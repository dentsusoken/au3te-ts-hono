import { DurableObject as Base } from 'cloudflare:workers';
import { Env } from '../env';
import { StoreItem, Database } from './Database';

export interface DurableObject<T> extends Database<T>, Base {
  setNextAlarm(ttl: number): Promise<void>;
  alarm(): Promise<void>;
}

const ALARM_DURATION_MS = 24 * 60 * 60 * 1000;

export class DurableObjectImpl<T> extends Base implements DurableObject<T> {
  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);
  }

  async save(key: string, item: StoreItem<T>): Promise<void> {
    await this.ctx.storage.put<StoreItem<T>>(key, item);

    const ttl = item.expiresAt
      ? item.expiresAt - Date.now()
      : ALARM_DURATION_MS;
    await this.setNextAlarm(ttl);
  }

  async get(key: string): Promise<T | undefined> {
    const storedData = await this.ctx.storage.get<StoreItem<T>>(key);

    if (!storedData) {
      return undefined;
    }

    return storedData.data;
  }

  async setNextAlarm(ttl: number = ALARM_DURATION_MS): Promise<void> {
    const alarm = await this.ctx.storage.getAlarm();
    if (alarm && alarm > 0) {
      return;
    }

    await this.ctx.storage.setAlarm(Date.now() + ttl);
  }

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
