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
import {
  AuthorizationDecisionHandlerConfigurationImpl,
  CreateAuthorizationDecisionHandlerConfigurationImplConstructorParams,
} from '@vecrea/au3te-ts-server/handler.authorization-decision';
import { UnifiedIdSessionSchemas } from '../../session';
import { AuthorizationDecisionHandlerFactory } from '../../../../di/DIContainer';
import { createGetOrAuthenticateUser } from './getOrAuthenticateUser';
import { SessionSchemas } from '@vecrea/au3te-ts-server/session';
import { UnifiedIdUser } from '../../schemas/User';

export const createUnifiedIdAuthorizationDecisionHandler: AuthorizationDecisionHandlerFactory =
  <SS extends SessionSchemas = UnifiedIdSessionSchemas, OPTS = unknown>({
    serverHandlerConfiguration,
    extractorConfiguration,
    userHandlerConfiguration,
    authorizationHandlerConfiguration,
    authorizationIssueHandlerConfiguration,
    authorizationFailHandlerConfiguration,
  }: CreateAuthorizationDecisionHandlerConfigurationImplConstructorParams<
    SS,
    UnifiedIdUser,
    'serviceId',
    OPTS
  >) => {
    return new AuthorizationDecisionHandlerConfigurationImpl<
      SS,
      UnifiedIdUser,
      'serviceId',
      OPTS
    >({
      serverHandlerConfiguration,
      extractorConfiguration,
      userHandlerConfiguration,
      authorizationHandlerConfiguration: authorizationHandlerConfiguration,
      authorizationIssueHandlerConfiguration,
      authorizationFailHandlerConfiguration,
      overrides: {
        createGetOrAuthenticateUser: createGetOrAuthenticateUser,
      },
    });
  };
