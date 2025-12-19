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
import {
  ProcessSaml2Request,
  CreateProcessSaml2RequestParams,
} from '@vecrea/au3te-ts-server/handler.federation-callback';
import { AuthorizationPageModel } from '@vecrea/au3te-ts-common/handler.authorization-page';
import { UnifiedIdSessionSchemas } from '../../session';
import { UnifiedIdUser } from '../../schemas/User';
import { UnifiedIdOptionsKeys } from '../user/UnifiedIdUserHandlerConfigurationImpl';

export const createProcessSaml2Request = ({
  responseErrorFactory,
  session,
  userHandler,
}: CreateProcessSaml2RequestParams<
  UnifiedIdSessionSchemas,
  UnifiedIdUser,
  UnifiedIdOptionsKeys
>): ProcessSaml2Request => {
  return async (request, federation): Promise<Response> => {
    try {
      const model = await session.get('authorizationPageModel');
      if (!model) {
        return responseErrorFactory.badRequestResponseError(
          'Authorization page model not found',
        ).response;
      }

      let userinfo;
      try {
        userinfo = await federation.processSaml2Response(request);
      } catch (error) {
        return responseErrorFactory.badRequestResponseError(
          `Failed to process federation response: ${
            error instanceof Error ? error.message : 'Unknown error'
          }`,
        ).response;
      }

      const unifiedIdParams = await session.get('unifiedIdParams');

      if (!unifiedIdParams) {
        return responseErrorFactory.badRequestResponseError(
          'Unified ID parameters not found',
        ).response;
      }
      const { serviceId, unifiedId } = unifiedIdParams;

      const { nameID } = userinfo;
      const user = {
        subject: `${nameID}@${federation.id}`,
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
      await userHandler.cacheUserAttributes(
        { ...user, ...userinfo.attributes } as UnifiedIdUser,
        'saml2',
        300
      ); // 5 minutes

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
