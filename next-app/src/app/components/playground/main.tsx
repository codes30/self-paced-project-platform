"use client";

import { Separator } from "@/components/ui/separator";
import { TabsTrigger, Tabs, TabsContent, TabsList } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Challenge, Submission } from "@prisma/client";
import { Card } from "@/components/ui/card";
import SwaggerUIComponent from "../swagger/main";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { submissionformSchema } from "@/schema/submissionForm";
import { NotionRendererComponent } from "./notionRendererComponent";
import { Input } from "@/components/ui/input";
import { clearCache } from "@/actions/clearCache";
import { useToast } from "@/hooks/use-toast";
import _ from "lodash";
import { columns } from "../tasks/components/columns";
import { DataTable } from "../tasks/components/data-table";
import { TestResultDialog } from "./result/TestResultDialog";
import { useState } from "react";
import { TSubmissionWithUserAndResults } from "../../../../types/submission";

export function PlaygroundPage({
  challenge,
  recordMap,
  submissionsList,
}: {
  challenge: Challenge;
  recordMap: any;
  submissionsList?: TSubmissionWithUserAndResults[];
}) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof submissionformSchema>>({
    resolver: zodResolver(submissionformSchema),
    defaultValues: {
      websocketUrl: "",
      challengeId: challenge.id,
      backendUrl: "",
      challengeName: challenge.name,
    },
  });

  const [submissionId, setSubmissionId] = useState("");

  async function onSubmit(values: z.infer<typeof submissionformSchema>) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_URL}/api/redis`, {
      method: "POST",
      body: JSON.stringify({ values }),
    });
    const { success, message } = await res.json();

    setSubmissionId(message.submissionId);

    clearCache();
    if (success) {
      toast({
        description: "Submission Successfull",
        variant: "success",
      });
      document.getElementById("testResultDialog")?.click();
    } else {
      toast({
        description: "Submission Failed",
        variant: "destructive",
      });
    }
  }
  return (
    <>
      <div className="hidden px-12 h-full flex-col md:flex">
        <div className="container flex flex-col items-start justify-between space-y-2 py-4 sm:flex-row sm:items-center sm:space-y-0 md:h-16">
          <h2 className="text-lg w-full font-semibold">{`Challenge ${challenge.id}`}</h2>
        </div>
        <Separator />
        <div className="grid grid-cols-12">
          <Tabs defaultValue="Documentation" className="col-span-9">
            <TabsList className="grid w-full mt-6 grid-cols-4">
              <TabsTrigger value="Documentation">
                <span>Documentation</span>
              </TabsTrigger>
              <TabsTrigger value="Api Specifications">
                <span>Api Specifications</span>
              </TabsTrigger>
              <TabsTrigger value="ws-specifications">
                <span>Web socket Specifications</span>
              </TabsTrigger>
              <TabsTrigger value="submissions">
                <span>Submissions</span>
              </TabsTrigger>
            </TabsList>
            <div className=" h-full w-full  py-6">
              <div className="grid h-full  w-full items-stretch gap-6">
                <div className="w-full ">
                  <TabsContent
                    value="Documentation"
                    className="mt-0 border-0 p-0"
                  >
                    <div className="flex h-full w-full flex-col space-y-4">
                      <Card className="overflow-y-auto max-h-[40rem] flex-1 p-4 md:min-h-[700px] lg:min-h-[700px]">
                        <ScrollArea className="overflow-y-auto h-full">
                          <NotionRendererComponent recordMap={recordMap} />
                        </ScrollArea>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent
                    value="Api Specifications"
                    className="mt-0 border-0 p-0"
                  >
                    <div className="flex h-full w-full flex-col space-y-4">
                      <Card className="min-h overflow-scroll- y   flex-1 p-4 md:min-h-[700px] lg:min-h-[700px]">
                        <ScrollArea>
                          <SwaggerUIComponent
                            challengeName={challenge.name}
                          ></SwaggerUIComponent>
                        </ScrollArea>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent
                    value="submissions"
                    className="mt-0 border-0 p-0"
                  >
                    <div className="flex h-full w-full flex-col space-y-4">
                      <Card className="overflow-y-auto flex-1 p-4 md:min-h-[700px] lg:min-h-[700px]">
                        <ScrollArea>
                          <DataTable
                            data={
                              _.isEmpty(submissionsList) ? [] : submissionsList!
                            }
                            columns={columns}
                          />
                        </ScrollArea>
                      </Card>
                    </div>
                  </TabsContent>

                  <TabsContent
                    value="ws-specifications"
                    className="mt-0 border-0 p-0"
                  >
                    <div className="flex h-full w-full flex-col space-y-4">
                      <Card className="min-h overflow-scroll- y   flex-1 p-4 md:min-h-[700px] lg:min-h-[700px]">
                        <ScrollArea>
                          <SwaggerUIComponent
                            challengeName={`${challenge.name}.ws`}
                          ></SwaggerUIComponent>
                        </ScrollArea>
                      </Card>
                    </div>
                  </TabsContent>
                </div>
              </div>
            </div>
          </Tabs>
          <div className="flex justify-center p-16  col-span-3">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-3 flex-1"
              >
                <FormField
                  control={form.control}
                  name="backendUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">
                        Backend Endpoint
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="https://hkirat.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="websocketUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-sm">
                        Websocket Endpoint
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="https://hkirat.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button disabled={form.formState.isSubmitting} type="submit">
                  Submit
                </Button>
              </form>
            </Form>
          </div>
        </div>
        <TestResultDialog
          isSubmitted={form.formState.isSubmitSuccessful}
          submissionId={submissionId}
        ></TestResultDialog>
      </div>
    </>
  );
}
