"use client";

import { Search, Filter, MoreHorizontal, Mail, Calendar,User , Award, CheckCircle, RefreshCw, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminUsersPage() {
    const router = useRouter();
    const [users, setUsers] = useState([]);
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
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredUsers.map((user) => (
                                <tr key={user._id} className="hover:bg-gray-50/50 transition-colors group cursor-pointer" onClick={() => router.push(`/admin/users/${user._id}`)}>
                                    <td className="px-8 py-4">
                                        <div className="flex items-center gap-4">
                                            {user.profilePicture ? (
                                                <img src={user.profilePicture} alt={user.fullName} className="w-10 h-10 rounded-full object-cover shadow-sm border border-gray-100" />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center font-bold text-gray-500 shadow-sm border border-gray-100">
                                                    {user.fullName ? user.fullName.charAt(0).toUpperCase() : '?'}
                                                </div>
                                            )}
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
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
}
