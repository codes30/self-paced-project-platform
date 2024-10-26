import Image from "next/image";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Challenge } from "@prisma/client";

interface TproductItemProps extends React.HTMLAttributes<HTMLDivElement> {
  challenge: Challenge;
  width?: number;
  aspectRatio?: "portrait" | "square";
  height?: number;
}

export function ChallengeItem({
  challenge,
  aspectRatio,
  width,
  height,
  className,
  ...props
}: TproductItemProps) {
  return (
    <Link href={`/challenges/${challenge.id}`}>
      <div className={cn("space-y-3", className)} {...props}>
        <div>
          <div>
            <div className="overflow-hidden rounded-md">
              <Image
                priority
                src={challenge.image}
                alt={challenge.id.toString()}
                width={width}
                height={height}
                className={cn(
                  "h-auto w-auto object-cover transition-all hover:scale-105",
                  aspectRatio === "portrait" ? "aspect-[3/4]" : "aspect-square",
                )}
              />
            </div>
          </div>
        </div>
        <div className="space-y-1 text-sm">
          <h3 className="font-medium leading-none">{challenge.name}</h3>
        </div>
      </div>
    </Link>
  );
}
