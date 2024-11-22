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
import { Session, sessionSchemas } from 'au3te-ts-base/session';
import { ExtractorConfiguration } from 'au3te-ts-base/extractor';
import { BaseHandlerConfiguration } from 'au3te-ts-base/handler';

export interface Env {
  Bindings: {
    API_VERSION: string;
    API_BASE_URL: string;
    API_KEY: string;
    ACCESS_TOKEN: string;
    SESSION_KV: KVNamespace;
  };
  Variables: {
    session: Session<typeof sessionSchemas>;
    extractorConfiguration: ExtractorConfiguration;
    baseHandlerConfiguration: BaseHandlerConfiguration<typeof sessionSchemas>;
  };
}
