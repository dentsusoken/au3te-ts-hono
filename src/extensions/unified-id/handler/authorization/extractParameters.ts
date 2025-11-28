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
import { isFormUrlEncodedType } from '@vecrea/au3te-ts-common/utils';
import { ExtractParameters } from '@vecrea/au3te-ts-server/extractor';
import { unifiedIdParamsSchema } from '../../schemas/UnifiedIdParams';

const splitParameters = (params: URLSearchParams) => {
  const context = new URLSearchParams();

  Object.keys(unifiedIdParamsSchema.shape).forEach((key) => {
    const value = params.get(key);
    if (value) {
      context.set(key, value);
      params.delete(key);
    }
  });

  return JSON.stringify({
    parameters: params.toString(),
    context: context.toString(),
  });
};

export const ExtractUnifiedIdParameters: ExtractParameters = async (
  request,
) => {
  const contentType = request.headers.get('Content-Type') || undefined;

  if (request.method.toUpperCase() === 'POST') {
    if (isFormUrlEncodedType(contentType)) {
      const params = new URLSearchParams(await request.text());

      return splitParameters(params);
    } else {
      throw new Error('Unsupported content type');
    }
  }

  const params = new URLSearchParams(new URL(request.url).search);

  return splitParameters(params);
};
