'use client'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { buttonStyles } from '@/components/ui/button'

interface SuppliersPaginationProps {
    currentPage: number
    totalPages: number
    totalCount: number
    limit: number
}

export default function SuppliersPagination({
    currentPage,
    totalPages,
    totalCount,
    limit
}: SuppliersPaginationProps) {
    const pathname = usePathname()
    const searchParams = useSearchParams()

    if (totalCount === 0) return null

    // Preserve existing query params (e.g. q) when changing page.
    const hrefFor = (p: number) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set('page', String(p))
        return `${pathname}?${params.toString()}`
    }

    return (
        <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
            <p className="text-[12px] text-slate-500 font-bold lowercase tracking-wide">
                Showing <span className="text-[var(--color-cashcrow-primary)] font-black">{(currentPage - 1) * limit + 1}</span> to <span className="text-[var(--color-cashcrow-primary)] font-black">{Math.min(currentPage * limit, totalCount)}</span> of <span className="font-black">{totalCount}</span> results
            </p>
            <div className="flex gap-3">
                <Link
                    href={hrefFor(Math.max(1, currentPage - 1))}
                    aria-disabled={currentPage === 1}
                    className={buttonStyles({ variant: 'outline', size: 'sm', className: currentPage === 1 ? 'opacity-50 pointer-events-none' : '' })}
                >
                    Previous
                </Link>
                <Link
                    href={hrefFor(Math.min(totalPages, currentPage + 1))}
                    aria-disabled={currentPage >= totalPages}
                    className={buttonStyles({ variant: 'primary', size: 'sm', className: currentPage >= totalPages ? 'opacity-50 pointer-events-none' : '' })}
                >
                    Next
                </Link>
            </div>
        </div>
    )
}
