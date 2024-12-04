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
import { UserHandlerConfigurationImpl } from 'au3te-ts-common/handler.user';
import { ExtractorConfigurationImpl } from 'au3te-ts-base/extractor';
import { Env } from '../env';

export class AuthorizationDecisionController {
  static async handle(c: Context<Env>) {
    const baseHandlerConfiguration = c.get('baseHandlerConfiguration');
    const extractorConfiguration = new ExtractorConfigurationImpl();
    const userHandlerConfiguration = new UserHandlerConfigurationImpl();

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
