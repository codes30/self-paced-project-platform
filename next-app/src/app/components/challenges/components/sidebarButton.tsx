"use client";

import { Button } from "@/components/ui/button";
import useSetQueryParams from "@/hooks/use-set-query-params";

export function SidebarButton({ text }: { text: string }) {
  const setQueryParams = useSetQueryParams();
  return (
    <Button
      onClick={() => {
        setQueryParams({ address: text });
      }}
      variant="ghost"
      className="w-full justify-start text-neutral-700"
    >
      {text}
    </Button>
  );
}
