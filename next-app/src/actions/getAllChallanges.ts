"use server";

import prisma from "@/lib/prisma";
import _ from "lodash";

export async function getAllChallenges() {
  try {
    const challenges = await prisma.challenge.findMany();
    if (_.isEmpty(challenges)) {
      throw new Error("No Challanges Found");
    }
    return challenges;
  } catch (error) {
    console.error({ error });
    return null;
  }
}
