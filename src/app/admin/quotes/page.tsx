import { Metadata } from 'next'
import { getAdminProfileOrRedirect } from '@/actions/auth'
import { getProductsForDropdown } from '@/actions/products'
import { getSuppliers } from '@/actions/suppliers'
import { getRecentQuotes } from '@/actions/quotes'
import { getMembers } from '@/actions/members'
import RequestQuoteForm from '@/components/admin/quotes/request-quote-form'
import DashboardLayout from '@/components/shared/dashboard/layout'

export const metadata: Metadata = {
    title: 'Audit Registry | Cashcrow',
    description: 'Manage and update formal procurement traces and quote requests.',
}

export default async function RequestQuotePage() {
    const profile = await getAdminProfileOrRedirect()

    const [products, suppliersData, recentQuotes, members] = await Promise.all([
        getProductsForDropdown(),
        getSuppliers(1, 100),
        getRecentQuotes(),
        getMembers()
    ])

    const suppliers = suppliersData.suppliers || []
    const fullName = `${profile.first_name} ${profile.last_name}`

    return (
        <DashboardLayout
            userName={fullName}
            userRole="Admin"
            userId={profile.id}
            avatarUrl={profile.avatar_url}
            title="Request Quote"
        >
            <div className="max-w-7xl mx-auto">
                <RequestQuoteForm
                    products={products}
                    suppliers={suppliers}
                    members={members}
                    initialRecentQuotes={recentQuotes}
                />
            </div>
        </DashboardLayout>
    )
}