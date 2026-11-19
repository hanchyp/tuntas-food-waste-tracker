"use client";
import { useEffect, useState } from "react";
export function useFeedback() {
  const [message, setMessage] = useState("");
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(""), 5000);
    return () => clearTimeout(timer);
  }, [message]);
  return [message, setMessage] as const;
}
