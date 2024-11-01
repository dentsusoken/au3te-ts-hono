import { Session, sessionSchemas } from 'au3te-ts-base/session';
import { ExtractorConfiguration } from 'au3te-ts-base/extractor';
import { BaseHandlerConfiguration } from 'au3te-ts-base/handler';

export interface Env {
  Bindings: {
    API_VERSION: string;
    API_BASE_URL: string;
    API_KEY: string;
    ACCESS_TOKEN: string;
    SESSION_KV: KVNamespace;
  };
  Variables: {
    session: Session<typeof sessionSchemas>;
    extractorConfiguration: ExtractorConfiguration;
    baseHandlerConfiguration: BaseHandlerConfiguration<typeof sessionSchemas>;
  };
}
