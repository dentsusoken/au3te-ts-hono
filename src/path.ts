import { ApiClientImpl } from 'au3te-ts-base/api';
import { BaseHandlerConfigurationImpl } from 'au3te-ts-base/handler';
import { ParHandlerConfigurationImpl } from 'au3te-ts-base/handler.par';
import { CredentialMetadataHandlerConfigurationImpl } from 'au3te-ts-base/handler.credential-metadata';
import { ServiceConfigurationHandlerConfigurationImpl } from 'au3te-ts-base/handler.service-configuration';
import { Session, sessionSchemas } from 'au3te-ts-base/session';

export class EndpointPath {
  #parPath: string;
  #authorizationPath: string;
  #serviceConfigurationPath: string;
  #issuerMetadataPath: string;

  constructor() {
    const apiClient = new ApiClientImpl({
      apiVersion: '',
      baseUrl: '',
      serviceApiKey: '',
      serviceAccessToken: '',
    });
    const baseHandlerConfiguration = new BaseHandlerConfigurationImpl(
      apiClient,
      {} as Session<typeof sessionSchemas>
    );

    this.#parPath = new ParHandlerConfigurationImpl(
      baseHandlerConfiguration
    ).path;
    this.#authorizationPath = new ParHandlerConfigurationImpl(
      baseHandlerConfiguration
    ).path;
    this.#serviceConfigurationPath =
      new ServiceConfigurationHandlerConfigurationImpl(
        baseHandlerConfiguration
      ).path;
    this.#issuerMetadataPath = new CredentialMetadataHandlerConfigurationImpl(
      baseHandlerConfiguration
    ).path;
  }

  get parPath(): string {
    return this.#parPath;
  }
  get authorizationPath(): string {
    return this.#authorizationPath;
  }
  get serviceConfigurationPath(): string {
    return this.#serviceConfigurationPath;
  }
  get issuerMetadataPath(): string {
    return this.#issuerMetadataPath;
  }
}
