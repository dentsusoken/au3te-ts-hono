import { Session, sessionSchemas } from '@vecrea/au3te-ts-server/session';
import { ExtractorConfiguration } from '@vecrea/au3te-ts-server/extractor';
import { ServerHandlerConfiguration } from '@vecrea/au3te-ts-server/handler.core';
import { DurableObjectBase } from './session/DurableObjectSession';

/**
 * Environment configuration interface for the application.
 * Defines the structure of environment bindings and runtime variables.
 */
export interface Env {
  /**
   * External bindings configuration for the application.
   * Contains API credentials and KV namespace configurations.
   */
  Bindings: {
    /** API version string for the Authlete API */
    API_VERSION: string;
    /** Base URL for the Authlete API */
    API_BASE_URL: string;
    /** API key for authentication with Authlete */
    API_KEY: string;
    /** Access token for authorization with Authlete */
    ACCESS_TOKEN: string;
    /** Public URL for the application */
    PUBLIC_URL?: string;
    /** KV namespace for session storage */
    SESSION_KV: KVNamespace;
    /** KV namespace for user storage */
    USER_KV: KVNamespace;
    /** KV namespace for mdoc storage */
    MDOC_KV: KVNamespace;
    /** AWS access key ID */
    AWS_ACCESS_KEY_ID: string;
    /** AWS secret access key */
    AWS_SECRET_ACCESS_KEY: string;
    /** DynamoDB table name for session storage */
    ISSUER_SESSION_DYNAMODB: string;
    /** Where to deploy ('local' or none) */
    DEPLOY_ENV: string;

    SESSION: DurableObjectNamespace<DurableObjectBase>;
  };

  /**
   * Runtime variables used throughout the application.
   * Contains session, extractor, and handler configurations.
   */
  Variables: {
    /** Current session instance with schema validation */
    session: Session<typeof sessionSchemas>;
    /** Configuration for request parameter extraction */
    extractorConfiguration: ExtractorConfiguration;
    /** Server configuration for request handlers */
    serverHandlerConfiguration: ServerHandlerConfiguration<
      typeof sessionSchemas
    >;
  };
}
