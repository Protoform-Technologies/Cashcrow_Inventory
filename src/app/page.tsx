import type { Metadata } from 'next'
import LoginForm from '@/components/auth/login-form'

export const metadata: Metadata = {
    title: 'Login | Cashcrow Lab Inventory Management',
    description: 'Precision inventory management for modern science. Streamline your research workflow with our advanced asset tracking system.',
}

export default function LoginPage() {
    return <LoginForm />
}
