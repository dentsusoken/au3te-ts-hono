import { FederationCallbackHandlerFactory } from '../../../../di';
import {
  FederationCallbackHandlerConfiguration,
  FederationCallbackHandlerConfigurationImpl,
} from '@vecrea/au3te-ts-server/handler.federation-callback';
import { UnifiedIdSessionSchemas } from '../../session';
import { UnifiedIdUser } from '../../schemas/User';
import { createProcessRequest } from './processRequest';
import { UnifiedIdOptionsKeys } from '../user/UnifiedIdUserHandlerConfigurationImpl';

export const createUnifiedIdFederationCallbackHandler: FederationCallbackHandlerFactory<
  UnifiedIdSessionSchemas,
  UnifiedIdUser,
  UnifiedIdOptionsKeys
> = (params): FederationCallbackHandlerConfiguration => {
  return new FederationCallbackHandlerConfigurationImpl({
    ...params,
    overrides: {
      createProcessRequest: createProcessRequest,
    },
  });
};
