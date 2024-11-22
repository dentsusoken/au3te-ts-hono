import { Hono } from 'hono';
import { Env } from './env';
import { sessionMiddleware } from './session';
import { AuthleteConfiguration } from 'au3te-ts-common/conf';
import { ApiClientImpl } from 'au3te-ts-base/api';
import { BaseHandlerConfigurationImpl } from 'au3te-ts-base/handler';
import { ExtractorConfigurationImpl } from 'au3te-ts-base/extractor';
import { ParEndpointConfigurationImpl } from 'au3te-ts-base/endpoint.par';
import { AuthorizationEndpointConfigurationImpl } from 'au3te-ts-base/endpoint.authorization';
import { AuthorizationDecisionEndpointConfigurationImpl } from 'au3te-ts-base/endpoint.authorization-decision';
import { ServiceConfigurationEndpointConfigurationImpl } from 'au3te-ts-base/endpoint.service-configuration';
import { CredentialMetadataEndpointConfigurationImpl } from 'au3te-ts-base/endpoint.credential-metadata';
import { AuthorizationIssueHandlerConfigurationImpl } from 'au3te-ts-base/handler.authorization-issue';
import { AuthorizationFailHandlerConfigurationImpl } from 'au3te-ts-base/handler.authorization-fail';
import { AuthorizationPageModelConfigurationImpl } from 'au3te-ts-common/page-model.authorization';
import { AuthorizationHandlerConfigurationImpl } from 'au3te-ts-base/handler.authorization';
import { UserConfigurationImpl } from 'au3te-ts-common/user';
import { EndpointPath } from './path';

const path = new EndpointPath();
const app = new Hono<Env>()
  .use(sessionMiddleware)
  // Setup Common Configurations
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
  // Pushed Authorization Endpoint
  .post(path.parPath, async (c) => {
    const endpointConfiguration = new ParEndpointConfigurationImpl(
      c.get('baseHandlerConfiguration'),
      c.get('extractorConfiguration')
    );
    return await endpointConfiguration.processRequest(c.req.raw);
  })
  // Authorizaion Endpoint
  .get(path.authorizationPath, async (c) => {
    const endpointConfiguration = new AuthorizationEndpointConfigurationImpl(
      c.get('baseHandlerConfiguration'),
      c.get('extractorConfiguration')
    );
    return await endpointConfiguration.processRequest(c.req.raw);
  })
  // Authorization Decision Endpoint
  .post('/api/authorization/decision', async (c) => {
    const baseHandlerConfiguration = c.get('baseHandlerConfiguration');
    const extractorConfiguration = new ExtractorConfigurationImpl();
    const userConfiguration = new UserConfigurationImpl();

    const authorizationIssueHandlerConfiguration =
      new AuthorizationIssueHandlerConfigurationImpl(baseHandlerConfiguration);
    const authorizationFailHandlerConfiguration =
      new AuthorizationFailHandlerConfigurationImpl(baseHandlerConfiguration);
    const authorizationPageModelConfiguration =
      new AuthorizationPageModelConfigurationImpl();

    const authorizationHandlerConfiguration =
      new AuthorizationHandlerConfigurationImpl({
        baseHandlerConfiguration,
        authorizationIssueHandlerConfiguration,
        authorizationFailHandlerConfiguration,
        authorizationPageModelConfiguration,
      });
    const endpointConfiguration =
      new AuthorizationDecisionEndpointConfigurationImpl({
        authorizationHandlerConfiguration,
        authorizationIssueHandlerConfiguration,
        baseHandlerConfiguration,
        extractorConfiguration,
        userConfiguration,
      });
    return await endpointConfiguration.processRequest(c.req.raw);
  })
  // OpenID Configuration
  .get(path.serviceConfigurationPath, async (c) => {
    const endpointConfiguration =
      new ServiceConfigurationEndpointConfigurationImpl(
        c.get('baseHandlerConfiguration')
      );
    return await endpointConfiguration.processRequest(c.req.raw);
  })
  // Credential Issuer Metadata
  .get(path.credentialIssuerMetadataPath, async (c) => {
    const endpointConfiguration =
      new CredentialMetadataEndpointConfigurationImpl(
        c.get('baseHandlerConfiguration')
      );
    return await endpointConfiguration.processRequest(c.req.raw);
  });

export default app;
