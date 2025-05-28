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
import { TokenIssueHandlerConfigurationImpl } from 'au3te-ts-base/handler.token-issue';
import { TokenFailHandlerConfigurationImpl } from 'au3te-ts-base/handler.token-fail';
import { TokenCreateHandlerConfigurationImpl } from 'au3te-ts-base/handler.token-create';
import { TokenHandlerConfigurationImpl } from 'au3te-ts-base/handler.token';
// import { UserHandlerConfigurationImpl } from 'au3te-ts-common/handler.user';
import { UserHandlerKV as UserHandlerConfigurationImpl } from '../user/UserHandlerKV';

/**
 * Controller handling the OAuth 2.0 token endpoint.
 * Processes token requests and issues access tokens, refresh tokens, and ID tokens.
 */
export class TokenController {
  /**
   * Handles the token request.
   * Validates the request and issues appropriate tokens based on the grant type.
   * @param {Context<Env>} c - The Hono context containing environment and request information.
   * @returns {Promise<Response>} A promise that resolves to the token response.
   */
  static async handle(c: Context<Env>) {
    const baseHandlerConfiguration = c.get('baseHandlerConfiguration');
    const extractorConfiguration = c.get('extractorConfiguration');
    const userHandlerConfiguration = new UserHandlerConfigurationImpl(
      c.env.USER_KV,
      c.env.MDOC_KV
    );
    const tokenFailHandlerConfiguration = new TokenFailHandlerConfigurationImpl(
      baseHandlerConfiguration
    );
    const tokenIssueHandlerConfiguration =
      new TokenIssueHandlerConfigurationImpl(baseHandlerConfiguration);
    const tokenCreateHandlerConfiguration =
      new TokenCreateHandlerConfigurationImpl(baseHandlerConfiguration);

    const tokenEndpointConfiguration = new TokenHandlerConfigurationImpl({
      baseHandlerConfiguration,
      extractorConfiguration,
      userHandlerConfiguration,
      tokenFailHandlerConfiguration,
      tokenIssueHandlerConfiguration,
      tokenCreateHandlerConfiguration,
    });

    return tokenEndpointConfiguration.processRequest(c.req.raw);
  }
}
