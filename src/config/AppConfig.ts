import { AuthleteConfiguration } from '@vecrea/au3te-ts-common/conf';
import { ApiClientImpl } from '@vecrea/au3te-ts-server/api';
import {
  ServerHandlerConfiguration,
  ServerHandlerConfigurationImpl,
} from '@vecrea/au3te-ts-server/handler.core';
import {
  ExtractorConfiguration,
  ExtractorConfigurationImpl,
} from '@vecrea/au3te-ts-server/extractor';
import { Session, SessionSchemas } from '@vecrea/au3te-ts-server/session';
import { Env } from '../env';

/**
 * Application configuration class that handles the setup of Authlete and related configurations.
 */
export class AppConfig {
  /**
   * Creates an Authlete configuration object from environment bindings.
   * @param {Env['Bindings']} env - The environment bindings containing API configuration.
   * @returns {AuthleteConfiguration} The Authlete configuration object.
   */
  static createConfiguration(env: Env['Bindings']): AuthleteConfiguration {
    return {
      apiVersion: env.API_VERSION,
      baseUrl: env.API_BASE_URL,
      serviceApiKey: env.API_KEY,
      serviceAccessToken: env.ACCESS_TOKEN,
    };
  }

  /**
   * Creates base configurations for handlers and extractors.
   * @template T - Type extending SessionSchemas
   * @param {Env['Bindings']} env - The environment bindings containing API configuration.
   * @param {Session<T>} session - The session instance.
   * @returns {{ serverHandlerConfiguration: ServerHandlerConfigurationImpl<T>, extractorConfiguration: ExtractorConfigurationImpl }} The base configurations object.
   */
  static createBaseConfigurations<T extends SessionSchemas>(
    env: Env['Bindings'],
    session: Session<T>
  ): {
    serverHandlerConfiguration: ServerHandlerConfiguration<T>;
    extractorConfiguration: ExtractorConfiguration;
  } {
    const configuration = this.createConfiguration(env);
    const apiClient = new ApiClientImpl(configuration);
    const serverHandlerConfiguration = new ServerHandlerConfigurationImpl(
      apiClient,
      session
    );
    const extractorConfiguration = new ExtractorConfigurationImpl();

    return {
      serverHandlerConfiguration,
      extractorConfiguration,
    };
  }

  private constructor() {
    throw new Error('This class is not instantiable');
  }
}
