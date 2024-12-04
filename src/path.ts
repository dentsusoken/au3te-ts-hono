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
import { ExtractorConfigurationImpl } from 'au3te-ts-base/extractor';
import { CredentialSingleIssueHandlerConfigurationImpl } from 'au3te-ts-base/handler.credential-single-issue';

/**
 * Manages the endpoint paths for various OAuth 2.0 and OpenID Connect operations.
 * This class centralizes the path configuration for all API endpoints used in the application.
 */
export class EndpointPath {
  #parPath: string;
  #authorizationPath: string;
  #authorizationDecisionPath: string;
  #tokenPath: string;
  #credentialPath: string;
  #serviceConfigurationPath: string;
  #credentialIssuerMetadataPath: string;

  /**
   * Initializes the endpoint paths using configurations from various handlers.
   * Sets up all necessary paths for OAuth 2.0 and OpenID Connect operations.
   */
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
    const extractorConfiguration = new ExtractorConfigurationImpl();

    this.#parPath = new ParHandlerConfigurationImpl({
      baseHandlerConfiguration,
      extractorConfiguration,
    }).path;
    this.#authorizationPath = new AuthorizationHandlerConfigurationImpl({
      baseHandlerConfiguration,
      authorizationIssueHandlerConfiguration: {} as any,
      authorizationFailHandlerConfiguration: {} as any,
      authorizationPageHandlerConfiguration: {} as any,
      extractorConfiguration,
    }).path;
    this.#authorizationDecisionPath = '/api/authorization/decision';
    this.#tokenPath = new TokenHandlerConfigurationImpl({
      baseHandlerConfiguration,
      tokenCreateHandlerConfiguration: {} as any,
      tokenIssueHandlerConfiguration: {} as any,
      tokenFailHandlerConfiguration: {} as any,
      userHandlerConfiguration: {} as any,
      extractorConfiguration,
    }).path;
    this.#credentialPath = new CredentialSingleIssueHandlerConfigurationImpl({
      extractorConfiguration,
      baseCredentialHandlerConfiguration: {} as any,
      introspectionHandlerConfiguration: {} as any,
      baseHandlerConfiguration,
      credentialSingleParseHandlerConfiguration: {} as any,
      commonCredentialHandlerConfiguration: {} as any,
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

  /**
   * Gets the Pushed Authorization Request (PAR) endpoint path.
   * @returns {string} The PAR endpoint path string.
   */
  get parPath(): string {
    return this.#parPath;
  }

  /**
   * Gets the authorization endpoint path.
   * @returns {string} The authorization endpoint path string.
   */
  get authorizationPath(): string {
    return this.#authorizationPath;
  }

  /**
   * Gets the authorization decision endpoint path.
   * @returns {string} The authorization decision endpoint path string.
   */
  get authorizationDecisionPath(): string {
    return this.#authorizationDecisionPath;
  }

  /**
   * Gets the token endpoint path.
   * @returns {string} The token endpoint path string.
   */
  get tokenPath(): string {
    return this.#tokenPath;
  }

  /**
   * Gets the credential endpoint path.
   * @returns {string} The credential endpoint path string.
   */
  get credentialPath(): string {
    return this.#credentialPath;
  }

  /**
   * Gets the service configuration endpoint path.
   * @returns {string} The service configuration endpoint path string.
   */
  get serviceConfigurationPath(): string {
    return this.#serviceConfigurationPath;
  }

  /**
   * Gets the credential issuer metadata endpoint path.
   * @returns {string} The credential issuer metadata endpoint path string.
   */
  get credentialIssuerMetadataPath(): string {
    return this.#credentialIssuerMetadataPath;
  }
}
