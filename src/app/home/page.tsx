"use client";

import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen bg-[#f4f7f5]">

      {/* Sidebar */}
      <div className="w-64 bg-[#1f4d36] text-white flex flex-col justify-between p-6">
        <div>
          <h1 className="text-xl font-semibold mb-8">Cashcrow Lab</h1>

          <nav className="space-y-3">
            <div className="bg-[#2e6b4f] px-4 py-2 rounded-md">Dashboard</div>
            <div className="px-4 py-2 hover:bg-[#2e6b4f] rounded-md cursor-pointer">Parts</div>
            <div className="px-4 py-2 hover:bg-[#2e6b4f] rounded-md cursor-pointer">Add Product</div>
            <div className="px-4 py-2 hover:bg-[#2e6b4f] rounded-md cursor-pointer">Daily Log</div>

            <p className="text-xs text-gray-300 mt-6 mb-2">ACCOUNT</p>
            <div className="px-4 py-2 hover:bg-[#2e6b4f] rounded-md cursor-pointer">User Profile</div>
            <div className="px-4 py-2 hover:bg-[#2e6b4f] rounded-md cursor-pointer">Settings</div>
          </nav>
        </div>

        {/* Logout */}
        <div
          onClick={() => router.push("/login")}
          className="px-4 py-2 hover:bg-[#2e6b4f] rounded-md cursor-pointer"
        >
          Logout
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8">

        {/* Top Bar */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Dashboard</h2>

          <div className="flex items-center gap-4">
            <div className="bg-white px-4 py-2 rounded-md shadow-sm text-sm text-gray-500">
              🔔
            </div>

            <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-md shadow-sm">
              <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
              <div>
                <p className="text-sm font-semibold">Dr. Aris Thorne</p>
                <p className="text-xs text-gray-500">LAB DIRECTOR</p>
              </div>
            </div>
          </div>
        </div>

        {/* Welcome Card */}
        <div className="bg-white p-6 rounded-lg shadow-sm flex justify-between items-center mb-6">
          <div>
            <h3 className="text-lg font-semibold">
              Welcome back, Dr. Thorne
            </h3>
            <p className="text-sm text-gray-500">
              Inventory overview for {"{DATE:TODAY}"}
            </p>
          </div>

          <button className="bg-[#1f4d36] text-white px-4 py-2 rounded-md">
            + Create Today's Log
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <p className="text-sm text-gray-500">Total Parts</p>
            <h2 className="text-3xl font-bold mt-2">0</h2>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <p className="text-sm text-gray-500">Low Stock</p>
            <h2 className="text-3xl font-bold mt-2">0</h2>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <p className="text-sm text-gray-500">Out of Stock</p>
            <h2 className="text-3xl font-bold mt-2">0</h2>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <p className="text-sm text-gray-500">Recent Logs</p>
            <h2 className="text-3xl font-bold mt-2">0</h2>
          </div>
        </div>

      </div>
    </div>
  );
}