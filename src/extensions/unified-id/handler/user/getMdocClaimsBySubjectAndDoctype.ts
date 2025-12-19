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
  GetBySubject,
  GetMdocClaimsBySubjectAndDoctype,
} from '@vecrea/au3te-ts-common/handler.user';
import { UnifiedIdAllocator } from '../../allocator';
import { UnifiedIdUser } from '../../schemas/User';
import { createUnifiedIdMdocClaims } from './createUnifiedIdMdocClaims';

/** Time-to-live for unified ID mdoc claims: 1 year in milliseconds */
const A_YEAR_TTL = 365 * 24 * 60 * 60 * 1000;

/**
 * Creates a function to retrieve mobile document (mdoc) claims by subject and document type.
 * Handles special case for UnifiedID document type by generating claims with unified ID allocation.
 *
 * @param {UnifiedIdAllocator} unifiedIdAllocator - The unified ID allocator instance for managing unified IDs.
 * @param {GetBySubject<UnifiedIdUser>} getBySubject - Function to retrieve a user by subject identifier.
 * @returns {GetMdocClaimsBySubjectAndDoctype} A function that retrieves mdoc claims for a given subject and document type.
 *
 * @example
 * ```typescript
 * const getMdocClaims = createGetMdocClaimsBySubjectAndDoctype(unifiedIdAllocator, getBySubject);
 * const mdoc = await getMdocClaims('1004', 'com.dentsusoken.vecrea.UnifiedID');
 * ```
 */
export const createGetMdocClaimsBySubjectAndDoctype =
  (
    unifiedIdAllocator: UnifiedIdAllocator,
    getBySubject: GetBySubject<UnifiedIdUser>,
    kv: KVNamespace,
  ): GetMdocClaimsBySubjectAndDoctype =>
  async (subject, doctype) => {
    // Special handling for UnifiedID document type
    if (doctype === 'com.dentsusoken.vecrea.UnifiedID') {
      const user = await getBySubject(subject);
      if (!user) {
        throw new Error('User not found');
      }
      const { serviceId } = user;
      if (!serviceId) {
        throw new Error('User missing required fields: serviceId');
      }
      // Get or create unified ID for this user and service
      const unifiedId = await unifiedIdAllocator.get(serviceId, subject);
      return createUnifiedIdMdocClaims(
        serviceId,
        subject,
        unifiedId,
        A_YEAR_TTL,
      );
    }
    // For other document types, use the default mock implementation
    // return mockGetMdocClaimsBySubjectAndDoctype(subject, doctype);
    const strMdoc = await kv.get(subject);
    if (!strMdoc) {
      return;
    }
    const mdoc = JSON.parse(strMdoc);
    return mdoc[doctype];
  };
