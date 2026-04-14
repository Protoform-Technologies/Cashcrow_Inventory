'use client'

import { Search, Eye, EyeOff } from 'lucide-react'

interface QuotesHeaderProps {
    searchQuery: string
    setSearchQuery: (query: string) => void
}

export default function QuotesHeader() {
    return (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Quote Registry</h2>
                <p className="text-slate-500 font-medium mt-1">
                    Manage and track your formal procurement requests
                </p>
            </div>
        </div>
    )
}
