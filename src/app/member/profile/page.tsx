import React from "react";
import { getMemberProfileOrRedirect } from "@/actions/auth";
import ProfileHeader from "@/components/shared/profile/profile-header";
import AccountInfo from "@/components/shared/profile/account-info";

export const metadata = {
  title: "User Profile | Cashcrow Lab",
  description: "Manage your member profile and preferences.",
};

export default async function MemberProfilePage() {
  const profile = await getMemberProfileOrRedirect();
  const fullName = `${profile.first_name} ${profile.last_name}`;

  return (
    <>
      <div className="max-w-[1400px] mx-auto p-4 md:p-8 space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

        {/* Profile Header (Banner & Avatar) */}
        <ProfileHeader profile={profile} />

        <div className="space-y-6 md:space-y-8">
          <AccountInfo profile={profile} />
        </div>

        {/* Footer Info */}
        <footer className="pt-10 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
          <div className="flex items-center gap-6">
            <span>© 2024 Cashcrow Lab</span>
            <span className="text-slate-200">|</span>
            <span className="hover:text-primary transition-colors cursor-pointer">Privacy Policy</span>
            <span className="hover:text-primary transition-colors cursor-pointer">Terms of Service</span>
          </div>
          <div className="px-4 py-1.5 bg-slate-50 border border-slate-100 rounded-full flex items-center gap-2">
            <div className="size-1.5 bg-emerald-400 rounded-full animate-pulse" />
            <span>System Version v2.4.1</span>
          </div>
        </footer>
      </div>
    </>
  );
}
