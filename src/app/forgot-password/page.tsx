import BrandingSection from "@/components/auth/branding-section"
import ForgotPasswordSection from "@/components/auth/forgot-password-section"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: 'Forgot Password | Cashcrow',
    description: 'Reset your Cashcrow account password to regain access to your inventory management dashboard.',
}

export default function ForgotPasswordPage() {
    return (
        <main className="flex min-h-screen bg-white">
            <BrandingSection />
            <ForgotPasswordSection />
        </main>
    )
}
