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
import { Context } from 'hono';
import { Env } from '../env';
import { DefaultSessionSchemas } from '@vecrea/au3te-ts-server/session';

/**
 * Controller handling the standard introspection endpoint.
 * Processes standard introspection requests and returns introspection responses.
 */
export class StandardIntrospectionController {
  /**
   * Handles the standard introspection request.
   * Returns the introspection response.
   * @param {Context<Env<DefaultSessionSchemas>>} c - The Hono context containing environment and request information.
   * @returns {Promise<Response>} A promise that resolves to the introspection response.
   */
  static async handle(c: Context<Env<DefaultSessionSchemas>>) {
    const di = c.get('getDI')(c);
    const endpointConfiguration = di.standardIntrospectionHandler();
    return await endpointConfiguration.processRequest(c.req.raw);
  }
}