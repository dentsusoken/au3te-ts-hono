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
import { AuthorizationDecisionEndpointConfigurationImpl } from 'au3te-ts-base/endpoint.authorization-decision';
import { AuthorizationIssueHandlerConfigurationImpl } from 'au3te-ts-base/handler.authorization-issue';
import { AuthorizationFailHandlerConfigurationImpl } from 'au3te-ts-base/handler.authorization-fail';
import { AuthorizationPageModelConfigurationImpl } from 'au3te-ts-common/page-model.authorization';
import { AuthorizationHandlerConfigurationImpl } from 'au3te-ts-base/handler.authorization';
import { UserConfigurationImpl } from 'au3te-ts-common/user';
import { ExtractorConfigurationImpl } from 'au3te-ts-base/extractor';
import { Env } from '../env';

export class AuthorizationDecisionController {
  static async handle(c: Context<Env>) {
    const baseHandlerConfiguration = c.get('baseHandlerConfiguration');
    const extractorConfiguration = new ExtractorConfigurationImpl();
    const userConfiguration = new UserConfigurationImpl();

    const authorizationIssueHandlerConfiguration =
      new AuthorizationIssueHandlerConfigurationImpl(baseHandlerConfiguration);
    const authorizationFailHandlerConfiguration =
      new AuthorizationFailHandlerConfigurationImpl(baseHandlerConfiguration);
    const authorizationPageModelConfiguration =
      new AuthorizationPageModelConfigurationImpl();

    const authorizationHandlerConfiguration =
      new AuthorizationHandlerConfigurationImpl({
        baseHandlerConfiguration,
        authorizationIssueHandlerConfiguration,
        authorizationFailHandlerConfiguration,
        authorizationPageModelConfiguration,
      });

    const endpointConfiguration =
      new AuthorizationDecisionEndpointConfigurationImpl({
        authorizationHandlerConfiguration,
        authorizationIssueHandlerConfiguration,
        baseHandlerConfiguration,
        extractorConfiguration,
        userConfiguration,
      });

    return await endpointConfiguration.processRequest(c.req.raw);
  }
}
