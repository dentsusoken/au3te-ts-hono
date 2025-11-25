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
  AuthorizationHandlerConfiguration,
  AuthorizationHandlerConfigurationImpl,
  AuthorizationHandlerConfigurationImplConstructorParams,
} from '@vecrea/au3te-ts-server/handler.authorization';
import { UnifiedIdSessionSchemas } from '../../session';
import { SessionSchemas } from '@vecrea/au3te-ts-server/session';
import { ExtractUnifiedIdParameters } from './extractParameters';
import { createGenerateAuthorizationPage } from './generateAuthorizationPage';
import { UnifiedIdParams } from '../../schemas/UnifiedIdParams';
import { createProcessApiResponse } from './processApiResponse';
import { createProcessRequest } from './processRequest';
import { AuthorizationHandlerFactory } from '../../../../di/DIContainer';
import { createToApiRequest } from './toApiRequest';

export class UnifiedIdAuthorizationHandler<
  SS extends SessionSchemas = UnifiedIdSessionSchemas,
  OPTS = UnifiedIdParams,
> extends AuthorizationHandlerConfigurationImpl<SS, OPTS> {
  constructor(
    params: AuthorizationHandlerConfigurationImplConstructorParams<SS, OPTS>,
  ) {
    super(params);
  }
}

export const createUnifiedIdAuthorizationHandler: AuthorizationHandlerFactory =
  <
    SS extends SessionSchemas = UnifiedIdSessionSchemas,
    OPTS extends UnifiedIdParams = UnifiedIdParams,
  >(
    params: AuthorizationHandlerConfigurationImplConstructorParams<SS, OPTS>,
  ): AuthorizationHandlerConfiguration<SS, OPTS> => {
    const unifiedIdParams: AuthorizationHandlerConfigurationImplConstructorParams<
      SS,
      OPTS
    > = {
      serverHandlerConfiguration: params.serverHandlerConfiguration,
      authorizationIssueHandlerConfiguration:
        params.authorizationIssueHandlerConfiguration,
      authorizationFailHandlerConfiguration:
        params.authorizationFailHandlerConfiguration,
      authorizationPageHandlerConfiguration:
        params.authorizationPageHandlerConfiguration,
      extractorConfiguration: {
        ...params.extractorConfiguration,
        extractParameters: ExtractUnifiedIdParameters,
      },
      federationManager: params.federationManager,
      overrides: {
        createGenerateAuthorizationPage: createGenerateAuthorizationPage<
          SS,
          OPTS
        >,
        createProcessApiResponse: createProcessApiResponse<SS, OPTS>,
        createProcessRequest: createProcessRequest<OPTS>,
        createToApiRequest: createToApiRequest<OPTS>,
      },
    };
    return new UnifiedIdAuthorizationHandler<SS, OPTS>(unifiedIdParams);
  };
