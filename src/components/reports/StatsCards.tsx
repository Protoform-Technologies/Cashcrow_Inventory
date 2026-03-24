"use client"

export default function StatsCards() {

    const stats = [
        {
            title: "Total Inventory Value",
            value: "$428,500.00",
            change: "+2.4% vs last month",
            positive: true,
        },
        {
            title: "Monthly Consumption",
            value: "14.2%",
            change: "-1.1% vs last month",
            positive: false,
        },
        {
            title: "Avg. Fulfillment Time",
            value: "3.2 Days",
            change: "-0.5 days faster",
            positive: true,
        },
        {
            title: "Stock Turnover",
            value: "5.8",
            change: "Steady performance",
            positive: true,
        },
    ]

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
                <div
                    key={index}
                    className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm"
                >
                    <p className="text-sm text-slate-500 mb-2">
                        {stat.title}
                    </p>

                    <h2 className="text-2xl font-bold text-slate-800 mb-1">
                        {stat.value}
                    </h2>

                    <p
                        className={`text-xs font-medium ${stat.positive
                            ? "text-green-600"
                            : "text-red-500"
                            }`}
                    >
                        {stat.change}
                    </p>
                </div>
            ))}
        </div>
    )
}