import crypto from 'crypto';
import { Context } from 'hono';
import { createMiddleware } from 'hono/factory';
import { getCookie, setCookie } from 'hono/cookie';
import {
  Session,
  sessionSchemas,
  StoredSessionData,
  ParsedSessionData,
  SessionSchemas,
} from '@vecrea/au3te-ts-server/session';
import { z } from 'zod';
import { DynamoDB } from '@vecrea/oid4vc-core/dynamodb';
import { createDynamoDBClient } from '../dynamodb';

/** Default session expiration time in seconds (24 hours) */
export const EXPIRATION_TTL = 24 * 60 * 60;

/** Cookie name used for storing the session ID */
const SESSION_COOKIE_NAME = '__session';

/**
 * KV implementation of the Session interface.
 */
export class KVSession<T extends SessionSchemas> implements Session<T> {
  #data: StoredSessionData<T> = {};
  #schemas: T;
  #sessionId: string;
  #kv: KVNamespace | DynamoDB;
  #expirationTtl: number;
  #loaded = false;

  /**
   * Creates an instance of KVSession.
   */
  constructor(
    schemas: T,
    sessionId: string,
    kv: KVNamespace | DynamoDB,
    expirationTtl: number = EXPIRATION_TTL
  ) {
    this.#schemas = schemas;
    this.#sessionId = sessionId;
    this.#kv = kv;
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

    const data = await this.#kv.get(this.sessionId);
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
    await this.#kv.put(this.sessionId, JSON.stringify(this.#data), {
      expirationTtl: this.expirationTtl,
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

/**
 * Generates a new session ID and sets it in a cookie.
 * @param {Context} c - The Hono context.
 * @returns {string} The generated session ID.
 */
export const generateAndSetSessionId = (c: Context): string => {
  const sessionId = crypto.randomUUID();
  setCookie(c, SESSION_COOKIE_NAME, sessionId, {
    httpOnly: true,
    secure: true,
    path: '/',
    maxAge: EXPIRATION_TTL,
    sameSite: 'Lax',
  });
  return sessionId;
};

/**
 * Middleware that manages session handling.
 * Creates or retrieves a session and makes it available in the context.
 */
export const sessionMiddleware = createMiddleware(
  async (c: Context, next: () => Promise<void>) => {
    const sessionId =
      getCookie(c, SESSION_COOKIE_NAME) || generateAndSetSessionId(c);
    c.set(
      'session',
      new KVSession(sessionSchemas, sessionId, c.env.SESSION_KV, EXPIRATION_TTL)
    );
    await next();
  }
);

/**
 * Middleware that manages session handling.
 * Creates or retrieves a session and makes it available in the context.
 */
export const sessionLambdaMiddleware = createMiddleware(
  async (c: Context, next: () => Promise<void>) => {
    const client = createDynamoDBClient({
      // credentials: {
      //   accessKeyId: c.env.AWS_ACCESS_KEY_ID,
      //   secretAccessKey: c.env.AWS_SECRET_ACCESS_KEY,
      // },
    });
    const dynamo = new DynamoDB(client, c.env.DYNAMODB_TABLE_ISSUER);
    const sessionId =
      getCookie(c, SESSION_COOKIE_NAME) || generateAndSetSessionId(c);
    c.set(
      'session',
      new KVSession(sessionSchemas, sessionId, dynamo, EXPIRATION_TTL)
    );
    await next();
  }
);
