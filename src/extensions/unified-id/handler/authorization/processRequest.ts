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

import { runAsyncCatching } from '@vecrea/oid4vc-core/utils';
import {
  CreateProcessRequestWithOptionsParams,
  ProcessRequestWithOptions,
} from '@vecrea/au3te-ts-server/handler.core';
import { AuthorizationRequest } from '@vecrea/au3te-ts-common/schemas.authorization';
import { UnifiedIdParams } from '../../schemas/UnifiedIdParams';

/**
 * Creates a function to process an HTTP request.
 * @template REQ - The type of the API request object.
 * @param {CreateProcessRequestParams<REQ>} params - Parameters for creating the process request function.
 * @returns {ProcessRequest} A function that processes the HTTP request.
 */
export const createProcessRequest =
  <OPTS extends UnifiedIdParams = UnifiedIdParams>({
    path,
    toApiRequest,
    handle,
    recoverResponseResult,
  }: CreateProcessRequestWithOptionsParams<
    AuthorizationRequest,
    OPTS
  >): ProcessRequestWithOptions<OPTS> =>
  async (request: Request): Promise<Response> => {
    const responseResult = await runAsyncCatching(async () => {
      const { apiRequest, options: requestOptions } =
        await toApiRequest(request);

      return handle({ apiRequest, options: requestOptions });
    });

    return await recoverResponseResult(path, responseResult);
  };
