"use client"

import { Calendar, Download } from "lucide-react"

export default function ReportsHeader() {
    return (
        <div className="flex justify-between items-center">

            <div>
                <p className="text-sm text-gray-500">Dashboard / Reports</p>
                <h1 className="text-2xl font-bold">Reports & Analytics</h1>
            </div>

            <div className="flex gap-3">

                <div className="flex items-center gap-2 border px-4 py-2 rounded-lg bg-white">
                    <Calendar className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">Oct 1, 2023 - Oct 31, 2023</span>
                </div>

                <button className="flex items-center gap-2 bg-[#1f4d36] text-white px-4 py-2 rounded-lg">
                    <Download className="w-4 h-4" />
                    Export
                </button>

            </div>
        </div>
    )
}