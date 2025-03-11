/*
 * Copyright (C) 2014-2024 Authlete, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND,
 * either express or implied. See the License for the specific
 * language governing permissions and limitations under the
 * License.
 */
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
  const { baseHandlerConfiguration, extractorConfiguration } =
    AppConfig.createBaseConfigurations(
      env<Env['Bindings']>(c),
      c.get('session')
    );

  c.set('baseHandlerConfiguration', baseHandlerConfiguration);
  c.set('extractorConfiguration', extractorConfiguration);
  return next();
});

export const setupLambdaMiddleware = createMiddleware(async (c, next) => {
  c.env = {
    ...c.env,
    API_VERSION: process.env.API_VERSION || '',
    API_BASE_URL: process.env.API_BASE_URL || '',
    API_KEY: process.env.API_KEY || '',
    ACCESS_TOKEN: process.env.ACCESS_TOKEN || '',
    SESSION_KV: process.env.SESSION_KV || '',
    AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID || '',
    AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY || '',
    TABLE_NAME: process.env.DYNAMODB_TABLE || '',
  };
  return next();
});