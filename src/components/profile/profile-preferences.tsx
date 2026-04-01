"use client";

import React, { useState } from "react";
import { Bell, Mail, ToggleLeft, ToggleRight, Loader2, Settings2 } from "lucide-react";
import { updatePreferences } from "@/actions/profile";

interface ProfilePreferencesProps {
  profile: any;
}

export default function ProfilePreferences({ profile }: ProfilePreferencesProps) {
  const [pushEnabled, setPushEnabled] = useState(profile.push_notifications ?? true);
  const [weeklyEnabled, setWeeklyEnabled] = useState(profile.weekly_reports ?? false);
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const handleToggle = async (type: "push" | "weekly") => {
    setIsLoading(type);
    const newVal = type === "push" ? !pushEnabled : !weeklyEnabled;
    const result = await updatePreferences({
      [type === "push" ? "push_notifications" : "weekly_reports"]: newVal,
    });

    if (result.success) {
      if (type === "push") setPushEnabled(newVal);
      else setWeeklyEnabled(newVal);
    }
    setIsLoading(null);
  };

  const preferences = [
    {
      id: "push",
      label: "Push Notifications",
      desc: "Receive real-time alerts for inventory updates and order approvals",
      icon: Bell,
      enabled: pushEnabled,
    },
    {
      id: "weekly",
      label: "Weekly Email Reports",
      desc: "Get a comprehensive summary of lab usage and stock levels every Monday",
      icon: Mail,
      enabled: weeklyEnabled,
    },
  ];

  return (
    <section className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all duration-300">
       <div className="flex items-center gap-3 mb-8">
        <div className="size-8 rounded-lg bg-emerald-50 flex items-center justify-center text-[#265035]">
          <Settings2 className="size-5" />
        </div>
        <h4 className="text-sm md:text-base font-black text-slate-900 uppercase tracking-widest leading-none">
          Preferences
        </h4>
      </div>

      <div className="space-y-4">
        {preferences.map((pref) => (
          <div 
            key={pref.id}
            className={`flex items-center justify-between p-5 rounded-2xl border transition-all ${
              pref.enabled ? "bg-[#265035]/5 border-[#265035]/20 shadow-sm" : "bg-slate-50/50 border-slate-100 hover:border-slate-200"
            }`}
          >
            <div className="flex gap-4">
              <div className={`size-10 rounded-xl flex items-center justify-center transition-colors ${
                pref.enabled ? "bg-white text-[#265035] shadow-sm" : "bg-white text-slate-400 group-hover:text-slate-600"
              }`}>
                <pref.icon className="size-5" />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-black text-slate-900 leading-none tracking-tight">{pref.label}</p>
                <p className="text-[10px] md:text-xs text-slate-500 font-medium leading-relaxed max-w-sm">{pref.desc}</p>
              </div>
            </div>

            <button
              disabled={isLoading !== null}
              onClick={() => handleToggle(pref.id as any)}
              className="relative focus:outline-none disabled:opacity-50 transition-all hover:scale-105"
            >
              <div className={`w-12 h-6 rounded-full transition-colors duration-300 ${pref.enabled ? "bg-[#265035]" : "bg-slate-200"}`}></div>
              <div className={`absolute left-1 top-1 bg-white size-4 rounded-full shadow-sm transition-transform duration-300 flex items-center justify-center ${pref.enabled ? "translate-x-6" : "translate-x-0"}`}>
                {isLoading === pref.id && <Loader2 className="size-2 animate-spin text-slate-400" />}
              </div>
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
