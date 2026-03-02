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
  const role = user.user_metadata?.role || "member";

useEffect(() => {
  if (!loading && user) {
    if (role !== "admin") {
      router.push("/member-dashboard");
    }
  }
}, [user, loading, role, router]);

  return (
  <div className="flex min-h-screen">

    
    <div className="w-64 bg-gray-900 text-white p-6">
      <h2 className="text-2xl font-bold mb-8">Cashcrow</h2>
      <ul className="space-y-4">
        <li className="hover:text-gray-300 cursor-pointer">Dashboard</li>
        <li 
          onClick={() => router.push("/add-members")}
          className="hover:text-gray-300 cursor-pointer"
        >
          Add Members
        </li>
      </ul>
    </div>

    
    <div className="flex-1 bg-gray-100 p-8">

      
      <div className="flex justify-between items-center bg-white p-4 rounded-lg shadow mb-8">
        <div>
          <h2 className="text-lg font-bold">{user.email}</h2>
          <p className="text-sm text-gray-500">Role: {role}</p>
        </div>

        <button
          onClick={handleSignOut}
          className="px-4 py-2 bg-red-500 text-white rounded-md"
        >
          Logout
        </button>
      </div>

      
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500">Total Members</h3>
          <p className="text-2xl font-bold">0</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500">Total Inventory</h3>
          <p className="text-2xl font-bold">0</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-gray-500">Active Users</h3>
          <p className="text-2xl font-bold">0</p>
        </div>
      </div>

    </div>
  </div>
);
}
