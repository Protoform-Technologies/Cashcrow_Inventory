import { Loader2 } from 'lucide-react'

export default function PageLoader() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] animate-in fade-in zoom-in-95 duration-500">
            <div className="w-16 h-16 bg-[var(--color-cashcrow-secondary)] rounded-2xl flex items-center justify-center mb-6 shadow-sm border border-[var(--color-cashcrow-accent)]">
                <Loader2 className="w-8 h-8 text-[var(--color-cashcrow-primary)] animate-spin" />
            </div>
            <h4 className="text-xl font-black text-slate-800 tracking-tight font-sans">
                Fetching Data
            </h4>
            <p className="mt-2 text-sm font-medium text-slate-500">
                Fetching from Cashcrow Workspace...
            </p>
        </div>
    )
}