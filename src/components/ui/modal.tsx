'use client'

import { useEffect } from 'react'
import { X } from 'lucide-react'
import type { ReactNode } from 'react'

type ModalSize = 'sm' | 'md' | 'lg' | 'xl'

interface ModalProps {
    open: boolean
    onClose: () => void
    children: ReactNode
    size?: ModalSize
    /** Floating close (✕) button in the top-right corner. */
    showCloseButton?: boolean
    /** Allow closing by clicking the backdrop / pressing Escape (default true). */
    dismissible?: boolean
}

const SIZES: Record<ModalSize, string> = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
}

/**
 * Consistent modal shell: dimmed backdrop, centered card, fade/zoom animation,
 * Escape-to-close and body scroll lock. Put your content as children.
 */
export default function Modal({
    open,
    onClose,
    children,
    size = 'md',
    showCloseButton = false,
    dismissible = true,
}: ModalProps) {
    useEffect(() => {
        if (!open) return
        const onKey = (e: KeyboardEvent) => { if (dismissible && e.key === 'Escape') onClose() }
        document.addEventListener('keydown', onKey)
        document.body.style.overflow = 'hidden'
        return () => {
            document.removeEventListener('keydown', onKey)
            document.body.style.overflow = ''
        }
    }, [open, onClose, dismissible])

    if (!open) return null

    return (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200"
                onClick={dismissible ? onClose : undefined}
            />
            <div className={`relative w-full ${SIZES[size]} max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200`}>
                {showCloseButton && (
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors z-10"
                    >
                        <X className="w-5 h-5" />
                    </button>
                )}
                {children}
            </div>
        </div>
    )
}
