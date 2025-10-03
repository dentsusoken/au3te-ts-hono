import { createMiddleware } from 'hono/factory';
import { AppConfig } from '../config/AppConfig';
import { env } from 'hono/adapter';
import { Env } from '../env';

/**
 * Middleware that sets up base configurations for the application.
 * Initializes and injects base handler and extractor configurations into the context.
 * @type {import('hono').MiddlewareHandler}
 */
export const setupMiddleware = createMiddleware(async (c, next) => {
  const { serverHandlerConfiguration, extractorConfiguration } =
    AppConfig.createBaseConfigurations(
      c.env,
      c.get('session')
    );

  c.set('serverHandlerConfiguration', serverHandlerConfiguration);
  c.set('extractorConfiguration', extractorConfiguration);
  return next();
});
