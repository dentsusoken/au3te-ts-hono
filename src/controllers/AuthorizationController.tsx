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
import { AuthorizationHandlerConfigurationImpl } from 'au3te-ts-base/handler.authorization';
import { AuthorizationIssueHandlerConfigurationImpl } from 'au3te-ts-base/handler.authorization-issue';
import { AuthorizationFailHandlerConfigurationImpl } from 'au3te-ts-base/handler.authorization-fail';
import {
  AuthorizationPageHandlerConfigurationImpl,
  AuthorizationPageModel,
} from 'au3te-ts-common/handler.authorization-page';
import { Env } from '../env';
import { AuthorizationPage } from '../view/AuthorizationPage';

/**
 * Controller handling OAuth 2.0 authorization endpoint requests.
 * Processes authorization requests and renders the authorization page.
 */
export class AuthorizationController {
  /**
   * Handles the authorization request.
   * @param {Context<Env>} c - The Hono context containing environment and request information.
   * @returns {Promise<Response>} A promise that resolves to either the authorization page or an error response.
   */
  static async handle(c: Context<Env>) {
    const baseHandlerConfiguration = c.get('baseHandlerConfiguration');
    const extractorConfiguration = c.get('extractorConfiguration');

    const authorizationIssueHandlerConfiguration =
      new AuthorizationIssueHandlerConfigurationImpl(baseHandlerConfiguration);
    const authorizationFailHandlerConfiguration =
      new AuthorizationFailHandlerConfigurationImpl(baseHandlerConfiguration);
    const authorizationPageHandlerConfiguration =
      new AuthorizationPageHandlerConfigurationImpl();
    const endpointConfiguration = new AuthorizationHandlerConfigurationImpl({
      baseHandlerConfiguration,
      authorizationIssueHandlerConfiguration,
      authorizationFailHandlerConfiguration,
      authorizationPageHandlerConfiguration,
      extractorConfiguration,
    });
    const result = await endpointConfiguration.processRequest(c.req.raw);
    if (result.ok) {
      const pageModel = (await result.json()) as AuthorizationPageModel;
      return c.render(<AuthorizationPage {...pageModel} />);
    }
    return result;
  }
}
