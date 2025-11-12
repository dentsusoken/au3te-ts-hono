import { ExtractorConfiguration } from '@vecrea/au3te-ts-server/extractor';
import {
  AuthorizationHandlerConfiguration,
  AuthorizationHandlerConfigurationImplConstructorParams,
} from '@vecrea/au3te-ts-server/handler.authorization';
import { ServerHandlerConfiguration } from '@vecrea/au3te-ts-server/handler.core';
import {
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

export interface DIContainer<
  SS extends SessionSchemas = typeof sessionSchemas
> {
  serverHandlerConfiguration(): ServerHandlerConfiguration<SS>;
  extractorConfiguration(): ExtractorConfiguration;
  authorizationHandler<OPTS extends object>(): AuthorizationHandlerConfiguration<
    SS,
    OPTS
  >;
  tokenHandler(): TokenHandlerConfiguration;
  credentialHandler(): CredentialSingleIssueHandlerConfiguration;
  authorizationDecisionHandler(): AuthorizationDecisionHandlerConfiguration;
  parHandler(): ParHandlerConfiguration;
  credentialIssuerJwksHandler(): CredentialIssuerJwksHandlerConfiguration;
  credentialMetadataHandler(): CredentialMetadataHandlerConfiguration;
  serviceConfigurationHandler(): ServiceConfigurationHandlerConfiguration;
  serviceJwksHandler(): ServiceJwksHandlerConfiguration;
  userHandler(): UserHandlerConfiguration;
}

export type AuthorizationHandlerFactory = <
  SS extends SessionSchemas,
  OPTS extends object
>(
  params: AuthorizationHandlerConfigurationImplConstructorParams<SS, OPTS>
) => AuthorizationHandlerConfiguration<SS, OPTS>;

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

export interface AuthorizationDecisionHandlerFactory {
  <
    SS extends SessionSchemas = typeof sessionSchemas,
    OPTS = undefined
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

export interface PARHandlerFactory {
  <SS extends SessionSchemas = typeof sessionSchemas>(params: {
    serverHandlerConfiguration: ServerHandlerConfiguration<SS>;
    extractorConfiguration: ExtractorConfiguration;
  }): ParHandlerConfiguration;
}

export interface CredentialIssuerJwksHandlerFactory {
  <SS extends SessionSchemas = typeof sessionSchemas>(params: {
    serverHandlerConfiguration: ServerHandlerConfiguration<SS>;
  }): CredentialIssuerJwksHandlerConfiguration;
}

export interface CredentialMetadataHandlerFactory {
  <SS extends SessionSchemas = typeof sessionSchemas>(params: {
    serverHandlerConfiguration: ServerHandlerConfiguration<SS>;
  }): CredentialMetadataHandlerConfiguration;
}

export interface ServiceConfigurationHandlerFactory {
  <SS extends SessionSchemas = typeof sessionSchemas>(params: {
    serverHandlerConfiguration: ServerHandlerConfiguration<SS>;
  }): ServiceConfigurationHandlerConfiguration;
}

export interface ServiceJwksHandlerFactory {
  <SS extends SessionSchemas = typeof sessionSchemas>(params: {
    serverHandlerConfiguration: ServerHandlerConfiguration<SS>;
  }): ServiceJwksHandlerConfiguration;
}

export interface UserHandlerFactory {
  <SS extends SessionSchemas>(
    c: Context<Env<SS>>
  ): UserHandlerConfiguration;
}

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
}
