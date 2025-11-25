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
import { ExtractorConfiguration } from '@vecrea/au3te-ts-server/extractor';
import {
  AuthorizationHandlerConfiguration,
  AuthorizationHandlerConfigurationImplConstructorParams,
} from '@vecrea/au3te-ts-server/handler.authorization';
import { ServerHandlerConfiguration } from '@vecrea/au3te-ts-server/handler.core';
import {
  Session,
  sessionSchemas,
  SessionSchemas,
} from '@vecrea/au3te-ts-server/session';
import { TokenHandlerConfiguration } from '@vecrea/au3te-ts-server/handler.token';
import { TokenFailHandlerConfiguration } from '@vecrea/au3te-ts-server/handler.token-fail';
import { TokenIssueHandlerConfiguration } from '@vecrea/au3te-ts-server/handler.token-issue';
import { TokenCreateHandlerConfiguration } from '@vecrea/au3te-ts-server/handler.token-create';
import { CredentialSingleIssueHandlerConfiguration } from '@vecrea/au3te-ts-server/handler.credential-single-issue';
import { IntrospectionHandlerConfiguration } from '@vecrea/au3te-ts-server/handler.introspection';
import { CredentialSingleParseHandlerConfiguration } from '@vecrea/au3te-ts-server/handler.credential-single-parse';
import { CommonCredentialHandlerConfiguration } from '@vecrea/au3te-ts-common/handler.credential';
import { ServerCredentialHandlerConfiguration } from '@vecrea/au3te-ts-server/handler.credential';
import { AuthorizationDecisionHandlerConfiguration } from '@vecrea/au3te-ts-server/handler.authorization-decision';
import { AuthorizationIssueHandlerConfiguration } from '@vecrea/au3te-ts-server/handler.authorization-issue';
import { AuthorizationFailHandlerConfiguration } from '@vecrea/au3te-ts-server/handler.authorization-fail';
import { ParHandlerConfiguration } from '@vecrea/au3te-ts-server/handler.par';
import { CredentialIssuerJwksHandlerConfiguration } from '@vecrea/au3te-ts-server/handler.credential-issuer-jwks';
import { CredentialMetadataHandlerConfiguration } from '@vecrea/au3te-ts-server/handler.credential-metadata';
import { ServiceConfigurationHandlerConfiguration } from '@vecrea/au3te-ts-server/handler.service-configuration';
import { ServiceJwksHandlerConfiguration } from '@vecrea/au3te-ts-server/handler.service-jwks';
import { UserHandlerConfiguration } from '@vecrea/au3te-ts-common/handler.user';
import { Env } from '../env';
import { Context } from 'hono';
import { FederationInitiationHandlerConfiguration } from '@vecrea/au3te-ts-server/handler.federation-initiation';
import { FederationCallbackHandlerConfiguration } from '@vecrea/au3te-ts-server/handler.federation-callback';
/**
 * Dependency Injection Container interface.
 * Provides factory methods for creating handler configurations.
 * @template SS - The session schemas type, defaults to the base sessionSchemas.
 */
export interface DIContainer<
  SS extends SessionSchemas = typeof sessionSchemas,
