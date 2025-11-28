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

import { simpleBuildResponse } from '@vecrea/au3te-ts-server/handler.authorization';
import { CreateProcessRequestParams } from '@vecrea/au3te-ts-server/handler.federation-callback';
import { AuthorizationPageModel } from '@vecrea/au3te-ts-common/handler.authorization-page';
import { UnifiedIdSessionSchemas } from '../../session';
import { UnifiedIdUser } from '../../schemas/User';
import { UnifiedIdOptionsKeys } from '../user/UnifiedIdUserHandlerConfigurationImpl';

export type ProcessRequest = (request: Request) => Promise<Response>;

export const createProcessRequest = ({
  path,
  extractPathParameter,
  federationManager,
  responseErrorFactory,
  session,
  userHandler,
}: CreateProcessRequestParams<
  UnifiedIdSessionSchemas,
  UnifiedIdUser,
  UnifiedIdOptionsKeys
>): ProcessRequest => {
  return async (request: Request): Promise<Response> => {
    try {
      const { federationId } = extractPathParameter(request, path);

      let federation: ReturnType<typeof federationManager.getFederation>;
      try {
        federation = federationManager.getFederation(federationId);
      } catch {
        return responseErrorFactory.notFoundResponseError(
          `Federation with ID '${federationId}' not found`,
        ).response;
      }

      const federationCallbackParams = await session.get(
        'federationCallbackParams',
      );
      if (!federationCallbackParams) {
        return responseErrorFactory.badRequestResponseError(
          'Federation parameters not found',
        ).response;
      }

      const model = await session.get('authorizationPageModel');
      if (!model) {
        return responseErrorFactory.badRequestResponseError(
          'Authorization page model not found',
        ).response;
      }

      // Only OIDC protocol is supported
      if (federationCallbackParams.protocol !== 'oidc') {
        return responseErrorFactory.badRequestResponseError(
          `Unsupported protocol: ${federationCallbackParams.protocol}. Only 'oidc' protocol is supported.`,
        ).response;
      }

      const { state, codeVerifier } = federationCallbackParams;

      if (!state) {
        return responseErrorFactory.badRequestResponseError('State not found')
          .response;
      }

      let userinfo;
      try {
        userinfo = await federation.processFederationResponse(
          new URL(request.url),
          state,
          codeVerifier ?? undefined,
        );
      } catch (error) {
        return responseErrorFactory.badRequestResponseError(
          `Failed to process federation response: ${
            error instanceof Error ? error.message : 'Unknown error'
          }`,
        ).response;
      }

      const { sub, ...userInfoWithoutSub } = userinfo;
      const unifiedIdParams = await session.get('unifiedIdParams');

      if (!unifiedIdParams) {
        return responseErrorFactory.badRequestResponseError(
          'Unified ID parameters not found',
        ).response;
      }
      const { serviceId, unifiedId } = unifiedIdParams;

      const user = {
        ...userInfoWithoutSub,
        subject: `${sub}@${federationId}`,
        serviceId,
        unifiedId,
      };

      const authTime = Math.floor(Date.now() / 1000);

      await session.setBatch({
        user,
        authTime,
      });

      model.user = user;
      await userHandler.addUser(user);

      return simpleBuildResponse(model as AuthorizationPageModel);
    } catch (error) {
      return responseErrorFactory.internalServerErrorResponseError(
        `Unexpected error: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
      ).response;
    }
  };
};
