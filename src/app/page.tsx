"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { createClient } from "@/lib/supabase";

export default function AddMembers() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const supabase = createClient();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  // Protect Page - Admin Only
  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }

    const role = user?.user_metadata?.role;

    if (!loading && role !== "admin") {
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  const handleAddMember = async () => {
    if (!name || !email) {
      alert("Please fill all fields");
      return;
    }

    const { error } = await supabase.from("profiles").insert([
      {
        name: name,
        email: email,
        role: "member",
      },
    ]);

    if (error) {
      alert("Error adding member");
      console.log(error);
    } else {
      alert("Member added successfully!");
      setName("");
      setEmail("");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow w-96">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Add Member
        </h1>

        <input
          type="text"
          placeholder="Full Name"
          className="w-full border p-2 mb-4 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="email"
          placeholder="Email Address"
          className="w-full border p-2 mb-4 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          onClick={handleAddMember}
          className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
        >
          Add Member
        </button>
      </div>
    </div>
  );
}