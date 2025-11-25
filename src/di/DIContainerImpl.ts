import { DIContainer, DIContainerOverrides } from './DIContainer';
import { Session, SessionSchemas } from '@vecrea/au3te-ts-server/session';
import {
  AuthorizationHandlerConfiguration,
  AuthorizationHandlerConfigurationImpl,
} from '@vecrea/au3te-ts-server/handler.authorization';
import { Env } from '../env';
import { Context } from 'hono';
import { ApiClient } from '@vecrea/au3te-ts-common';
import {
  ServerHandlerConfiguration,
  ServerHandlerConfigurationImpl,
} from '@vecrea/au3te-ts-server/handler.core';
import { ApiClientImpl } from '@vecrea/au3te-ts-server/api';
import {
  ExtractorConfiguration,
  ExtractorConfigurationImpl,
} from '@vecrea/au3te-ts-server/extractor';
import {
  AuthorizationIssueHandlerConfiguration,
  AuthorizationIssueHandlerConfigurationImpl,
} from '@vecrea/au3te-ts-server/handler.authorization-issue';
import {
  AuthorizationFailHandlerConfiguration,
  AuthorizationFailHandlerConfigurationImpl,
} from '@vecrea/au3te-ts-server/handler.authorization-fail';
import {
  AuthorizationPageHandlerConfiguration,
  AuthorizationPageHandlerConfigurationImpl,
} from '@vecrea/au3te-ts-common/handler.authorization-page';
import {
  TokenHandlerConfiguration,
  TokenHandlerConfigurationImpl,
} from '@vecrea/au3te-ts-server/handler.token';
import { TokenIssueHandlerConfigurationImpl } from '@vecrea/au3te-ts-server/handler.token-issue';
import { TokenFailHandlerConfigurationImpl } from '@vecrea/au3te-ts-server/handler.token-fail';
import { TokenCreateHandlerConfigurationImpl } from '@vecrea/au3te-ts-server/handler.token-create';
import {
  CredentialSingleIssueHandlerConfiguration,
  CredentialSingleIssueHandlerConfigurationImpl,
} from '@vecrea/au3te-ts-server/handler.credential-single-issue';
import { CredentialSingleParseHandlerConfigurationImpl } from '@vecrea/au3te-ts-server/handler.credential-single-parse';
import { ServerCredentialHandlerConfigurationImpl } from '@vecrea/au3te-ts-server/handler.credential';
import { IntrospectionHandlerConfigurationImpl } from '@vecrea/au3te-ts-server/handler.introspection';
import { CommonCredentialHandlerConfigurationImpl } from '@vecrea/au3te-ts-common/handler.credential';
import {
  CredentialMetadataHandlerConfiguration,
  CredentialMetadataHandlerConfigurationImpl,
} from '@vecrea/au3te-ts-server/handler.credential-metadata';
import {
  AuthorizationDecisionHandlerConfiguration,
  AuthorizationDecisionHandlerConfigurationImpl,
} from '@vecrea/au3te-ts-server/handler.authorization-decision';
import {
  ParHandlerConfiguration,
  ParHandlerConfigurationImpl,
} from '@vecrea/au3te-ts-server/handler.par';
import {
  CredentialIssuerJwksHandlerConfiguration,
  CredentialIssuerJwksHandlerConfigurationImpl,
} from '@vecrea/au3te-ts-server/handler.credential-issuer-jwks';
import {
  ServiceConfigurationHandlerConfiguration,
  ServiceConfigurationHandlerConfigurationImpl,
} from '@vecrea/au3te-ts-server/handler.service-configuration';
import {
  ServiceJwksHandlerConfiguration,
  ServiceJwksHandlerConfigurationImpl,
} from '@vecrea/au3te-ts-server/handler.service-jwks';
import {
  UserHandlerConfiguration,
  UserHandlerConfigurationImpl,
} from '@vecrea/au3te-ts-common/handler.user';
// import { UserHandlerKV } from '../extensions/kv-user/handler/user/UserHandlerKV';
import { createDOSession } from '../session/DurableObjectSession';
import { FederationManagerImpl } from '../federation/FederationManagerImpl';
import {
  FederationInitiationHandlerConfiguration,
  FederationInitiationHandlerConfigurationImpl,
} from '@vecrea/au3te-ts-server/handler.federation-initiation';
import {
  FederationCallbackHandlerConfiguration,
  FederationCallbackHandlerConfigurationImpl,
} from '@vecrea/au3te-ts-server/handler.federation-callback';

/**
 * Default implementation of the DI container.
 * Provides factory methods for creating handler configurations with dependency injection.
 * @template SS - The session schemas type.
 */
