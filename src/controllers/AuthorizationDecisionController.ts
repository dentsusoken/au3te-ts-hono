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
import { AuthorizationDecisionHandlerConfigurationImpl } from 'au3te-ts-base/handler.authorization-decision';
import { AuthorizationIssueHandlerConfigurationImpl } from 'au3te-ts-base/handler.authorization-issue';
import { AuthorizationFailHandlerConfigurationImpl } from 'au3te-ts-base/handler.authorization-fail';
import { AuthorizationPageHandlerConfigurationImpl } from 'au3te-ts-common/handler.authorization-page';
import { AuthorizationHandlerConfigurationImpl } from 'au3te-ts-base/handler.authorization';
// import { UserHandlerConfigurationImpl } from 'au3te-ts-common/handler.user';
import { UserHandlerKV as UserHandlerConfigurationImpl } from '../user/UserHandlerKV';
import { ExtractorConfigurationImpl } from 'au3te-ts-base/extractor';
import { Env } from '../env';

/**
 * Controller handling the authorization decision endpoint.
 * Processes user's consent decision for OAuth 2.0 authorization requests.
 */
export class AuthorizationDecisionController {
  /**
   * Handles the authorization decision request.
   * Processes the user's consent decision and returns appropriate response.
   * @param {Context<Env>} c - The Hono context containing environment and request information.
   * @returns {Promise<Response>} A promise that resolves to the authorization decision response.
   */
  static async handle(c: Context<Env>) {
    const baseHandlerConfiguration = c.get('baseHandlerConfiguration');
    const extractorConfiguration = new ExtractorConfigurationImpl();
    const userHandlerConfiguration = new UserHandlerConfigurationImpl(
      c.env.USER_KV,
      c.env.MDOC_KV
    );

    const authorizationIssueHandlerConfiguration =
      new AuthorizationIssueHandlerConfigurationImpl(baseHandlerConfiguration);
    const authorizationFailHandlerConfiguration =
      new AuthorizationFailHandlerConfigurationImpl(baseHandlerConfiguration);
    const authorizationPageHandlerConfiguration =
      new AuthorizationPageHandlerConfigurationImpl();

    const authorizationHandlerConfiguration =
      new AuthorizationHandlerConfigurationImpl({
        baseHandlerConfiguration,
        authorizationIssueHandlerConfiguration,
        authorizationFailHandlerConfiguration,
        authorizationPageHandlerConfiguration,
        extractorConfiguration,
      });

    const endpointConfiguration =
      new AuthorizationDecisionHandlerConfigurationImpl({
        baseHandlerConfiguration,
        extractorConfiguration,
        userHandlerConfiguration,
        authorizationHandlerConfiguration,
        authorizationIssueHandlerConfiguration,
        authorizationFailHandlerConfiguration,
      });

    return await endpointConfiguration.processRequest(c.req.raw);
  }
}
