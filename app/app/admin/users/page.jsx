"use client";

import { Search, Filter, MoreHorizontal, Mail, Calendar, Award, CheckCircle, RefreshCw, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

export default function AdminUsersPage() {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isIssuing, setIsIssuing] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch('/api/admin/users');
                if (res.ok) {
                    const data = await res.json();
                    setUsers(data);
                }
            } catch (err) {
                console.error("Failed to fetch users", err);
            }
        };
        fetchUsers();
    }, []);

    const calculateEndDate = (joinDate, durationMonths) => {
        if (!joinDate || !durationMonths) return null;
        const start = new Date(joinDate);
        const months = parseInt(durationMonths.split(' ')[0]) || 0;
        start.setMonth(start.getMonth() + months);
        return start.toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' });
    };

    const handleIssueCertificate = (user) => {
        setIsIssuing(true);
        setTimeout(() => {
            toast.success(`Certificate issued to ${user.name}!`);
            setIsIssuing(false);
            setSelectedUser(null);
        }, 1500);
    };

    const filteredUsers = users.filter(u =>
        (u.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (u.email || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6 p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">User Management</h1>
                    <p className="text-gray-500 mt-1 text-sm font-medium">Manage system users, roles, and permissions.</p>
                </div>
                <div className="flex gap-2">
                    <button className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm font-bold hover:bg-gray-50 flex items-center gap-2 shadow-sm">
                        <Filter className="w-4 h-4" /> Filter
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <div className="relative max-w-xl">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search users by name, email or role..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 text-sm font-medium"
                        />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/50 text-gray-400 uppercase font-bold text-[10px] tracking-widest">
                            <tr>
                                <th className="px-8 py-4">User</th>
                                <th className="px-6 py-4">Role</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Timeline</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredUsers.map((user) => (
                                <tr key={user._id} className="hover:bg-gray-50/50 transition-colors group">
                                    <td className="px-8 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center font-bold text-gray-500">
                                                {user.fullName ? user.fullName.charAt(0).toUpperCase() : '?'}
                                            </div>
                                            <div>
                                                <div className="font-bold text-gray-900 text-sm">{user.fullName}</div>
                                                <div className="text-xs text-gray-400 font-medium flex items-center gap-1">
                                                    <Mail className="w-3 h-3" /> {user.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-[10px] uppercase font-bold border ${user.role === 'admin' ? 'bg-purple-50 text-purple-700 border-purple-100' :
                                            user.role === 'developer' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                                'bg-gray-50 text-gray-700 border-gray-200'
                                            }`}>
                                            {user.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${user.status === 'Active' ? 'text-green-700 bg-green-50 border border-green-100' : 'text-gray-500 bg-gray-100 border border-gray-200'
                                            }`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                                            {user.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-[11px] text-gray-400 font-bold flex flex-col">
                                            <span className="flex items-center gap-1.5">
                                                <Calendar className="w-3 h-3 text-gray-300" /> Joined: {new Date(user.joinDate).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' })}
                                            </span>
                                            {user.duration && (
                                                <span className="text-[10px] text-black font-black uppercase mt-1">
                                                    Ends: {calculateEndDate(user.joinDate, user.duration)}
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            {user.role?.toLowerCase() === 'intern' && (
                                                <button
                                                    onClick={() => setSelectedUser(user)}
                                                    className="p-2.5 bg-emerald-50 text-emerald-600 rounded-xl hover:bg-emerald-600 hover:text-white transition-all border border-emerald-100 flex items-center gap-2 shadow-sm"
                                                    title="Issue Certificate"
                                                >
                                                    <Award className="w-4 h-4" />
                                                </button>
                                            )}
                                            <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-900 transition-colors" title="Additional Actions">
                                                <MoreHorizontal className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <AnimatePresence>
                {selectedUser && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedUser(null)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-sm bg-white rounded-[2.5rem] p-8 shadow-2xl">
                            <h3 className="text-xl font-black text-gray-900 flex items-center gap-2 mb-2">
                                <Award className="w-5 h-5 text-emerald-500" />
                                Issue Certificate
                            </h3>
                            <p className="text-[11px] font-bold text-gray-400 mb-6 font-medium">Process completion protocol for {selectedUser.fullName}</p>

                            <div className="space-y-3">
                                <div className="p-3 bg-gray-50 rounded-xl flex items-center gap-3 border border-gray-100 shadow-sm">
                                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                                    <span className="text-[10px] font-bold text-gray-600 uppercase">Internship Verified</span>
                                </div>
                                <div className="p-3 bg-gray-50 rounded-xl flex items-center gap-3 border border-gray-100 shadow-sm">
                                    <Mail className="w-4 h-4 text-blue-500" />
                                    <span className="text-[10px] font-bold text-gray-600 uppercase">Dispatch Prepared</span>
                                </div>
                            </div>

                            <div className="flex gap-3 mt-8">
                                <button onClick={() => setSelectedUser(null)} className="flex-1 py-3 text-[10px] font-black uppercase text-gray-400">Cancel</button>
                                <button
                                    onClick={() => handleIssueCertificate(selectedUser)}
                                    disabled={isIssuing}
                                    className="flex-1 py-3 bg-black text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 active:scale-95 transition-all"
                                >
                                    {isIssuing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Award className="w-3.5 h-3.5" />}
                                    Confirm
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
