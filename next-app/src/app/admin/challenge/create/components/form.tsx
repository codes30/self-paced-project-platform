"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createChallengeSchema } from "../../../../../../types/challenge";
import { createChallenge } from "@/actions/createChallenge";

//TODO: infer from prisma

export function CreateChallengeForm() {
  const form = useForm<z.infer<typeof createChallengeSchema>>({
    resolver: zodResolver(createChallengeSchema),
    defaultValues: {
      name: "",
      isActive: false,
      image: "",
      notionDocPageId: "",
    },
  });

  async function onSubmit(values: z.infer<typeof createChallengeSchema>) {
    console.log("herehheheh");
    const isChallengeCreated = await createChallenge(values);
    if (isChallengeCreated) {
      return alert("success");
    }

    return alert("failed");
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Challenge Name</FormLabel>
              <FormControl>
                <Input placeholder="xxxxxx" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notionDocPageId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notion Doc Page Id</FormLabel>
              <FormControl>
                <Input placeholder="xxxxxxxxxx" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image Url</FormLabel>
              <FormControl>
                <Input placeholder="url" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
