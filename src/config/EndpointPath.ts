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
import { PAR_PATH } from '@vecrea/au3te-ts-server/handler.par';
import { AUTHORIZATION_PATH } from '@vecrea/au3te-ts-server/handler.authorization';
import { TOKEN_PATH } from '@vecrea/au3te-ts-server/handler.token';
import { SERVICE_CONFIGURATION_PATH } from '@vecrea/au3te-ts-server/handler.service-configuration';
import { CREDENTIAL_METADATA_PATH } from '@vecrea/au3te-ts-server/handler.credential-metadata';
import { SERVICE_JWKS_PATH } from '@vecrea/au3te-ts-server/handler.service-jwks';
import { AUTHORIZATION_DECISION_PATH } from '@vecrea/au3te-ts-server/handler.authorization-decision';
import { CREDENTIAL_SINGLE_ISSUE_PATH } from '@vecrea/au3te-ts-server/handler.credential-single-issue';
import { CREDENTIAL_ISSUER_JWKS_PATH } from '@vecrea/au3te-ts-server/handler.credential-issuer-jwks';

/**
 * Manages the endpoint paths for various OAuth 2.0 and OpenID Connect operations.
 * This class centralizes the path configuration for all API endpoints used in the application.
 */
export class EndpointPath {
  static readonly parPath = PAR_PATH;
  static readonly authorizationPath = AUTHORIZATION_PATH;
  static readonly authorizationDecisionPath = AUTHORIZATION_DECISION_PATH;
  static readonly tokenPath = TOKEN_PATH;
  static readonly credentialPath = CREDENTIAL_SINGLE_ISSUE_PATH;
  static readonly serviceConfigurationPath = SERVICE_CONFIGURATION_PATH;
  static readonly credentialIssuerMetadataPath = CREDENTIAL_METADATA_PATH;
  static readonly credentialIssuerJwksPath = CREDENTIAL_ISSUER_JWKS_PATH;
  static readonly serviceJwksPath = SERVICE_JWKS_PATH;

  private constructor() {
    throw new Error('This class is not instantiable');
  }
}
