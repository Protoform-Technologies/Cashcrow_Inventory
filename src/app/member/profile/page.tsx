import React from "react";
import DashboardLayout from "@/components/shared/dashboard/layout";
import { getMemberProfileOrRedirect } from "@/actions/auth";
import ProfileHeader from "@/components/profile/profile-header";
import AccountInfo from "@/components/profile/account-info";
import ProfilePreferences from "@/components/profile/profile-preferences";
import { ShieldAlert, LogOut } from "lucide-react";
import { logout } from "@/actions/auth";

export const metadata = {
  title: "User Profile | Cashcrow Lab",
  description: "Manage your member profile and preferences.",
};

export default async function MemberProfilePage() {
  const profile = await getMemberProfileOrRedirect();
  const fullName = `${profile.first_name} ${profile.last_name}`;

  return (
    <DashboardLayout 
      userName={fullName} 
      userRole="Research Scientist" 
      avatarUrl={profile.avatar_url}
      title="User Profile"
    >
      <div className="max-w-[1400px] mx-auto p-4 md:p-8 space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Profile Header (Banner & Avatar) */}
        <ProfileHeader profile={profile} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          {/* Main Info Column */}
          <div className="lg:col-span-2 space-y-6 md:space-y-8">
            <AccountInfo profile={profile} />
            <ProfilePreferences profile={profile} />
          </div>

          {/* Right Sidebar: Security & Actions */}
          <div className="space-y-6 md:space-y-8">
            {/* Account Actions Section */}
            <section className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-red-50 hover:shadow-md transition-all duration-300">
               <div className="flex items-center gap-3 mb-6">
                <div className="size-8 rounded-lg bg-red-50 flex items-center justify-center text-red-500">
                  <ShieldAlert className="size-5" />
                </div>
                <h4 className="text-xs md:text-sm font-black text-red-600 uppercase tracking-widest leading-none">
                  Account Actions
                </h4>
              </div>

              <div className="space-y-4">
                <form action={logout}>
                  <button 
                    type="submit"
                    className="w-full flex items-center justify-center gap-3 py-4 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-xl text-sm font-black transition-all border border-red-100 shadow-sm active:scale-95 group"
                  >
                    <LogOut className="size-5 group-hover:-translate-x-1 transition-transform" />
                    Logout of System
                  </button>
                </form>
                <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-wider leading-relaxed px-4">
                  Security Note: Logging out will terminate all active lab sessions on this device.
                </p>
              </div>
            </section>
          </div>
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
    </DashboardLayout>
  );
}
