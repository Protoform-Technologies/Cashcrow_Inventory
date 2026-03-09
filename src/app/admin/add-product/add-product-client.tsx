'use client'

import { useState } from 'react'
import DashboardLayout from '@/components/dashboard/layout'
import AddProductForm from '@/components/dashboard/add-product-form'
import EditProductForm from '@/components/dashboard/edit-product-form'
import { deleteProduct } from '@/actions/products'
import { ChevronRight, Package, PlusCircle, X, Pencil, Trash2, Loader2, ChevronLeft } from "lucide-react"
import { Button } from '@/components/ui/button'

interface Vendor {
    name: string
    fund: string
    link: string
}

interface Product {
    id: string
    name: string
    sku: string
    category: string
    shelf_code: string
    box_code: string
    quantity: number
    min_stock_level: number
    notes?: string
    image_url?: string
    vendors?: Vendor[]
}

interface AddProductClientProps {
    userName: string
    products: Product[]
}

const ITEMS_PER_PAGE = 5

function getStockStatus(quantity: number, minStockLevel: number) {
    if (quantity === 0) return { status: 'Out of Stock', class: 'bg-red-100 text-red-700', trend: 'danger' }
    if (quantity <= minStockLevel) return { status: 'Low Stock', class: 'bg-orange-100 text-orange-700', trend: 'warning' }
    return { status: 'In Stock', class: 'bg-emerald-100 text-emerald-700', trend: 'up' }
}

