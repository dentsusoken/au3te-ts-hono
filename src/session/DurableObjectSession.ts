import {
  Session,
  StoredSessionData,
  ParsedSessionData,
  SessionSchemas,
} from '@vecrea/au3te-ts-server/session';
import { DurableObject } from 'cloudflare:workers';
import { z } from 'zod';
import { Env } from '../env';

/** Default session expiration time in seconds (24 hours) */
const EXPIRATION_TTL = 24 * 60 * 60;

/**
 * Duration for setting the next alarm for garbage collection (24 hours in milliseconds).
 * @constant {number}
 */
const ALARM_DURATION_MS = 24 * 60 * 60 * 1000;

/**
 * Presentation information stored within the Durable Object
 *
 * @interface StoredSession
 */
interface StoredSession {
  /** Presentation JSON data or string format */
  data: string;

  /** Expiration timestamp in milliseconds */
  expiresAt: number;
}

export class DurableObjectBase extends DurableObject {
  /**
   * Creates a new PresentationDurableObject instance
   *
   * @param ctx - Durable Object state context
   * @param env - Environment variables and bindings
   */
  constructor(ctx: DurableObjectState, env: Env) {
    super(ctx, env);
  }

  /**
   * Saves presentation data
   *
   * @param key - The key to store under
   * @param data - Presentation JSON data or string
   * @returns Promise that resolves when save is complete
   *
   * @example
   * ```typescript
   * await durableObject.save('presentation:123', presentationJson);
   * ```
   */
  async save(key: string, data: string): Promise<void> {
    // Store data with expiration timestamp
    await this.ctx.storage.put<StoredSession>(key, {
      data,
      expiresAt: Date.now() + EXPIRATION_TTL,
    });

    // Ensure garbage collection alarm is set
    await this.setNextAlarm();
  }

  /**
   * Retrieves presentation data for the specified key
   *
   * @param key - The key to retrieve
   * @returns Presentation data or undefined if not found
   *
   * @example
   * ```typescript
   * const data = await durableObject.get('presentation:123');
   * if (data) {
   *   // Handle data if it exists
   * }
   * ```
   */
  async get(key: string): Promise<string | undefined> {
    // Retrieve stored data from Durable Object storage
    const storedData = await this.ctx.storage.get<StoredSession>(key);

    // Return undefined if data doesn't exist
    if (!storedData) {
      return undefined;
    }

    // Return the actual presentation data
    return storedData.data;
  }

  /**
   * Sets the next alarm for garbage collection
   *
   * Does nothing if an alarm is already set.
   * Sets an alarm 24 hours from now for garbage collection.
   *
   * @private
   */
  private async setNextAlarm() {
    // Check if an alarm is already scheduled
    const alarm = await this.ctx.storage.getAlarm();
    if (alarm && alarm > 0) {
      return; // Alarm already exists, nothing to do
    }

    // Schedule the next garbage collection alarm
    await this.ctx.storage.setAlarm(Date.now() + ALARM_DURATION_MS);
  }

  /**
   * Alarm handler for garbage collection of expired data
   *
   * Executed periodically to automatically delete presentation data
   * that has passed its expiration time. Sets the next alarm after completion.
   *
   * @async
   */
  async alarm(): Promise<void> {
    const now = Date.now();

    // Get all stored data for expiration check
    const allData = await this.ctx.storage.list<StoredSession>();

    // Delete expired entries
    for (const [key, value] of allData) {
      if (value.expiresAt < now) {
        await this.ctx.storage.delete(key);
      }
    }

    // Schedule the next garbage collection cycle
    await this.setNextAlarm();
  }
}

