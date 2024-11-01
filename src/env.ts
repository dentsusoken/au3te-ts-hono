import { BaseSession } from 'au3te-ts-base/session';

export interface Env {
  Bindings: {
    SESSION_KV: KVNamespace;
  };
  Variables: {
    session: BaseSession;
  };
}
