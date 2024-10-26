import prisma from "@/lib/prisma";
import { workerReponseMap } from "@/lib/workerReponses";
import { submissionResultSchema } from "@/schema/submissionResult";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    //@ts-ignore
    const token = request.headers.get("authorization").split(" ")[1];
    if (token !== "J6o3GGPtq1Jf3Ai6k/RcNUUyqJiPVvq6Qq6SBPnJ8l4=") {
      throw new Error("Invalid Token");
    }
    const parsedValues = submissionResultSchema.safeParse(data.values);
    if (!parsedValues.success) {
      throw new Error("Error parsing Data");
    }

    const { id, executionTime, status, perTestResults } = parsedValues.data;

    console.log("response from worker recieved");
    console.log({ id, executionTime, status, perTestResults });
    //set test Results in workerReponseMap
    workerReponseMap.set(id, perTestResults);

    //add test results in db
    await prisma.submission.update({
      where: { id },
      data: { executionTime, status, results: { create: perTestResults } },
    });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error({ error });
    return NextResponse.json({ success: false });
  }
}
