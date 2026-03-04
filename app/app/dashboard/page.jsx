"use client";

import { useState, useEffect } from "react";
import {
    Zap,
    Code,
    Layout,
    Server,
    Database,
    Clock,
    BookOpen,
    Github,
    MessageSquare,
    ExternalLink,
    Star,
    Trophy,
    Target,
    Flame,
    TrendingUp,
    ShieldCheck,
    Cpu,
    Sparkles,
    ArrowRight,
    Briefcase,
    Activity,
    CheckCircle2,
    BarChart3,
    Users
} from "lucide-react";
import { differenceInDays } from "date-fns";
import { motion, AnimatePresence } from "motion/react";

const SCHEDULE_BASE_DATE = new Date(2026, 0, 1);
const WORK_LOGS = [
    { id: 1, task: "API Authentication Layer", status: "Review", date: "2h ago" },
    { id: 2, task: "Component Library Audit", status: "Done", date: "5h ago" },
    { id: 3, task: "Database Schema Update", status: "Pending", date: "1d ago" },
];

export default function StudentDashboard() {
    const [user, setUser] = useState(null);
    const [stats, setStats] = useState({
        completed: 0,
        efficiency: 0,
        tickets: 0,
        logHrs: 0,
    });
    const [ticketsList, setTicketsList] = useState([]);

    useEffect(() => {
        const fetchUserData = async () => {
            const email = localStorage.getItem("userEmail");
            if (!email) return;

            try {
                const [userRes, ticketsRes] = await Promise.all([
                    fetch(`/api/user/me?email=${email}`),
                    fetch(`/api/tickets`)
                ]);

                if (userRes.ok) {
                    const userData = await userRes.json();
                    setUser(userData);

                    const joinDate = new Date(userData.joinDate || Date.now());
                    const today = new Date();
                    let days = differenceInDays(today, joinDate);
                    if (days < 0) days = 0;

                    let userTickets = [];
                    if (ticketsRes.ok) {
                        const allTickets = await ticketsRes.json();
                        userTickets = allTickets.filter(t => t.reportedBy === email);
                    }
                    setTicketsList(userTickets);

                    setStats({
                        completed: Math.min(100, Math.floor(days * 1.5)), // derived progression
                        efficiency: (days > 0 ? (Math.random() * (9.9 - 8.5) + 8.5) : 10).toFixed(1),
                        tickets: userTickets.length,
                        logHrs: days * 8,
                    });
                }
            } catch (error) {
                console.error("Failed to fetch dashboard data:", error);
            }
        };
        fetchUserData();
    }, []);

    return (
        <div className="relative p-8 max-w-6xl mx-auto space-y-10">
            {/* Background Pattern */}
            <div
                className="fixed inset-0 z-0 opacity-[0.08] pointer-events-none"
                style={{
                    backgroundImage: 'url("/background9.svg")',
                    backgroundSize: '100px',
                    backgroundRepeat: 'repeat'
                }}
            />

            {/* Header - Internship Focus */}
            <header className="relative z-10 flex justify-between items-end border-b border-gray-50 pb-6">
                <div className="space-y-1">

                    <h1 className="text-3xl font-black text-gray-900 tracking-tighter uppercase leading-none">
                        Intern Dashboard
                    </h1>
                </div>
                <div className="flex items-center gap-4 text-[9px] font-black text-gray-400 uppercase tracking-widest">
                    Track: <span className="text-black">{user ? user.track : "Loading..."}</span>
                </div>
            </header>

            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Task Efficiency Card (Amber) */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-amber-600 rounded-[2.5rem] p-7 text-white relative overflow-hidden shadow-xl shadow-amber-900/20 group"
                >
                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform duration-700">
                        <Briefcase className="w-32 h-32 -mr-8 -mt-8" />
                    </div>
                    <div className="relative z-10 flex flex-col h-full space-y-5">
                        <div>
                            <span className="text-[8px] font-black uppercase tracking-[0.4em] opacity-80">Project Completion</span>
                            <div className="flex items-baseline gap-2 mt-1">
                                <h2 className="text-5xl font-black tracking-tighter">{user ? stats.completed : "0"}</h2>
                                <span className="text-lg font-black opacity-60">%</span>
                            </div>
                        </div>

                        <div className="space-y-3 flex-1">
                            {[
                                { label: "Sprint 3: Auth Integration", p: "100%" },
                                { label: "Sprint 4: Payment Logic", p: "65%" },
                                { label: "Sprint 5: Performance Fix", p: "20%" }
                            ].map((item) => (
                                <div key={item.label} className="space-y-1">
                                    <div className="flex justify-between text-[8px] font-black uppercase tracking-widest opacity-90">
                                        <span>{item.label}</span>
                                        <span>{item.p}</span>
                                    </div>
                                    <div className="w-full bg-amber-800/30 rounded-full h-1.5 overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: item.p }}
                                            transition={{ duration: 1.5, ease: "easeOut" }}
                                            className="bg-white h-full rounded-full"
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="pt-6 border-t border-amber-500/30 grid grid-cols-3 gap-2 text-center">
                            <div>
                                <span className="block text-xl font-black">{user ? stats.efficiency : "0.0"}</span>
                                <span className="text-[7px] font-black uppercase tracking-widest opacity-70">Efficiency</span>
                            </div>
                            <div>
                                <span className="block text-xl font-black">{user ? stats.tickets : "0"}</span>
                                <span className="text-[7px] font-black uppercase tracking-widest opacity-70">Tickets</span>
                            </div>
                            <div>
                                <span className="block text-xl font-black">{user ? stats.logHrs : "0"}</span>
                                <span className="text-[7px] font-black uppercase tracking-widest opacity-70">Log Hrs</span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Work Cycle Card (Violet) */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="bg-violet-600 rounded-[2.5rem] p-7 text-white relative overflow-hidden shadow-xl shadow-violet-900/20 group"
                >
                    <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform duration-700">
                        <Activity className="w-32 h-32 -mr-8 -mt-8" />
                    </div>
                    <div className="relative z-10 flex flex-col h-full space-y-6">
                        <div>
                            <span className="text-[8px] font-black uppercase tracking-[0.4em] opacity-80">Current Sprint</span>
                            <h2 className="text-2xl font-black mt-1 leading-tight tracking-tighter uppercase font-outline">Live Production<br />Mirroring</h2>
                            <div className="flex items-center gap-2 mt-1.5">
                                <Clock className="w-3.5 h-3.5 text-violet-300" />
                                <p className="text-[8px] font-bold text-violet-200 uppercase tracking-widest">Deadline: Tonight</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-3 flex-1">
                            {[
                                { icon: CheckCircle2, val: "08", label: "Fixed" },
                                { icon: MessageSquare, val: "03", label: "Review" },
                                { icon: Code, val: "12", label: "Commits" }
                            ].map((m, i) => (
                                <div key={i} className="bg-violet-700/40 backdrop-blur-sm rounded-2xl p-3 border border-violet-500/20">
                                    <div className="mb-1.5 p-1.5 bg-violet-500/30 rounded-lg w-fit">
                                        <m.icon className="w-3 h-3 text-violet-100" />
                                    </div>
                                    <div className="text-lg font-black leading-none">{m.val}</div>
                                    <div className="text-[7px] font-black uppercase tracking-widest text-violet-300 mt-1">{m.label}</div>
                                </div>
                            ))}
                        </div>

                        <div className="pt-6 flex items-center justify-between border-t border-violet-500/30">
                            <div className="flex -space-x-2">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="w-6 h-6 rounded-full border border-violet-600 bg-violet-800 flex items-center justify-center text-[7px] font-bold shadow-lg">
                                        UX
                                    </div>
                                ))}
                            </div>
                            <button className="text-[8px] font-black uppercase tracking-widest text-white px-4 py-2.5 bg-violet-700 hover:bg-violet-800 rounded-xl shadow-lg transition-all flex items-center gap-2 group/btn border border-violet-500/30">
                                Open Repo <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </motion.div>

            </div>

            {/* New Bottom Section: Real-time Work Logs & Performance Stats */}
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">


            </div>
        </div>
    );
}
