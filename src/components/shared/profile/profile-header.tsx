"use client";

import React, { useState, useRef } from "react";
import { Camera, Edit3, Loader2, User, Calendar, Briefcase, Trash2 } from "lucide-react";
import { uploadAvatar, removeAvatar } from "@/actions/profile";
import { getInitials } from "@/lib/getInitials";
import { toast } from "sonner";

interface ProfileHeaderProps {
  profile: any;
}

export default function ProfileHeader({ profile }: ProfileHeaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isRemoving, setIsRemoving] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fullName = `${profile.first_name} ${profile.last_name}`;
  const initials = getInitials(fullName);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("avatar", file);

    const result = await uploadAvatar(formData);
    if (result.success && result.url) {
      setAvatarUrl(result.url);
      toast.success("Profile photo updated");
    } else {
      toast.error(result.error || "Failed to upload avatar");
    }
    setIsUploading(false);
  };

  const handleRemovePhoto = async () => {
    if (!confirm("Are you sure you want to remove your profile photo?")) return;

    setIsRemoving(true);
    const result = await removeAvatar();
    if (result.success) {
      setAvatarUrl(null);
      toast.success("Profile photo removed");
    } else {
      toast.error(result.error || "Failed to remove avatar");
    }
    setIsRemoving(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden group/header transition-all hover:shadow-md">
      {/* Banner Area */}
      <div className="h-32 md:h-40 bg-[#265035] relative">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_white_1px,transparent_1px)] bg-[size:20px_20px]"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent"></div>
      </div>

      {/* Content Area */}
      <div className="px-6 md:px-10 pb-8 flex flex-col items-center md:flex-row md:items-end gap-6 -mt-12 md:-mt-16 relative z-10 text-center md:text-left">
        {/* Avatar Section */}
        <div className="relative group/avatar shrink-0">
          <div className="size-28 md:size-36 rounded-2xl bg-white border-4 border-white shadow-xl overflow-hidden relative">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Profile"
                className="size-full object-cover transition-transform duration-500 group-hover/avatar:scale-110"
              />
            ) : (
              <div className="size-full flex items-center justify-center bg-slate-50 text-[var(--color-cashcrow-primary)] font-black text-3xl md:text-4xl tracking-tighter">
                {initials}
              </div>
            )}

            {(isUploading || isRemoving) && (
              <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center text-white">
                <Loader2 className="size-6 animate-spin" />
              </div>
            )}
          </div>

          <div className="absolute -bottom-1.5 -right-1.5 md:-bottom-2 md:-right-2 flex items-center gap-1.5 md:gap-2">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="bg-white p-2 md:p-2.5 rounded-xl shadow-lg  text-[#265035] hover:bg-[#265035] hover:text-white transition-all active:scale-95 group/cam"
              title="Update Profile Photo"
            >
              <Camera className="size-3.5 md:size-4 group-hover/cam:scale-110 transition-transform" />
            </button>
            {avatarUrl && (
              <button
                onClick={handleRemovePhoto}
                className="bg-white p-2 md:p-2.5 rounded-xl shadow-lg border border-slate-100 text-red-500 hover:bg-red-500 hover:text-white transition-all active:scale-95 group/trash"
                title="Remove Profile Photo"
              >
                <Trash2 className="size-3.5 md:size-4 group-hover/trash:scale-110 transition-transform" />
              </button>
            )}
          </div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*"
          />
        </div>

        {/* User Identity */}
        <div className="flex-1 pb-2 w-full">
          <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            {profile.first_name} {profile.last_name}
          </h3>
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-6 gap-y-2 mt-2">
            <span className="flex items-center gap-1.5 text-xs md:text-sm font-bold text-slate-500 uppercase tracking-wider">
              <Briefcase className="size-4 text-[#265035]" />
              {profile.role === 'ADMIN' ? 'Admin' : 'Member'}
            </span>
            <span className="flex items-center gap-1.5 text-xs md:text-sm font-bold text-slate-500 uppercase tracking-wider">
              <Calendar className="size-4 text-[#265035]" />
              Joined {new Date(profile.created_at).getFullYear()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
