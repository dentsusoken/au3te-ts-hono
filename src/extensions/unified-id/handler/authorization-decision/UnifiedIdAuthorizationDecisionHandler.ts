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
import { UnifiedIdUser } from '../../schemas/User';
import { UnifiedIdOptionsKeys } from '../user/UnifiedIdUserHandlerConfigurationImpl';

export const createUnifiedIdAuthorizationDecisionHandler: AuthorizationDecisionHandlerFactory<
  UnifiedIdSessionSchemas,
  UnifiedIdUser,
  UnifiedIdOptionsKeys
> = <OPTS = unknown>({
  serverHandlerConfiguration,
  extractorConfiguration,
  userHandlerConfiguration,
  authorizationHandlerConfiguration,
  authorizationIssueHandlerConfiguration,
  authorizationFailHandlerConfiguration,
}: CreateAuthorizationDecisionHandlerConfigurationImplConstructorParams<
  UnifiedIdSessionSchemas,
  UnifiedIdUser,
  UnifiedIdOptionsKeys,
  OPTS
>) => {
  return new AuthorizationDecisionHandlerConfigurationImpl<
    UnifiedIdSessionSchemas,
    UnifiedIdUser,
    UnifiedIdOptionsKeys,
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
