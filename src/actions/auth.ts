"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase-server";

export async function signIn(email: string, password: string) {
  const supabase = await createServerSupabaseClient();
  
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error };
  }

  redirect("/home");
}

export async function signUp(email: string, password: string, fullName: string, role: string) {
  const supabase = await createServerSupabaseClient();
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        role: role,
      },
    },
  });

  if (error) {
    return { error };
  }

  // Create profile record
  if (data.user) {
    await supabase.from("profiles").insert([
      {
        id: data.user.id,
        email: email,
        name: fullName,
        role: role,
      },
    ]);
  }

  revalidatePath("/", "page");
  return { error: null };
}

export async function signOut() {
  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();
  revalidatePath("/", "page");
  redirect("/login");
}

export async function signInWithGoogle() {
  const supabase = await createServerSupabaseClient();
  
  // Get the base URL - use localhost:3000 as default
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  
  const redirectTo = `${baseUrl}/auth/callback`;
  
  console.log("Google OAuth redirect URL:", redirectTo);

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: redirectTo,
    },
  });

  // If there's a URL, redirect to Google's login page
  if (data.url) {
    console.log("Redirecting to Google:", data.url);
    redirect(data.url);
  }

  if (error) {
    console.error("Google OAuth error:", error);
    return { error };
  }
  
  return { error: null };
}
