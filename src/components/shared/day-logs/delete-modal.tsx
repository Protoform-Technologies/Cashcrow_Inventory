import { Loader2, AlertTriangle } from "lucide-react"

interface DeleteModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    isDeleting: boolean
}

export default function DeleteModal({ isOpen, onClose, onConfirm, isDeleting }: DeleteModalProps) {
    if (!isOpen) return null

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white text-slate-900 p-6 rounded-2xl shadow-xl w-full max-w-sm mx-4 animate-in zoom-in-95 duration-200">
                <div className="flex justify-center mb-4">
                    <div className="size-12 rounded-full bg-red-50 flex items-center justify-center border border-red-100">
                        <AlertTriangle className="size-6 text-red-500" />
                    </div>
                </div>
                <h3 className="text-xl font-black tracking-tight mb-2 text-center text-slate-900">Delete Record</h3>
                <p className="text-slate-500 text-center mb-6 font-medium leading-relaxed">
                    Are you sure you want to delete this log? This action cannot be undone and will permanently remove this record from the ledger.
                </p>
                <div className="flex gap-3">
                    <button 
                        onClick={onClose}
                        disabled={isDeleting}
                        className="flex-1 py-2.5 rounded-xl font-bold border border-slate-200 hover:bg-slate-50 text-slate-500 transition-colors disabled:opacity-50 active:scale-95 uppercase text-xs tracking-widest"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={onConfirm}
                        disabled={isDeleting}
                        className="flex-1 py-2.5 rounded-xl font-bold bg-red-600 hover:bg-red-700 text-white transition-colors disabled:opacity-50 flex justify-center items-center active:scale-95 uppercase text-xs tracking-widest shadow-lg shadow-red-500/20"
                    >
                        {isDeleting ? (
                            <div className="flex items-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span>Deleting...</span>
                            </div>
                        ) : (
                            "Delete"
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}
