import { createServerSupabaseClient, getSupabaseAdmin } from '@/lib/supabase'
import { redirect } from 'next/navigation'
import DashboardLayout from '@/components/dashboard/layout'
import { getProducts } from '@/actions/products'
import Link from 'next/link'
import { PlusCircle, Search, ArrowLeft, ArrowRight, PackageOpen } from 'lucide-react'

export default async function PartsPage(props: { searchParams: Promise<{ page?: string }> }) {
    const searchParams = await props.searchParams;
    const page = Number(searchParams.page) || 1
    const limit = 6

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

    const fullName = `${profile.first_name} ${profile.last_name}`
    const { products, count } = await getProducts(page, limit)
    const totalPages = Math.ceil(count / limit)

    return (
        <DashboardLayout userName={fullName} userRole="Lab Admin" title="Inventory Parts">

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                <div>
                    <h2 className="text-2xl font-black text-slate-900 tracking-tight">Parts Inventory</h2>
                    <p className="text-slate-500 font-medium mt-1">Manage and track your laboratory parts</p>
                </div>
                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="relative flex-1 sm:w-64">
                        <input
                            type="text"
                            placeholder="Search parts..."
                            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-cashcrow-primary)]/20 focus:border-[var(--color-cashcrow-primary)]"
                        />
                        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    </div>
                    <Link href="/admin/add-product" className="shrink-0 flex items-center gap-2 bg-[var(--color-cashcrow-primary)] hover:bg-[var(--color-cashcrow-lightgreen)] text-white px-4 py-2 rounded-xl font-bold text-sm shadow-md transition-colors">
                        <PlusCircle className="w-4 h-4" />
                        Add Part
                    </Link>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
                {products.length === 0 ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100 shadow-inner">
                            <PackageOpen className="w-8 h-8 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-800 mb-1">No parts found</h3>
                        <p className="text-slate-500 max-w-sm mb-6">You haven't added any parts to the inventory yet. Start by adding your first product.</p>
                        <Link href="/admin/add-product" className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-2.5 rounded-lg font-bold text-sm transition-colors">
                            <PlusCircle className="w-4 h-4" />
                            Add First Part
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 font-bold">
                                        <th className="px-6 py-4">Part Details</th>
                                        <th className="px-6 py-4">SKU / Code</th>
                                        <th className="px-6 py-4">Location</th>
                                        <th className="px-6 py-4 text-right">Quantity</th>
                                        <th className="px-6 py-4 text-right">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {products.map(product => (
                                        <tr key={product.id} className="hover:bg-slate-50/50 transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-lg border border-slate-200 bg-slate-100 overflow-hidden shrink-0 flex items-center justify-center">
                                                        {product.image_url ? (
                                                            <img src={product.image_url} alt={product.part_name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <PackageOpen className="w-6 h-6 text-slate-400" />
                                                        )}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-slate-800 text-sm">{product.part_name}</p>
                                                        <p className="text-xs font-medium text-slate-500 mt-0.5">{product.category}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 font-mono text-xs font-semibold border border-slate-200">
                                                    {product.sku}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-sm font-semibold text-slate-800">Shelf {product.shelf_code}</p>
                                                <p className="text-xs text-slate-500 mt-0.5">Box {product.box_code}</p>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <p className="text-sm font-bold text-slate-800">{product.quantity}</p>
                                                <p className="text-xs text-slate-500 mt-0.5">{product.unit_of_measurement}</p>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                {product.quantity <= product.min_stock_level ? (
                                                    <span className="inline-flex items-center px-2 py-1 rounded-md bg-red-50 text-red-700 text-xs font-bold ring-1 ring-red-200">
                                                        Low Stock
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center px-2 py-1 rounded-md bg-green-50 text-green-700 text-xs font-bold ring-1 ring-green-200">
                                                        In Stock
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        <div className="mt-auto p-4 border-t border-slate-200 flex items-center justify-between bg-slate-50">
                            <p className="text-sm font-medium text-slate-500">
                                Showing <span className="font-bold text-slate-800">{(page - 1) * limit + 1}</span> to <span className="font-bold text-slate-800">{Math.min(page * limit, count)}</span> of <span className="font-bold text-slate-800">{count}</span> results
                            </p>
                            <div className="flex items-center gap-2">
                                <Link
                                    href={`/admin/parts?page=${Math.max(1, page - 1)}`}
                                    className={`p-2 rounded-lg border border-slate-200 hover:bg-white text-slate-600 transition-colors ${page === 1 ? 'opacity-50 pointer-events-none' : ''}`}
                                >
                                    <ArrowLeft className="w-4 h-4" />
                                </Link>
                                <div className="hidden sm:flex items-center gap-1">
                                    {Array.from({ length: totalPages }).map((_, i) => (
                                        <Link
                                            key={i}
                                            href={`/admin/parts?page=${i + 1}`}
                                            className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-bold transition-colors ${page === i + 1 ? 'bg-[var(--color-cashcrow-primary)] text-white' : 'hover:bg-slate-200 text-slate-600'}`}
                                        >
                                            {i + 1}
                                        </Link>
                                    ))}
                                </div>
                                <Link
                                    href={`/admin/parts?page=${Math.min(totalPages, page + 1)}`}
                                    className={`p-2 rounded-lg border border-slate-200 hover:bg-white text-slate-600 transition-colors ${page >= totalPages ? 'opacity-50 pointer-events-none' : ''}`}
                                >
                                    <ArrowRight className="w-4 h-4" />
                                </Link>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </DashboardLayout>
    )
}
