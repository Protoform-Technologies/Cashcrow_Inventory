import { createServerSupabaseClient, getSupabaseAdmin } from '@/lib/supabase'
import { redirect } from 'next/navigation'
import { getProducts } from '@/actions/products'
import { getSuppliers } from '@/actions/suppliers'
import AddProductClient from './add-product-client'

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

    const fullName = `${profile.first_name} ${profile.last_name}`

    // Fetch existing products
    const { products } = await getProducts(1, 100) // Get first 100 products
    const { suppliers } = await getSuppliers(1, 100)

    return <AddProductClient userName={fullName} products={products || []} suppliers={suppliers || []} />
}
