"use server";

import prisma from "@/lib/prisma";
import {
  createChallengeSchema,
  TcreateChallengeSchema,
} from "../../types/challenge";
import _ from "lodash";

export async function createChallenge(values: TcreateChallengeSchema) {
  try {
    const parsedValues = createChallengeSchema.safeParse(values);
    if (!parsedValues.success) {
      throw new Error("zod parsing failed");
    }
    const { name, isActive, image, notionDocPageId } = parsedValues.data;
    const newChallenge = await prisma.challenge.create({
      data: { name, isActive, image, notionDocPageId },
    });
    if (_.isEmpty(newChallenge)) {
      throw new Error("Error creating new Challenge");
    }
    return true;
  } catch (error) {
    console.error({ error });
    return false;
  }
}
