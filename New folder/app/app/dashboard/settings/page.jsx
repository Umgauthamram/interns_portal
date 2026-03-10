"use client";

import {
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Briefcase,
    Clock,
    Laptop,
    ShieldCheck,
    Lock,
    ChevronRight
} from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils"; // Assuming you have utility class merger

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState("profile");
    // Simulator for fetching user data from MongoDB
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            const email = typeof window !== 'undefined' ? localStorage.getItem('userEmail') : null;
            if (!email) {
                // If no email found, we can't fetch. 
                // For demo purposes, we might want to handle this gracefully or redirect.
                // Keeping loading state might hang the UI, so we set loading false.
                setLoading(false);
                return;
            }

            try {
                const res = await fetch(`/api/user/me?email=${email}`);
                if (res.ok) {
                    const data = await res.json();
                    setUser({
                        ...data,
                        // Format date if needed or ensure API returns formatted
                        joinDate: data.joinDate ? new Date(data.joinDate).toISOString().split('T')[0] : 'N/A'
                    });
                } else {
                    console.error("Failed to fetch user");
                }
            } catch (error) {
                console.error("Error fetching user data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center flex-col gap-4">
                <h2 className="text-xl font-bold text-gray-800">User credentials not found.</h2>
                <p className="text-gray-500">Please complete the registration process.</p>
            </div>
        );
    }

    const tabs = [
        { id: "profile", label: "My Profile", icon: User },
        { id: "internship", label: "Internship Details", icon: Briefcase },
        { id: "security", label: "Security", icon: ShieldCheck },
    ];

    return (
        <div className="relative min-h-screen">
            <div className="relative z-10 space-y-6 pt-2">

                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight flex items-center gap-3">
                        <User className="w-8 h-8 text-black" />
                        Account Settings
                    </h1>
                    <p className="text-gray-500 mt-1">
                        Manage your profile, preferences, and account security.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* Sidebar Navigation */}
                    <div className="lg:col-span-3 space-y-6">


                        <nav className="bg-white rounded-2xl shadow-sm border border-gray-100 p-2 space-y-1">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={cn(
                                        "w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                                        activeTab === tab.id
                                            ? "bg-black text-white"
                                            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                                    )}
                                >
                                    <div className="flex items-center gap-3">
                                        <tab.icon className={cn("w-5 h-5", activeTab === tab.id ? "text-white" : "text-gray-400")} />
                                        {tab.label}
                                    </div>
                                    {activeTab === tab.id && <ChevronRight className="w-4 h-4 text-white" />}
                                </button>
                            ))}
                        </nav>
                    </div>

                    {/* Main Content Area */}
                    <div className="lg:col-span-9">

                        {/* Profile Tab */}
                        {activeTab === "profile" && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                                    <div className="flex items-center justify-between mb-6">
                                        <h3 className="text-xl font-bold text-gray-900">
                                            Personal Information
                                        </h3>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Full Name</label>
                                            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-gray-900 font-medium flex items-center gap-3">
                                                <User className="w-4 h-4 text-gray-400" />
                                                {user.fullName}
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Email Address</label>
                                            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-gray-900 font-medium flex items-center gap-3">
                                                <Mail className="w-4 h-4 text-gray-400" />
                                                {user.email}
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Phone</label>
                                            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-gray-900 font-medium flex items-center gap-3">
                                                <Phone className="w-4 h-4 text-gray-400" />
                                                {user.phone}
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Date of Birth</label>
                                            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-gray-900 font-medium flex items-center gap-3">
                                                <Calendar className="w-4 h-4 text-gray-400" />
                                                {user.dob}
                                            </div>
                                        </div>
                                        <div className="space-y-2 md:col-span-2">
                                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Address</label>
                                            <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 text-gray-900 font-medium flex items-center gap-3">
                                                <MapPin className="w-4 h-4 text-gray-400" />
                                                {user.address}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Internship Tab */}
                        {activeTab === "internship" && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                                    <h3 className="text-xl font-bold text-gray-900 mb-6">Internship Overview</h3>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4">
                                            <div className="flex items-center gap-3 mb-1">
                                                <div className="p-1.5 bg-white rounded-lg shadow-sm">
                                                    <Laptop className="w-4 h-4 text-gray-700" />
                                                </div>
                                                <span className="font-semibold text-gray-700 text-sm">Current Track</span>
                                            </div>
                                            <p className="text-lg font-bold text-gray-900 pl-1">{user.track}</p>
                                        </div>

                                        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4">
                                            <div className="flex items-center gap-3 mb-1">
                                                <div className="p-1.5 bg-white rounded-lg shadow-sm">
                                                    <Clock className="w-4 h-4 text-gray-700" />
                                                </div>
                                                <span className="font-semibold text-gray-700 text-sm">Duration</span>
                                            </div>
                                            <p className="text-lg font-bold text-gray-900 pl-1">{user.duration}</p>
                                        </div>

                                        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4">
                                            <div className="flex items-center gap-3 mb-1">
                                                <div className="p-1.5 bg-white rounded-lg shadow-sm">
                                                    <MapPin className="w-4 h-4 text-gray-700" />
                                                </div>
                                                <span className="font-semibold text-gray-700 text-sm">Work Mode</span>
                                            </div>
                                            <p className="text-lg font-bold text-gray-900 pl-1 capitalize">{user.mode}</p>
                                        </div>

                                        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4">
                                            <div className="flex items-center gap-3 mb-1">
                                                <div className="p-1.5 bg-white rounded-lg shadow-sm">
                                                    <Calendar className="w-4 h-4 text-gray-700" />
                                                </div>
                                                <span className="font-semibold text-gray-700 text-sm">Join Date</span>
                                            </div>
                                            <p className="text-lg font-bold text-gray-900 pl-1">{user.joinDate}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Security Tab */}
                        {activeTab === "security" && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                                    <div className="flex items-start gap-4 mb-8">
                                        <div className="p-3 bg-red-50 text-red-600 rounded-xl">
                                            <Lock className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900">Security Settings</h3>
                                            <p className="text-gray-500">Update your password to keep your account secure.</p>
                                        </div>
                                    </div>

                                    <form className="max-w-lg space-y-6">
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">Current Password</label>
                                                <input
                                                    type="password"
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-gray-50 focus:bg-white"
                                                    placeholder="Enter current password"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">New Password</label>
                                                <input
                                                    type="password"
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-gray-50 focus:bg-white"
                                                    placeholder="Enter new password"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm New Password</label>
                                                <input
                                                    type="password"
                                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-gray-50 focus:bg-white"
                                                    placeholder="Confirm new password"
                                                />
                                            </div>
                                        </div>

                                        <div className="pt-4 border-t border-gray-100">
                                            <button
                                                type="button"
                                                className="px-8 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 transform duration-200 flex items-center gap-2"
                                            >
                                                <ShieldCheck className="w-4 h-4" />
                                                Update Password
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
}
