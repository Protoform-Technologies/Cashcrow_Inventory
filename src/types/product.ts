export interface Product {
    id: string
    name: string
    sku: string
    category: string
    shelf_code: string
    box_code: string
    quantity: number
    min_stock_level: number
    notes: string
    image_url: string | null
    data_sheet_url?: string | null
    vendors: { fund?: string; link?: string; name?: string }[] | null
    initial_quantity: number
    unit_of_measurement: string | null
    created_at: string
    updated_at: string
    is_deleted?: boolean
}
