import { Prisma } from "@prisma/client";

export type TSubmissionWithUserAndResults = Prisma.SubmissionGetPayload<{
  include: { user: true; results: true };
}>;
