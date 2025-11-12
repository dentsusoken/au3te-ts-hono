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

import { GetOrAuthenticateUserFactory } from '@vecrea/au3te-ts-server/handler.authorization-decision';
import { UnifiedIdUser } from '../../schemas/User';

const emptyAuthenticationResult = { user: undefined, authTime: undefined };

export const createGetOrAuthenticateUser: GetOrAuthenticateUserFactory<
  UnifiedIdUser,
  'serviceId'
> = (getByCredentials) => async (session, parameters) => {
  const { user, authTime, unifiedIdParams } = await session.getBatch(
    'user',
    'authTime',
    'unifiedIdParams',
  );

  if (user && authTime) {
    return { user, authTime };
  }

  if (!unifiedIdParams) {
    return { ...emptyAuthenticationResult };
  }

  const { serviceId } = unifiedIdParams;

  if (!serviceId) {
    return { ...emptyAuthenticationResult };
  }

  const { loginId, password } = parameters;

  if (!loginId || !password) {
    return { ...emptyAuthenticationResult };
  }

  const loginUser = await getByCredentials(loginId, password, { serviceId });

  if (loginUser) {
    const authTime = Math.floor(Date.now() / 1000);

    await session.setBatch({
      user: loginUser,
      authTime,
    });

    return { user: loginUser, authTime };
  }

  return { ...emptyAuthenticationResult };
};
