"use server";

/**
 * Sample server action for inventory management.
 * Demonstrate how to write backend code in the actions folder.
 */

export async function searchInventoryItems(query: string) {
    // Simulate a database delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Sample data
    const items = [
        { id: "1", name: "Premium Cashcrow Wallet", stock: 42, price: 120 },
        { id: "2", name: "Executive Stock Ledger", stock: 15, price: 85 },
        { id: "3", name: "Asset Tracking Sensor", stock: 105, price: 45 },
    ];

    if (!query) return items;

    return items.filter((item) =>
        item.name.toLowerCase().includes(query.toLowerCase())
    );
}

export async function updateStockLevel(itemId: string, newLevel: number) {
    // Logic to update database would go here
    console.log(`Updating item ${itemId} to stock level ${newLevel}`);

    return { success: true, message: "Inventory updated successfully" };
}
