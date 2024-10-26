import { workerReponseMap } from "@/lib/workerReponses";
import _ from "lodash";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const searchParams = new URLSearchParams(url.search);
  const submissionId = searchParams.get("submissionId");

  if (!submissionId) {
    return;
  }
  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      try {
        const initialMessage = {
          type: "connection",
          status: "established",
          data: [],
        };

        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify(initialMessage)}\n\n`),
        );

        const intervalId = setInterval(() => {
          if (request.signal.aborted) {
            clearInterval(intervalId);
            controller.close();
            return;
          }

          console.log({ workerReponseMap: workerReponseMap.get(submissionId) });

          if (_.isEmpty(workerReponseMap.get(submissionId))) {
            const message = {
              type: "update",
              status: "pending",
              data: [],
            };
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify(message)}\n\n`),
            );
          } else {
            const message = {
              type: "update",
              status: "done",
              data: workerReponseMap.get(submissionId),
            };
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify(message)}\n\n`),
            );
          }
        }, 2000);

        // Clean up on connection close
        request.signal.addEventListener("abort", () => {
          clearInterval(intervalId);
          controller.close();
        });
      } catch (error) {
        controller.error(error);
      }
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
}
