import { DurableObject } from '../../../database';
import { UnifiedIdAllocator } from './UnifiedIdAllocator';
import { generateUnifiedId } from './generateUnifiedId';

const UNIFIED_ID_KEY = 'unifiedId';

export class UnifiedIdAllocatorDurableObjects implements UnifiedIdAllocator {
  #stub: DurableObjectStub<DurableObject<Map<string, Record<string, string>>>>;
  #unifiedIdList: Map<string, Record<string, string>> | null = null;
  #loaded = false;

  constructor(
    stub: DurableObjectStub<DurableObject<Map<string, Record<string, string>>>>,
  ) {
    this.#stub = stub;
  }

  /**
   * Loads unified ID list from the Durable Object storage.
   * If the data is already loaded, it does nothing.
   * @returns {Promise<void>} A promise that resolves when the data is loaded.
   */
  private async loadData(): Promise<void> {
    if (this.#loaded) {
      return;
    }

    const data = await this.#stub.get(UNIFIED_ID_KEY);
    if (data) {
      this.#unifiedIdList = data;
    } else {
      this.#unifiedIdList = new Map();
    }

    this.#loaded = true;
  }

  /**
   * Saves unified ID list to the Durable Object storage.
   * @returns {Promise<void>} A promise that resolves when the data is saved.
   */
  private async saveData(): Promise<void> {
    if (!this.#unifiedIdList) {
      return;
    }

    await this.#stub.save(UNIFIED_ID_KEY, {
      data: this.#unifiedIdList,
    });
  }

  async get(serviceId: string, userId: string): Promise<string> {
    const existingUnifiedId = await this.exists({ serviceId, userId });
    if (existingUnifiedId) {
      return existingUnifiedId;
    }
    const unifiedId = generateUnifiedId();
    await this.save(unifiedId, serviceId, userId);
    return unifiedId;
  }

  async save(
    unifiedId: string,
    serviceId: string,
    userId: string,
  ): Promise<void> {
    await this.loadData();
    if (!this.#unifiedIdList) {
      this.#unifiedIdList = new Map();
    }
    this.#unifiedIdList.set(unifiedId, { [serviceId]: userId });
    await this.saveData();
  }

  async exists(params: { unifiedId: string }): Promise<string | undefined>;
  async exists(params: {
    serviceId: string;
    userId: string;
  }): Promise<string | undefined>;
  async exists(
    params: { unifiedId: string } | { serviceId: string; userId: string },
  ): Promise<string | undefined> {
    await this.loadData();
    if (!this.#unifiedIdList || this.#unifiedIdList.size === 0) {
      return undefined;
    }
    if ('unifiedId' in params) {
      return this.#unifiedIdList.has(params.unifiedId)
        ? params.unifiedId
        : undefined;
    }
    if ('serviceId' in params && 'userId' in params) {
      for (const [unifiedId, services] of this.#unifiedIdList.entries()) {
        if (services[params.serviceId] === params.userId) {
          return unifiedId;
        }
      }
    }
    return undefined;
  }
}
