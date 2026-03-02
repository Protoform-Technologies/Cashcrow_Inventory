"use client";

import { useState } from "react";
import { addMember } from "@/actions/members";

export function AddMemberForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleAddMember = async () => {
    if (!name || !email) {
      setMessage({ type: "error", text: "Please fill all fields" });
      return;
    }

    setLoading(true);
    setMessage(null);

    const result = await addMember(name, email);

    if (result.success) {
      setMessage({ type: "success", text: "Member added successfully!" });
      setName("");
      setEmail("");
    } else {
      setMessage({ type: "error", text: result.error || "Error adding member" });
    }

    setLoading(false);
  };

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

        {message && (
          <div className={`p-2 mb-4 rounded text-sm ${message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
            {message.text}
          </div>
        )}

        <button
          onClick={handleAddMember}
          disabled={loading}
          className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600 disabled:opacity-50"
        >
          {loading ? "Adding..." : "Add Member"}
        </button>
      </div>
    </div>
  );
}
