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
  GetByCredentials,
  GetBySubject,
  GetMdocClaimsBySubjectAndDoctype,
  UserHandlerConfiguration,
} from '@vecrea/au3te-ts-common/handler.user';
import { DefaultSessionSchemas } from '@vecrea/au3te-ts-server/session';
import { Context } from 'hono';
import { UserHandlerFactory } from '../../../../di/DIContainer';
import { Env } from '../../../../env';
import {
  UnifiedIdAllocator,
  UnifiedIdAllocatorDurableObjects,
} from '../../allocator';
import { UnifiedIdUser } from '../../schemas/User';
import { createGetByCredentials } from './getByCredentials';
import { getBySubject } from './getBySubject';
import { createGetMdocClaimsBySubjectAndDoctype } from './getMdocClaimsBySubjectAndDoctype';

/** Union type representing the keys for unified ID options */
type UnifiedIdOptionsKeys = 'serviceId' | 'unifiedId';

/**
 * Extended user handler configuration interface for unified ID functionality.
 * Adds unified ID allocator support to the base user handler configuration.
 *
 * @template U - The user type, must extend UnifiedIdUser (defaults to UnifiedIdUser)
 * @template T - Union of User property keys (excluding 'loginId' and 'password') to require in options parameter (defaults to never)
 *
 * @extends {UserHandlerConfiguration<U, T>}
 */
export interface UnifiedIdUserHandlerConfiguration<
  U extends UnifiedIdUser = UnifiedIdUser,
  T extends keyof Omit<U, 'loginId' | 'password'> = never,
> extends UserHandlerConfiguration<U, T> {
  /** The unified ID allocator instance for managing unified IDs */
  unifiedIdAllocator: UnifiedIdAllocator;
}

/**
 * Implementation of UnifiedIdUserHandlerConfiguration.
 * Provides user authentication, lookup, and mdoc claims retrieval with unified ID support.
 *
 * @template SS - The session schemas type
 *
 * @implements {UnifiedIdUserHandlerConfiguration<UnifiedIdUser, UnifiedIdOptionsKeys>}
 *
 * @example
 * ```typescript
 * const handler = new UnifiedIdUserHandlerConfigurationImpl(context);
 * const user = await handler.getByCredentials('inga', 'inga', { serviceId: 'shopvc' });
 * ```
 */
export class UnifiedIdUserHandlerConfigurationImpl<
  SS extends DefaultSessionSchemas,
> implements
    UnifiedIdUserHandlerConfiguration<UnifiedIdUser, UnifiedIdOptionsKeys>
{
  /** Function to retrieve a user by subject identifier */
  getBySubject: GetBySubject<UnifiedIdUser>;
  /** Function to authenticate a user using login credentials with unified ID support */
  getByCredentials: GetByCredentials<UnifiedIdUser, UnifiedIdOptionsKeys>;
  /** Function to retrieve mobile document (mdoc) claims by subject and document type */
  getMdocClaimsBySubjectAndDoctype: GetMdocClaimsBySubjectAndDoctype;

  /** The unified ID allocator instance for managing unified IDs */
  unifiedIdAllocator: UnifiedIdAllocator;

  /**
   * Creates a new instance of UnifiedIdUserHandlerConfigurationImpl.
   * Initializes the unified ID allocator and sets up user handler functions.
   *
   * @param {Context<Env<SS>>} c - The Hono context containing environment configuration
   */
  constructor(c: Context<Env<SS>>) {
    this.unifiedIdAllocator = new UnifiedIdAllocatorDurableObjects(
      c.env.DURABLE_OBJECT.get(
        c.env.DURABLE_OBJECT.idFromName('unifiedIdAllocator'),
      ),
    );
    this.getBySubject = getBySubject;
    this.getByCredentials = createGetByCredentials(this.unifiedIdAllocator);
    this.getMdocClaimsBySubjectAndDoctype =
      createGetMdocClaimsBySubjectAndDoctype(
        this.unifiedIdAllocator,
        this.getBySubject,
      );
  }
}

/**
 * Factory function for creating a unified ID user handler configuration.
 * This function is used by the DI container to create user handler instances.
 *
 * @template SS - The session schemas type
 * @param {Context<Env<SS>>} c - The Hono context containing environment configuration
 * @returns {UserHandlerConfiguration} A user handler configuration instance with unified ID support
 *
 * @example
 * ```typescript
 * const factory: UserHandlerFactory = createUnifiedIdUserHandler;
 * const handler = factory(context);
 * ```
 */
export const createUnifiedIdUserHandler: UserHandlerFactory = <
  SS extends DefaultSessionSchemas,
>(
  c: Context<Env<SS>>,
): UserHandlerConfiguration => {
  return new UnifiedIdUserHandlerConfigurationImpl<SS>(
    c,
  ) as UserHandlerConfiguration;
};
