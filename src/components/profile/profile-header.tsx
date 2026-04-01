"use client";

import React, { useState, useRef } from "react";
import { Camera, Edit3, Loader2, User, Calendar, Briefcase } from "lucide-react";
import { uploadAvatar } from "@/actions/profile";

interface ProfileHeaderProps {
  profile: any;
}

export default function ProfileHeader({ profile }: ProfileHeaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("avatar", file);

    const result = await uploadAvatar(formData);
    if (result.success && result.url) {
      setAvatarUrl(result.url);
    } else {
      alert(result.error || "Failed to upload avatar");
    }
    setIsUploading(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden group/header transition-all hover:shadow-md">
      {/* Banner Area */}
      <div className="h-32 md:h-40 bg-[#265035] relative">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_white_1px,transparent_1px)] bg-[size:20px_20px]"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent"></div>
      </div>

      {/* Content Area */}
      <div className="px-6 md:px-10 pb-8 flex flex-col md:flex-row md:items-end gap-6 -mt-12 md:-mt-16 relative z-10">
        {/* Avatar Section */}
        <div className="relative group/avatar">
          <div className="size-28 md:size-36 rounded-2xl bg-slate-100 border-4 border-white shadow-xl overflow-hidden relative">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt="Profile"
                className="size-full object-cover transition-transform duration-500 group-hover/avatar:scale-110"
              />
            ) : (
              <div className="size-full flex items-center justify-center bg-slate-50 text-slate-300">
                <User className="size-12 md:size-16" />
              </div>
            )}

            {isUploading && (
              <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center text-white">
                <Loader2 className="size-6 animate-spin" />
              </div>
            )}
          </div>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-2 right-2 bg-white p-2 rounded-xl shadow-lg border border-slate-100 text-[#265035] hover:bg-[#265035] hover:text-white transition-all active:scale-95"
            title="Update Profile Photo"
          >
            <Camera className="size-4" />
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/*"
          />
        </div>

        {/* User Identity */}
        <div className="flex-1 pb-2">
          <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            {profile.first_name} {profile.last_name}
          </h3>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-2">
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

        {/* Edit Button */}
        <div className="pb-2">
          <button className="bg-[#265035] hover:bg-[#1e402a] text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-[#265035]/20 hover:shadow-2xl transition-all flex items-center gap-2.5 active:scale-95">
            <Edit3 className="size-4" />
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
}
