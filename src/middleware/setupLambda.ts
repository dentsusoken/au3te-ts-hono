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
import { createMiddleware } from 'hono/factory';
import * as Aws from 'aws-sdk';

async function getSecret(
  secretName: string,
  region: string,
  endpoint?: string
): Promise<void> {
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
}

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
