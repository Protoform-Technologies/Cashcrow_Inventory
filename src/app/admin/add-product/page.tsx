import { getAdminProfileOrRedirect } from '@/actions/auth'
import { getProducts } from '@/actions/products'
import { getSuppliers } from '@/actions/suppliers'
import AddProductClient from './add-product-client'

export default async function AddProductPage() {
    const profile = await getAdminProfileOrRedirect()

    const fullName = `${profile.first_name} ${profile.last_name}`

    // Fetch existing products
    const { products } = await getProducts(1, 100) // Get first 100 products
    const { suppliers } = await getSuppliers(1, 100)

    return <AddProductClient userName={fullName} products={products || []} suppliers={suppliers || []} />
}
