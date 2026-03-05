"use client";

import { isServer } from "@/lib/is-server";
import { VercelToolbar } from "@vercel/toolbar/next";

export function StaffToolbar() {
  const isEmployee =
    (!isServer && window?.document?.cookie?.includes("isEmployee")) ??
    false;

  return isEmployee ? <VercelToolbar /> : null;
}