export default function AddProductClient({ userName, products }: AddProductClientProps) {
    const [showAddForm, setShowAddForm] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [editingProduct, setEditingProduct] = useState<Product | null>(null)
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)
    const [localProducts, setLocalProducts] = useState<Product[]>(products)
    const [currentPage, setCurrentPage] = useState(1)

    const totalPages = Math.ceil(localProducts.length / ITEMS_PER_PAGE)
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const paginatedProducts = localProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE)

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }

    const handleSuccess = () => {
        setShowAddForm(false)
    }

    const handleCancel = () => {
        setShowAddForm(false)
    }

    const handleProductAdded = () => {
        window.location.reload()
    }

    const handleEdit = (product: Product) => {
        setEditingProduct(product)
        setShowEditModal(true)
    }

    const handleEditClose = () => {
        setShowEditModal(false)
        setEditingProduct(null)
    }

    const handleEditSuccess = () => {
        setShowEditModal(false)
        setEditingProduct(null)
        window.location.reload()
    }

    const handleDelete = (id: string) => {
        setDeleteConfirmId(id)
    }

    const confirmDelete = async () => {
        if (!deleteConfirmId) return
        setIsDeleting(true)
        const result = await deleteProduct(deleteConfirmId)
        if (result?.success) {
            setLocalProducts(prev => prev.filter(p => p.id !== deleteConfirmId))
        }
        setDeleteConfirmId(null)
        setIsDeleting(false)
    }

    const handleCancelDelete = () => {
        setDeleteConfirmId(null)
    }

    return (
        <DashboardLayout userName={userName} userRole="Lab Admin" title="Add New Product">
            <header className="px-4 md:px-8 py-4 md:py-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div></div>
                    {!showAddForm && (
                        <Button
                            onClick={() => setShowAddForm(true)}
                            className="bg-[var(--color-cashcrow-primary)] hover:bg-[var(--color-cashcrow-primary)]/90 text-white font-semibold py-2 px-4 md:px-6 rounded-lg transition-all shadow-md flex items-center justify-center gap-2 w-full sm:w-auto"
                        >
                            <PlusCircle className="w-5 h-5" />
                            <span className="md:hidden lg:inline">Add New Product</span>
                            <span className="hidden md:inline lg:hidden">Add Product</span>
                        </Button>
                    )}
                </div>
                <p className="text-slate-500 text-sm mt-2">Manage your lab inventory and product catalog.</p>
            </header>

            <div className="px-4 md:px-8 pb-8 max-w-6xl mx-auto space-y-6 md:space-y-8">
                {showAddForm && (
                    <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold">Add New Product</h3>
                                <p className="text-slate-500 text-sm">Fill in the details to add a new product to your inventory.</p>
                            </div>
                            <button onClick={handleCancel} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <AddProductForm onSuccess={handleProductAdded} onCancel={handleCancel} />
                    </section>
                )}

                {localProducts && localProducts.length > 0 && (
                    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                        <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex items-center gap-2">
                            <Package className="w-5 h-5 text-[var(--color-cashcrow-primary)]" />
                            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-700">Existing Products in Inventory</h3>
                            <span className="ml-auto text-xs font-bold bg-[var(--color-cashcrow-primary)] text-white px-2.5 py-1 rounded-full">
                                {localProducts.length}
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
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {paginatedProducts.map((product) => {
                                        const stockInfo = getStockStatus(product.quantity || 0, product.min_stock_level || 0)
                                        
                                        if (deleteConfirmId === product.id) {
                                            return (
                                                <tr key={product.id} className="bg-red-50">
                                                    <td colSpan={7} className="px-6 py-4">
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center">
                                                                    <Trash2 className="w-5 h-5" />
                                                                </div>
                                                                <p className="font-medium text-red-600">Delete {product.name}?</p>
                                                            </div>
                                                            <div className="flex gap-2">
                                                                <Button onClick={confirmDelete} disabled={isDeleting} size="sm" className="bg-red-600 hover:bg-red-700 text-white">
                                                                    {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Delete'}
                                                                </Button>
                                                                <Button onClick={handleCancelDelete} variant="outline" size="sm">Cancel</Button>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )
                                        }
                                        
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
                                                    <code className="text-[11px] bg-slate-50 border border-slate-200 text-slate-500 px-2 py-1 rounded-md font-mono">{product.sku}</code>
                                                </td>
                                                <td className="px-6 py-5">
                                                    <div className="flex items-center gap-1 text-sm text-slate-600">
                                                        <span className="font-semibold">{product.shelf_code}</span>
                                                        <span className="text-slate-400">/</span>
                                                        <span>{product.box_code}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-5 text-right">
                                                    <span className={`font-black ${stockInfo.trend === 'warning' ? 'text-orange-600' : stockInfo.trend === 'danger' ? 'text-red-600' : 'text-slate-900'}`}>{product.quantity || 0}</span>
                                                </td>
                                                <td className="px-6 py-5 text-center">
                                                    <span className={`px-3 py-1 text-[10px] font-black rounded-full uppercase tracking-wider ${stockInfo.class}`}>{stockInfo.status}</span>
                                                </td>
                                                <td className="px-6 py-5 text-right">
                                                    <div className="flex justify-end gap-2">
                                                        <button onClick={() => handleEdit(product)} className="p-2 text-slate-400 hover:text-primary transition-colors">
                                                            <Pencil className="w-5 h-5" />
                                                        </button>
                                                        <button onClick={() => handleDelete(product.id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                                                            <Trash2 className="w-5 h-5" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {totalPages > 1 && (
                            <div className="p-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
                                <p>Showing {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, localProducts.length)} of {localProducts.length} products</p>
                                <div className="flex gap-2">
                                    <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="px-3 py-1 border border-slate-200 rounded hover:bg-slate-50 transition-colors disabled:opacity-50 flex items-center gap-1">
                                        <ChevronLeft className="w-4 h-4" />
                                        Previous
                                    </button>
                                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                        <button key={page} onClick={() => handlePageChange(page)} className={`px-3 py-1 border rounded transition-colors ${currentPage === page ? 'bg-[var(--color-cashcrow-primary)] text-white border-[var(--color-cashcrow-primary)]' : 'border-slate-200 hover:bg-slate-50'}`}>
                                            {page}
                                        </button>
                                    ))}
                                    <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="px-3 py-1 border border-slate-200 rounded hover:bg-slate-50 transition-colors disabled:opacity-50 flex items-center gap-1">
                                        Next
                                        <ChevronRight className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {localProducts && localProducts.length === 0 && (
                    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-12 text-center">
                        <Package className="w-12 h-12 text-slate-300 mx-auto mb-4" />
                        <h3 className="text-lg font-bold text-slate-700 mb-2">No Products Yet</h3>
                        <p className="text-slate-500 text-sm">Your inventory is empty. Click "Add New Product" to get started.</p>
                    </div>
                )}
            </div>

            {showEditModal && editingProduct && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto m-4">
                        <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold">Edit Product</h3>
                                <p className="text-slate-500 text-sm">Update the product details below.</p>
                            </div>
                            <button onClick={handleEditClose} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <div className="p-6">
                            <EditProductForm product={editingProduct} onSuccess={handleEditSuccess} onCancel={handleEditClose} />
                        </div>
                    </div>
                </div>
            )}
        </DashboardLayout>
    )
}

