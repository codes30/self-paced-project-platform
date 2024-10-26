import { getServerAuthSession } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { submissionformSchema } from "@/schema/submissionForm";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "redis";

const redisHost = process.env.REDIS_HOST || "localhost";
const redisClient = createClient({
  url: `redis://${redisHost}:6379`,
});

redisClient.on("error", (err) => {
  console.log("Redis error: ", err);
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerAuthSession();
    if (!session) {
      throw new Error("NO USER");
    }

    // Connect Redis client once outside the transaction
    if (!redisClient.isOpen) {
      await redisClient.connect();
    }

    const { values } = await request.json();
    const parsedValues = submissionformSchema.safeParse(values);
    if (!parsedValues.success) {
      return NextResponse.json({ success: false });
    }

    // Get the username, backendUrl, and websocketUrl from the body
    const { backendUrl, websocketUrl, challengeName, challengeId } =
      parsedValues.data;

    let reply: number = -1;
    let submissionId = "-1";
    // Add entry to DB using a transaction
    await prisma.$transaction(async (tx: any) => {
      const { id } = await tx.submission.create({
        data: {
          userId: session.user.id,
          backendUrl,
          websocketUrl,
          status: "in progress",
          submissionTime: Date.now().toString(),
          challengeId,
        },
      });

      // Add the submission data to Redis
      reply = await redisClient.lPush(
        "submissions",
        JSON.stringify({ id, backendUrl, websocketUrl, challengeName }),
      );
      console.log(
        `Submission added to Redis queue for the challenge ${challengeName}`,
      );

      submissionId = id;
    });

    return NextResponse.json({
      success: true,
      message: { submissionId },
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json({ success: false, message: "Submission failed" });
  } finally {
    if (redisClient.isOpen) {
      await redisClient.disconnect();
    }
  }
}
