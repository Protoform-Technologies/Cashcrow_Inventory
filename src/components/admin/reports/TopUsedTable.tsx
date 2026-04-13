"use client"

interface Part {
    sku: string
    name: string
    desc: string
    category: string
    usage: string
    status: string
}

export default function TopUsedTable({ data }: { data: Part[] }) {
    return (
        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm mt-6">

            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-slate-700">
                    Top Used Parts (This Month)
                </h2>

                <button className="text-sm text-green-700 font-medium hover:underline">
                    View All Inventory
                </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm">

                    {/* Table Head */}
                    <thead>
                        <tr className="text-left text-slate-500 border-b">
                            <th className="py-3">SKU ID</th>
                            <th>Part Name</th>
                            <th>Category</th>
                            <th>Usage Count</th>
                            <th>Status</th>
                        </tr>
                    </thead>

                    {/* Table Body */}
                    <tbody>
                        {data.map((item, index) => (
                            <tr
                                key={index}
                                className="border-b last:border-none hover:bg-slate-50 transition"
                            >
                                <td className="py-3 font-medium text-slate-700">
                                    {item.sku}
                                </td>

                                <td>
                                    <div>
                                        <p className="font-medium text-slate-800">
                                            {item.name}
                                        </p>
                                        <p className="text-xs text-slate-400">
                                            {item.desc}
                                        </p>
                                    </div>
                                </td>

                                <td className="text-slate-600">
                                    {item.category}
                                </td>

                                <td className="font-semibold text-slate-800">
                                    {item.usage}
                                </td>

                                <td>
                                    <span
                                        className={`text-xs font-semibold px-2 py-1 rounded-full ${item.status === "LOW STOCK"
                                                ? "bg-red-100 text-red-600"
                                                : "bg-green-100 text-green-600"
                                            }`}
                                    >
                                        {item.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>

                </table>
            </div>
        </div>
    )
}