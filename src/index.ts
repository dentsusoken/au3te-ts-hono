import { Hono } from 'hono';
import { Env } from './env';
import { sessionMiddleware } from './session';
import { AuthleteConfiguration } from 'au3te-ts-common/conf';
import { ApiClientImpl } from 'au3te-ts-base/api';
import { BaseHandlerConfigurationImpl } from 'au3te-ts-base/handler';
import { ExtractorConfigurationImpl } from 'au3te-ts-base/extractor';
import { ParEndpointConfigurationImpl } from 'au3te-ts-base/endpoint.par';
import { AuthorizationEndpointConfigurationImpl } from 'au3te-ts-base/endpoint.authorization';
import { ServiceConfigurationEndpointConfigurationImpl } from 'au3te-ts-base/endpoint.service-configuration';
import { CredentialMetadataEndpointConfigurationImpl } from 'au3te-ts-base/endpoint.credential-metadata';
import { EndpointPath } from './path';

const path = new EndpointPath();
const app = new Hono<Env>()
  .use(sessionMiddleware)
  .use('*', (c, next) => {
    const configuration: AuthleteConfiguration = {
      apiVersion: c.env.API_VERSION,
      baseUrl: c.env.API_BASE_URL,
      serviceApiKey: c.env.API_KEY,
      serviceAccessToken: c.env.ACCESS_TOKEN,
    };
    const apiClient = new ApiClientImpl(configuration);
    const session = c.get('session');
    const baseHandlerConfiguration = new BaseHandlerConfigurationImpl(
      apiClient,
      session
    );
    const extractorConfiguration = new ExtractorConfigurationImpl();
    c.set('baseHandlerConfiguration', baseHandlerConfiguration);
    c.set('extractorConfiguration', extractorConfiguration);
    return next();
  })
  .get(path.serviceConfigurationPath, async (c) => {
    const endpointConfiguration = new ParEndpointConfigurationImpl(
      c.get('baseHandlerConfiguration'),
      c.get('extractorConfiguration')
    );
    return await endpointConfiguration.processRequest(c.req.raw);
  })
  .get(path.serviceConfigurationPath, async (c) => {
    const endpointConfiguration = new AuthorizationEndpointConfigurationImpl(
      c.get('baseHandlerConfiguration'),
      c.get('extractorConfiguration')
    );
    return await endpointConfiguration.processRequest(c.req.raw);
  })
  .get(path.serviceConfigurationPath, async (c) => {
    const endpointConfiguration =
      new ServiceConfigurationEndpointConfigurationImpl(
        c.get('baseHandlerConfiguration')
      );
    return await endpointConfiguration.processRequest(c.req.raw);
  })
  .get(path.serviceConfigurationPath, async (c) => {
    const endpointConfiguration =
      new CredentialMetadataEndpointConfigurationImpl(
        c.get('baseHandlerConfiguration')
      );
    return await endpointConfiguration.processRequest(c.req.raw);
  });

export default app;
