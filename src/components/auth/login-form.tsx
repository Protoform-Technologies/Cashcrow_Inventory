import BrandingSection from "./branding-section"
import AuthSection from "./auth-section"

export default function LoginForm() {
    return (
        <div className="flex min-h-screen w-full flex-col lg:flex-row">
            <BrandingSection />
            <AuthSection />
        </div>
    )
}
