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
import { AuthleteConfiguration } from 'au3te-ts-common/conf';
import { ApiClientImpl } from 'au3te-ts-base/api';
import { BaseHandlerConfigurationImpl } from 'au3te-ts-base/handler';
import { ExtractorConfigurationImpl } from 'au3te-ts-base/extractor';
import { Session, SessionSchemas } from 'au3te-ts-base/session';
import { Env } from '../env';

export class AppConfig {
  static createConfiguration(env: Env['Bindings']): AuthleteConfiguration {
    return {
      apiVersion: env.API_VERSION,
      baseUrl: env.API_BASE_URL,
      serviceApiKey: env.API_KEY,
      serviceAccessToken: env.ACCESS_TOKEN,
    };
  }

  static createBaseConfigurations<T extends SessionSchemas>(
    env: Env['Bindings'],
    session: Session<T>
  ) {
    const configuration = this.createConfiguration(env);
    const apiClient = new ApiClientImpl(configuration);
    const baseHandlerConfiguration = new BaseHandlerConfigurationImpl(
      apiClient,
      session
    );
    const extractorConfiguration = new ExtractorConfigurationImpl();

    return {
      baseHandlerConfiguration,
      extractorConfiguration,
    };
  }
}
