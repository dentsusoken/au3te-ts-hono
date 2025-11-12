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

import { GetBySubject } from '@vecrea/au3te-ts-common/handler.user';
import { UnifiedIdUsers } from './UnifiedIdUsers';
import { UnifiedIdUser } from '../../schemas/User';

/**
 * Retrieves a user by their unique subject identifier.
 * Performs a lookup against the static user repository using the subject identifier.
 *
 * @param {string} subject - The unique subject identifier to search for.
 * @returns {Promise<UnifiedIdUser | undefined>} A promise that resolves to:
 *   - The user object if a matching subject is found
 *   - undefined if no matching user is found
 *
 * @example
 * ```typescript
 * const user = await getBySubject('1004');
 * if (user) {
 *   console.log('User found:', user.name);
 * }
 * ```
 */
export const getBySubject: GetBySubject<UnifiedIdUser> = async (subject) => {
  return UnifiedIdUsers.find((user) => user.subject === subject);
};
