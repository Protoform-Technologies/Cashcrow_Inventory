export async function fetchReportData() {
    return {
        stats: [
            { title: "Total Inventory Value", value: "$428,500.00", change: "+2.4% vs last month", positive: true },
            { title: "Monthly Consumption", value: "14.2%", change: "-1.1% vs last month", positive: false },
            { title: "Avg. Fulfillment Time", value: "3.2 Days", change: "-0.5 days faster", positive: true },
            { title: "Stock Turnover", value: "5.8", change: "Steady performance", positive: true }
        ],

        topParts: [
            {
                sku: "ESP32-001",
                name: "ESP32-WROOM-32E",
                desc: "Wi-Fi + BT SoC Module",
                category: "Processors",
                usage: "1,240",
                status: "LOW STOCK"
            }
        ]
    }
}