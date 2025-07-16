import {
  UserHandlerConfiguration,
  GetBySubject,
  GetByCredentials,
  GetMdocClaimsBySubjectAndDoctype,
} from '@vecrea/au3te-ts-common/handler.user';
import { User } from '@vecrea/au3te-ts-common/schemas.common';

/**
 * Creates a function to retrieve a user by their subject from a KV store.
 *
 * @param {KVNamespace} kv - The KV namespace to search for the user.
 * @returns {GetBySubject} A function that takes a subject and returns a user.
 */
const createGetBySubjectKV =
  (kv: KVNamespace): GetBySubject =>
  async (subject) => {
    const { keys } = await kv.list();

    for (let i = 0; i < keys.length; i++) {
      const { name: key } = keys[i];
      const strUser = await kv.get(key);
      if (!strUser) continue;

      const user = JSON.parse(strUser) as User;
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
  (kv: KVNamespace): GetByCredentials =>
  async (loginId, password) => {
    const { keys } = await kv.list();

    for (let i = 0; i < keys.length; i++) {
      const { name: key } = keys[i];
      const strUser = await kv.get(key);
      if (!strUser) continue;

      const user = JSON.parse(strUser) as User;
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

export class UserHandlerKV implements UserHandlerConfiguration {
  #users: KVNamespace;
  #mdocs: KVNamespace;

  getByCredentials: GetByCredentials;
  getBySubject: GetBySubject;
  getMdocClaimsBySubjectAndDoctype: GetMdocClaimsBySubjectAndDoctype;

  constructor(users: KVNamespace, mdocs: KVNamespace) {
    this.#users = users;
    this.#mdocs = mdocs;

    this.getBySubject = createGetBySubjectKV(this.#users);
    this.getByCredentials = createGetByCredentialsKV(this.#users);
    this.getMdocClaimsBySubjectAndDoctype =
      createGetMdocClaimsBySubjectAndDoctypeKV(this.#mdocs);
  }
}
