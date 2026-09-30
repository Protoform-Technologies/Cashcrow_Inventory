import { Loader2 } from "lucide-react"

interface FinalizeModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    isSubmitting: boolean
    entryCount: number
}

export default function FinalizeModal({ isOpen, onClose, onConfirm, isSubmitting, entryCount }: FinalizeModalProps) {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white text-slate-900 p-6 rounded-2xl shadow-xl w-full max-w-sm mx-4 animate-in zoom-in-95 duration-200">
                <h3 className="text-xl font-black tracking-tight mb-2 text-center text-slate-900">Confirm Submission</h3>
                <p className="text-slate-500 text-center mb-6 font-medium leading-relaxed">
                    Initialize atomic submission for {entryCount} line{entryCount !== 1 ? 's' : ''}? This will verify and update stock individually.
                </p>
                <div className="flex gap-3">
                    <button 
                        onClick={onClose}
                        disabled={isSubmitting}
                        className="flex-1 py-2.5 rounded-xl font-bold border border-slate-200 hover:bg-slate-50 text-slate-500 transition-colors disabled:opacity-50 active:scale-95 uppercase text-xs tracking-widest"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={onConfirm}
                        disabled={isSubmitting}
                        className="flex-1 py-2.5 rounded-xl font-bold bg-[var(--color-cashcrow-primary)] hover:bg-[var(--color-cashcrow-lightgreen)] text-white transition-colors disabled:opacity-50 flex justify-center items-center active:scale-95 uppercase text-xs tracking-widest shadow-lg shadow-[var(--color-cashcrow-primary)]/20"
                    >
                        {isSubmitting ? (
                            <div className="flex items-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Verifying...</span>
                            </div>
                        ) : (
                            "Confirm"
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}
