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
import { AuthorizationRequest } from '@vecrea/au3te-ts-common/schemas.authorization';
import { CreateToApiRequestParams } from '@vecrea/au3te-ts-server/handler.authorization';
import {
  ApiRequestWithOptions,
  ToApiRequest,
} from '@vecrea/au3te-ts-server/handler.core';
import { UnifiedIdParams } from '../../schemas/UnifiedIdParams';

export const createToApiRequest =
  <OPTS extends UnifiedIdParams = UnifiedIdParams>({
    extractParameters,
  }: CreateToApiRequestParams): ToApiRequest<
    ApiRequestWithOptions<AuthorizationRequest, OPTS>
  > =>
  async (
    request: Request,
  ): Promise<ApiRequestWithOptions<AuthorizationRequest, OPTS>> => {
    const { parameters, context } = JSON.parse(
      await extractParameters(request),
    ) as { parameters: string; context: string };

    const searchParams = new URLSearchParams(context);
    const options = Object.fromEntries(searchParams.entries()) as OPTS;

    return {
      apiRequest: {
        parameters,
        context,
      },
      options: options,
    };
  };
