import {
  GetByCredentials,
  UserHandlerConfiguration,
  UserHandlerConfigurationImpl,
} from '@vecrea/au3te-ts-common/handler.user';
import { UnifiedIdUser } from '../schemas/User';
import { mockGetByCredentials } from './mockGetByCredentials';
import { mockGetMdocClaimsBySubjectAndDoctype } from './mockGetMdocClaimsBySubjectAndDoctype';
import { mockGetBySubject } from './mockGetBySubject';
import { UserHandlerFactory } from '../../../di/DIContainer';

export interface UnifiedIdUserHandlerConfiguration
  extends UserHandlerConfiguration {
  getByCredentials: GetByCredentials<UnifiedIdUser, 'serviceId'>;
}

export class UnifiedIdUserHandlerConfigurationImpl
  extends UserHandlerConfigurationImpl
  implements UnifiedIdUserHandlerConfiguration
{
  getBySubject = mockGetBySubject;
  getByCredentials = mockGetByCredentials;
  getMdocClaimsBySubjectAndDoctype = mockGetMdocClaimsBySubjectAndDoctype;
}

export const createUnifiedIdUserHandler: UserHandlerFactory = ({
  users: _users,
  mdocs: _mdocs,
}) => {
  // Mock実装のため、KVNamespaceパラメータは使用しないが、型の整合性のために受け取る
  return new UnifiedIdUserHandlerConfigurationImpl();
};
