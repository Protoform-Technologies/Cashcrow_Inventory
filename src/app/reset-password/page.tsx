import BrandingSection from "@/components/auth/branding-section"
import ResetPasswordSection from "@/components/auth/reset-password-section"
import { Metadata } from "next"

export const metadata: Metadata = {
    title: 'Reset Password | Cashcrow',
    description: 'Create a new, secure password for your Cashcrow account.',
}

export default function ResetPasswordPage() {
    return (
        <main className="flex min-h-screen bg-white">
            <BrandingSection />
            <ResetPasswordSection />
        </main>
    )
}
