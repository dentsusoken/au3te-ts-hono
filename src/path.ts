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
import { ApiClientImpl } from 'au3te-ts-base/api';
import { BaseHandlerConfigurationImpl } from 'au3te-ts-base/handler';
import { ParHandlerConfigurationImpl } from 'au3te-ts-base/handler.par';
import { AuthorizationHandlerConfigurationImpl } from 'au3te-ts-base/handler.authorization';
import { TokenHandlerConfigurationImpl } from 'au3te-ts-base/handler.token';
import { CredentialMetadataHandlerConfigurationImpl } from 'au3te-ts-base/handler.credential-metadata';
import { ServiceConfigurationHandlerConfigurationImpl } from 'au3te-ts-base/handler.service-configuration';
import { Session, sessionSchemas } from 'au3te-ts-base/session';

export class EndpointPath {
  #parPath: string;
  #authorizationPath: string;
  #authorizationDecisionPath: string;
  #tokenPath: string;
  #serviceConfigurationPath: string;
  #credentialIssuerMetadataPath: string;

  constructor() {
    const apiClient = new ApiClientImpl({
      apiVersion: '',
      baseUrl: '',
      serviceApiKey: '',
      serviceAccessToken: '',
    });
    const baseHandlerConfiguration = new BaseHandlerConfigurationImpl(
      apiClient,
      {} as Session<typeof sessionSchemas>
    );

    this.#parPath = new ParHandlerConfigurationImpl(
      baseHandlerConfiguration
    ).path;
    this.#authorizationPath = new AuthorizationHandlerConfigurationImpl({
      baseHandlerConfiguration,
      authorizationIssueHandlerConfiguration: {} as any,
      authorizationFailHandlerConfiguration: {} as any,
      authorizationPageModelConfiguration: {} as any,
    }).path;
    this.#authorizationDecisionPath = '/api/authorization/decision';
    this.#tokenPath = new TokenHandlerConfigurationImpl({
      baseHandlerConfiguration,
      tokenCreateHandlerConfiguration: {} as any,
      tokenIssueHandlerConfiguration: {} as any,
      tokenFailHandlerConfiguration: {} as any,
      userConfiguration: {} as any,
    }).path;
    this.#serviceConfigurationPath =
      new ServiceConfigurationHandlerConfigurationImpl(
        baseHandlerConfiguration
      ).path;
    this.#credentialIssuerMetadataPath =
      new CredentialMetadataHandlerConfigurationImpl(
        baseHandlerConfiguration
      ).path;
  }

  get parPath(): string {
    return this.#parPath;
  }
  get authorizationPath(): string {
    return this.#authorizationPath;
  }
  get authorizationDecisionPath(): string {
    return this.#authorizationDecisionPath;
  }
  get tokenPath(): string {
    return this.#tokenPath;
  }
  get serviceConfigurationPath(): string {
    return this.#serviceConfigurationPath;
  }
  get credentialIssuerMetadataPath(): string {
    return this.#credentialIssuerMetadataPath;
  }
}
