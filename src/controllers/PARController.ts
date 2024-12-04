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
import { Context } from 'hono';
import { ParHandlerConfigurationImpl } from 'au3te-ts-base/handler.par';
import { ExtractorConfigurationImpl } from 'au3te-ts-base/extractor';
import { Env } from '../env';

export class PARController {
  static async handle(c: Context<Env>) {
    const baseHandlerConfiguration = c.get('baseHandlerConfiguration');
    const extractorConfiguration = new ExtractorConfigurationImpl();

    const endpointConfiguration = new ParHandlerConfigurationImpl({
      baseHandlerConfiguration,
      extractorConfiguration,
    });
    return await endpointConfiguration.processRequest(c.req.raw);
  }
}
