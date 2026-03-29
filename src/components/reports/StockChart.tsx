"use client"

export default function StockChart() {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm col-span-2 border">

            <div className="flex justify-between mb-4">
                <h3 className="font-semibold">Stock Movement Over Time</h3>

                <div className="flex gap-3 text-sm">
                    <span className="text-green-600">● Inbound</span>
                    <span className="text-gray-400">● Outbound</span>
                </div>
            </div>

            <div className="h-64 flex items-center justify-center text-gray-400">
                Chart Area
            </div>

            <div className="flex justify-between text-xs text-gray-400 mt-3">
                <span>Week 1</span>
                <span>Week 2</span>
                <span>Week 3</span>
                <span>Week 4</span>
            </div>

        </div>
    )
}