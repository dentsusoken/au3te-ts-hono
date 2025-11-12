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

import { AuthorizationResponse } from '@vecrea/au3te-ts-common/schemas.authorization';
import {
  ApiResponseWithOptions,
  ProcessApiResponse,
} from '@vecrea/au3te-ts-server/handler.core';
import { CreateProcessApiResponseParams4Authorization } from '@vecrea/au3te-ts-server/handler.authorization';
import { SessionSchemas } from '@vecrea/au3te-ts-server/session';
import { UnifiedIdParams } from '../../schemas/UnifiedIdParams';

export const createProcessApiResponse =
  <SS extends SessionSchemas, OPTS extends UnifiedIdParams = UnifiedIdParams>({
    path,
    session,
    generateAuthorizationPage,
    handleNoInteraction,
    buildUnknownActionMessage,
    responseFactory,
    responseErrorFactory,
  }: CreateProcessApiResponseParams4Authorization<
    SS,
    OPTS
  >): ProcessApiResponse<
    ApiResponseWithOptions<AuthorizationResponse, OPTS>,
    OPTS
  > =>
  /**
   * Processes the API response for Authorization requests.
   * @param {AuthorizationResponse} apiResponse - The response from the Authlete API for Authorization
   * @returns {Promise<Response>} A promise that resolves to the HTTP response
   */
  async (
    apiResponseWithOptions: ApiResponseWithOptions<AuthorizationResponse, OPTS>,
    _?: OPTS
  ): Promise<Response> => {
    const { apiResponse, options } = apiResponseWithOptions;

    const { action, responseContent } = apiResponse;

    switch (action) {
      case 'INTERNAL_SERVER_ERROR':
        throw responseErrorFactory.internalServerErrorResponseError(
          responseContent
        );
      case 'BAD_REQUEST':
        throw responseErrorFactory.badRequestResponseError(responseContent);
      case 'LOCATION':
        return responseFactory.location(responseContent!);
      case 'FORM':
        return responseFactory.form(responseContent);
      case 'INTERACTION':
        return await generateAuthorizationPage(apiResponse, session, options);
      case 'NO_INTERACTION':
        return await handleNoInteraction(apiResponse, session);
      default:
        throw responseErrorFactory.internalServerErrorResponseError(
          buildUnknownActionMessage(path, action)
        );
    }
  };
