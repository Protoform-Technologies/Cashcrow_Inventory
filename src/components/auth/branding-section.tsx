import Image from "next/image"

export default function BrandingSection() {
    return (
        <div className="relative hidden lg:flex lg:w-1/2 flex-col items-center justify-center bg-[var(--color-cashcrow-primary)] p-12 overflow-hidden">

            {/* Background Decoration */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-[var(--color-cashcrow-accent)] blur-[120px]"></div>
                <div className="absolute bottom-[-5%] right-[-5%] w-[30%] h-[30%] rounded-full bg-white blur-[100px]"></div>
                <div
                    className="absolute inset-0"
                    style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(255,255,255,0.05) 1px, transparent 0)', backgroundSize: '40px 40px' }}
                ></div>
            </div>

            <div className="relative z-10 flex flex-col items-center gap-8">
                <div className="relative w-[320px] h-[320px] drop-shadow-2xl">
                    <Image
                        src="/Cashcrow_Logo_Branding.png"
                        alt="Cashcrow Logo"
                        fill
                        className="object-contain"
                        priority
                    />
                </div>
                <span className="text-[var(--color-cashcrow-accent)] text-xl font-medium uppercase tracking-[0.2em]">Protoform Technologies</span>
            </div>
        </div>
    )
}