> {
  /**
   * Creates a session instance for the given context.
   * @param {Context<Env<SS>>} c - The Hono context containing environment and session information.
   * @returns {Session<SS>} A session instance configured with the session schemas.
   */
  session(c: Context<Env<SS>>): Session<SS>;

  /**
   * Creates a server handler configuration.
   * @returns {ServerHandlerConfiguration<SS>} The server handler configuration.
   */
  serverHandlerConfiguration(): ServerHandlerConfiguration<SS>;

  /**
   * Creates an extractor configuration.
   * @returns {ExtractorConfiguration} The extractor configuration.
   */
  extractorConfiguration(): ExtractorConfiguration;

  /**
   * Creates an authorization handler configuration.
   * @template OPTS - Additional options type for the authorization handler.
   * @returns {AuthorizationHandlerConfiguration<SS, OPTS>} The authorization handler configuration.
   */
  authorizationHandler<
    OPTS extends object,
  >(): AuthorizationHandlerConfiguration<SS, OPTS>;

  /**
   * Creates a token handler configuration.
   * @returns {TokenHandlerConfiguration} The token handler configuration.
   */
  tokenHandler(): TokenHandlerConfiguration;

  /**
   * Creates a credential handler configuration.
   * @returns {CredentialSingleIssueHandlerConfiguration} The credential handler configuration.
   */
  credentialHandler(): CredentialSingleIssueHandlerConfiguration;

  /**
   * Creates an authorization decision handler configuration.
   * @returns {AuthorizationDecisionHandlerConfiguration} The authorization decision handler configuration.
   */
  authorizationDecisionHandler(): AuthorizationDecisionHandlerConfiguration;

  /**
   * Creates a PAR (Pushed Authorization Request) handler configuration.
   * @returns {ParHandlerConfiguration} The PAR handler configuration.
   */
  parHandler(): ParHandlerConfiguration;

  /**
   * Creates a credential issuer JWKS handler configuration.
   * @returns {CredentialIssuerJwksHandlerConfiguration} The credential issuer JWKS handler configuration.
   */
  credentialIssuerJwksHandler(): CredentialIssuerJwksHandlerConfiguration;

  /**
   * Creates a credential metadata handler configuration.
   * @returns {CredentialMetadataHandlerConfiguration} The credential metadata handler configuration.
   */
  credentialMetadataHandler(): CredentialMetadataHandlerConfiguration;

  /**
   * Creates a service configuration handler configuration.
   * @returns {ServiceConfigurationHandlerConfiguration} The service configuration handler configuration.
   */
  serviceConfigurationHandler(): ServiceConfigurationHandlerConfiguration;

  /**
   * Creates a service JWKS handler configuration.
   * @returns {ServiceJwksHandlerConfiguration} The service JWKS handler configuration.
   */
  serviceJwksHandler(): ServiceJwksHandlerConfiguration;

  /**
   * Creates a user handler configuration.
   * @returns {UserHandlerConfiguration} The user handler configuration.
   */
  userHandler(): UserHandlerConfiguration;

  /**
   * Creates a federation initiation handler configuration.
   * @returns {FederationInitiationHandlerConfiguration} The federation initiation handler configuration.
   */
  federationInitiationHandler(): FederationInitiationHandlerConfiguration;
  /**
   * Creates a federation callback handler configuration.
   * @returns {FederationCallbackHandlerConfiguration} The federation callback handler configuration.
   */
  federationCallbackHandler(): FederationCallbackHandlerConfiguration;
}

/**
 * Factory function type for creating authorization handler configurations.
 * @template SS - The session schemas type.
 * @template OPTS - Additional options type for the authorization handler.
 */
export type AuthorizationHandlerFactory = <
  SS extends SessionSchemas,
  OPTS extends object,
>(
  params: AuthorizationHandlerConfigurationImplConstructorParams<SS, OPTS>,
) => AuthorizationHandlerConfiguration<SS, OPTS>;

/**
 * Factory interface for creating token handler configurations.
 */
export interface TokenHandlerFactory {
  <SS extends SessionSchemas = typeof sessionSchemas>(params: {
    serverHandlerConfiguration: ServerHandlerConfiguration<SS>;
    extractorConfiguration: ExtractorConfiguration;
    userHandlerConfiguration: UserHandlerConfiguration;
    tokenFailHandlerConfiguration: TokenFailHandlerConfiguration;
    tokenIssueHandlerConfiguration: TokenIssueHandlerConfiguration;
    tokenCreateHandlerConfiguration: TokenCreateHandlerConfiguration;
  }): TokenHandlerConfiguration;
}

/**
 * Factory interface for creating credential handler configurations.
 */
export interface CredentialHandlerFactory {
  <SS extends SessionSchemas = typeof sessionSchemas>(params: {
    serverHandlerConfiguration: ServerHandlerConfiguration<SS>;
    extractorConfiguration: ExtractorConfiguration;
    introspectionHandlerConfiguration: IntrospectionHandlerConfiguration;
    credentialSingleParseHandlerConfiguration: CredentialSingleParseHandlerConfiguration;
    commonCredentialHandlerConfiguration: CommonCredentialHandlerConfiguration;
    serverCredentialHandlerConfiguration: ServerCredentialHandlerConfiguration;
  }): CredentialSingleIssueHandlerConfiguration;
}

/**
 * Factory interface for creating authorization decision handler configurations.
 */
export interface AuthorizationDecisionHandlerFactory {
  <
    SS extends SessionSchemas = typeof sessionSchemas,
    OPTS = undefined,
  >(params: {
    serverHandlerConfiguration: ServerHandlerConfiguration<SS>;
    extractorConfiguration: ExtractorConfiguration;
    userHandlerConfiguration: UserHandlerConfiguration;
    authorizationHandlerConfiguration: AuthorizationHandlerConfiguration<
      SS,
      OPTS
    >;
    authorizationIssueHandlerConfiguration: AuthorizationIssueHandlerConfiguration;
    authorizationFailHandlerConfiguration: AuthorizationFailHandlerConfiguration;
  }): AuthorizationDecisionHandlerConfiguration;
}