export class DIContainerImpl<SS extends SessionSchemas>
  implements DIContainer<SS>
{
  readonly #c: Context<Env<SS>>;
  readonly #overrides: DIContainerOverrides;

  /** Session factory function that creates session instances from contexts */
  session: (c: Context<Env<SS>>) => Session<SS>;

  /**
   * Creates a new DIContainerImpl instance.
   * @param {Context<Env<SS>>} c - The Hono context.
   * @param {SS} sessionSchemas - The session schemas to use.
   * @param {DIContainerOverrides} [overrides={}] - Optional overrides for handler factories.
   */
  constructor(
    c: Context<Env<SS>>,
    sessionSchemas: SS,
    overrides: DIContainerOverrides = {},
  ) {
    this.#c = c;
    this.#overrides = overrides;

    if (this.#overrides.session) {
      this.session = this.#overrides.session(sessionSchemas);
    } else {
      this.session = createDOSession(sessionSchemas);
    }
  }

  #apiClient(): ApiClient {
    return new ApiClientImpl({
      apiVersion: this.#c.env.API_VERSION,
      baseUrl: this.#c.env.API_BASE_URL,
      serviceApiKey: this.#c.env.API_KEY,
      serviceAccessToken: this.#c.env.ACCESS_TOKEN,
    });
  }

  serverHandlerConfiguration(): ServerHandlerConfiguration<SS> {
    const session = this.session(this.#c);
    return new ServerHandlerConfigurationImpl(this.#apiClient(), session);
  }

  extractorConfiguration(): ExtractorConfiguration {
    return new ExtractorConfigurationImpl();
  }
  authorizationIssueHandlerConfiguration(): AuthorizationIssueHandlerConfiguration {
    return new AuthorizationIssueHandlerConfigurationImpl(
      this.serverHandlerConfiguration(),
    );
  }
  authorizationFailHandlerConfiguration(): AuthorizationFailHandlerConfiguration {
    return new AuthorizationFailHandlerConfigurationImpl(
      this.serverHandlerConfiguration(),
    );
  }
  authorizationPageHandlerConfiguration(): AuthorizationPageHandlerConfiguration {
    return new AuthorizationPageHandlerConfigurationImpl({
      federationRegistry: new FederationManagerImpl(this.#c).getConfigurations(),
    });
  }

  #buildAuthorizationHandlerParams() {
    return {
      serverHandlerConfiguration: this.serverHandlerConfiguration(),
      authorizationIssueHandlerConfiguration:
        this.authorizationIssueHandlerConfiguration(),
      authorizationFailHandlerConfiguration:
        this.authorizationFailHandlerConfiguration(),
      authorizationPageHandlerConfiguration:
        this.authorizationPageHandlerConfiguration(),
      extractorConfiguration: this.extractorConfiguration(),
      federationManager: new FederationManagerImpl(this.#c),
    };
  }

  authorizationHandler<
    OPTS extends object,
  >(): AuthorizationHandlerConfiguration<SS, OPTS> {
    const params = this.#buildAuthorizationHandlerParams();
    if (this.#overrides.authorizationHandler) {
      return this.#overrides.authorizationHandler<SS, OPTS>(params);
    }
    return new AuthorizationHandlerConfigurationImpl(params);
  }

  userHandler(): UserHandlerConfiguration {
    if (this.#overrides.userHandler) {
      return this.#overrides.userHandler(this.#c);
    }
    return new UserHandlerConfigurationImpl();
  }

  #buildTokenHandlerDependencies() {
    const serverHandlerConfiguration = this.serverHandlerConfiguration();
    const extractorConfiguration = this.extractorConfiguration();
    const userHandlerConfiguration = this.userHandler();
    const tokenFailHandlerConfiguration = new TokenFailHandlerConfigurationImpl(
      serverHandlerConfiguration,
    );
    const tokenIssueHandlerConfiguration =
      new TokenIssueHandlerConfigurationImpl(serverHandlerConfiguration);
    const tokenCreateHandlerConfiguration =
      new TokenCreateHandlerConfigurationImpl(serverHandlerConfiguration);

    return {
      serverHandlerConfiguration,
      extractorConfiguration,
      userHandlerConfiguration,
      tokenFailHandlerConfiguration,
      tokenIssueHandlerConfiguration,
      tokenCreateHandlerConfiguration,
    };
  }

  tokenHandler(): TokenHandlerConfiguration {
    const dependencies = this.#buildTokenHandlerDependencies();
    if (this.#overrides.tokenHandler) {
      return this.#overrides.tokenHandler(dependencies);
    }

    return new TokenHandlerConfigurationImpl(dependencies);
  }

  #buildCredentialHandlerDependencies() {
    const serverHandlerConfiguration = this.serverHandlerConfiguration();
    const extractorConfiguration = this.extractorConfiguration();
    const introspectionHandlerConfiguration =
      new IntrospectionHandlerConfigurationImpl(serverHandlerConfiguration);
    const credentialSingleParseHandlerConfiguration =
      new CredentialSingleParseHandlerConfigurationImpl(
        serverHandlerConfiguration,
      );
    const userHandlerConfiguration = this.userHandler();
    const commonCredentialHandlerConfiguration =
      new CommonCredentialHandlerConfigurationImpl({
        userHandlerConfiguration,
      });
    const credentialMetadataHandlerConfiguration =
      new CredentialMetadataHandlerConfigurationImpl(
        serverHandlerConfiguration,
      );
    const serverCredentialHandlerConfiguration =
      new ServerCredentialHandlerConfigurationImpl({
        credentialMetadataHandlerConfiguration,
      });

    return {
      serverHandlerConfiguration,
      extractorConfiguration,
      introspectionHandlerConfiguration,
      credentialSingleParseHandlerConfiguration,
      commonCredentialHandlerConfiguration,
      serverCredentialHandlerConfiguration,
    };
  }

  credentialHandler(): CredentialSingleIssueHandlerConfiguration {
    const dependencies = this.#buildCredentialHandlerDependencies();
    if (this.#overrides.credentialHandler) {
      return this.#overrides.credentialHandler(dependencies);
    }

    return new CredentialSingleIssueHandlerConfigurationImpl<SS>(dependencies);
  }

  #buildAuthorizationDecisionHandlerDependencies() {
    const serverHandlerConfiguration = this.serverHandlerConfiguration();
    const extractorConfiguration = this.extractorConfiguration();
    const userHandlerConfiguration = this.userHandler();
    const authorizationIssueHandlerConfiguration =
      this.authorizationIssueHandlerConfiguration();
    const authorizationFailHandlerConfiguration =
      this.authorizationFailHandlerConfiguration();
    const authorizationHandlerConfiguration = this.authorizationHandler();

    return {
      serverHandlerConfiguration,
      extractorConfiguration,
      userHandlerConfiguration,
      authorizationHandlerConfiguration,
      authorizationIssueHandlerConfiguration,
      authorizationFailHandlerConfiguration,
    };
  }

  authorizationDecisionHandler(): AuthorizationDecisionHandlerConfiguration {
    const dependencies = this.#buildAuthorizationDecisionHandlerDependencies();
    if (this.#overrides.authorizationDecisionHandler) {
      return this.#overrides.authorizationDecisionHandler<SS, object>(
        dependencies,
      );
    }

    return new AuthorizationDecisionHandlerConfigurationImpl(dependencies);
  }

  parHandler(): ParHandlerConfiguration {
    const params = {
      serverHandlerConfiguration: this.serverHandlerConfiguration(),
      extractorConfiguration: this.extractorConfiguration(),
    };
    if (this.#overrides.parHandler) {
      return this.#overrides.parHandler(params);
    }
    return new ParHandlerConfigurationImpl(params);
  }

  credentialIssuerJwksHandler(): CredentialIssuerJwksHandlerConfiguration {
    const serverHandlerConfiguration = this.serverHandlerConfiguration();
    if (this.#overrides.credentialIssuerJwksHandler) {
      return this.#overrides.credentialIssuerJwksHandler({
        serverHandlerConfiguration,
      });
    }
    return new CredentialIssuerJwksHandlerConfigurationImpl(
      serverHandlerConfiguration,
    );
  }

  credentialMetadataHandler(): CredentialMetadataHandlerConfiguration {
    const serverHandlerConfiguration = this.serverHandlerConfiguration();
    if (this.#overrides.credentialMetadataHandler) {
      return this.#overrides.credentialMetadataHandler({
        serverHandlerConfiguration,
      });
    }
    return new CredentialMetadataHandlerConfigurationImpl(
      serverHandlerConfiguration,
    );
  }

  serviceConfigurationHandler(): ServiceConfigurationHandlerConfiguration {
    const serverHandlerConfiguration = this.serverHandlerConfiguration();
    if (this.#overrides.serviceConfigurationHandler) {
      return this.#overrides.serviceConfigurationHandler({
        serverHandlerConfiguration,
      });
    }
    return new ServiceConfigurationHandlerConfigurationImpl(
      serverHandlerConfiguration,
    );
  }

  serviceJwksHandler(): ServiceJwksHandlerConfiguration {
    const serverHandlerConfiguration = this.serverHandlerConfiguration();
    if (this.#overrides.serviceJwksHandler) {
      return this.#overrides.serviceJwksHandler({
        serverHandlerConfiguration,
      });
    }
    return new ServiceJwksHandlerConfigurationImpl(serverHandlerConfiguration);
  }

  federationInitiationHandler(): FederationInitiationHandlerConfiguration {
    const serverHandlerConfiguration = this.serverHandlerConfiguration();
    const extractorConfiguration = this.extractorConfiguration();
    const federationManager = new FederationManagerImpl(this.#c);
    return new FederationInitiationHandlerConfigurationImpl({
      serverHandlerConfiguration,
      extractorConfiguration,
      federationManager,
    });
  }

  federationCallbackHandler(): FederationCallbackHandlerConfiguration {
    const serverHandlerConfiguration = this.serverHandlerConfiguration();
    const extractorConfiguration = this.extractorConfiguration();
    const federationManager = new FederationManagerImpl(this.#c);
    return new FederationCallbackHandlerConfigurationImpl({
      serverHandlerConfiguration,
      extractorConfiguration,
      federationManager,
    });
  }
}
