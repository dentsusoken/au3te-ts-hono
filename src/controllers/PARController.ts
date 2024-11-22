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
import { ParEndpointConfigurationImpl } from 'au3te-ts-base/endpoint.par';
import { Env } from '../env';

export class PARController {
  static async handle(c: Context<Env>) {
    const endpointConfiguration = new ParEndpointConfigurationImpl(
      c.get('baseHandlerConfiguration'),
      c.get('extractorConfiguration')
    );
    return await endpointConfiguration.processRequest(c.req.raw);
  }
}
