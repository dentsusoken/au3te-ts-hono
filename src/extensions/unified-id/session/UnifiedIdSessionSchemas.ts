import {
  defaultSessionSchemas,
  SessionSchemas,
} from '@vecrea/au3te-ts-server/session';
import { unifiedIdUserSchema } from '../schemas/User';
import { unifiedIdParamsSchema } from '../schemas/UnifiedIdParams';

export const unifiedIdSessionSchemas = {
  ...defaultSessionSchemas,
  user: unifiedIdUserSchema,
  unifiedIdParams: unifiedIdParamsSchema,
} satisfies SessionSchemas;

export type UnifiedIdSessionSchemas = typeof unifiedIdSessionSchemas &
  SessionSchemas;
