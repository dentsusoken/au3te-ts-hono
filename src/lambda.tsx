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
import { Hono } from 'hono';
import { handle } from 'hono/aws-lambda';
import { jsxRenderer } from 'hono/jsx-renderer';
import { Env } from './env';
import { sessionLambdaMiddleware } from './middleware/session';
import { EndpointPath } from './config/EndpointPath';
import { PARController } from './controllers/PARController';
import { AuthorizationController } from './controllers/AuthorizationController';
import { AuthorizationDecisionController } from './controllers/AuthorizationDecisionController';
import { ServiceConfigurationController } from './controllers/ServiceConfigurationController';
import { CredentialMetadataController } from './controllers/CredentialMetadataController';
import { setupMiddleware } from './middleware/setup';
import { setupLambdaMiddleware } from './middleware/setupLambda';
import { TokenController } from './controllers/TokenController';
import { CredentialController } from './controllers/CredentialController';
import { CredentialIssuerJwksController } from './controllers/CredentialIssuerJwksController';
import { ServiceJwksController } from './controllers/ServiceJwksController';
import { TopPage } from './view/TopPage';
import * as Aws from 'aws-sdk';

const app = new Hono<Env>();

app.use(setupLambdaMiddleware);
app.use(sessionLambdaMiddleware);
app.use(setupMiddleware);
app.use(
  '*',
  jsxRenderer(({ children }) => <>{children}</>)
);
app.get('/', (c) => {
  const host = c.req.header('host') || '';
  return c.render(<TopPage host={host} />);
});
app.get('/css/index.css', async (c) => {
  const s3 = new Aws.S3();
  const bucketName = 'tw-css';
  const objectKey = 'index.css';
  const params = {
    Bucket: bucketName,
    Key: objectKey,
  };
  const data = await s3.getObject(params).promise();
  const cssContent = data.Body?.toString('utf-8') || '';
  // return c.text(cssContent);
  return c.body(cssContent, 200, { 'Content-Type': 'text/css' });
});
app.get('/css/authorization.css', async (c) => {
  const s3 = new Aws.S3();
  const bucketName = 'tw-css';
  const objectKey = 'authorization.css';
  const params = {
    Bucket: bucketName,
    Key: objectKey,
  };
  const data = await s3.getObject(params).promise();
  const cssContent = data.Body?.toString('utf-8') || '';
  // return c.text(cssContent);
  return c.body(cssContent, 200, { 'Content-Type': 'text/css' });
});
app.post(EndpointPath.parPath, PARController.handle);
app.get(EndpointPath.authorizationPath, AuthorizationController.handle);
app.post(
  EndpointPath.authorizationDecisionPath,
  AuthorizationDecisionController.handle
);
app.post(EndpointPath.tokenPath, TokenController.handle);
app.post(EndpointPath.credentialPath, CredentialController.handle);
app.get(
  EndpointPath.serviceConfigurationPath,
  ServiceConfigurationController.handle
);
app.get(
  EndpointPath.credentialIssuerMetadataPath,
  CredentialMetadataController.handle
);
app.get(
  EndpointPath.credentialIssuerJwksPath,
  CredentialIssuerJwksController.handle
);
app.get(EndpointPath.serviceJwksPath, ServiceJwksController.handle);

// export default app;
export const handler = handle(app);
