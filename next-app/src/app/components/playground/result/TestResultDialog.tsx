"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TperTestResults } from "@/schema/submissionResult";
import _ from "lodash";
import { useEffect, useState } from "react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function TestResultDialog({
  isSubmitted,
  submissionId,
}: {
  isSubmitted: boolean;
  submissionId: string;
}) {
  const [data, setData] = useState<any>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    let eventSource: EventSource | null = null;

    if (isSubmitted && submissionId) {
      eventSource = new EventSource(
        `${process.env.NEXT_PUBLIC_URL}/api/event-stream?submissionId=${submissionId}`,
      );

      eventSource.onmessage = (event) => {
        try {
          const parsedData = JSON.parse(event.data);
          if (!_.isEmpty(parsedData.data)) {
            setData(parsedData.data);
            eventSource?.close();
          }
        } catch (e) {
          console.error("Failed to parse SSE data:", e);
        }
      };

      eventSource.onerror = (error) => {
        console.error("SSE Error:", error);
        eventSource?.close();
      };
    }
    if (!isDialogOpen) {
      if (eventSource) {
        eventSource.close();
        setData(null);
      }
    }
    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [isSubmitted, isDialogOpen, submissionId]);

  return (
    <Dialog onOpenChange={setIsDialogOpen}>
      <DialogTrigger hidden id="testResultDialog"></DialogTrigger>
      <DialogContent className="w-[40rem] h-[30rem] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Test Results</DialogTitle>
          <DialogDescription>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-center">Title</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-center">Duration</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data
                  ? data.map((d: TperTestResults, index: number) => {
                      return (
                        <TableRow key={index}>
                          <TableCell className="font-medium">
                            {d.title}
                          </TableCell>

                          <TableCell className="font-medium text-center">
                            {d.status}
                          </TableCell>

                          <TableCell className="font-medium text-center">
                            {d.duration}
                          </TableCell>
                        </TableRow>
                      );
                    })
                  : "Running Tests..."}
              </TableBody>
            </Table>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
