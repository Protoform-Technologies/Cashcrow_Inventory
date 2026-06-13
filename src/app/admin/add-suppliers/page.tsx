import AddSupplierForm from '@/components/admin/suppliers/add-supplier-form'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Add Suppliers | Cashcrow',
    description: 'Onboard new inventory source partners and manage procurement logistics.',
}

export default function AddSuppliersPage() {
    return (
        <div className="w-full space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Onboard New Supplier</h2>
                <p className="text-slate-500 font-medium">
                    Fill in the details below to register a new vendor.
                </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-10">
                <AddSupplierForm />
            </div>
        </div>
    )
}
