import { userSchema, User } from "@vecrea/au3te-ts-common/schemas.common"
import { z } from "zod"
import { unifiedIdParamsSchema } from "./UnifiedIdParams"

export const unifiedIdUserSchema = userSchema.extend({
  ...unifiedIdParamsSchema.shape,
})

export type UnifiedIdUser = User & z.infer<typeof unifiedIdUserSchema>
