import { createServerSupabaseClient, getSupabaseAdmin } from '@/lib/supabase'
import { redirect } from 'next/navigation'
import DashboardLayout from '@/components/dashboard/layout'
import AddProductForm from '@/components/dashboard/add-product-form'
import { ChevronRight, Package, AlertTriangle, AlertCircle } from "lucide-react"
import { getProducts } from '@/actions/products'

// Helper function to determine stock status
function getStockStatus(quantity: number, minStockLevel: number) {
    if (quantity === 0) return { status: 'Out of Stock', class: 'bg-red-100 text-red-700', trend: 'danger' }
    if (quantity <= minStockLevel) return { status: 'Low Stock', class: 'bg-orange-100 text-orange-700', trend: 'warning' }
    return { status: 'In Stock', class: 'bg-emerald-100 text-emerald-700', trend: 'up' }
}

export default async function AddProductPage() {
    const supabase = await createServerSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/')
    }

    const adminClient = getSupabaseAdmin()
    const { data: profile } = await adminClient
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    if (!profile || profile.role?.toUpperCase() !== 'ADMIN') {
        redirect('/')
    }

    // Fetch existing products
    const { products } = await getProducts(1, 100) // Get first 100 products

    const fullName = `${profile.first_name} ${profile.last_name}`

    return (
        <DashboardLayout userName={fullName} userRole="Lab Admin" title="Add New Product">
            <div className="flex items-center gap-2 mb-8 text-sm">
                <span className="text-slate-500 font-semibold">Parts</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
                <h2 className="text-slate-900 font-bold tracking-tight">Add New Product</h2>
            </div>

            <AddProductForm />

            {/* Existing Products Table */}
            {products && products.length > 0 && (
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm mb-8 overflow-hidden">
                    <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center gap-2">
                        <Package className="w-5 h-5 text-[var(--color-cashcrow-primary)]" />
                        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">Existing Products in Inventory</h3>
                        <span className="ml-auto text-xs font-bold bg-[var(--color-cashcrow-primary)] text-white px-2.5 py-1 rounded-full">
                            {products.length}
                        </span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 text-slate-500 text-[10px] uppercase tracking-[0.15em] font-black border-b border-slate-100">
                                    <th className="px-6 py-4">Item Name</th>
                                    <th className="px-6 py-4">Category</th>
                                    <th className="px-6 py-4">SKU</th>
                                    <th className="px-6 py-4">Location</th>
                                    <th className="px-6 py-4 text-right">Qty</th>
                                    <th className="px-6 py-4 text-center">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {products.map((product: any) => {
                                    const stockInfo = getStockStatus(product.quantity || 0, product.min_stock_level || 0)
                                    return (
                                        <tr key={product.id} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-3">
                                                    {product.image_url ? (
                                                        <img src={product.image_url} alt={product.name} className="w-10 h-10 rounded-lg object-cover border border-slate-200" />
                                                    ) : (
                                                        <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                                                            <Package className="w-5 h-5 text-slate-400" />
                                                        </div>
                                                    )}
                                                    <p className="font-bold text-slate-900 group-hover:text-[var(--color-cashcrow-primary)] transition-colors">{product.name}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5">
                                                <span className="text-sm text-slate-600 font-medium bg-slate-100 px-2 py-1 rounded-lg">{product.category}</span>
                                            </td>
                                            <td className="px-6 py-5">
                                                <code className="text-[11px] bg-slate-50 border border-slate-200 text-slate-500 px-2 py-1 rounded-md font-mono">
                                                    {product.sku}
                                                </code>
                                            </td>
                                            <td className="px-6 py-5">
                                                <div className="flex items-center gap-1 text-sm text-slate-600">
                                                    <span className="font-semibold">{product.shelf_code}</span>
                                                    <span className="text-slate-400">/</span>
                                                    <span>{product.box_code}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 text-right">
                                                <span className={`font-black ${stockInfo.trend === 'warning' ? 'text-orange-600' :
                                                    stockInfo.trend === 'danger' ? 'text-red-600' :
                                                        'text-slate-900'
                                                    }`}>{product.quantity || 0}</span>
                                            </td>
                                            <td className="px-6 py-5 text-center">
                                                <span className={`px-3 py-1 text-[10px] font-black rounded-full uppercase tracking-wider ${stockInfo.class}`}>
                                                    {stockInfo.status}
                                                </span>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Show empty state if no products exist */}
            {products && products.length === 0 && (
                <div className="bg-white border border-slate-200 rounded-2xl shadow-sm mb-8 p-12 text-center">
                    <Package className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                    <h3 className="text-lg font-bold text-slate-700 mb-2">No Products Yet</h3>
                    <p className="text-slate-500 text-sm">Your inventory is empty. Add your first product using the form above.</p>
                </div>
            )}
        </DashboardLayout>
    )
}
