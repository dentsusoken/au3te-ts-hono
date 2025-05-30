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
import { CredentialMetadataHandlerConfigurationImpl } from 'au3te-ts-base/handler.credential-metadata';
import { Env } from '../env';

/**
 * Controller handling the credential issuer metadata endpoint.
 * Provides metadata about the credential issuer's capabilities and configuration.
 */
export class CredentialMetadataController {
  /**
   * Handles the credential issuer metadata request.
   * Returns the metadata about supported credential types and issuer configuration.
   * @param {Context<Env>} c - The Hono context containing environment and request information.
   * @returns {Promise<Response>} A promise that resolves to the credential issuer metadata response.
   */
  static async handle(c: Context<Env>) {
    const endpointConfiguration =
      new CredentialMetadataHandlerConfigurationImpl(
        c.get('baseHandlerConfiguration')
      );
    return await endpointConfiguration.processRequest(c.req.raw);
  }
}
