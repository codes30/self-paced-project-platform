import { z } from "zod";

export const submissionformSchema = z.object({
  challengeId:z.string().min(1),
  backendUrl: z.string().min(1),
  websocketUrl: z.string().min(1),
  challengeName: z.string().min(1),
});
