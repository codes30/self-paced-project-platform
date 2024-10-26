import Link from "next/link";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <main className="flex flex-col gap-8 w-full h-screen justify-center items-center ">
      <Link href={"/challenges"}>
        <Button>All Challenges</Button>
      </Link>
    </main>
  );
}
