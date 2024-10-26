import { z } from "zod";

export const perTestResults = z.object({
  title: z.string().min(1),
  status: z.string().min(1),
  duration: z.number(),
});
export type TperTestResults = z.infer<typeof perTestResults>;

export const submissionResultSchema = z.object({
  id: z.string().min(1),
  executionTime: z.string().min(1),
  status: z.string().min(1),
  perTestResults: z.array(perTestResults),
});
