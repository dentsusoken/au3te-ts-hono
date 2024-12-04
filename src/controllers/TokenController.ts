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
import { UserHandlerConfigurationImpl } from 'au3te-ts-common/handler.user';

export class TokenController {
  static async handle(c: Context<Env>) {
    const baseHandlerConfiguration = c.get('baseHandlerConfiguration');
    const extractorConfiguration = c.get('extractorConfiguration');
    const userHandlerConfiguration = new UserHandlerConfigurationImpl();
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
