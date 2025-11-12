import {
  AuthorizationHandlerConfiguration,
  AuthorizationHandlerConfigurationImpl,
  AuthorizationHandlerConfigurationImplConstructorParams,
} from '@vecrea/au3te-ts-server/handler.authorization';
import { UnifiedIdSessionSchemas } from '../../session';
import { SessionSchemas } from '@vecrea/au3te-ts-server/session';
import { ExtractUnifiedIdParameters } from './extractParameters';
import { createGenerateAuthorizationPage } from './generateAuthorizationPage';
import { UnifiedIdParams } from '../../schemas/UnifiedIdParams';
import { createProcessApiResponse } from './processApiResponse';
import { createProcessRequest } from './processRequest';
import { AuthorizationHandlerFactory } from '../../../../di/DIContainer';
import { createToApiRequest } from './toApiRequest';

export class UnifiedIdAuthorizationHandler<
  SS extends SessionSchemas = UnifiedIdSessionSchemas,
  OPTS = UnifiedIdParams
> extends AuthorizationHandlerConfigurationImpl<SS, OPTS> {
  constructor(
    params: AuthorizationHandlerConfigurationImplConstructorParams<SS, OPTS>
  ) {
    super(params);
  }
}

export const createUnifiedIdAuthorizationHandler: AuthorizationHandlerFactory =
  <SS extends SessionSchemas = UnifiedIdSessionSchemas, OPTS extends UnifiedIdParams = UnifiedIdParams>(
    params: AuthorizationHandlerConfigurationImplConstructorParams<SS, OPTS>
  ): AuthorizationHandlerConfiguration<SS, OPTS> => {
    const unifiedIdParams: AuthorizationHandlerConfigurationImplConstructorParams<
      SS,
      OPTS
    > = {
      serverHandlerConfiguration: params.serverHandlerConfiguration,
      authorizationIssueHandlerConfiguration:
        params.authorizationIssueHandlerConfiguration,
      authorizationFailHandlerConfiguration:
        params.authorizationFailHandlerConfiguration,
      authorizationPageHandlerConfiguration:
        params.authorizationPageHandlerConfiguration,
      extractorConfiguration: {
        ...params.extractorConfiguration,
        extractParameters: ExtractUnifiedIdParameters,
      },
      overrides: {
        createGenerateAuthorizationPage: createGenerateAuthorizationPage<
          SS,
          OPTS
        >,
        createProcessApiResponse: createProcessApiResponse<SS, OPTS>,
        createProcessRequest: createProcessRequest<OPTS>,
        createToApiRequest: createToApiRequest<OPTS>,
      },
    };
    return new UnifiedIdAuthorizationHandler<SS, OPTS>(unifiedIdParams);
  };
