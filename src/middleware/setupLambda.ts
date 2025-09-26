import { createMiddleware } from 'hono/factory';
import { Env as SecretsManagerEnv } from '@squilla/hono-aws-middlewares/secrets-manager';
import { Env } from '../env';

/**
 * Middleware that sets up environment variables for AWS Lambda.
 * Retrieves secrets and sets them in the context environment.
 */
export const setupLambdaMiddleware = createMiddleware<SecretsManagerEnv & Env>(
  async (c, next) => {
    const secretsManager = c.get('SecretsManager');
    const response = await secretsManager.getSecretValue({
      SecretId: process.env.SECRET_NAME || 'issuer-secrets',
    });
    const secret = JSON.parse(response.SecretString || '{}');

    c.env = {
      ...c.env,
      API_VERSION: secret.API_VERSION || '',
      API_BASE_URL: secret.API_BASE_URL || '',
      API_KEY: secret.API_KEY || '',
      ACCESS_TOKEN: secret.ACCESS_TOKEN || '',
      PUBLIC_URL: secret.PUBLIC_URL || '',
      ISSUER_SESSION_DYNAMODB: process.env.ISSUER_SESSION_DYNAMODB || '',
    };
    return next();
  }
);
