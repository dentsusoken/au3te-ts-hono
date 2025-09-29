import crypto from 'crypto';
import { Context } from 'hono';
import { createMiddleware } from 'hono/factory';
import { getCookie, setCookie } from 'hono/cookie';
import { sessionSchemas } from '@vecrea/au3te-ts-server/session';
import { DynamoDB } from '@vecrea/oid4vc-core/dynamodb';
import { createDynamoDBClient } from '../dynamodb';
import { DynamoSession } from '../session';
import { DurableObjectSession } from '../session/DurableObjectSession';
import { Env } from '../env';

/** Default session expiration time in seconds (24 hours) */
export const EXPIRATION_TTL = 24 * 60 * 60;

/** Cookie name used for storing the session ID */
const SESSION_COOKIE_NAME = '__session';

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
// export const sessionMiddleware = createMiddleware(
//   async (c: Context, next: () => Promise<void>) => {
//     const sessionId =
//       getCookie(c, SESSION_COOKIE_NAME) || generateAndSetSessionId(c);
//     c.set(
//       'session',
//       new KVSession(sessionSchemas, sessionId, c.env.SESSION_KV, EXPIRATION_TTL)
//     );
//     await next();
//   }
// );

export const sessionMiddleware = createMiddleware(
  async (c: Context<Env>, next: () => Promise<void>) => {
    const sessionId =
      getCookie(c, SESSION_COOKIE_NAME) || generateAndSetSessionId(c);
    const stub = c.env.SESSION.get(c.env.SESSION.idFromName(sessionId));
    c.set(
      'session',
      new DurableObjectSession(sessionSchemas, sessionId, stub, EXPIRATION_TTL)
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
      new DynamoSession(sessionSchemas, sessionId, dynamo, EXPIRATION_TTL)
    );
    await next();
  }
);
