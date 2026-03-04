
"use client";

import { Save, Bell, Lock, User, Shield } from "lucide-react";

export default function AdminSettingsPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">System Settings</h1>

            {/* Profile Section */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-100">
                    <div className="w-20 h-20 rounded-full bg-black text-white flex items-center justify-center">
                        <User className="w-8 h-8" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Admin Profile</h2>
                        <p className="text-gray-500 text-sm">Update your personal information</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Display Name</label>
                        <input type="text" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-black/5 font-medium" defaultValue="System Administrator" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-700">Email Address</label>
                        <input type="email" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-black/5 font-medium" defaultValue="admin@internportal.com" />
                    </div>
                </div>
            </div>

            {/* Security Section */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                    <div className="p-2 bg-red-50 rounded-lg text-red-500">
                        <Shield className="w-5 h-5" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Security</h2>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl bg-gray-50/50">
                        <div className="flex items-center gap-3">
                            <Lock className="w-5 h-5 text-gray-400" />
                            <div>
                                <h3 className="font-bold text-gray-900">Two-Factor Authentication</h3>
                                <p className="text-xs text-gray-500 font-medium">Add an extra layer of security</p>
                            </div>
                        </div>
                        <div className="w-12 h-6 bg-gray-200 rounded-full relative cursor-pointer transition-colors hover:bg-gray-300">
                            <div className="w-4 h-4 bg-white rounded-full absolute left-1 top-1 shadow-sm transition-transform"></div>
                        </div>
                    </div>

                    <div className="flex items-center justify-between p-4 border border-gray-100 rounded-xl bg-gray-50/50">
                        <div className="flex items-center gap-3">
                            <Bell className="w-5 h-5 text-gray-400" />
                            <div>
                                <h3 className="font-bold text-gray-900">Login Notifications</h3>
                                <p className="text-xs text-gray-500 font-medium">Get notified of new sign-ins</p>
                            </div>
                        </div>
                        <div className="w-12 h-6 bg-black rounded-full relative cursor-pointer transition-colors">
                            <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1 shadow-sm transition-transform"></div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end gap-3">
                <button className="px-6 py-3 rounded-xl border border-gray-200 text-gray-500 font-bold hover:bg-gray-50 transition-colors">Cancel</button>
                <button className="px-8 py-3 rounded-xl bg-black text-white font-bold hover:bg-gray-800 transition-colors shadow-lg">Save Changes</button>
            </div>
        </div>
    );
}
