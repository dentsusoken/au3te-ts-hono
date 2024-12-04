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
import { CredentialSingleIssueHandlerConfigurationImpl } from 'au3te-ts-base/handler.credential-single-issue';
import { CredentialSingleParseHandlerConfigurationImpl } from 'au3te-ts-base/handler.credential-single-parse';
import { BaseCredentialHandlerConfigurationImpl } from 'au3te-ts-base/handler.credential';
import { IntrospectionHandlerConfigurationImpl } from 'au3te-ts-base/handler.introspection';
import { CommonCredentialHandlerConfigurationImpl } from 'au3te-ts-common/handler.credential';
import { CredentialMetadataHandlerConfigurationImpl } from 'au3te-ts-base/handler.credential-metadata';
import { UserHandlerConfigurationImpl } from 'au3te-ts-common/handler.user';
import { Env } from '../env';

export class CredentialController {
  static async handle(c: Context<Env>) {
    const baseHandlerConfiguration = c.get('baseHandlerConfiguration');
    const extractorConfiguration = c.get('extractorConfiguration');
    const userHandlerConfiguration = new UserHandlerConfigurationImpl();

    const introspectionHandlerConfiguration =
      new IntrospectionHandlerConfigurationImpl(baseHandlerConfiguration);
    const credentialSingleParseHandlerConfiguration =
      new CredentialSingleParseHandlerConfigurationImpl(
        baseHandlerConfiguration
      );
    const commonCredentialHandlerConfiguration =
      new CommonCredentialHandlerConfigurationImpl({
        userHandlerConfiguration,
      });
    const credentialMetadataHandlerConfiguration =
      new CredentialMetadataHandlerConfigurationImpl(baseHandlerConfiguration);
    const baseCredentialHandlerConfiguration =
      new BaseCredentialHandlerConfigurationImpl({
        credentialMetadataHandlerConfiguration,
      });

    const endpointConfiguration =
      new CredentialSingleIssueHandlerConfigurationImpl({
        baseHandlerConfiguration,
        extractorConfiguration,
        introspectionHandlerConfiguration,
        credentialSingleParseHandlerConfiguration,
        commonCredentialHandlerConfiguration,
        baseCredentialHandlerConfiguration,
      });
    return await endpointConfiguration.processRequest(c.req.raw);
  }
}
