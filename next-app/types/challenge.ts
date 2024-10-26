import { z } from "zod";

export const createChallengeSchema = z.object({
  name: z.string().min(1),
  isActive: z.boolean(),
  image: z.string().min(1),
  notionDocPageId: z.string().min(1),
});

export type TcreateChallengeSchema = z.infer<typeof createChallengeSchema>