export class DurableObjectSession<T extends SessionSchemas>
  implements Session<T>
{
  #data: StoredSessionData<T> = {};
  #schemas: T;
  #sessionId: string;
  #stub: DurableObjectStub<DurableObjectBase>;
  #expirationTtl: number;
  #loaded = false;

  constructor(
    schemas: T,
    sessionId: string,
    stub: DurableObjectStub<DurableObjectBase>,
    expirationTtl: number = EXPIRATION_TTL
  ) {
    this.#schemas = schemas;
    this.#sessionId = sessionId;
    this.#stub = stub;
    this.#expirationTtl = expirationTtl;
  }

  /**
   * Gets the session ID.
   * @returns {string} The session ID.
   */
  public get sessionId() {
    return this.#sessionId;
  }

  /**
   * Gets the expiration time-to-live (TTL) for the session.
   * @returns {number} The expiration TTL in seconds.
   */
  public get expirationTtl() {
    return this.#expirationTtl;
  }

  /**
   * Loads session data from the KV store.
   * If the data is already loaded, it does nothing.
   * @returns {Promise<void>} A promise that resolves when the data is loaded.
   */
  public async loadData() {
    if (this.#loaded) {
      return;
    }

    const data = await this.#stub.get(this.sessionId);
    if (data) {
      this.#data = JSON.parse(data);
    } else {
      this.#data = {};
    }

    this.#loaded = true;
  }

  /**
   * Saves session data to the KV store.
   * @returns {Promise<void>} A promise that resolves when the data is saved.
   */
  private async saveData() {
    await this.#stub.save(this.sessionId, JSON.stringify(this.#data));
  }

  /**
   * Parses a stored value for a given key.
   *
   * @template K - The key type, which must be a key of T.
   * @param {K} key - The key to parse the value for.
   * @returns {z.infer<T[K]> | undefined} The parsed value, or undefined if not found or parsing fails.
   */
  parseValue<K extends keyof T>(key: K): z.infer<T[K]> | undefined {
    const value = this.#data[key];

    if (!value) {
      return undefined;
    }

    const parsedJson = JSON.parse(value);
    return this.#schemas[key].parse(parsedJson);
  }

  /**
   * Retrieves the value associated with the specified key.
   *
   * @template K - The key type, which must be a key of T.
   * @param {K} key - The key to retrieve the value for.
   * @returns {Promise<z.infer<T[K]> | undefined>} A promise that resolves with the parsed value, or undefined if not found.
   */
  async get<K extends keyof T>(key: K): Promise<z.infer<T[K]> | undefined> {
    await this.loadData();
    return this.parseValue(key);
  }

  /**
   * Retrieves multiple values associated with the specified keys.
   *
   * @template K - The key type, which must be a key of T.
   * @param {...K} keys - The keys to retrieve values for.
   * @returns {Promise<ParsedSessionData<T, K>>} A promise that resolves with an object containing the retrieved and parsed values.
   */
  async getBatch<K extends keyof T>(
    ...keys: K[]
  ): Promise<ParsedSessionData<T, K>> {
    await this.loadData();
    const result: ParsedSessionData<T, K> = {};

    keys.forEach((key) => {
      result[key] = this.parseValue(key);
    });

    return result;
  }

  /**
   * Sets the value for the specified key.
   *
   * @template K - The key type, which must be a key of T.
   * @param {K} key - The key to set the value for.
   * @param {z.infer<T[K]>} value - The value to set.
   * @returns {Promise<void>} A promise that resolves when the operation is complete.
   */
  async set<K extends keyof T>(key: K, value: z.infer<T[K]>): Promise<void> {
    await this.loadData();
    this.#data[key] = JSON.stringify(value);
    await this.saveData();
  }

  /**
   * Sets multiple key-value pairs in the session.
   *
   * @template K - The key type, which must be a key of T.
   * @param {ParsedSessionData<T, K>} batch - An object containing the key-value pairs to set.
   * @returns {Promise<void>} A promise that resolves when the operation is complete.
   */
  async setBatch<K extends keyof T>(
    batch: ParsedSessionData<T, K>
  ): Promise<void> {
    await this.loadData();
    Object.entries(batch).forEach(([key, value]) => {
      this.#data[key as K] = JSON.stringify(value);
    });
    await this.saveData();
  }

  /**
   * Deletes the value associated with the specified key.
   *
   * @template K - The key type, which must be a key of T.
   * @param {K} key - The key to delete the value for.
   * @returns {Promise<z.infer<T[K]> | undefined>} A promise that resolves with the deleted value, or undefined if not found.
   */
  async delete<K extends keyof T>(key: K): Promise<z.infer<T[K]> | undefined> {
    await this.loadData();
    const result = this.parseValue(key);
    delete this.#data[key];
    await this.saveData();

    return result;
  }

  /**
   * Deletes multiple values associated with the specified keys.
   *
   * @template K - The key type, which must be a key of T.
   * @param {...K} keys - The keys to delete values for.
   * @returns {Promise<ParsedSessionData<T, K>>} A promise that resolves with an object containing the deleted values.
   */
  async deleteBatch<K extends keyof T>(
    ...keys: K[]
  ): Promise<ParsedSessionData<T, K>> {
    await this.loadData();
    const result: ParsedSessionData<T, K> = {};

    keys.forEach((key) => {
      result[key] = this.parseValue(key);
      delete this.#data[key];
    });
    await this.saveData();
    return result;
  }

  /**
   * Clears all key-value pairs from the session.
   *
   * @returns {Promise<void>} A promise that resolves when the operation is complete.
   */
  async clear(): Promise<void> {
    this.#data = {};
    await this.saveData();
  }
}
