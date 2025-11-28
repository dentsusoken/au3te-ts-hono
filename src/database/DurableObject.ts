import { DurableObject as Base } from 'cloudflare:workers';
import { Env } from '../env';
import { StoreItem, Database } from './Database';
import { DefaultSessionSchemas } from '@vecrea/au3te-ts-server/session';

/**
 * Durable Object interface that extends Database with alarm-based expiration.
 * @template T - The type of data stored in the Durable Object.
 */
export interface DurableObject<T> extends Database<T>, Base {
  /**
   * Sets the next alarm for garbage collection.
   * @param {number} ttl - Time to live in milliseconds until the next alarm.
   * @returns {Promise<void>} A promise that resolves when the alarm is set.
   */
  setNextAlarm(ttl: number): Promise<void>;

  /**
   * Handles the alarm event to clean up expired items.
   * @returns {Promise<void>} A promise that resolves when cleanup is complete.
   */
  alarm(): Promise<void>;
}

/** Default alarm duration in milliseconds (24 hours) */
const ALARM_DURATION_MS = 24 * 60 * 60 * 1000;

/**
 * Implementation of DurableObject that provides database functionality with automatic expiration.
 * @template T - The type of data stored in the Durable Object.
 */
export class DurableObjectImpl<T> extends Base implements DurableObject<T> {
  /**
   * Creates a new DurableObjectImpl instance.
   * @param {DurableObjectState} ctx - The Durable Object state context.
   * @param {Env} env - The environment variables and bindings.
   */
  constructor(ctx: DurableObjectState, env: Env<DefaultSessionSchemas>) {
    super(ctx, env);
  }

  /**
   * Saves an item to the Durable Object storage and sets an alarm for expiration.
   * @param {string} key - The key to store the item under.
   * @param {StoreItem<T>} item - The item to store, including data and optional expiration.
   * @returns {Promise<void>} A promise that resolves when the save operation completes.
   */
  async save(key: string, item: StoreItem<T>): Promise<void> {
    await this.ctx.storage.put<StoreItem<T>>(key, item);

    const ttl = item.expiresAt
      ? item.expiresAt - Date.now()
      : ALARM_DURATION_MS;
    await this.setNextAlarm(ttl);
  }

  /**
   * Retrieves an item from the Durable Object storage.
   * @param {string} key - The key to retrieve the item for.
   * @returns {Promise<T | undefined>} A promise that resolves to the stored data, or undefined if not found.
   */
  async get(key: string): Promise<T | undefined> {
    const storedData = await this.ctx.storage.get<StoreItem<T>>(key);

    if (!storedData) {
      return undefined;
    }

    return storedData.data;
  }

  /**
   * Sets the next alarm for garbage collection if no alarm is currently set.
   * @param {number} [ttl=ALARM_DURATION_MS] - Time to live in milliseconds until the next alarm.
   * @returns {Promise<void>} A promise that resolves when the alarm is set or if an alarm already exists.
   */
  async setNextAlarm(ttl: number = ALARM_DURATION_MS): Promise<void> {
    const alarm = await this.ctx.storage.getAlarm();
    if (alarm && alarm > 0) {
      return;
    }

    await this.ctx.storage.setAlarm(Date.now() + ttl);
  }

  /**
   * Handles the alarm event to clean up expired items from storage.
   * This method is called automatically by Cloudflare Workers when the alarm fires.
   * @returns {Promise<void>} A promise that resolves when cleanup is complete.
   */
  async alarm(): Promise<void> {
    const now = Date.now();

    const allData = await this.ctx.storage.list<StoreItem<T>>();

    for (const [key, item] of allData) {
      if (!item.expiresAt) {
        continue;
      }
      if (item.expiresAt < now) {
        await this.ctx.storage.delete(key);
      }
    }

    await this.setNextAlarm();
  }
}
