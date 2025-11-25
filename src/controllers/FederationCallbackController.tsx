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
import { AuthorizationPageModel } from '@vecrea/au3te-ts-common/handler.authorization-page';
import { Env } from '../env';
import { AuthorizationPage } from '../view/AuthorizationPage';
import { DefaultSessionSchemas } from '@vecrea/au3te-ts-server/session';

/**
 * Controller handling federation callback endpoint requests.
 * Processes federation callback requests from external identity providers
 * and renders the authorization page when successful.
 */
export class FederationCallbackController {
  /**
   * Handles the federation callback request.
   * @param {Context<Env>} c - The Hono context containing environment and request information.
   * @returns {Promise<Response>} A promise that resolves to either the federation callback response or an error response.
   */
  static async handle(c: Context<Env<DefaultSessionSchemas>>) {
    const di = c.get('getDI')(c);

    const endpointConfiguration = di.federationCallbackHandler();
    const result = await endpointConfiguration.processRequest(c.req.raw);
    if (result.ok) {
      const pageModel = (await result.json()) as AuthorizationPageModel;
      return c.render(
        <AuthorizationPage {...pageModel} publicUrl={c.env.PUBLIC_URL} />,
      );
    }
    return result;
  }
}
