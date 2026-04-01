import { getMemberProfileOrRedirect } from '@/actions/auth'
import DashboardLayout from '@/components/dashboard/layout'
import { Button } from '@/components/ui/button'
import { Settings, Shield, Bell, Palette, LogOut, UserCog } from 'lucide-react'

export default async function SettingsPage() {
    const profile = await getMemberProfileOrRedirect()
    const fullName = `${profile.first_name} ${profile.last_name}`

    return (
        <DashboardLayout 
            userName={fullName} 
            userRole="Lab Member" 
            avatarUrl={profile.avatar_url}
            title="Settings"
        >
            <div className="space-y-8 max-w-2xl">
                {/* Header */}
                <div className="flex items-center gap-4 p-8 bg-gradient-to-r from-slate-50 to-white rounded-3xl border border-slate-200 shadow-sm">
                    <div className="w-16 h-16 bg-[var(--color-cashcrow-lightgreen)]/20 rounded-2xl flex items-center justify-center border-2 border-[var(--color-cashcrow-lightgreen)]/30">
                        <Settings className="w-8 h-8 text-[var(--color-cashcrow-lightgreen)]" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-slate-900">Settings</h1>
                        <p className="text-slate-500">Manage your account preferences and lab settings</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Account Settings */}
                    <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
                        <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
                            <UserCog className="w-7 h-7 text-[var(--color-cashcrow-primary)]" />
                            Account
                        </h2>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                                <div>
                                    <p className="font-semibold text-slate-900">{profile.email}</p>
                                    <p className="text-sm text-slate-500">Primary login email</p>
                                </div>
                                <Button variant="outline" className="gap-2">
                                    Change Password
                                </Button>
                            </div>
                            <Button className="w-full h-14 bg-[var(--color-cashcrow-lightgreen)] hover:bg-[var(--color-cashcrow-primary)] text-white font-bold rounded-xl shadow-lg">
                                Update Profile
                            </Button>
                        </div>
                    </div>

                    {/* Notification & Appearance */}
                    <div className="space-y-6">
                        {/* Notifications */}
                        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3 mb-6">
                                <Bell className="w-6 h-6 text-orange-500" />
                                Notifications
                            </h3>
                            <div className="space-y-3">
                                <label className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 cursor-pointer">
                                    <input type="checkbox" className="w-5 h-5 rounded-lg text-[var(--color-cashcrow-primary)] focus:ring-[var(--color-cashcrow-primary)]" />
                                    <span className="font-medium text-slate-900">Low stock alerts</span>
                                </label>
                                <label className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 cursor-pointer">
                                    <input type="checkbox" className="w-5 h-5 rounded-lg text-[var(--color-cashcrow-primary)] focus:ring-[var(--color-cashcrow-primary)]" />
                                    <span className="font-medium text-slate-900">Daily log reminders</span>
                                </label>
                            </div>
                        </div>

                        {/* Theme */}
                        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
                            <h3 className="text-xl font-bold text-slate-900 flex items-center gap-3 mb-6">
                                <Palette className="w-6 h-6" />
                                Appearance
                            </h3>
                            <div className="grid grid-cols-3 gap-3">
                                <button className="p-3 rounded-xl border-2 border-slate-200 hover:border-[var(--color-cashcrow-lightgreen)] transition-all">
                                    Light
                                </button>
                                <button className="p-3 rounded-xl border-2 border-slate-200 hover:border-[var(--color-cashcrow-lightgreen)] transition-all bg-slate-900 text-white">
                                    Dark
                                </button>
                                <button className="p-3 rounded-xl border-2 border-slate-200 hover:border-[var(--color-cashcrow-lightgreen)] transition-all">
                                    Auto
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Security & Logout */}
                <div className="bg-gradient-to-r from-orange-50 to-red-50 p-8 rounded-3xl border border-orange-200 shadow-lg">
                    <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                        <Shield className="w-8 h-8 text-orange-500" />
                        Security
                    </h2>
                    <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                        <div>
                            <p className="text-slate-600 mb-2">Session active</p>
                            <p className="text-sm text-slate-500">Last login: {new Date().toLocaleString()}</p>
                        </div>
                        <Button variant="outline" className="gap-2 h-12 px-8 font-bold border-red-200 text-red-700 hover:bg-red-50 hover:text-red-900 rounded-xl shadow-lg hover:shadow-xl transition-all">
                            <LogOut className="w-5 h-5" />
                            Log Out
                        </Button>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}

