"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function DashboardPage() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  const handleSignOut = async () => {
    await signOut();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-2xl font-bold text-primary">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cashcrow-secondary">
      <h1 className="text-6xl font-extrabold text-cashcrow-primary mb-8">Cashcrow</h1>
      <p className="text-xl text-cashcrow-textmuted mb-8">Welcome to your dashboard!</p>
      <div className="text-center mb-8">
        <p className="text-sm text-cashcrow-textmuted">Logged in as: {user.email}</p>
        <p className="text-sm text-cashcrow-textmuted">Role: {user.user_metadata?.role || "member"}</p>
      </div>
      <button
        onClick={handleSignOut}
        className="px-6 py-3 bg-cashcrow-primary text-white rounded-lg font-semibold hover:bg-cashcrow-lightgreen transition-colors"
      >
        Logout
      </button>
    </div>
  );
}
