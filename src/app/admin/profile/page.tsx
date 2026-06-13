import React from "react";
import { getAdminProfileOrRedirect } from "@/actions/auth";
import ProfileHeader from "@/components/shared/profile/profile-header";
import AccountInfo from "@/components/shared/profile/account-info";
import { ShieldAlert, LogOut } from "lucide-react";
import { logout } from "@/actions/auth";

export const metadata = {
  title: "Admin Profile | Cashcrow Lab",
  description: "Manage your administrator profile and preferences.",
};

export default async function AdminProfilePage() {
  const profile = await getAdminProfileOrRedirect();
  const fullName = `${profile.first_name} ${profile.last_name}`;

  return (
    <>
      <div className="max-w-[1400px] mx-auto p-4 md:p-8 space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">

        {/* Profile Header (Banner & Avatar) */}
        <ProfileHeader profile={profile} />

        <div className="space-y-6 md:space-y-8">
          <AccountInfo profile={profile} />
        </div>
      </div>
    </>
  );
}
