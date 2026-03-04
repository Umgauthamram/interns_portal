"use client";

import { Activity, BarChart2, Users, UserCheck } from "lucide-react";
import { useState, useEffect } from "react";

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalInterns: 0,
        activeNow: 0,
        placements: 0,
        completion: 0
    });
    const [recentActivity, setRecentActivity] = useState([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [usersRes, projectsRes] = await Promise.all([
                    fetch('/api/admin/users'),
                    fetch('/api/projects?role=admin')
                ]);

                if (usersRes.ok && projectsRes.ok) {
                    const users = await usersRes.json();
                    const projects = await projectsRes.json();

                    const interns = users.filter(u => u.role === 'intern');
                    const activeInterns = interns.filter(u => u.status === 'Active');
                    const completedProjects = projects.filter(p => p.progress === 100 || p.status === 'Approved');

                    const completionRate = projects.length > 0
                        ? ((completedProjects.length / projects.length) * 100).toFixed(1)
                        : 0;

                    setStats({
                        totalInterns: interns.length,
                        activeNow: activeInterns.length,
                        placements: completedProjects.length, // using completed projects as placements for now
                        completion: completionRate
                    });

                    // Build activity feed from recent projects
                    const latestProjects = projects.slice(0, 5).map(p => ({
                        u: p.internName || 'Unknown User',
                        a: p.status === 'Pending' ? `Requested ${p.projectName}` : `Deployed ${p.projectName}`,
                        s: p.status === 'Pending' ? 'Pending' : 'Success',
                        date: new Date(p.requestedAt).getTime()
                    }));
                    setRecentActivity(latestProjects);
                }
            } catch (err) {
                console.error("Failed to fetch admin stats", err);
            }
        };
        fetchDashboardData();
    }, []);
    return (
        <div className="relative p-6">
            <div className="relative z-10 space-y-8 max-w-6xl mx-auto">
                {/* Header */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                            Admin Overview
                        </h1>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-1">
                            System performance & User metrics
                        </p>
                    </div>
                </header>

                {/* Stats Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                        { label: "Total Interns", value: stats.totalInterns.toLocaleString(), change: "+12.5%", icon: Users, color: "text-blue-500", bg: "bg-blue-50" },
                        { label: "Active Now", value: stats.activeNow.toLocaleString(), change: "+5.2%", icon: Activity, color: "text-emerald-500", bg: "bg-emerald-50" },
                        { label: "Placements", value: stats.placements.toLocaleString(), change: "+8.1%", icon: UserCheck, color: "text-purple-500", bg: "bg-purple-50" },
                        { label: "Completion", value: `${stats.completion}%`, change: "+2.3%", icon: BarChart2, color: "text-amber-500", bg: "bg-amber-50" },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm">
                            <div className="flex justify-between items-start mb-3">
                                <div className={`p-2 rounded-xl ${stat.bg} ${stat.color}`}>
                                    <stat.icon className="w-4 h-4" />
                                </div>
                                <span className="text-[8px] font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-full">
                                    {stat.change}
                                </span>
                            </div>
                            <div>
                                <h3 className="text-xl font-black text-gray-900">{stat.value}</h3>
                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tighter">{stat.label}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Charts Area */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-100 p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest">Registration Trends</h3>
                            <div className="flex bg-gray-50 rounded-lg p-0.5 border border-gray-100">
                                <button className="px-2 py-1 rounded-md text-[8px] font-black bg-white text-gray-900 shadow-sm">Weekly</button>
                                <button className="px-2 py-1 rounded-md text-[8px] font-black text-gray-400">Monthly</button>
                            </div>
                        </div>
                        <div className="h-40 flex items-end justify-between px-2 gap-2">
                            {[40, 65, 45, 80, 55, 90, 70, 85, 60, 75, 50, 95].map((h, i) => (
                                <div key={i} className="w-full bg-gray-50 rounded-t-lg relative group overflow-hidden h-full flex flex-col justify-end">
                                    <div
                                        className="bg-black rounded-t-md transition-all duration-700"
                                        style={{ height: `${h}%` }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl border border-gray-100 p-6 flex flex-col justify-between">
                        <h3 className="text-xs font-black text-gray-900 uppercase tracking-widest mb-4">Track Split</h3>
                        <div className="h-32 flex items-center justify-center relative">
                            <div className="w-24 h-24 rounded-full border-[1rem] border-gray-50 relative flex items-center justify-center">
                                <div className="absolute inset-0 rounded-full border-[1rem] border-black border-r-transparent border-b-transparent border-l-transparent rotate-[60deg]"></div>
                                <div className="text-center absolute">
                                    <div className="text-sm font-black text-gray-900">2.5k</div>
                                </div>
                            </div>
                        </div>
                        <div className="space-y-2 mt-4">
                            {[{ l: 'Web', v: '65%', c: 'bg-black' }, { l: 'AI', v: '35%', c: 'bg-purple-500' }].map(t => (
                                <div key={t.l} className="flex items-center justify-between text-[10px] p-2 bg-gray-50 rounded-xl">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-2 h-2 rounded-full ${t.c}`} />
                                        <span className="font-bold text-gray-600">{t.l}</span>
                                    </div>
                                    <span className="font-black">{t.v}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Activity Feed */}
                <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
                    <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/10">
                        <h3 className="text-[10px] font-black text-gray-900 uppercase tracking-widest">Fresh Logs</h3>
                        <button className="text-[9px] font-black text-blue-500 uppercase">View All</button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="text-[8px] font-black text-gray-400 uppercase tracking-widest bg-gray-50/50">
                                <tr>
                                    <th className="px-6 py-3">User</th>
                                    <th className="px-6 py-3 text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {recentActivity.length > 0 ? recentActivity.map((row, i) => (
                                    <tr key={i} className="hover:bg-gray-50/50">
                                        <td className="px-6 py-3">
                                            <p className="text-xs font-bold text-gray-900">{row.u}</p>
                                            <p className="text-[9px] text-gray-400 font-medium">{row.a}</p>
                                        </td>
                                        <td className="px-6 py-3 text-right">
                                            <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-full border ${row.s === 'Success' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>
                                                {row.s}
                                            </span>
                                        </td>
                                    </tr>
                                )) : (
                                    <tr>
                                        <td colSpan="2" className="px-6 py-4 text-center text-xs text-gray-400 font-bold uppercase tracking-widest">No Recent Activity</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}
