import { Context } from 'hono';
import { createMiddleware } from 'hono/factory';
import { getCookie, setCookie } from 'hono/cookie';
import { sessionSchemas } from '@vecrea/au3te-ts-server/session';
import { DynamoDB } from '@vecrea/oid4vc-core/dynamodb';
import { Env } from '../env';
import { Env as DynamoDBEnv } from '@squilla/hono-aws-middlewares/dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { DynamoSession } from '../session';

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
export const sessionLambdaMiddleware = createMiddleware<Env & DynamoDBEnv>(
  async (c: Context<Env & DynamoDBEnv>, next: () => Promise<void>) => {
    const dynamo = new DynamoDB(
      DynamoDBDocumentClient.from(c.get('DynamoDB')),
      c.env.ISSUER_SESSION_DYNAMODB
    );
    const sessionId =
      getCookie(c, SESSION_COOKIE_NAME) || generateAndSetSessionId(c);
    c.set(
      'session',
      new DynamoSession(sessionSchemas, sessionId, dynamo, EXPIRATION_TTL)
    );
    await next();
  }
);
