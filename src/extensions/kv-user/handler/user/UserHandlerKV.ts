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
  UserHandlerConfiguration,
  GetBySubject,
  GetByCredentials,
  GetMdocClaimsBySubjectAndDoctype,
  AddUser,
  CacheUserAttributes,
  MapUserAttributesToMdoc,
  createMapUserAttributesToMdoc,
  DeleteUserAttributesCache,
} from '@vecrea/au3te-ts-common/handler.user';
import { User } from '@vecrea/au3te-ts-common/schemas.common';
import { UserHandlerFactory } from '../../../../di';
import { DefaultSessionSchemas } from '@vecrea/au3te-ts-server/session';

/**
 * Creates a function to retrieve a user by their subject from a KV store.
 *
 * @param {KVNamespace} kv - The KV namespace to search for the user.
 * @returns {GetBySubject} A function that takes a subject and returns a user.
 */
const createGetBySubjectKV =
  <U extends User = User>(kv: KVNamespace): GetBySubject<U> =>
  async (subject) => {
    const { keys } = await kv.list();

    for (let i = 0; i < keys.length; i++) {
      const { name: key } = keys[i];
      const strUser = await kv.get(key);
      if (!strUser) continue;

      const user = JSON.parse(strUser) as U;
      if (user.subject === subject) {
        return user;
      }
    }

    return undefined;
  };

/**
 * Creates a function to retrieve a user by their credentials from a KV store.
 *
 * @param {KVNamespace} kv - The KV namespace to search for the user.
 * @returns {GetByCredentials} A function that takes loginId and password and returns a user.
 */
const createGetByCredentialsKV =
  <
    U extends User = User,
    T extends keyof Omit<U, 'loginId' | 'password'> = never,
  >(
    kv: KVNamespace,
  ): GetByCredentials<U, T> =>
  async (loginId, password) => {
    const { keys } = await kv.list();

    for (let i = 0; i < keys.length; i++) {
      const { name: key } = keys[i];
      const strUser = await kv.get(key);
      if (!strUser) continue;

      const user = JSON.parse(strUser) as U;
      if (user.loginId === loginId && user.password === password) {
        return user;
      }
    }

    return undefined;
  };

/**
 * Creates a function to retrieve mdoc claims by subject and document type from a KV store.
 *
 * @param {KVNamespace} kv - The KV namespace to search for the mdoc claims.
 * @returns {GetMdocClaimsBySubjectAndDoctype} A function that takes a subject and document type and returns mdoc claims.
 */
const createGetMdocClaimsBySubjectAndDoctypeKV =
  (kv: KVNamespace): GetMdocClaimsBySubjectAndDoctype =>
  async (subject, doctype) => {
    const strMdoc = await kv.get(subject);
    if (!strMdoc) {
      return;
    }
    const mdoc = JSON.parse(strMdoc);
    return mdoc[doctype];
  };

const createAddUserKV =
  (kv: KVNamespace): AddUser =>
  async (user) => {
    await kv.put(user.subject, JSON.stringify(user));
  };

const createCacheUserAttributesKV = (
  kv: KVNamespace,
  mapUserAttributesToMdoc: MapUserAttributesToMdoc,
): CacheUserAttributes => {
  return async (user, protocol, ttl) => {
    const strMdoc = await kv.get(user.subject);
    if (strMdoc) {
      return;
    }
    const mdoc = mapUserAttributesToMdoc(user, protocol);
    await kv.put(user.subject, JSON.stringify(mdoc), {
      expirationTtl: ttl,
    });
  };
};

const createDeleteUserAttributesCacheKV = (
  kv: KVNamespace,
): DeleteUserAttributesCache => {
  return async (subject) => {
    await kv.delete(subject);
  };
};

export class UserHandlerKV<
  U extends User = User,
  T extends keyof Omit<U, 'loginId' | 'password'> = never,
> implements UserHandlerConfiguration<U, T>
{
  #users: KVNamespace;
  #mdocs: KVNamespace;

  getByCredentials: GetByCredentials<U, T>;
  getBySubject: GetBySubject<U>;
  getMdocClaimsBySubjectAndDoctype: GetMdocClaimsBySubjectAndDoctype;
  addUser: AddUser<U>;
  cacheUserAttributes: CacheUserAttributes<U>;
  deleteUserAttributesCache: DeleteUserAttributesCache;

  constructor(users: KVNamespace, mdocs: KVNamespace) {
    this.#users = users;
    this.#mdocs = mdocs;

    this.getBySubject = createGetBySubjectKV(this.#users);
    this.getByCredentials = createGetByCredentialsKV<U, T>(this.#users);
    this.getMdocClaimsBySubjectAndDoctype =
      createGetMdocClaimsBySubjectAndDoctypeKV(this.#mdocs);
    this.addUser = createAddUserKV(this.#users);

    const mapUserAttributesToMdoc = createMapUserAttributesToMdoc(
      {},
      {
        'org.iso.18013.5.1.mDL': {
          'org.iso.18013.5.1': {
            // family_name: 'surName',
            // given_name: 'givenName',
            document_number: 'subject',
          },
        },
      },
    );
    this.cacheUserAttributes = createCacheUserAttributesKV(
      this.#mdocs,
      mapUserAttributesToMdoc,
    );
    this.deleteUserAttributesCache = createDeleteUserAttributesCacheKV(
      this.#mdocs,
    );
  }
}

export const createUserHandlerKV: UserHandlerFactory<
  DefaultSessionSchemas,
  User,
  never
> = (c) => {
  return new UserHandlerKV(c.env.USER_KV, c.env.MDOC_KV);
};
