"use server";

import prisma from "@/lib/prisma";
import _ from "lodash";

export async function getChallengeById({ id }: { id: string }) {
  try {
    const challenge = await prisma.challenge.findFirst({
      where: { id },
    });
    if (_.isEmpty(challenge)) {
      throw new Error("Invalid Challenge Id");
    }
    return challenge;
  } catch (error) {
    console.error({ error });
    return null;
  }
}
