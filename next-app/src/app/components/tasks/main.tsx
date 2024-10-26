import { Metadata } from "next";
import Image from "next/image";
import { columns } from "./components/columns";
import { DataTable } from "./components/data-table";
import _ from "lodash";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { ScrollInViewComponent } from "@/components/scrollInViewButton";

export const metadata: Metadata = {
  title: "Tasks",
  description: "A task and issue tracker build using Tanstack Table.",
};

export const revalidate = 1;

export default async function TaskPage() {
  return (
    <>
      <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
        <div className="flex items-center justify-between space-y-2">
          <div className="flex justify-center items-center gap-4">
            <h2 className="text-2xl font-bold tracking-tight">
              Test Submissons PROBO-v1
            </h2>
            <ScrollInViewComponent id="apiSpecs">
              <div className="flex justify-center items-center gap-2 text-sm hover:underline hover:cursor-pointer ">
                <p>view api specs</p>
                <ArrowRightIcon></ArrowRightIcon>
              </div>
            </ScrollInViewComponent>
          </div>
        </div>
      </div>
    </>
  );
}
