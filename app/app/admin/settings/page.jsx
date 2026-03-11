"use client";

import { useState, useEffect } from "react";
import { Save, Lock, User, Shield, RefreshCw, XCircle, Mail, Phone, Calendar } from "lucide-react";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminSettingsPage() {
    const [email, setEmail] = useState("admin@internportal.com");
    const [displayName, setDisplayName] = useState("System Administrator");
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [reenterPassword, setReenterPassword] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [userDetails, setUserDetails] = useState(null);
    const [isLoadingProfile, setIsLoadingProfile] = useState(true);

    useEffect(() => {
        const fetchUserProfile = async () => {
            if (typeof window !== "undefined") {
                const userEmail = localStorage.getItem("userEmail");
                if (userEmail) {
                    try {
                        const res = await fetch(`/api/user/me?email=${userEmail}`);
                        if (res.ok) {
                            const data = await res.json();
                            setUserDetails(data);
                            setEmail(data.email);
                            setDisplayName(data.fullName || data.name);
                        } else {
                            // fallback
                            setEmail(userEmail);
                            setDisplayName(localStorage.getItem("userName") || "System Administrator");
                        }
                    } catch (error) {
                        console.error("Failed to fetch user profile", error);
                    }
                }
                setIsLoadingProfile(false);
            }
        };
        fetchUserProfile();
    }, []);

    const handleSave = async () => {
        if (!oldPassword || !newPassword || !reenterPassword) {
            toast.error("Please fill all password fields.");
            return;
        }

        if (newPassword !== reenterPassword) {
            toast.error("New passwords do not match.");
            return;
        }

        setIsSaving(true);
        try {
            const res = await fetch("/api/admin/settings/password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, oldPassword, newPassword }),
            });

            const data = await res.json();
            if (res.ok) {
                toast.success(data.message || "Password updated successfully!");
                setOldPassword("");
                setNewPassword("");
                setReenterPassword("");
                setIsPasswordModalOpen(false);
            } else {
                toast.error(data.message || "Failed to update password.");
            }
        } catch (err) {
            toast.error("An error occurred while saving.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">System Settings</h1>

            {/* Profile Section */}
            <div className="bg-white p-8 md:p-10 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-start gap-8 md:gap-10">
                {isLoadingProfile ? (
                    <div className="w-full flex items-start gap-8 animate-pulse">
                        <div className="w-40 h-40 bg-gray-100 rounded-[2.5rem] shrink-0" />
                        <div className="flex-1 space-y-4 pt-2">
                            <div className="h-10 w-1/3 bg-gray-100 rounded-xl" />
                            <div className="h-5 w-1/4 bg-gray-100 rounded-lg mb-8" />
                            <div className="grid grid-cols-4 gap-6">
                                <div className="h-10 bg-gray-100 rounded-lg" />
                                <div className="h-10 bg-gray-100 rounded-lg" />
                                <div className="h-10 bg-gray-100 rounded-lg" />
                                <div className="h-10 bg-gray-100 rounded-lg" />
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="w-32 h-32 md:w-40 md:h-40 bg-gray-50 rounded-[2.5rem] border-2 border-white shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex items-center justify-center shrink-0">
                            {userDetails?.profilePicture ? (
                                <img src={userDetails.profilePicture} alt="Profile" className="w-full h-full object-cover rounded-[2.5rem]" />
                            ) : (
                                <User className="w-12 h-12 text-gray-300" strokeWidth={1.5} />
                            )}
                        </div>

                        <div className="flex-1 pt-1 overflow-hidden w-full">
                            <div className="flex flex-wrap items-center gap-3 mb-2">
                                <h2 className="text-3xl font-black text-gray-900 tracking-tight truncate max-w-full">
                                    {userDetails?.fullName || userDetails?.name || displayName}
                                </h2>
                                <span className="text-[10px] font-black text-purple-700 bg-purple-50 px-3 py-1.5 rounded-full uppercase tracking-widest shrink-0">
                                    {userDetails?.role || 'Admin'}
                                </span>
                                <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-full uppercase tracking-widest flex items-center gap-1.5 shrink-0">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                    {userDetails?.status || 'Active'}
                                </span>
                            </div>

                            <div className="flex items-center gap-2 text-sm font-bold text-gray-400 mb-8">
                                <Mail className="w-4 h-4 text-gray-300 shrink-0" />
                                <span className="truncate">{userDetails?.email || email}</span>
                            </div>

                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 gap-y-8">
                                <div className="space-y-1.5 overflow-hidden">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Track</p>
                                    <p className="font-bold text-gray-900 text-sm truncate">{userDetails?.track || 'System Admin'}</p>
                                </div>
                                <div className="space-y-1.5 overflow-hidden">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Phone</p>
                                    <p className="font-bold text-gray-900 text-sm flex items-center gap-2 truncate">
                                        <Phone className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                                        {userDetails?.phone || 'Not Provided'}
                                    </p>
                                </div>
                                <div className="space-y-1.5 overflow-hidden">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Duration</p>
                                    <p className="font-bold text-gray-900 text-sm truncate">{userDetails?.duration || 'Permanent'}</p>
                                </div>
                                <div className="space-y-1.5 overflow-hidden">
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Joined Period</p>
                                    <p className="font-bold text-gray-900 text-sm flex items-center gap-2 truncate">
                                        <Calendar className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                                        {userDetails?.joinDate ? new Date(userDetails.joinDate).toLocaleDateString('en-GB') : 'N/A'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Security Section Button */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-red-50 rounded-xl text-red-500">
                        <Shield className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Security</h2>
                        <p className="text-gray-500 text-sm">Manage your account security and password</p>
                    </div>
                </div>
                <button
                    onClick={() => setIsPasswordModalOpen(true)}
                    className="px-6 py-3 bg-black text-white rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-gray-800 transition-all hover:-translate-y-0.5 shadow-lg"
                >
                    <Lock className="w-4 h-4" /> Change Password
                </button>
            </div>

            {/* Password Modal */}
            <AnimatePresence>
                {isPasswordModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsPasswordModalOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-2xl" />
                        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="relative bg-white rounded-[2rem] p-8 max-w-md w-full shadow-2xl border border-gray-100">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <p className="text-[8px] font-black text-gray-300 uppercase tracking-[0.4em] mb-1">Security</p>
                                    <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter">Change Password</h3>
                                </div>
                                <button onClick={() => setIsPasswordModalOpen(false)} className="p-2 bg-gray-50 rounded-xl hover:bg-rose-50 hover:text-rose-500 transition-all border border-gray-100"><XCircle className="w-5 h-5" /></button>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Current Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input type="password" placeholder="Enter current password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-black/5" />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">New Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input type="password" placeholder="Enter new password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-black/5" />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Confirm New Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                        <input type="password" placeholder="Re-enter new password" value={reenterPassword} onChange={(e) => setReenterPassword(e.target.value)}
                                            className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-black/5" />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 mt-8">
                                <button
                                    onClick={() => { setOldPassword(""); setNewPassword(""); setReenterPassword(""); setIsPasswordModalOpen(false); }}
                                    disabled={isSaving}
                                    className="px-5 py-3 rounded-xl border border-gray-200 text-gray-500 text-sm font-bold hover:bg-gray-50 transition-colors disabled:opacity-50">
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="px-6 py-3 rounded-xl bg-black text-white text-sm font-bold hover:bg-gray-800 transition-colors shadow-lg flex items-center gap-2 disabled:opacity-50">
                                    {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                    {isSaving ? "Saving..." : "Save Password"}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
