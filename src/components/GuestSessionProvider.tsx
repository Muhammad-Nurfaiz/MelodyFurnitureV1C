"use client";

import { useEffect } from "react";
import { initGuestSession } from "@/lib/guestSession";

export function GuestSessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    initGuestSession();
  }, []);

  return <>{children}</>;
}