/**
 * Factory interface for creating PAR (Pushed Authorization Request) handler configurations.
 */
export interface PARHandlerFactory {
  <SS extends SessionSchemas = typeof sessionSchemas>(params: {
    serverHandlerConfiguration: ServerHandlerConfiguration<SS>;
    extractorConfiguration: ExtractorConfiguration;
  }): ParHandlerConfiguration;
}

/**
 * Factory interface for creating credential issuer JWKS handler configurations.
 */
export interface CredentialIssuerJwksHandlerFactory {
  <SS extends SessionSchemas = typeof sessionSchemas>(params: {
    serverHandlerConfiguration: ServerHandlerConfiguration<SS>;
  }): CredentialIssuerJwksHandlerConfiguration;
}

/**
 * Factory interface for creating credential metadata handler configurations.
 */
export interface CredentialMetadataHandlerFactory {
  <SS extends SessionSchemas = typeof sessionSchemas>(params: {
    serverHandlerConfiguration: ServerHandlerConfiguration<SS>;
  }): CredentialMetadataHandlerConfiguration;
}

/**
 * Factory interface for creating service configuration handler configurations.
 */
export interface ServiceConfigurationHandlerFactory {
  <SS extends SessionSchemas = typeof sessionSchemas>(params: {
    serverHandlerConfiguration: ServerHandlerConfiguration<SS>;
  }): ServiceConfigurationHandlerConfiguration;
}

/**
 * Factory interface for creating service JWKS handler configurations.
 */
export interface ServiceJwksHandlerFactory {
  <SS extends SessionSchemas = typeof sessionSchemas>(params: {
    serverHandlerConfiguration: ServerHandlerConfiguration<SS>;
  }): ServiceJwksHandlerConfiguration;
}

/**
 * Factory interface for creating user handler configurations.
 */
export interface UserHandlerFactory {
  /**
   * Creates a user handler configuration.
   * @template SS - The session schemas type.
   * @param {Context<Env<SS>>} c - The Hono context.
   * @returns {UserHandlerConfiguration} The user handler configuration.
   */
  <SS extends SessionSchemas>(c: Context<Env<SS>>): UserHandlerConfiguration;
}

/**
 * Factory interface for creating session instances.
 */
export interface SessionFactory {
  /**
   * Creates a session factory function.
   * @template SS - The session schemas type.
   * @param {SS} sessionSchemas - The session schemas to use.
   * @returns A function that creates a session instance from a context.
   */
  <SS extends SessionSchemas>(
    sessionSchemas: SS,
  ): (c: Context<Env<SS>>) => Session<SS>;
}

/**
 * Factory interface for creating federation initiation handler configurations.
 */
export interface FederationInitiationHandlerFactory {
  <SS extends SessionSchemas>(params: {
    serverHandlerConfiguration: ServerHandlerConfiguration<SS>;
  }): FederationInitiationHandlerConfiguration;
}
/**
 * Factory interface for creating federation callback handler configurations.
 */
export interface FederationCallbackHandlerFactory {
  <SS extends SessionSchemas>(params: {
    serverHandlerConfiguration: ServerHandlerConfiguration<SS>;
  }): FederationCallbackHandlerConfiguration;
}
/**
 * Override configuration for DI container.
 * Allows custom implementations to be injected for specific handlers.
 */
export interface DIContainerOverrides {
  authorizationHandler?: AuthorizationHandlerFactory;
  tokenHandler?: TokenHandlerFactory;
  credentialHandler?: CredentialHandlerFactory;
  authorizationDecisionHandler?: AuthorizationDecisionHandlerFactory;
  parHandler?: PARHandlerFactory;
  credentialIssuerJwksHandler?: CredentialIssuerJwksHandlerFactory;
  credentialMetadataHandler?: CredentialMetadataHandlerFactory;
  serviceConfigurationHandler?: ServiceConfigurationHandlerFactory;
  serviceJwksHandler?: ServiceJwksHandlerFactory;
  userHandler?: UserHandlerFactory;
  session?: SessionFactory;
  federationInitiationHandler?: FederationInitiationHandlerFactory;
  federationCallbackHandler?: FederationCallbackHandlerFactory;
}
