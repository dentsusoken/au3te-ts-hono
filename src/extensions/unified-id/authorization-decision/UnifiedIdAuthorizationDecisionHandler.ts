import {
  AuthorizationDecisionHandlerConfigurationImpl,
  CreateAuthorizationDecisionHandlerConfigurationImplConstructorParams,
} from '@vecrea/au3te-ts-server/handler.authorization-decision';
import { UnifiedIdSessionSchemas } from '../session';
import { AuthorizationDecisionHandlerFactory } from '../../../di/DIContainer';
import { createGetOrAuthenticateUser } from './getOrAuthenticateUser';
import { SessionSchemas } from '@vecrea/au3te-ts-server/session';
import { UnifiedIdUser } from '../schemas/User';

export const createUnifiedIdAuthorizationDecisionHandler: AuthorizationDecisionHandlerFactory =
  <SS extends SessionSchemas = UnifiedIdSessionSchemas, OPTS = unknown>({
    serverHandlerConfiguration,
    extractorConfiguration,
    userHandlerConfiguration,
    authorizationHandlerConfiguration,
    authorizationIssueHandlerConfiguration,
    authorizationFailHandlerConfiguration,
  }: CreateAuthorizationDecisionHandlerConfigurationImplConstructorParams<
    SS,
    UnifiedIdUser,
    'serviceId',
    OPTS
  >) => {
    return new AuthorizationDecisionHandlerConfigurationImpl<
      SS,
      UnifiedIdUser,
      'serviceId',
      OPTS
    >({
      serverHandlerConfiguration,
      extractorConfiguration,
      userHandlerConfiguration,
      authorizationHandlerConfiguration: authorizationHandlerConfiguration,
      authorizationIssueHandlerConfiguration,
      authorizationFailHandlerConfiguration,
      overrides: {
        createGetOrAuthenticateUser: createGetOrAuthenticateUser,
      },
    });
  };
