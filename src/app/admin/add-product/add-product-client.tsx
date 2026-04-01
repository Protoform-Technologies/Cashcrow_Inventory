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

interface Supplier {
    id: string
    company_name: string
    contact_name?: string
    email?: string
    phone?: string
}

interface AddProductClientProps {
    userName: string
    avatarUrl?: string
    products: Product[]
    suppliers: Supplier[]
}

const ITEMS_PER_PAGE = 5

function getStockStatus(quantity: number, minStockLevel: number) {
    if (quantity === 0) return { status: 'Out of Stock', class: 'bg-red-100 text-red-700', trend: 'danger' }
    if (quantity <= minStockLevel) return { status: 'Low Stock', class: 'bg-orange-100 text-orange-700', trend: 'warning' }
    return { status: 'In Stock', class: 'bg-emerald-100 text-emerald-700', trend: 'up' }
}

export default function AddProductClient({ userName, avatarUrl, products, suppliers }: AddProductClientProps) {
    const [showAddForm, setShowAddForm] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [editingProduct, setEditingProduct] = useState<Product | null>(null)
    const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)
    const [isDeleting, setIsDeleting] = useState(false)
    const [localProducts, setLocalProducts] = useState<Product[]>(products)
    const [currentPage, setCurrentPage] = useState(1)

    const totalPages = Math.ceil(localProducts.length / ITEMS_PER_PAGE)
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
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
        <DashboardLayout userName={userName} userRole="Lab Admin" avatarUrl={avatarUrl} title="Add New Product">
            <div className="w-full">
                {/* Title and Button Section */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 mb-2">
                    <div></div>
                    {!showAddForm && (
                        <Button
                            onClick={() => setShowAddForm(true)}
                            className="bg-[var(--color-cashcrow-primary)] hover:bg-[var(--color-cashcrow-primary)]/90 text-white font-semibold py-2.5 md:py-2 px-4 md:px-6 rounded-lg transition-all shadow-md flex items-center justify-center gap-2 w-full sm:w-auto text-sm md:text-base"
                        >
                            <PlusCircle className="w-4 h-4 md:w-5 md:h-5" />
                            <span className="md:hidden lg:inline">Add New Product</span>
                            <span className="hidden md:inline lg:hidden">Add Product</span>
                        </Button>
                    )}
                </div>
                <p className="text-slate-500 text-sm mb-6">Manage your lab inventory and product catalog.</p>

                <div className="space-y-6 md:space-y-8">
                    {showAddForm && (
                        <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
                            <div className="p-4 md:p-6 border-b border-slate-100 flex items-center justify-between">
                                <div>
                                    <h3 className="text-lg font-semibold">Add New Product</h3>
                                    <p className="text-slate-500 text-sm">Fill in the details to add a new product to your inventory.</p>
                                </div>
                                <button onClick={handleCancel} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            <AddProductForm suppliers={suppliers} onSuccess={handleProductAdded} onCancel={handleCancel} />
                        </section>
                    )}

                    {localProducts && localProducts.length > 0 && (
                        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                            <div className="bg-slate-50 border-b border-slate-200 px-3 md:px-6 py-3 md:py-4 flex items-center gap-2 flex-wrap">
                                <Package className="w-4 h-4 md:w-5 md:h-5 text-[var(--color-cashcrow-primary)]" />
                                <h3 className="text-xs md:text-sm font-bold uppercase tracking-wider text-slate-700">Products</h3>
                                <span className="ml-auto text-xs font-bold bg-[var(--color-cashcrow-primary)] text-white px-2 py-0.5 md:px-2.5 md:py-1 rounded-full">
                                    {localProducts.length}
                                </span>
                            </div>
                            {/* Responsive Products Display */}
                            <div className="space-y-4 md:space-y-0">
                                {/* Mobile Cards */}
                                <div className="md:hidden grid grid-cols-1 gap-4 p-2 md:p-0">
                                    {paginatedProducts.map((product) => {
                                        const stockInfo = getStockStatus(product.quantity || 0, product.min_stock_level || 0)
                                        const deleteConfirm = deleteConfirmId === product.id
                                        return (
                                            <div key={product.id} className={`bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md overflow-hidden transition-all ${deleteConfirm ? 'bg-red-50 border-red-200 ring-2 ring-red-200' : ''}`}>
                                                {deleteConfirm ? (
                                                    <div className="p-6">
                                                        <div className="flex flex-col items-center gap-4 text-center">
                                                            <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center">
                                                                <Trash2 className="w-8 h-8 text-red-600" />
                                                            </div>
                                                            <div>
                                                                <h4 className="font-bold text-lg text-slate-900 mb-1">Delete {product.name}?</h4>
                                                                <p className="text-slate-500 text-sm">This action cannot be undone.</p>
                                                            </div>
                                                            <div className="flex gap-3 w-full">
                                                                <Button onClick={confirmDelete} disabled={isDeleting} className="flex-1 bg-red-600 hover:bg-red-700 text-white">
                                                                    {isDeleting ? (
                                                                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                                                                    ) : null}
                                                                    Delete
                                                                </Button>
                                                                <Button onClick={handleCancelDelete} variant="outline" className="flex-1">
                                                                    Cancel
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <>
                                                        {/* Product Image & Name */}
                                                        <div className="p-4 border-b border-slate-100">
                                                            <div className="flex items-start gap-3">
                                                                <div className="shrink-0">
                                                                    {product.image_url ? (
                                                                        <img 
                                                                            src={product.image_url} 
                                                                            alt={product.name} 
                                                                            className="w-16 h-16 rounded-xl object-cover border border-slate-200 shadow-sm" 
                                                                        />
                                                                    ) : (
                                                                        <div className="w-16 h-16 rounded-xl bg-slate-100 flex items-center justify-center border-2 border-dashed border-slate-300">
                                                                            <Package className="w-6 h-6 text-slate-400" />
                                                                        </div>
                                                                    )}
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <h4 className="font-bold text-base text-slate-900 truncate mb-1">{product.name}</h4>
                                                                    <p className="text-xs text-slate-500">SKU: <code className="font-mono bg-slate-100 px-1.5 py-0.5 rounded">{product.sku}</code></p>
                                                                </div>
                                                                <span className={`px-2 py-1 text-[11px] font-black rounded-full uppercase tracking-wider ${stockInfo.class}`}>
                                                                    {stockInfo.status}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {/* Product Details */}
                                                        <div className="p-4 grid grid-cols-2 gap-2 text-xs">
                                                            <div className="space-y-1">
                                                                <span className="text-slate-500 font-bold uppercase tracking-tight text-[10px]">Category</span>
                                                                <span className="font-semibold text-slate-900">{product.category}</span>
                                                            </div>
                                                            <div className="space-y-1">
                                                                <span className="text-slate-500 font-bold uppercase tracking-tight text-[10px]">Location</span>
                                                                <span className="font-semibold text-slate-900">{product.shelf_code}/{product.box_code}</span>
                                                            </div>
                                                            <div className="space-y-1 col-span-2">
                                                                <span className="text-slate-500 font-bold uppercase tracking-tight text-[10px]">Qty</span>
                                                                <span className={`font-black text-lg ${stockInfo.trend === 'warning' ? 'text-orange-600' : stockInfo.trend === 'danger' ? 'text-red-600' : 'text-emerald-600'}`}>
                                                                    {product.quantity || 0}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {/* Actions */}
                                                        <div className="px-4 pb-4 pt-2 flex gap-2">
                                                            <button 
                                                                onClick={() => handleEdit(product)}
                                                                className="flex-1 p-3 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-all flex items-center justify-center gap-2 hover:border-primary hover:shadow-sm"
                                                            >
                                                                <Pencil className="w-4 h-4" />
                                                                Edit
                                                            </button>
                                                            <button 
                                                                onClick={() => handleDelete(product.id)}
                                                                className="flex-1 p-3 bg-red-50 border border-red-200 rounded-xl text-sm font-medium text-red-700 hover:bg-red-100 transition-all flex items-center justify-center gap-2"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Desktop Table */}
                                <div className="hidden md:block overflow-x-auto">
                                    <table className="w-full">
                                        <thead>
                                            <tr className="bg-slate-50/50 text-slate-500 text-xs uppercase tracking-wider font-black border-b border-slate-100">
                                                <th className="px-6 py-4 w-[25%]">Item</th>
                                                <th className="px-6 py-4 w-[12%]">Cat</th>
                                                <th className="px-6 py-4 w-[12%]">SKU</th>
                                                <th className="px-6 py-4 w-[12%]">Loc</th>
                                                <th className="px-6 py-4 w-[10%] text-right">Qty</th>
                                                <th className="px-6 py-4 w-[12%] text-center">Status</th>
                                                <th className="px-6 py-4 w-[17%] text-right">Actions</th>
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
                                                                        <Button onClick={handleCancelDelete} variant="outline" size="sm">
                                                                            Cancel
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )
                                                }

                                                return (
                                                    <tr key={product.id} className="hover:bg-slate-50/50 group">
                                                        <td className="px-6 py-5">
                                                            <div className="flex items-center gap-3">
                                                                {product.image_url ? (
                                                                    <img src={product.image_url} alt={product.name} className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0" />
                                                                ) : (
                                                                    <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                                                                        <Package className="w-5 h-5 text-slate-400" />
                                                                    </div>
                                                                )}
                                                                <p className="font-bold text-sm truncate max-w-[120px] group-hover:text-primary">{product.name}</p>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-5">
                                                            <span className="text-sm font-medium bg-slate-100 px-2 py-1 rounded-lg text-slate-600">{product.category}</span>
                                                        </td>
                                                        <td className="px-6 py-5">
                                                            <code className="text-xs bg-slate-50 border border-slate-200 px-2 py-1 rounded-md font-mono">{product.sku}</code>
                                                        </td>
                                                        <td className="px-6 py-5">
                                                            <div className="text-sm text-slate-600">
                                                                <span className="font-semibold">{product.shelf_code}</span>/{product.box_code}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-5 text-right">
                                                            <span className={`font-black text-base ${stockInfo.trend === 'warning' ? 'text-orange-600' : stockInfo.trend === 'danger' ? 'text-red-600' : 'text-emerald-600'}`}>
                                                                {product.quantity || 0}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-5 text-center">
                                                            <span className={`px-3 py-1 text-xs font-black rounded-full uppercase tracking-wider ${stockInfo.class}`}>
                                                                {stockInfo.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-5 text-right">
                                                            <div className="flex justify-end gap-2">
                                                                <button onClick={() => handleEdit(product)} className="p-2 text-slate-400 hover:text-primary hover:bg-slate-50 rounded-lg transition-colors">
                                                                    <Pencil className="w-5 h-5" />
                                                                </button>
                                                                <button onClick={() => handleDelete(product.id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-slate-50 rounded-lg transition-colors">
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
                                    <div className="p-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500 bg-slate-50">
                                        <p>Showing {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, localProducts.length)} of {localProducts.length} products</p>
                                        <div className="flex gap-1">
                                            <button 
                                                onClick={() => handlePageChange(currentPage - 1)} 
                                                disabled={currentPage === 1}
                                                className="px-3 py-1.5 border rounded-lg hover:bg-slate-50 disabled:opacity-50 flex items-center gap-1 border-slate-200 disabled:border-slate-200"
                                            >
                                                <ChevronLeft className="w-4 h-4" />
                                                Previous
                                            </button>
                                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                                                <button
                                                    key={page}
                                                    onClick={() => handlePageChange(page)}
                                                    className={`px-3 py-1.5 border rounded-lg transition-colors font-medium ${
                                                        currentPage === page
                                                            ? 'bg-[var(--color-cashcrow-primary)] text-white border-[var(--color-cashcrow-primary)]'
                                                            : 'border-slate-200 hover:bg-slate-50'
                                                    }`}
                                                >
                                                    {page}
                                                </button>
                                            ))}
                                            <button 
                                                onClick={() => handlePageChange(currentPage + 1)} 
                                                disabled={currentPage === totalPages}
                                                className="px-3 py-1.5 border rounded-lg hover:bg-slate-50 disabled:opacity-50 flex items-center gap-1 border-slate-200 disabled:border-slate-200"
                                            >
                                                Next
                                                <ChevronRight className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {(!localProducts || localProducts.length === 0) && (
                        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-12 text-center animate-in fade-in">
                            <Package className="w-12 h-12 text-slate-300 mx-auto mb-6" />
                            <h3 className="text-xl font-bold text-slate-900 mb-2">No Products Yet</h3>
                            <p className="text-slate-500 text-sm mb-6 max-w-md mx-auto">Your inventory is empty. Click "Add New Product" to get started.</p>
                            <Button onClick={() => setShowAddForm(true)} className="bg-[var(--color-cashcrow-primary)] hover:bg-[var(--color-cashcrow-primary)]/90">
                                <PlusCircle className="w-4 h-4 mr-2" />
                                Add First Product
                            </Button>
                        </div>
                    )}
                </div>

                {showEditModal && editingProduct && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                            <div className="sticky top-0 z-10 bg-white border-b border-slate-200 p-6 flex items-center justify-between">
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900">Edit Product</h3>
                                    <p className="text-slate-500 mt-1">Update the product details below.</p>
                                </div>
                                <button 
                                    onClick={handleEditClose}
                                    className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            <div className="p-6">
                                <EditProductForm 
                                    product={editingProduct} 
                                    onSuccess={handleEditSuccess} 
                                    onCancel={handleEditClose} 
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    )
}
