"use client";

import { useState, useEffect, useCallback } from "react";
import {
    Layout,
    Clock,
    Github,
    ExternalLink,
    Activity,
    Sparkles,
    Briefcase,
    ChevronDown,
    CalendarCheck,
    Video,
    TrendingUp,
    AlertCircle,
    CheckCircle2,
    Zap,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const FIRST_SCREEN_QUOTES = [
    "Every expert was once a beginner. Take the first step!",
    "Your ideas have the power to change the world. Start building!",
    "Welcome to the beginning of something great. What will you create?",
    "A journey of a thousand miles begins with a single commit."
];

const STATUS_COLORS = {
    'On Track': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-100', icon: TrendingUp },
    'Excellent': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-100', icon: Zap },
    'Needs Attention': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-100', icon: AlertCircle },
    'Behind Schedule': { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-100', icon: AlertCircle },
    'Completed': { bg: 'bg-gray-900', text: 'text-white', border: 'border-gray-800', icon: CheckCircle2 },
};

export default function StudentDashboard() {
    const [user, setUser] = useState(null);
    const [projects, setProjects] = useState([]);
    const [tickets, setTickets] = useState([]);
    const [weeklyReviews, setWeeklyReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProjectId, setSelectedProjectId] = useState(null);

    const fetchUserData = useCallback(async () => {
        const email = typeof window !== 'undefined' ? localStorage.getItem("userEmail") : null;
        if (!email) return;

        try {
            const [userRes, projectsRes, ticketsRes] = await Promise.all([
                fetch(`/api/user/me?email=${email}`),
                fetch(`/api/projects?email=${email}`),
                fetch(`/api/tickets`)
            ]);

            if (userRes.ok) {
                setUser(await userRes.json());
            }
            if (projectsRes.ok) {
                const projData = await projectsRes.json();
                setProjects(projData);
                // Always default to stored or first project
                const stored = typeof window !== 'undefined' ? localStorage.getItem('dashboardProjectId') : null;
                const validId = stored && projData.find(p => p._id === stored) ? stored : projData[0]?._id;
                if (validId) setSelectedProjectId(validId);
            }
            if (ticketsRes.ok) {
                const ticketsData = await ticketsRes.json();
                if (Array.isArray(ticketsData)) {
                    setTickets(ticketsData.filter(t => t.reportedBy === email));
                }
            }
        } catch (error) {
            console.error("Failed to fetch dashboard data:", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchUserData(); }, [fetchUserData]);

    // Fetch weekly reviews when user is known
    useEffect(() => {
        if (!user?._id) return;
        fetch(`/api/weekly-review?internId=${user._id}`)
            .then(r => r.ok ? r.json() : [])
            .then(data => setWeeklyReviews(Array.isArray(data) ? data : []))
            .catch(() => { });
    }, [user]);

    // Persist selected project
    const handleProjectChange = (id) => {
        setSelectedProjectId(id);
        if (typeof window !== 'undefined') localStorage.setItem('dashboardProjectId', id);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
            </div>
        );
    }

    if (!user) return null;

    const hasProjects = projects && projects.length > 0;
    const randomQuote = FIRST_SCREEN_QUOTES[Math.floor(Math.random() * FIRST_SCREEN_QUOTES.length)];

    if (!hasProjects) {
        return (
            <div className="p-8 max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-[2rem] p-8 border border-gray-100 shadow-sm flex flex-col md:flex-row gap-10 items-center overflow-hidden relative"
                >
                    <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50 rounded-full blur-[100px] opacity-60 -translate-y-1/2 translate-x-1/4 pointer-events-none" />
                    <div className="flex-1 space-y-6 relative z-10">
                        <h2 className="text-2xl font-bold text-gray-900">
                            Welcome to your Internship Journey, {user.fullName?.split(' ')[0]}!
                        </h2>
                        <p className="text-gray-600 text-lg leading-relaxed">
                            The <span className="font-semibold text-gray-800">{user.track || 'Intern'}</span> track is designed to challenge you and help you grow.
                        </p>
                        <div className="pt-2">
                            <Link href="/dashboard/projects" className="inline-flex items-center gap-2 bg-black text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-800 transition-colors">
                                <Briefcase className="w-5 h-5" /> View Projects
                            </Link>
                        </div>
                    </div>
                    <div className="w-64 shrink-0 flex flex-col items-center text-center space-y-6 relative z-10 py-6">
                        <div className="bg-gray-50 rounded-full p-2 shadow-inner border border-gray-100">
                            <img src={`https://api.dicebear.com/7.x/micah/svg?seed=${user.fullName}&backgroundColor=transparent`} alt="avatar" className="w-48 h-48" />
                        </div>
                        <p className="text-base font-medium text-gray-700 italic px-4">"{randomQuote}"</p>
                    </div>
                </motion.div>
            </div>
        );
    }

    const mainProject = projects.find(p => p._id === selectedProjectId) || projects[0];

    // Avatar & quote based on progress
    let avatarSeed = "Happy" + new Date().getDay();
    let quote = "Keep up the great work! You're making solid progress every day.";
    let avatarBgHex = '#e0e7ff';
    let avatarBorder = 'border-blue-200';

    if (!mainProject.progress || mainProject.progress === 0) {
        avatarSeed = "Sleepy" + user.fullName;
        quote = "Looks like you haven't started your project progress yet. Let's make some commits today!";
        avatarBgHex = '#fee2e2';
        avatarBorder = 'border-red-200';
    } else if (mainProject.progress >= 100) {
        avatarSeed = "Winner" + user.fullName;
        quote = "Amazing! You've finalized your project. Take a moment to celebrate!";
        avatarBgHex = '#dcfce7';
        avatarBorder = 'border-green-200';
    }

    // Upcoming / latest review
    const upcomingReview = weeklyReviews.find(r => r.meetingStatus === 'Scheduled');
    const latestReview = weeklyReviews[0];

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-6">

            {/* Welcome & Motivation Header */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm flex flex-col md:flex-row gap-6 items-center"
            >
                <div className={`shrink-0 rounded-full border-4 ${avatarBorder} overflow-hidden shadow-sm`} style={{ backgroundColor: avatarBgHex }}>
                    <img src={`https://api.dicebear.com/7.x/micah/svg?seed=${avatarSeed}&backgroundColor=transparent`} alt="avatar" className="w-24 h-24 scale-110 translate-y-2" />
                </div>
                <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-1">Hello, {user.fullName?.split(' ')[0]}! 👋</h2>
                    <p className="text-gray-500 text-base italic">"{quote}"</p>
                </div>
            </motion.div>

            {/* Project Selector — always visible */}
            <div className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm space-y-4">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">Active Project</h3>
                    <div className="relative w-full md:w-72">
                        {projects.length > 1 ? (
                            <>
                                <select
                                    value={selectedProjectId || ''}
                                    onChange={e => handleProjectChange(e.target.value)}
                                    className="w-full appearance-none bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 pr-10 text-sm font-bold text-gray-900 outline-none focus:ring-2 focus:ring-black/10 transition-all cursor-pointer"
                                >
                                    {projects.map(p => (
                                        <option key={p._id} value={p._id}>{p.projectName}</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                            </>
                        ) : (
                            <div className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5 text-sm font-bold text-gray-700">
                                {projects[0]?.projectName}
                            </div>
                        )}
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div
                        key={mainProject._id}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-5"
                    >
                        {/* Title + Status */}
                        <div className="flex items-start justify-between gap-4 flex-wrap">
                            <div>
                                <h4 className="text-xl font-black text-gray-900 tracking-tight">{mainProject.projectName}</h4>
                                {mainProject.description && (
                                    <p className="text-sm text-gray-500 mt-1 max-w-2xl leading-relaxed">{mainProject.description}</p>
                                )}
                            </div>
                            <span className={`shrink-0 px-3 py-1 rounded-full text-xs font-bold border ${mainProject.status === 'Approved' ? 'bg-green-50 text-green-700 border-green-200' :
                                mainProject.status === 'Rejected' ? 'bg-red-50 text-red-700 border-red-200' :
                                    'bg-yellow-50 text-yellow-700 border-yellow-200'
                                }`}>
                                {mainProject.status}
                            </span>
                        </div>

                        {/* Progress bar */}
                        <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                            <div className="mb-3 flex justify-between items-center">
                                <span className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                                    <Activity className="w-3.5 h-3.5 text-purple-400" /> Integration Level
                                </span>
                                <span className="text-gray-900 font-black text-lg">{mainProject.progress || 0}%</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                                <motion.div
                                    key={mainProject._id + '-progress'}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${mainProject.progress || 0}%` }}
                                    transition={{ duration: 0.8, ease: "easeOut" }}
                                    className="bg-black h-full rounded-full"
                                />
                            </div>
                        </div>

                        {/* Tech Stack + Links */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
                                <h5 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                                    <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Tech Stack
                                </h5>
                                {mainProject.techStack?.length > 0 ? (
                                    <div className="flex flex-wrap gap-2">
                                        {mainProject.techStack.map(tech => (
                                            <span key={tech} className="px-3 py-1.5 bg-white border border-gray-200 text-gray-700 rounded-lg text-xs font-bold">{tech}</span>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-400 text-xs">No technologies specified.</p>
                                )}
                            </div>

                            <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 space-y-3">
                                <h5 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-3 flex items-center gap-1.5">
                                    <Layout className="w-3.5 h-3.5 text-blue-400" /> Project Links
                                </h5>
                                {mainProject.repoLink ? (
                                    <a href={mainProject.repoLink} target="_blank" rel="noreferrer"
                                        className="flex items-center gap-2 p-3 rounded-xl bg-white border border-gray-100 text-sm font-semibold text-gray-700 hover:border-gray-300 transition-all group">
                                        <Github className="w-4 h-4 group-hover:scale-110 transition-transform" /> Repository
                                    </a>
                                ) : (
                                    <div className="flex items-center gap-2 p-3 bg-white/50 rounded-xl border border-gray-100 text-xs text-gray-400">
                                        <Github className="w-4 h-4 opacity-40" /> No repo linked
                                    </div>
                                )}
                                {mainProject.deployLink ? (
                                    <a href={mainProject.deployLink} target="_blank" rel="noreferrer"
                                        className="flex items-center gap-2 p-3 rounded-xl bg-blue-50 border border-blue-100 text-sm font-semibold text-blue-700 hover:bg-blue-100 transition-all group">
                                        <ExternalLink className="w-4 h-4 group-hover:scale-110 transition-transform" /> Live App
                                    </a>
                                ) : (
                                    <div className="flex items-center gap-2 p-3 bg-white/50 rounded-xl border border-gray-100 text-xs text-gray-400">
                                        <ExternalLink className="w-4 h-4 opacity-40" /> No deploy linked
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Weekly Review Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                {/* Upcoming Meeting */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm space-y-4"
                >
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                        <CalendarCheck className="w-3.5 h-3.5 text-blue-500" /> Upcoming Review
                    </h3>
                    {upcomingReview ? (
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <span className="font-black text-gray-900 text-lg">{upcomingReview.weekLabel}</span>
                                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-sky-50 text-sky-600 border border-sky-100">Scheduled</span>
                            </div>
                            <div className="flex items-center gap-4 text-xs font-bold text-gray-400 flex-wrap">
                                <span className="flex items-center gap-1.5">
                                    📅 {new Date(upcomingReview.meetingDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                                </span>
                                <span className="flex items-center gap-1.5">
                                    🕐 {upcomingReview.meetingTime}
                                </span>
                            </div>
                            {upcomingReview.progressNote && (
                                <p className="text-xs text-gray-500 italic bg-gray-50 rounded-xl px-3 py-2">{upcomingReview.progressNote}</p>
                            )}
                            <a
                                href={upcomingReview.meetingLink}
                                target="_blank" rel="noreferrer"
                                className="inline-flex items-center gap-2 px-4 py-2.5 bg-black text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-gray-800 transition-all shadow-md"
                            >
                                <Video className="w-3.5 h-3.5" /> Join Meeting
                            </a>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                            <CalendarCheck className="w-8 h-8 text-gray-200 mb-3" />
                            <p className="text-sm font-bold text-gray-400">No upcoming review scheduled</p>
                            <p className="text-xs text-gray-300 mt-1">Your admin will schedule one soon.</p>
                        </div>
                    )}
                </motion.div>

                {/* Latest Progress Status */}
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
                    className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm space-y-4"
                >
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                        <TrendingUp className="w-3.5 h-3.5 text-emerald-500" /> Latest Review Status
                    </h3>
                    {latestReview ? (() => {
                        const sc = STATUS_COLORS[latestReview.progressStatus] || STATUS_COLORS['On Track'];
                        const Icon = sc.icon;
                        return (
                            <div className="space-y-3">
                                <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${sc.bg} ${sc.border}`}>
                                    <Icon className={`w-4 h-4 ${sc.text}`} />
                                    <span className={`text-sm font-black ${sc.text}`}>{latestReview.progressStatus}</span>
                                </div>
                                <div className="flex items-center justify-between text-xs font-bold text-gray-400">
                                    <span>{latestReview.weekLabel}</span>
                                    <span>{new Date(latestReview.meetingDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                                </div>
                                {latestReview.progressNote && (
                                    <p className="text-xs text-gray-600 bg-gray-50 rounded-xl px-3 py-2 italic">{latestReview.progressNote}</p>
                                )}
                                <p className="text-[10px] text-gray-300 font-bold uppercase tracking-widest">{weeklyReviews.length} total review{weeklyReviews.length !== 1 ? 's' : ''}</p>
                            </div>
                        );
                    })() : (
                        <div className="flex flex-col items-center justify-center py-8 text-center">
                            <TrendingUp className="w-8 h-8 text-gray-200 mb-3" />
                            <p className="text-sm font-bold text-gray-400">No reviews yet</p>
                            <p className="text-xs text-gray-300 mt-1">Progress status will appear here after your first review.</p>
                        </div>
                    )}
                </motion.div>
            </div>

            {/* Audit Logs */}
            {tickets.length > 0 && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
                    className="bg-white rounded-[2rem] p-6 border border-gray-100 shadow-sm"
                >
                    <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-1.5 mb-4">
                        <Clock className="w-3.5 h-3.5" /> Activity Logs
                    </h3>
                    <div className="space-y-3">
                        {tickets.slice(0, 4).map(ticket => (
                            <div key={ticket._id} className="flex items-center justify-between gap-4 p-4 rounded-2xl border border-gray-100 bg-gray-50 hover:bg-gray-100 transition-all">
                                <div>
                                    <p className="font-semibold text-gray-900 text-sm">{ticket.type}</p>
                                    <p className="text-xs text-gray-400 mt-0.5">{new Date(ticket.createdAt).toLocaleDateString()}</p>
                                </div>
                                <span className={`shrink-0 px-3 py-1 text-xs font-bold rounded-xl border ${ticket.status === 'Resolved' || ticket.status === 'Closed'
                                    ? 'bg-green-50 text-green-700 border-green-100'
                                    : 'bg-yellow-50 text-yellow-700 border-yellow-100'
                                    }`}>
                                    {ticket.status}
                                </span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}

        </div>
    );
}
