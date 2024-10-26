"use client";

import { ReactNode } from "react";

export function ScrollInViewComponent({
  children,
  id,
}: {
  children: ReactNode;
  id: string;
}) {
  return (
    <div
      onClick={() => {
        const apiSpecs = document.getElementById(id);
        console.log({ apiSpecs });
        console.log("here");
        apiSpecs?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }}
    >
      {children}
    </div>
  );
}
