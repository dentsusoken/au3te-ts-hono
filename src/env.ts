import {
  Session,
  DefaultSessionSchemas,
} from '@vecrea/au3te-ts-server/session';
import { GetDI } from './di';
import { Env as DynamoDBEnv } from '@squilla/hono-aws-middlewares/dynamodb';
import { DurableObjectImpl } from './database';

/**
 * Environment configuration interface for the application.
 * Defines the structure of environment bindings and runtime variables.
 * @template SS - Session schemas type extending SessionSchemas, defaults to the base sessionSchemas.
 */
export type Env<SS extends DefaultSessionSchemas> = DynamoDBEnv & {
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

    /** Durable Object namespace for distributed state management */
    DURABLE_OBJECT: DurableObjectNamespace<DurableObjectImpl<unknown>>;

    /** JSON string containing federation registry configuration for external identity providers */
    FEDERATTION_CONFIGS: string;
  };

  /**
   * Runtime variables used throughout the application.
   * Contains session, extractor, and handler configurations.
   */
  Variables: {
    /** Current session instance with schema validation */
    session: Session<SS>;
    /** Session ID for creating session instances */
    sessionId?: string;

    /** Dependency injection container factory function that creates configured DI containers */
    getDI: GetDI<SS>;
  };
};
