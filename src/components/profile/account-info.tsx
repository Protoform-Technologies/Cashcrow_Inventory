"use client";

import React, { useState, useTransition } from "react";
import { Mail, BadgeCheck, Building2, MapPin, BadgeInfo, Save, Loader2, User } from "lucide-react";
import { updateProfile } from "@/actions/profile";

interface AccountInfoProps {
  profile: any;
}

export default function AccountInfo({ profile }: AccountInfoProps) {
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    firstName: profile.first_name || "",
    lastName: profile.last_name || "",
    memberId: profile.member_id || "",
    researchArea: profile.research_area || "",
    location: profile.location || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setSuccess(false);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    setError(null);

    startTransition(async () => {
      const fd = new FormData();
      Object.entries(formData).forEach(([key, val]) => fd.append(key, val));
      
      const result = await updateProfile(fd);
      if (result.success) {
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError(result.error || "Failed to update profile");
      }
    });
  };

  const fields = [
    { label: "First Name", icon: User, name: "firstName" },
    { label: "Last Name", icon: User, name: "lastName" },
    { label: "Member ID", icon: BadgeCheck, name: "memberId", placeholder: "e.g. CC-9821" },
    { label: "Research Area", icon: Building2, name: "researchArea", placeholder: "e.g. Clinical Research" },
    { label: "Primary Location", icon: MapPin, name: "location", placeholder: "e.g. Main Lab (Building A)" },
  ];

  return (
    <section className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-all duration-300">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-lg bg-emerald-50 flex items-center justify-center text-[#265035]">
            <BadgeInfo className="size-5" />
          </div>
          <h4 className="text-sm md:text-base font-black text-slate-900 uppercase tracking-widest leading-none">
            Account Information
          </h4>
        </div>

        {success && (
          <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest animate-in fade-in slide-in-from-right-2">
            Changes saved successfully!
          </span>
        )}
        {error && (
          <span className="text-[10px] font-black text-red-500 uppercase tracking-widest animate-in fade-in slide-in-from-right-2">
            {error}
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <div className="space-y-2 group">
            <label className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-[0.2em] px-1">
              Email Address (Read-only)
            </label>
            <div className="flex items-center gap-3 p-4 bg-slate-50/50 rounded-xl border border-slate-100 opacity-60">
              <Mail className="size-5 text-slate-400" />
              <span className="text-sm font-bold text-slate-500 leading-none">{profile.email}</span>
            </div>
          </div>

          {fields.map((field) => (
            <div key={field.name} className="space-y-2 group">
              <label htmlFor={field.name} className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-[0.2em] px-1 transition-colors group-focus-within:text-[#265035]">
                {field.label}
              </label>
              <div className="flex items-center gap-3 p-4 bg-slate-50/50 rounded-xl border border-slate-200 transition-all hover:bg-white hover:border-[#265035]/30 focus-within:bg-white focus-within:border-[#265035]/50 focus-within:ring-4 focus-within:ring-[#265035]/5">
                <field.icon className="size-5 text-slate-400 group-focus-within:text-[#265035] transition-colors" />
                <input
                  id={field.name}
                  name={field.name}
                  type="text"
                  value={(formData as any)[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  className="bg-transparent border-none p-0 w-full text-sm font-bold text-slate-700 placeholder:text-slate-300 focus:ring-0 outline-none"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={isPending}
            className="bg-[#265035] hover:bg-[#1e402a] text-white px-8 py-3.5 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-[#265035]/20 hover:shadow-2xl transition-all flex items-center gap-2.5 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Save className="size-4 group-hover:scale-110 transition-transform" />
            )}
            {isPending ? "Saving Changes..." : "Save Changes"}
          </button>
        </div>
      </form>
    </section>
  );
}

