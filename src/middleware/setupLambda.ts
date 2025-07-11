import { createMiddleware } from 'hono/factory';
import * as Aws from 'aws-sdk';

/**
 * Retrieves and sets environment variables from AWS Secrets Manager.
 *
 * @param {string} secretName - The name of the secret to retrieve.
 * @param {string} region - The AWS region where the secret is stored.
 * @param {string} [endpoint] - Optional endpoint for local development.
 * @returns {Promise<void>} A promise that resolves when the secret is retrieved and environment variables are set.
 */
const getSecret = async (
  secretName: string,
  region: string,
  endpoint?: string
): Promise<void> => {
  const client = new Aws.SecretsManager({
    region,
    endpoint,
  });

  try {
    const data = await client
      .getSecretValue({ SecretId: secretName })
      .promise();

    if ('SecretString' in data) {
      const secret = data.SecretString;
      const secretObj = JSON.parse(secret!);

      for (const [key, value] of Object.entries(secretObj)) {
        process.env[key] = value as string;
      }
    }
  } catch (err) {
    console.error(`Error retrieving secret: ${err}`);
  }
};

/**
 * Middleware that sets up environment variables for AWS Lambda.
 * Retrieves secrets and sets them in the context environment.
 */
export const setupLambdaMiddleware = createMiddleware(async (c, next) => {
  const deployEnv = process.env.DEPLOY_ENV || 'aws';
  const secretName = 'twEnviromentVariables';
  const region = 'ap-northeast-1';
  const endpoint = deployEnv === 'local' ? 'http://localhost:4566' : undefined;

  await getSecret(secretName, region, endpoint);

  c.env = {
    ...c.env,
    API_VERSION: process.env.API_VERSION || '',
    API_BASE_URL: process.env.API_BASE_URL || '',
    API_KEY: process.env.API_KEY || '',
    ACCESS_TOKEN: process.env.ACCESS_TOKEN || '',
    SESSION_KV: process.env.SESSION_KV || '',
    DYNAMODB_TABLE_ISSUER: process.env.DYNAMODB_TABLE_ISSUER || '',
  };
  return next();
});
