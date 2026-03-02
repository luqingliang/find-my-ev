"use client";

import { useEffect } from "react";
import { useCompareStore } from "@/lib/useCompareStore";

const STORAGE_KEY = "find-my-electric-car-ids";

export function CompareSync() {
  const ids = useCompareStore((s) => s.ids);
  const setIds = useCompareStore((s) => s.setIds);

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        setIds(parsed.filter((item) => typeof item === "string"));
      }
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, [setIds]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  }, [ids]);

  return null;
}
