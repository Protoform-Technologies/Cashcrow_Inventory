export const reportStats = [
  {
    label: "Total Inventory Value",
    value: "₹428,500.00",
    trend: "+2.4% vs last month",
    trendType: "up",
    icon: "payments",
  },
  {
    label: "Monthly Consumption",
    value: "14.2%",
    trend: "-1.1% vs last month",
    trendType: "down-good", // down is good for consumption usually
    icon: "monitoring",
  },
  {
    label: "Avg. Fulfillment Time",
    value: "3.2 Days",
    trend: "-0.5 days faster",
    trendType: "down-good", // down is good for time
    icon: "speed",
  },
  {
    label: "Stock Turnover",
    value: "5.8",
    trend: "Steady performance",
    trendType: "neutral",
    icon: "autorenew",
  },
];

export const stockMovementData = [
  { name: "Week 1", inbound: 400, outbound: 240 },
  { name: "Week 2", inbound: 300, outbound: 139 },
  { name: "Week 3", inbound: 200, outbound: 980 },
  { name: "Week 4", inbound: 278, outbound: 390 },
];

export const inventoryByCategoryData = [
  { name: "Sensors & Actuators", value: 45, color: "#265035" },
  { name: "Integrated Circuits", value: 30, color: "#3d7a52" },
  { name: "Passive Components", value: 25, color: "#54a370" },
];

export const topUsedParts = [
  {
    sku: "IC-ESP32-W-01",
    name: "ESP32-WROOM-32E",
    description: "Wi-Fi + BT SoC Module",
    category: "Processors",
    usage: "1,240",
    status: "Low Stock",
    statusColor: "red",
  },
  {
    sku: "SEN-BMP-280-S",
    name: "BMP280 Barometric Sensor",
    description: "Pressure and Temperature",
    category: "Sensors",
    usage: "892",
    status: "Stable",
    statusColor: "green",
  },
  {
    sku: "CON-SMA-04-F",
    name: "SMA Connector Female",
    description: "Right Angle, PCB Mount",
    category: "Hardware",
    usage: "534",
    status: "High Demand",
    statusColor: "blue",
  },
  {
    sku: "RES-0805-10K-F",
    name: "10k Ohm Resistor 0805",
    description: "1% Precision SMD",
    category: "Passives",
    usage: "4,120",
    status: "Stable",
    statusColor: "green",
  },
];
