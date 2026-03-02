"use server";

import { revalidatePath } from "next/cache";
import { createServerSupabaseClient } from "@/lib/supabase-server";

export async function addMember(name: string, email: string) {
  const supabase = await createServerSupabaseClient();
  
  const { error } = await supabase.from("profiles").insert([
    {
      name: name,
      email: email,
      role: "member",
    },
  ]);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard", "page");
  revalidatePath("/add-members", "page");
  return { success: true, error: null };
}

export async function inviteMember(name: string, email: string) {
  const supabase = await createServerSupabaseClient();
  
  // Send invitation email via Supabase
  const { error } = await supabase.auth.admin.inviteUserByEmail(email, {
    data: {
      name: name,
      role: "member",
    },
  });

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard", "page");
  return { success: true, error: null };
}

export async function getMembers() {
  const supabase = await createServerSupabaseClient();
  
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return { data: [], error: error.message };
  }

  return { data, error: null };
}

export async function deleteMember(memberId: string) {
  const supabase = await createServerSupabaseClient();
  
  const { error } = await supabase
    .from("profiles")
    .delete()
    .eq("id", memberId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard", "page");
  return { success: true, error: null };
}

export async function updateMemberRole(memberId: string, role: string) {
  const supabase = await createServerSupabaseClient();
  
  const { error } = await supabase
    .from("profiles")
    .update({ role })
    .eq("id", memberId);

  if (error) {
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard", "page");
  return { success: true, error: null };
}
