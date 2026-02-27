"use client";

import { AuthProvider as SupabaseAuthProvider } from "@/context/AuthContext";
import { ReactNode } from "react";

export function AuthProvider({ children }: { children: ReactNode }) {
  return <SupabaseAuthProvider>{children}</SupabaseAuthProvider>;
}
