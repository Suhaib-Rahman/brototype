"use client";
import { useEffect } from "react";
import { useUIStore } from "@/store/useUIStore";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const palette = useUIStore((state) => state.palette);

  useEffect(() => {
    document.documentElement.setAttribute("data-palette", palette);
  }, [palette]);

  return <>{children}</>;
}
