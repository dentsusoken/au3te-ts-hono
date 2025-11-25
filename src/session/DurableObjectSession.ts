import {
  Session,
  StoredSessionData,
  ParsedSessionData,
  DefaultSessionSchemas,
  SessionSchemas,
} from '@vecrea/au3te-ts-server/session';
import { DurableObject } from '../database';
import { z } from 'zod';
import { Context } from 'hono';
import { Env } from '../env';
import { SessionFactory } from '../di/DIContainer';
import { getSessionId } from './getSessionId';

/** Default session expiration time in seconds (24 hours) */
const EXPIRATION_TTL = 24 * 60 * 60;

/**
 * Session implementation using Cloudflare Durable Objects for storage.
 * Provides persistent session storage with automatic expiration handling.
 * @template T - The session schemas type.
 */
export class DurableObjectSession<T extends DefaultSessionSchemas & SessionSchemas>
  implements Session<T>
{
  #data: StoredSessionData<T> = {};
  #schemas: T;
  #sessionId: string;
  #stub: DurableObjectStub<DurableObject<string>>;
  #expirationTtl: number;
  #loaded = false;

  /**
   * Creates a new DurableObjectSession instance.
   * @param {T} schemas - The session schemas for validation.
   * @param {string} sessionId - The unique session identifier.
   * @param {DurableObjectStub<DurableObject<string>>} stub - The Durable Object stub for storage operations.
   * @param {number} [expirationTtl=EXPIRATION_TTL] - The expiration time-to-live in seconds.
   */
  constructor(
    schemas: T,
    sessionId: string,
    stub: DurableObjectStub<DurableObject<string>>,
    expirationTtl: number = EXPIRATION_TTL,
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
   * Loads session data from the Durable Object storage.
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
   * Saves session data to the Durable Object storage.
   * @returns {Promise<void>} A promise that resolves when the data is saved.
   */
  private async saveData() {
    await this.#stub.save(this.sessionId, {
      data: JSON.stringify(this.#data),
      expiresAt: Date.now() + this.#expirationTtl,
    });
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
    batch: ParsedSessionData<T, K>,
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

/**
 * Creates a session factory function for Durable Object-based sessions.
 * @param {SS} sessionSchemas - The session schemas to use.
 * @returns A function that creates a DurableObjectSession instance from a context.
 * @example
 * const sessionFactory = createDOSession(unifiedIdSessionSchemas);
 * const session = sessionFactory(context);
 */
export const createDOSession: SessionFactory = <
  SS extends DefaultSessionSchemas,
>(
  sessionSchemas: SS,
) => {
  return (c: Context<Env<SS>>) => {
    const sessionId = getSessionId(c);
    const stub = c.env.DURABLE_OBJECT.get(
      c.env.DURABLE_OBJECT.idFromName(sessionId),
    );

    return new DurableObjectSession<SS>(
      sessionSchemas,
      sessionId,
      stub,
      EXPIRATION_TTL,
    );
  };
};
