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

import { GetByCredentials } from '@vecrea/au3te-ts-common/handler.user';
import { UnifiedIdUsers } from './UnifiedIdUsers';
import { UnifiedIdUser } from '../../schemas/User';
import { UnifiedIdAllocator } from '../../allocator';

/**
 * Creates a function to retrieve a user by their login credentials.
 * Handles unified ID allocation and validation when serviceId and unifiedId are provided.
 *
 * @param {UnifiedIdAllocator} unifiedIdAllocator - The unified ID allocator instance for managing unified IDs.
 * @returns {GetByCredentials<UnifiedIdUser, 'serviceId' | 'unifiedId'>} A function that authenticates users and manages unified IDs.
 *
 * @example
 * ```typescript
 * const getByCredentials = createGetByCredentials(unifiedIdAllocator);
 * const user = await getByCredentials('inga', 'inga', { serviceId: 'shopvc', unifiedId: 'abc123' });
 * ```
 */
export const createGetByCredentials =
  (
    unifiedIdAllocator: UnifiedIdAllocator,
  ): GetByCredentials<UnifiedIdUser, 'serviceId' | 'unifiedId'> =>
  async (loginId, password, options) => {
    // If serviceId is not provided, perform basic authentication without unified ID handling
    if (!options?.serviceId) {
      return UnifiedIdUsers.find(
        (user) => user.loginId === loginId && user.password === password,
      );
    }

    const { unifiedId, serviceId } = options;

    // Find user matching credentials and serviceId
    const user = UnifiedIdUsers.find(
      (user) =>
        user.loginId === loginId &&
        user.password === password &&
        user.serviceId === serviceId,
    );
    if (!user) {
      return undefined;
    }

    // If unifiedId is not provided, allocate a new one
    if (!unifiedId) {
      await unifiedIdAllocator.get(serviceId, user.subject);
      return user;
    }

    // If unifiedId is provided, validate it exists
    const existingUnifiedId = await unifiedIdAllocator.exists({
      unifiedId,
    });
    if (!existingUnifiedId) {
      throw new Error('Invalid unified ID');
    }

    // Verify the unifiedId is associated with this serviceId and userId
    // If not already associated, this will create/update the association
    const associatedUnifiedId = await unifiedIdAllocator.exists({
      serviceId,
      userId: user.subject,
    });
    if (associatedUnifiedId !== unifiedId) {
      // Associate the unifiedId with this serviceId and userId
      await unifiedIdAllocator.save(unifiedId, serviceId, user.subject);
    }
    return user;
  };
