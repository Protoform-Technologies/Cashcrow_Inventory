import { Package, Edit3, AlertCircle, UserPlus } from "lucide-react"

const logs = [
    {
        title: "Stock Updated",
        description: "Sarah Jenkins added 20L of Ethanol",
        time: "14:32 PM • STORAGE-A",
        icon: Package,
        color: "bg-[#265136]"
    },
    {
        title: "Inventory Audit",
        description: "Completed by Dr. Aris Thorne",
        time: "12:15 PM • LAB-WIDE",
        icon: Edit3,
        color: "bg-amber-500"
    },
    {
        title: "Stock Warning",
        description: "Nitrile Gloves marked out of stock",
        time: "09:40 AM • PPE-STATION",
        icon: AlertCircle,
        color: "bg-red-500"
    },
    {
        title: "New Entry",
        description: "Michael Ross logged disposal",
        time: "08:12 AM • BIOHAZARD",
        icon: UserPlus,
        color: "bg-slate-400"
    }
]

export default function DailyLogFeed() {
    return (
        <div className="space-y-5">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-black text-slate-900">Daily Log</h3>
                <span className="bg-[#265136]/10 text-[#265136] text-[10px] font-black px-2 py-1 rounded-lg tracking-widest uppercase">
                    Real-Time
                </span>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-8 relative overflow-hidden">
                {logs.map((log, i) => (
                    <div key={i} className="relative flex gap-5 group">
                        {i !== logs.length - 1 && (
                            <div className="absolute left-[18px] top-10 bottom-[-32px] w-[1.5px] bg-slate-100 group-hover:bg-[#265136]/20 transition-colors"></div>
                        )}
                        <div className={`w-9 h-9 rounded-full ${log.color} flex items-center justify-center text-white shrink-0 z-10 border-4 border-white shadow-sm transition-transform group-hover:scale-110`}>
                            <log.icon className="w-4 h-4" />
                        </div>
                        <div className="space-y-1">
                            <p className="text-sm font-bold text-slate-900 tracking-tight">{log.title}</p>
                            <p className="text-xs text-slate-500 font-medium leading-relaxed">{log.description}</p>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{log.time}</p>
                        </div>
                    </div>
                ))}

                <button className="w-full py-4 bg-slate-50 text-slate-500 text-[10px] font-black rounded-xl hover:bg-slate-100 transition-all uppercase tracking-[0.2em] border border-slate-100 mt-4">
                    Load Full Log History
                </button>
            </div>
        </div>
    )
}
