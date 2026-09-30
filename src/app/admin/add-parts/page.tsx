import { getSuppliers } from '@/actions/suppliers'
import { getProjects } from '@/actions/projects'
import AddPartForm from '@/components/admin/parts/add-part-form'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Add Parts | Cashcrow',
    description: 'Register new inventory items and manage stock levels.',
}

export default async function AddPartsPage() {
    // Fetch suppliers and projects for the part form (in parallel)
    const [{ suppliers }, projects] = await Promise.all([
        getSuppliers(1, 200),
        getProjects(),
    ])

    return (
        <div className="w-full space-y-6">
            <div>
                <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Onboard New Parts</h2>
                <p className="text-slate-500 font-medium">
                    Fill in the details below to add new inventory items to the system.
                </p>
            </div>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 md:p-10">
                <AddPartForm suppliers={suppliers || []} projects={projects || []} />
            </div>
        </div>
    )
}
