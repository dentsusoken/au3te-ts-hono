import { createMiddleware } from 'hono/factory';
import { Env } from '@squilla/hono-aws-middlewares/secrets-manager';

/**
 * Middleware that sets up environment variables for AWS Lambda.
 * Retrieves secrets and sets them in the context environment.
 */
export const setupLambdaMiddleware = createMiddleware<Env>(async (c, next) => {
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
    ISSUER_SESSION_DYNAMODB: process.env.ISSUER_SESSION_DYNAMODB || '',
  };
  return next();
});
