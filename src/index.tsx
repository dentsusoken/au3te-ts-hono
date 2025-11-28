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
import { jsxRenderer } from 'hono/jsx-renderer';
import { EndpointPath } from './config/EndpointPath';
import {
  AuthorizationController,
  AuthorizationDecisionController,
  CredentialController,
  CredentialIssuerJwksController,
  CredentialMetadataController,
  FederationCallbackController,
  FederationInitiationController,
  PARController,
  ServiceConfigurationController,
  ServiceJwksController,
  TokenController,
} from './controllers';
import { createGetDI } from './di';
import { Env } from './env';
import { createUnifiedIdAuthorizationHandler } from './extensions/unified-id/handler/authorization';
import { createUnifiedIdAuthorizationDecisionHandler } from './extensions/unified-id/handler/authorization-decision/UnifiedIdAuthorizationDecisionHandler';
import {
  createUnifiedIdUserHandler,
  UnifiedIdOptionsKeys,
} from './extensions/unified-id/handler/user/UnifiedIdUserHandlerConfigurationImpl';
import {
  UnifiedIdSessionSchemas,
  unifiedIdSessionSchemas,
} from './extensions/unified-id/session';
import { TopPage } from './view/TopPage';
import { createUnifiedIdFederationCallbackHandler } from './extensions/unified-id/handler/federation-callback/UnifiedIdFederationCallbackHandler';
import { UnifiedIdUser } from './extensions/unified-id/schemas/User';

const app = new Hono<
  Env<UnifiedIdSessionSchemas, UnifiedIdUser, UnifiedIdOptionsKeys>
>();

app.use(async (c, next) => {
  c.set(
    'getDI',
    createGetDI<UnifiedIdSessionSchemas, UnifiedIdUser, UnifiedIdOptionsKeys>(
      unifiedIdSessionSchemas,
      {
        authorizationHandler: createUnifiedIdAuthorizationHandler,
        authorizationDecisionHandler:
          createUnifiedIdAuthorizationDecisionHandler,
        userHandler: createUnifiedIdUserHandler,
        federationCallbackHandler: createUnifiedIdFederationCallbackHandler,
      },
    ),
  );
  await next();
});
app.use(
  '*',
  jsxRenderer(({ children }) => <>{children}</>),
);
app.get('/', (c) => c.render(<TopPage publicUrl={c.env.PUBLIC_URL} />));
app.post(EndpointPath.parPath, PARController.handle);
app.get(EndpointPath.authorizationPath, AuthorizationController.handle);
app.post(
  EndpointPath.authorizationDecisionPath,
  AuthorizationDecisionController.handle,
);
app.post(EndpointPath.tokenPath, TokenController.handle);
app.post(EndpointPath.credentialPath, CredentialController.handle);
app.get(
  EndpointPath.serviceConfigurationPath,
  ServiceConfigurationController.handle,
);
app.get(
  EndpointPath.credentialIssuerMetadataPath,
  CredentialMetadataController.handle,
);
app.get(
  EndpointPath.credentialIssuerJwksPath,
  CredentialIssuerJwksController.handle,
);
app.get(EndpointPath.serviceJwksPath, ServiceJwksController.handle);
app.get(
  EndpointPath.federationInitiationPath,
  FederationInitiationController.handle,
);
app.get(
  EndpointPath.federationCallbackPath,
  FederationCallbackController.handle,
);
export { DurableObjectImpl } from './database';
export default app;
