/*
 * Copyright (C) 2018-2021 Authlete, Inc.
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
import { ApiMethod as ClientRegistrationApiMethod } from '@vecrea/au3te-ts-server/handler.client-registration';

/**
 * Controller handling the client registration endpoint.
 * Processes client registration requests and returns client registration responses.
 */
export class ClientRegistrationController {
  /**
   * Handles the client registration request.
   * Returns the client registration response.
   * @param {Context<Env<DefaultSessionSchemas>>} c - The Hono context containing environment and request information.
   * @param {ClientRegistrationApiMethod} method - The method to use for the client registration request.
   * @returns {Promise<Response>} A promise that resolves to the client registration response.
   */
  static async handle(c: Context<Env<DefaultSessionSchemas>>) {
    const di = c.get('getDI')(c);
    const endpointConfiguration = di.clientRegistrationHandlerConfiguration(
      ClientRegistrationController.getMethod(c),
    );
    return await endpointConfiguration.processRequest(c.req.raw);
  }

  private static getMethod<SS extends DefaultSessionSchemas>(
    c: Context<Env<SS>>,
  ): ClientRegistrationApiMethod {
    console.log("called getMethod");
    
    const method = c.req.method;
    switch (method) {
      case 'POST':
        return 'create';
      case 'GET':
        return 'get';
      case 'PUT':
        return 'update';
      case 'DELETE':
        return 'delete';
    }
    throw new Error('Invalid method');
  }
}
