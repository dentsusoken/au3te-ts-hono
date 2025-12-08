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
import { FederationManagerImpl } from '@vecrea/au3te-ts-server/federation';
import { federationRegistrySchema } from '@vecrea/au3te-ts-common/schemas.federation';
import { Context } from 'hono';
import { Env } from '../env';
import { DefaultSessionSchemas } from '@vecrea/au3te-ts-server/session';
import * as validator from 'samlify-validator-js';

/**
 * Implementation of FederationManager that manages federation configurations.
 * Handles federation registry parsing, validation, and federation instance creation.
 * @template SS - Session schemas type extending SessionSchemas
 */
export class FederationManagerHono<
  SS extends DefaultSessionSchemas,
> extends FederationManagerImpl {
  // #configs: FederationRegistry;

  /**
   * Creates a new FederationManagerImpl instance.
   * Parses federation configurations from environment variables.
   * @param {Context<Env<SS>>} c - The Hono context containing environment configuration.
   */
  constructor(c: Context<Env<SS>>) {
    super({
      registry: federationRegistrySchema.parse(
        JSON.parse(c.env.FEDERATTION_CONFIGS || '{}'),
      ),
      isDev: true,
      validator,
    });
  }
}
