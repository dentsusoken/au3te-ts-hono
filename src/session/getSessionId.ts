import crypto from 'crypto';
import { Context } from 'hono';
import { getCookie, setCookie } from 'hono/cookie';

/** Default session expiration time in seconds (24 hours) */
const EXPIRATION_TTL = 24 * 60 * 60;

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

export const getSessionId = (c: Context): string => {
  return getCookie(c, SESSION_COOKIE_NAME) || generateAndSetSessionId(c);
};
