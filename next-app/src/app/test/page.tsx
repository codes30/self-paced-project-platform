"use client";

import { useEffect } from "react";

export default function TestPage() {
  useEffect(() => {
    const eventSource = new EventSource(
      "http://localhost:3001/api/event-stream",
    );
    eventSource.onmessage = (event) => {
      console.log({ event });
    };
  }, []);
  return <div></div>;
}
