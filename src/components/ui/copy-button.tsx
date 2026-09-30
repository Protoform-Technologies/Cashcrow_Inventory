'use client'

import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { toast } from 'sonner'

interface CopyButtonProps {
    /** The text copied to the clipboard. */
    value: string
    /** Used for the tooltip / aria label, e.g. "GST No". */
    label?: string
    className?: string
}

/**
 * Small icon button that copies `value` to the clipboard and briefly shows a
 * check. Reusable anywhere a copyable value is displayed.
 */
export default function CopyButton({ value, label = 'value', className = '' }: CopyButtonProps) {
    const [copied, setCopied] = useState(false)

    const handleCopy = async (e: React.MouseEvent) => {
        // Don't trigger any parent link/row navigation.
        e.preventDefault()
        e.stopPropagation()
        try {
            await navigator.clipboard.writeText(value)
            setCopied(true)
            toast.success(label && label !== 'value' ? `${label} copied` : 'Copied')
            setTimeout(() => setCopied(false), 1500)
        } catch {
            toast.error('Could not copy to clipboard')
        }
    }

    return (
        <button
            type="button"
            onClick={handleCopy}
            title={copied ? 'Copied!' : `Copy ${label}`}
            aria-label={`Copy ${label}`}
            className={`shrink-0 p-1.5 rounded-lg text-slate-400 hover:text-[var(--color-cashcrow-primary)] hover:bg-slate-100 transition-all ${className}`}
        >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
        </button>
    )
}
