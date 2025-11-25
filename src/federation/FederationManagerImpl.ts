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
import {
  Federation,
  FederationImpl,
  FederationManager,
} from '@vecrea/au3te-ts-server/federation';
import {
  federationRegistrySchema,
  FederationRegistry,
  federationConfigSchema,
} from '@vecrea/au3te-ts-common/schemas.federation';
import { Context } from 'hono';
import { Env } from '../env';
import { DefaultSessionSchemas } from '@vecrea/au3te-ts-server/session';

/**
 * Implementation of FederationManager that manages federation configurations.
 * Handles federation registry parsing, validation, and federation instance creation.
 * @template SS - Session schemas type extending SessionSchemas
 */
export class FederationManagerImpl<SS extends DefaultSessionSchemas>
  implements FederationManager
{
  #configs: FederationRegistry;

  /**
   * Creates a new FederationManagerImpl instance.
   * Parses federation configurations from environment variables.
   * @param {Context<Env<SS>>} c - The Hono context containing environment configuration.
   */
  constructor(c: Context<Env<SS>>) {
    const federationsConfig = JSON.parse(
      c.env.FEDERATTION_CONFIGS || '{}',
    ) as FederationRegistry;
    this.#configs = federationsConfig;
  }

  /**
   * Validates whether a federation configuration at the given index is valid.
   * @param {number} index - The index of the federation configuration to validate.
   * @returns {boolean} True if the configuration is valid, false otherwise.
   */
  isConfigurationValid(index: number): boolean {
    const config = this.#configs?.federations[index];
    return federationConfigSchema.safeParse(config).success;
  }

  /**
   * Builds a map of federation instances from the configured federation registry.
   * @returns {Map<string, Federation>} A map where keys are federation IDs and values are Federation instances.
   */
  buildFederations(): Map<string, Federation> {
    return new Map(
      this.#configs?.federations.map((config) => [
        config.id,
        new FederationImpl(config, true),
      ]),
    );
  }

  /**
   * Retrieves and validates all federation configurations.
   * @returns {FederationRegistry} The validated federation registry containing all federation configurations.
   */
  getConfigurations(): FederationRegistry {
    return federationRegistrySchema.parse(this.#configs);
  }

  /**
   * Retrieves a specific federation instance by its ID.
   * @param {string} id - The unique identifier of the federation to retrieve.
   * @returns {Federation} The Federation instance for the specified ID.
   * @throws {Error} If the federation with the given ID is not found.
   */
  getFederation(id: string): Federation {
    return new FederationImpl(
      this.#configs!.federations.find((config) => config.id === id)!,
      true,
    );
  }
}
