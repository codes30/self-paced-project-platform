import { cn } from "@/lib/utils";
import _ from "lodash";
import { SidebarButton } from "./sidebarButton";
import { Challenge } from "@prisma/client";

export async function Sidebar({
  className,
  challenges,
}: {
  className: string;
  challenges: Challenge[];
}) {
  return (
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Challenges
          </h2>
          <div className="space-y-1">
            {challenges.map((item, index) => {
              return (
                <SidebarButton key={index} text={item.name}></SidebarButton>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
