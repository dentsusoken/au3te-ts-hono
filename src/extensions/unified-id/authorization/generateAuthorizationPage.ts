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
  CreateGenerateAuthorizationPageParams,
  GenerateAuthorizationPage,
} from '@vecrea/au3te-ts-server/handler.authorization';
import { SessionSchemas } from '@vecrea/au3te-ts-server/session';
import { UnifiedIdSessionSchemas } from '../session';
import { UnifiedIdParams } from '../schemas/UnifiedIdParams';
import { AuthorizationPageModel } from '@vecrea/au3te-ts-common/handler.authorization-page';

/**
 * Creates a function to generate an authorization page
 * @template SS - The type of SessionSchemas
 * @template OPTS - The type of options
 * @param {CreateGenerateAuthorizationPageParams<SS>} params - The parameters for creating the function
 * @returns {GenerateAuthorizationPage<SS>} A function that generates an authorization page
 */
export const createGenerateAuthorizationPage =
  <SS extends SessionSchemas = UnifiedIdSessionSchemas, OPTS extends UnifiedIdParams = UnifiedIdParams>({
    responseToDecisionParams,
    clearCurrentUserInfoInSessionIfNecessary,
    buildAuthorizationPageModel,
    buildResponse,
  }: CreateGenerateAuthorizationPageParams<SS>): GenerateAuthorizationPage<
    SS,
    OPTS
  > =>
  async (response, session, options) => {
    const authorizationDecisionParams = responseToDecisionParams(response);
    const { acrs, client } = response;

    await session.setBatch({
      authorizationDecisionParams,
      acrs,
      client,
      unifiedIdParams: options,
    });
    await clearCurrentUserInfoInSessionIfNecessary(response, session);
    const user = await session.get('user');
    let model: AuthorizationPageModel;

    if (user?.serviceId !== options?.serviceId) {
      await session.delete('user');
      model = buildAuthorizationPageModel(response, undefined);
    } else {
      model = buildAuthorizationPageModel(response, user);
    }

    return buildResponse(model);
  };
