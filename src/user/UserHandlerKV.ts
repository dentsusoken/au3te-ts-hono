import {
  UserHandlerConfiguration,
  GetBySubject,
  GetByCredentials,
  GetMdocClaimsBySubjectAndDoctype,
} from 'au3te-ts-common/handler.user';
import { User } from 'au3te-ts-common/schemas.common';

const createGetBySubjectKV =
  (kv: KVNamespace): GetBySubject =>
  async (subject) => {
    const { keys } = await kv.list();

    for (const { name: key } of keys) {
      const strUser = await kv.get(key);
      if (!strUser) {
        continue;
      }
      const user = JSON.parse(strUser) as User;
      if (user.subject === subject) {
        return user;
      }
    }
  };

const createGetByCredentialsKV =
  (kv: KVNamespace): GetByCredentials =>
  async (loginId, password) => {
    const { keys } = await kv.list();

    for (const { name: key } of keys) {
      const strUser = await kv.get(key);
      if (!strUser) {
        continue;
      }
      const user = JSON.parse(strUser) as User;
      if (user.loginId === loginId && user.password === password) {
        return user;
      }
    }
  };

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
