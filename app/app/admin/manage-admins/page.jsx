"use client";

import { useState, useEffect } from "react";
import { UserPlus, Shield, Trash2, RefreshCw, Eye, EyeOff } from "lucide-react";
import { toast } from "react-hot-toast";

export default function ManageAdminsPage() {
    const [admins, setAdmins] = useState([]);
    const [loading, setLoading] = useState(true);

    // Form state
    const [adminForm, setAdminForm] = useState({
        fullName: "",
        email: "",
        phone: "",
        password: "TempPassword123!"
    });
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        fetchAdmins();
    }, []);

    const fetchAdmins = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/users");
            if (res.ok) {
                const users = await res.json();
                const adminUsers = users.filter(u => u.role === 'admin');
                setAdmins(adminUsers);
            }
        } catch (error) {
            console.error("Failed to fetch admins:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateAdmin = async (e) => {
        e.preventDefault();
        const tid = toast.loading("Creating Admin...");
        try {
            const requestedBy = typeof window !== 'undefined' ? localStorage.getItem('userEmail') : null;

            const res = await fetch("/api/admin/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...adminForm, requestedBy }),
            });

            const data = await res.json();
            if (res.ok) {
                toast.success("Admin created successfully!", { id: tid });
                setAdminForm({ fullName: "", email: "", phone: "", password: "TempPassword123!" });
                fetchAdmins();
            } else {
                toast.error(data.message || "Failed to create admin", { id: tid });
            }
        } catch (error) {
            toast.error("Error creating admin", { id: tid });
        }
    };

    return (
        <div className="space-y-8">
            <header>
                <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                    Manage Admins
                </h1>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-1">
                    Add and manage administrator accounts
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Add New Admin Form */}
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm h-fit">
                    <h2 className="text-lg font-bold flex items-center gap-2 mb-6 text-gray-900">
                        <div className="p-2 bg-blue-50 rounded-xl text-blue-600">
                            <UserPlus className="w-5 h-5" />
                        </div>
                        Add New Admin
                    </h2>

                    <form onSubmit={handleCreateAdmin} className="space-y-4">
                        <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                            <input
                                className="w-full px-4 py-3 mt-1 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/10 text-gray-900 text-sm"
                                placeholder="Admin Name"
                                value={adminForm.fullName}
                                onChange={e => setAdminForm({ ...adminForm, fullName: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Email</label>
                            <input
                                className="w-full px-4 py-3 mt-1 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/10 text-gray-900 text-sm"
                                placeholder="admin@example.com"
                                type="email"
                                value={adminForm.email}
                                onChange={e => setAdminForm({ ...adminForm, email: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Phone</label>
                            <input
                                className="w-full px-4 py-3 mt-1 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/10 text-gray-900 text-sm"
                                placeholder="+1 234 567 890"
                                value={adminForm.phone}
                                onChange={e => setAdminForm({ ...adminForm, phone: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Default Password</label>
                            <div className="relative mt-1">
                                <input
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/10 text-gray-900 text-sm pr-12"
                                    placeholder="Password"
                                    type={showPassword ? "text" : "password"}
                                    value={adminForm.password}
                                    onChange={e => setAdminForm({ ...adminForm, password: e.target.value })}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        <button type="submit" className="w-full bg-black text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors shadow-lg shadow-gray-900/10 active:scale-[0.98]">
                            Create Admin User
                        </button>
                    </form>
                </div>

                {/* Existing Admins List */}
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm h-fit">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold flex items-center gap-2 text-gray-900">
                            <div className="p-2 bg-purple-50 rounded-xl text-purple-600">
                                <Shield className="w-5 h-5" />
                            </div>
                            Current Admins
                        </h2>
                        <button
                            onClick={fetchAdmins}
                            className="p-2 bg-gray-50 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all"
                            title="Refresh"
                        >
                            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                        </button>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-black"></div>
                        </div>
                    ) : admins.length === 0 ? (
                        <p className="text-gray-400 text-sm text-center py-12">No admin users found.</p>
                    ) : (
                        <div className="space-y-3 max-h-[500px] overflow-y-auto">
                            {admins.map((admin) => (
                                <div key={admin._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-black flex items-center justify-center text-white text-sm font-bold shadow-md">
                                            {admin.fullName?.charAt(0) || "A"}
                                        </div>
                                        <div>
                                            <p className="text-sm font-bold text-gray-900">{admin.fullName}</p>
                                            <p className="text-xs text-gray-400">{admin.email}</p>
                                        </div>
                                    </div>
                                    <span className="text-[8px] font-black uppercase tracking-widest px-2.5 py-1 bg-black text-white rounded-full">
                                        Admin
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
