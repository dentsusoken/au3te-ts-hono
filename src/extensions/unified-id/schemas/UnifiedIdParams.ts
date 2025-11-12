import { z } from 'zod';

export const unifiedIdParamsSchema = z.object({
  unifiedId: z.string().nullish(),
  serviceId: z.string().nullish(),
});

export type UnifiedIdParams = z.infer<typeof unifiedIdParamsSchema>;
