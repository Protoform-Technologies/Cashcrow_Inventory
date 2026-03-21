import { Package, Edit3, AlertCircle, UserPlus, History, RefreshCw, RotateCcw, Trash2 } from "lucide-react"
import Link from "next/link"

interface LogEntry {
    title: string
    description: string
    time: string
    type: string
    color: string
}

interface DailyLogFeedProps {
    logs: LogEntry[]
}

export default function DailyLogFeed({ logs }: DailyLogFeedProps) {
    const iconMap: Record<string, any> = {
        'IN': Package,
        'OUT': History,
        'RETURN': RotateCcw,
        'ADJUST': Edit3,
        'SCRAP': AlertCircle,
        'DEFAULT': Package
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-black text-slate-900">Daily Log</h3>
            </div>
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 space-y-7 relative overflow-hidden flex flex-col justify-between h-fit">
                <div className="space-y-7">
                    {logs.length > 0 ? logs.slice(0, 4).map((log, i) => {
                        const Icon = iconMap[log.type] || iconMap['DEFAULT']
                        return (
                            <div key={i} className="relative flex gap-5 group">
                                {i !== Math.min(logs.length, 4) - 1 && (
                                    <div className="absolute left-[16px] top-8 bottom-[-28px] w-[1.5px] bg-slate-100 group-hover:bg-[#265136]/20 transition-colors"></div>
                                )}
                                <div className={`w-9 h-9 rounded-full ${log.color} flex items-center justify-center text-white shrink-0 z-10 border-4 border-white shadow-sm transition-transform group-hover:scale-110`}>
                                    <Icon className="w-4 h-4" />
                                </div>
                                <div className="space-y-0.5 pt-0.5">
                                    <p className="text-sm font-bold text-slate-900 tracking-tight leading-none mb-1.5">{log.title}</p>
                                    <p className="text-[11px] text-slate-500 font-medium leading-tight">{log.description}</p>
                                    <p className="text-[9px] text-slate-400 font-bold uppercase tracking-wider mt-1">{log.time}</p>
                                </div>
                            </div>
                        )
                    }) : (
                        <div className="py-8 text-center text-slate-500 font-medium text-sm">
                            No recent activity logged today.
                        </div>
                    )}
                </div>

                <Link href="/admin/daily-log" className="block w-full text-center py-3 bg-[var(--color-cashcrow-primary)] text-white text-[11px] font-black rounded-xl hover:bg-[var(--color-cashcrow-lightgreen)] transition-all uppercase tracking-[0.2em] shadow-lg shadow-[var(--color-cashcrow-primary)]/10 active:scale-95 mt-6">
                    Load Full Log History
                </Link>
            </div>
        </div>
    )
}
