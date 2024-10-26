import { ChallengeItem } from "./components/album-artwork";
import _ from "lodash";
import { Separator } from "@/components/ui/separator";
import { getAllChallenges } from "@/actions/getAllChallanges";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { ScrollBar } from "@/components/ui/scroll-area";
import { Sidebar } from "./components/sidebar";

export async function ProductPage() {
  const challenges = await getAllChallenges();
  if (_.isEmpty(challenges)) {
    return <div>No Challanges found</div>;
  }

  return (
    <div className="block h-full">
      <div className="h-full border-t">
        <div className="grid h-full lg:grid-cols-10">
          <Sidebar
            challenges={challenges!}
            className="hidden h-full col-span-1 lg:block"
          />
          <div className="col-span-3 lg:col-span-9 lg:border-l">
            <div className="h-full px-4 py-6 lg:px-8">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h2 className="text-2xl font-semibold tracking-tight">
                    Active Challenges
                  </h2>
                  <p className="text-sm text-muted-foreground">Top picks</p>
                </div>
              </div>
              <Separator className="my-4" />
              <div className="relative">
                <div className="flex flex-wrap gap-5 pb-4">
                  {challenges?.map((challenge) => (
                    <ChallengeItem
                      key={challenge.id.toString()}
                      challenge={challenge}
                      className="w-[250px]"
                      aspectRatio="portrait"
                      width={400}
                      height={400}
                    />
                  ))}
                </div>
              </div>
              <div className="mt-6 space-y-1">
                <h2 className="text-2xl font-semibold tracking-tight">
                  Recommended
                </h2>
              </div>
              <Separator className="my-4" />
              <div className="relative">
                <ScrollArea>
                  <div className="flex space-x-4 pb-4">
                    {challenges?.map((challenge) => (
                      <ChallengeItem
                        key={challenge.id.toString()}
                        challenge={challenge}
                        className="w-[150px]"
                        aspectRatio="square"
                        width={150}
                        height={150}
                      />
                    ))}
                  </div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
