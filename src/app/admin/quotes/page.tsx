import { getAdminProfileOrRedirect } from '@/actions/auth'
import { getProductsForDropdown } from '@/actions/products'
import { getSuppliers } from '@/actions/suppliers'
import { getRecentQuotes } from '@/actions/quotes'
import RequestQuoteForm from '@/components/member/requests/request-quote-form'
import DashboardLayout from '@/components/shared/dashboard/layout'

export default async function RequestQuotePage() {
    const profile = await getAdminProfileOrRedirect()
    const [products, suppliersData, recentQuotes] = await Promise.all([
        getProductsForDropdown(),
        getSuppliers(1, 100),
        getRecentQuotes()
    ])

    const suppliers = suppliersData.suppliers || []
    const fullName = `${profile.first_name} ${profile.last_name}`

    return (
        <DashboardLayout 
            userName={fullName} 
            userRole="Lab Admin" 
            avatarUrl={profile.avatar_url}
            title="Request Quote"
        >
            <div className="max-w-7xl mx-auto">
                <RequestQuoteForm 
                    products={products} 
                    suppliers={suppliers} 
                    initialRecentQuotes={recentQuotes} 
                />
            </div>
        </DashboardLayout>
    )
}
