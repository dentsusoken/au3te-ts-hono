import { Mdoc } from '@vecrea/au3te-ts-common/handler.user';

export const createUnifiedIdMdocClaims = (
  service: string,
  userId: string,
  unifiedId: string,
  ttl?: number,
): Mdoc => {
  const issueDate = new Date().toISOString();
  const expiryDate = ttl ? new Date(Date.now() + ttl).toISOString() : issueDate;

  return {
    'com.dentsusoken.vecrea': {
      issue_date: `cbor:0("${issueDate}")`,
      expiry_date: `cbor:0("${expiryDate}")`,
      type: 'UnifiedID',
      service,
      user_id: userId,
      unified_id: unifiedId,
    },
  };
};
