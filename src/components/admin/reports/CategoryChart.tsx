"use client"

export default function CategoryChart() {
    return (
        <div className="bg-white p-6 rounded-xl shadow-sm border">

            <h3 className="font-semibold mb-4">Inventory by Category</h3>

            <div className="flex flex-col items-center justify-center h-48">

                <div className="w-32 h-32 rounded-full border-8 border-gray-200 flex items-center justify-center">
                    <span className="font-bold text-lg">12</span>
                </div>

            </div>

            <div className="mt-4 space-y-2 text-sm">

                <div className="flex justify-between">
                    <span>● Sensors & Actuators</span>
                    <span>45%</span>
                </div>

                <div className="flex justify-between">
                    <span>● Integrated Circuits</span>
                    <span>30%</span>
                </div>

                <div className="flex justify-between">
                    <span>● Passive Components</span>
                    <span>25%</span>
                </div>

            </div>

        </div>
    )
}