"use client";

import { useState, useEffect } from "react";
import {
    Activity,
    AlertCircle,
    AlertTriangle,
    Award,
    ArrowRight,
    Briefcase,
    Calendar,
    CheckCircle2,
    CheckSquare,
    ChevronRight,
    Clock,
    Code,
    Cpu,
    ExternalLink,
    FileText,
    Flag,
    FolderGit2,
    Github,
    History,
    Layout,
    LifeBuoy,
    MapPin,
    MessageSquare,
    MonitorSmartphone,
    Rocket,
    ShieldAlert,
    Sparkles,
    TicketIcon,
    Timer,
    Zap
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

const TRACK_RESOURCES = {
    "Web Development": {
        overview: "Build full-stack real-world applications. You will learn frontend UI development, backend logic, APIs, secure authentication, database management, and cloud deployment pipelines.",
        skills: ["React / Next.js", "Node.js / APIs", "Tailwind CSS", "Databases", "Authentication"],
        career: "Prepares you for roles like Full-Stack Developer, Frontend Engineer, and Systems Architect.",
        statements: [
            { title: "E-Commerce Cart System", desc: "Build a scalable cart with payment mocking.", difficulty: "Medium", time: "2-3 Weeks", reqs: "React, Context API" },
            { title: "SaaS Dashboard Panel", desc: "A KPI dashboard with user authentication.", difficulty: "Hard", time: "3-4 Weeks", reqs: "Next.js, NextAuth" },
        ]
    },
    "App Development": {
        overview: "Create robust, cross-platform mobile applications. You will explore mobile architectures, responsive layouts, device integrations, and App Store readiness.",
        skills: ["React Native / Flutter", "State Management", "Mobile APIs", "UI Animation"],
        career: "Prepares you for roles like Mobile Developer, iOS/Android Engineer.",
        statements: [
            { title: "Task Manager App", desc: "A beautiful interactive mobile to-do manager.", difficulty: "Medium", time: "2 Weeks", reqs: "React Native" },
            { title: "Fitness Tracker", desc: "App that tracks metrics using charts.", difficulty: "Hard", time: "4 Weeks", reqs: "Flutter, SQLite" },
        ]
    },
    "UI/UX Design": {
        overview: "Design intuitive and stunning user experiences. Focus on user psychology, wireframing, high-fidelity prototyping, and foundational user research.",
        skills: ["Figma / Adobe XD", "Prototyping", "User Research", "Wireframing"],
        career: "Prepares you for roles like Product Designer, UX Researcher, UI Designer.",
        statements: [
            { title: "Fintech App Redesign", desc: "Redesign an banking app for better accessibility.", difficulty: "Medium", time: "2 Weeks", reqs: "Figma" },
            { title: "E-Commerce Web Flow", desc: "End-to-end checkout flow prototyping.", difficulty: "Medium", time: "3 Weeks", reqs: "Prototyping" },
        ]
    },
    "Web3": {
        overview: "Step into the decentralized future. Learn smart contract development, dApp integration, blockchain fundamentals, and wallet interactions.",
        skills: ["Solidity", "Ethers.js / Web3.js", "Smart Contracts", "Hardhat"],
        career: "Prepares you for roles like Blockchain Developer, Web3 Engineer, Smart Contract Auditor.",
        statements: [
            { title: "NFT Marketplace logic", desc: "A decentralized marketplace contract.", difficulty: "Hard", time: "4 Weeks", reqs: "Solidity" },
            { title: "Token Staking App", desc: "A simple dApp for staking ERC20 tokens.", difficulty: "Medium", time: "3 Weeks", reqs: "Web3.js, React" },
        ]
    }
};

export default function StudentDashboard() {
    const [user, setUser] = useState(null);
    const [projects, setProjects] = useState([]);
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    // Mock data for immediate UX feedback (normally fetched)
    const [missedReviews] = useState(0);
    const [nextReviewDate] = useState("March 12, 2026 at 4:00 PM");

    useEffect(() => {
        const fetchUserData = async () => {
            const email = typeof window !== 'undefined' ? localStorage.getItem("userEmail") : null;
            if (!email) return;

            try {
                const [userRes, projectsRes, ticketsRes] = await Promise.all([
                    fetch(`/api/user/me?email=${email}`),
                    fetch(`/api/projects?email=${email}`),
                    fetch(`/api/tickets`)
                ]);

                if (userRes.ok) {
                    const userData = await userRes.json();
                    setUser(userData);
                }
                if (projectsRes.ok) {
                    const projData = await projectsRes.json();
                    setProjects(projData);
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
        };
        fetchUserData();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
            </div>
        );
    }

    if (!user) return null;

    const hasProjects = projects && projects.length > 0;
    const trackName = user.track || "Web Development";
    const trackData = TRACK_RESOURCES[trackName] || TRACK_RESOURCES["Web Development"];
    const mainProject = projects[0];

    // ---- STATE 1: ONBOARDING DASHBOARD ----
    if (!hasProjects) {
        return (
            <div className="max-w-7xl mx-auto px-6 py-6 space-y-6 bg-gray-50/50 min-h-screen">
                {/* TOP ROW: Welcome & Mentor Avatar */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Welcome Header */}
                    <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                        <div className="relative z-10 space-y-4">
                            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                                Welcome back, {user.fullName?.split(' ')[0]}!
                            </h1>
                            <div className="flex flex-wrap items-center gap-3">
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-700 rounded-lg text-sm font-semibold border border-blue-100">
                                    <Sparkles className="w-4 h-4" /> {trackName} Track
                                </span>
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-50 text-gray-600 rounded-lg text-sm font-medium border border-gray-200">
                                    <Clock className="w-4 h-4" /> {user.duration || "N/A"} Duration
                                </span>
                                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-50 text-gray-600 rounded-lg text-sm font-medium border border-gray-200">
                                    <MapPin className="w-4 h-4" /> {user.mode || "Remote"}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Mentor Cartoon Avatar Card */}
                    <div className="lg:col-span-1 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 shadow-md border border-indigo-400 text-white flex items-center gap-5 relative overflow-hidden group">
                        <div className="w-24 h-24 shrink-0 bg-white/20 backdrop-blur-md rounded-full border-2 border-white/30 overflow-hidden shadow-inner flex items-center justify-center p-2 group-hover:scale-105 transition-transform">
                            <img src={`https://api.dicebear.com/7.x/micah/svg?seed=Mentor${user.fullName}&backgroundColor=transparent`} className="w-full h-full scale-110" alt="Mentor" />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-base font-semibold mb-1">Getting Started</h3>
                            <p className="text-sm text-indigo-100 leading-snug mb-3">
                                "Start by exploring your track projects below. Pick a problem statement that matches your current skill goal!"
                            </p>
                            <Link href="/dashboard/projects" className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white text-indigo-600 rounded-lg text-xs font-bold hover:bg-gray-50 transition-colors shadow-sm">
                                Explore Projects <ChevronRight className="w-3.5 h-3.5" />
                            </Link>
                        </div>
                    </div>
                </div>

                {/* MIDDLE ROW: Content & Rules */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Left 70%: Track Overview & Statements */}
                    <div className="lg:col-span-2 space-y-6">

                        {/* Track Overview Card */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <MonitorSmartphone className="w-5 h-5 text-gray-400" /> About Your Track
                            </h2>
                            <p className="text-base text-gray-600 leading-relaxed mb-6">
                                {trackData.overview}
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-widest mb-3">Skills Acquired</h4>
                                    <div className="flex flex-wrap gap-2">
                                        {trackData.skills.map((skill, idx) => (
                                            <span key={idx} className="px-3 py-1 bg-gray-50 text-gray-600 border border-gray-200 rounded-lg text-xs font-medium">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-widest mb-3">Career Relevance</h4>
                                    <p className="text-sm text-gray-600">{trackData.career}</p>
                                </div>
                            </div>
                        </div>

                        {/* Recommended Problem Statements */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <Briefcase className="w-5 h-5 text-gray-400" /> Recommended Problem Statements
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {trackData.statements.map((stmt, idx) => (
                                    <div key={idx} className="p-5 border border-gray-100 rounded-xl bg-gray-50 hover:bg-gray-100/50 hover:border-gray-200 transition-all flex flex-col h-full">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-lg font-semibold text-gray-900">{stmt.title}</h3>
                                            <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full ${stmt.difficulty === 'Hard' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'}`}>
                                                {stmt.difficulty}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600 mb-4 flex-1">{stmt.desc}</p>
                                        <div className="flex items-center gap-4 text-xs font-medium text-gray-500 mb-5">
                                            <span className="flex items-center gap-1"><Timer className="w-3.5 h-3.5" /> {stmt.time}</span>
                                            <span className="flex items-center gap-1"><Code className="w-3.5 h-3.5" /> {stmt.reqs.split(',')[0]}</span>
                                        </div>
                                        <Link href="/dashboard/projects" className="w-full py-2 bg-white border border-gray-200 text-gray-700 text-sm font-semibold rounded-lg text-center hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm">
                                            View Details
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right 30%: Objectives & CTAs */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Objectives Card */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <h2 className="text-xl font-semibold text-gray-900 mb-5 flex items-center gap-2">
                                <Flag className="w-5 h-5 text-emerald-500" /> Internship Objectives
                            </h2>
                            <ul className="space-y-4">
                                {[
                                    "Build one working project",
                                    "Submit repo / design / deployment",
                                    "Attend weekly reviews",
                                    "Complete milestones",
                                    "Resolve admin feedback",
                                    "Stay active in the portal"
                                ].map((obj, i) => (
                                    <li key={i} className="flex items-start gap-3">
                                        <CheckCircle2 className="w-5 h-5 text-gray-300 shrink-0 mt-0.5" />
                                        <span className="text-sm text-gray-700 font-medium">{obj}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* CTA Row */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col gap-3">
                            <h3 className="text-base font-semibold text-gray-900 mb-1">Ready to start?</h3>
                            <Link href="/dashboard/projects" className="w-full py-3 bg-black text-white text-base font-semibold rounded-xl text-center shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all">
                                Choose a Project
                            </Link>
                            <button className="w-full py-3 bg-gray-50 border border-gray-200 text-gray-700 text-base font-semibold rounded-xl text-center hover:bg-gray-100 transition-colors">
                                Read Track Guide
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ---- STATE 2: ACTIVE PROGRESS DASHBOARD ----

    // Dynamic Assistant Logic & Actions
    let avatarSeed = "Mentor" + user.fullName;
    let assistantMessage = "You're making steady progress. Make sure your live link is working!";
    let nextAction = "Submit your next 10% progress update.";
    let healthColor = "blue";
    let healthText = "On Track";
    let healthSubtext = "No blockers reported";

    if (mainProject.progress === 0 || !mainProject.progress) {
        assistantMessage = "You haven't started making progress yet. Let's get your repo set up.";
        nextAction = "Initialize repository and push first commit.";
        healthColor = "gray";
        healthText = "Inactive";
        healthSubtext = "Awaiting first update";
    } else if (missedReviews >= 2) {
        avatarSeed = "Concerned" + user.fullName;
        assistantMessage = "You've missed 2 review meetings. Your progress may be adjusted by admin.";
        nextAction = "Contact your mentor immediately to schedule a makeup sync.";
        healthColor = "red";
        healthText = "At Risk";
        healthSubtext = "Action required";
    } else if (mainProject.progress >= 100) {
        avatarSeed = "Winner" + user.fullName;
        assistantMessage = "Great job! Your project is complete and ready for final verification.";
        nextAction = "Request final admin approval for certification.";
        healthColor = "emerald";
        healthText = "Completed";
        healthSubtext = "Awaiting sign-off";
    } else if (mainProject.status === 'Rejected') {
        avatarSeed = "Thinking" + user.fullName;
        assistantMessage = "Your last submission was rejected. Please review admin feedback.";
        nextAction = "Review feedback and apply necessary changes.";
        healthColor = "red";
        healthText = "Action Needed";
        healthSubtext = "Submission rejected";
    }

    // Support ticket stats
    const openTickets = tickets.filter(t => t.status === 'Open').length;
    const inProgressTickets = tickets.filter(t => t.status === 'In Progress').length;
    const resolvedTickets = tickets.filter(t => t.status === 'Resolved').length;

    // Time calculations
    const lastUpdateDate = new Date(mainProject.updatedAt || mainProject.requestedAt).toLocaleDateString("en-US", { month: 'short', day: 'numeric' });

    return (
        <div className="w-full max-w-[1500px] mx-auto px-6 md:px-10 py-8 space-y-8 bg-gray-50/30 min-h-screen">

            {/* Welcome Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Hello, {user.fullName?.split(' ')[0]} 👋</h1>
                </div>



            {/* Middle Row: Progress and Links */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* Left 50%: Main Project Progress */}
                <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-sm border border-gray-100 relative overflow-hidden flex flex-col justify-center min-h-[320px]">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2" />

                    <div className="relative z-10 w-full">
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <div className="flex items-center gap-4 mb-3">
                                    <h2 className="text-3xl font-bold text-gray-900">{mainProject.projectName}</h2>
                                    <span className={`px-4 py-1.5 text-xs font-bold uppercase tracking-widest rounded-md ${mainProject.status === 'Approved' ? 'bg-emerald-100 text-emerald-800' :
                                        mainProject.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                                            'bg-amber-100 text-amber-800'
                                        }`}>
                                        {mainProject.status}
                                    </span>
                                </div>
                                <p className="text-base text-gray-600 max-w-2xl leading-relaxed">{mainProject.description}</p>
                            </div>
                        </div>

                        <div className="mt-10">
                            <div className="flex justify-between items-end mb-4">
                                <div>
                                    <span className="text-base font-semibold text-gray-900 block mb-1">Milestone Progress</span>
                                    <span className="text-sm text-gray-500 block">Target completion: {mainProject.progress >= 100 ? 'Achieved' : 'Pending'}</span>
                                </div>
                                <span className="text-5xl font-black text-gray-900 tracking-tighter">{mainProject.progress || 0}%</span>
                            </div>

                            {/* Standard Progress Bar */}
                            <div className="w-full flex h-5 bg-gray-100 rounded-full overflow-hidden shadow-inner border border-gray-200">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${mainProject.progress || 0}%` }}
                                    className={`h-full ${mainProject.progress >= 100 ? 'bg-emerald-500' : 'bg-blue-600'} transition-all duration-1000 ease-out`}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right 50%: Guided Assistant Card */}
                <div className="bg-white rounded-[2rem] p-8 md:p-10 shadow-sm border border-gray-100 flex flex-col justify-center relative overflow-hidden min-h-[320px]">
                    <div className="absolute top-0 right-0 w-72 h-72 bg-indigo-50 rounded-full blur-3xl opacity-60 -translate-y-1/2 translate-x-1/2" />

                    <div className="relative z-10 flex flex-col justify-center h-full">
                        <div className="flex items-center gap-8">
                            <div className="w-32 h-32 shrink-0 bg-indigo-50/80 rounded-full flex items-center justify-center p-2 relative overflow-hidden border border-indigo-100 shadow-inner">
                                <img src={`https://api.dicebear.com/7.x/micah/svg?seed=${avatarSeed}&backgroundColor=transparent`} className="w-full h-full scale-110" alt="Avatar" />
                            </div>
                            <div>
                                <p className="text-xl text-gray-800 font-medium leading-relaxed tracking-tight">
                                    "{assistantMessage}"
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* Bottom Row: 4 Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                {/* Track Resources */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col">
                    <h3 className="text-[15px] font-bold text-gray-900 mb-5 flex items-center gap-2">
                        <ExternalLink className="w-4 h-4 text-gray-400" /> Project Links
                    </h3>
                    <div className="space-y-4 flex-1">
                        {trackName === 'UI/UX Design' ? (
                            <>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-200 shrink-0"><FileText className="w-4 h-4 text-gray-500" /></div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[12px] font-semibold text-gray-900 truncate">Figma Design</p>
                                        {mainProject.repoLink ?
                                            <a href={mainProject.repoLink} target="_blank" className="text-[13px] font-medium text-blue-600 hover:underline truncate block">View Source</a> :
                                            <p className="text-[13px] font-medium text-red-500">Missing</p>
                                        }
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-200 shrink-0"><MonitorSmartphone className="w-4 h-4 text-gray-500" /></div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[12px] font-semibold text-gray-900 truncate">Prototype</p>
                                        {mainProject.deployLink ?
                                            <a href={mainProject.deployLink} target="_blank" className="text-[13px] font-medium text-blue-600 hover:underline truncate block">View Demo</a> :
                                            <p className="text-[13px] font-medium text-red-500">Missing</p>
                                        }
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-200 shrink-0"><Github className="w-4 h-4 text-gray-500" /></div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[12px] font-semibold text-gray-900 truncate">Repository</p>
                                        {mainProject.repoLink ?
                                            <a href={mainProject.repoLink} target="_blank" className="text-[13px] font-medium text-blue-600 hover:underline truncate block">View Code</a> :
                                            <p className="text-[13px] font-medium text-red-500">Missing</p>
                                        }
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-200 shrink-0"><Rocket className="w-4 h-4 text-gray-500" /></div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[12px] font-semibold text-gray-900 truncate">Live App</p>
                                        {mainProject.deployLink ?
                                            <a href={mainProject.deployLink} target="_blank" className="text-[13px] font-medium text-blue-600 hover:underline truncate block">View Deploy</a> :
                                            <p className="text-[13px] font-medium text-red-500 border-b border-dashed border-red-300 pb-0.5 cursor-pointer hover:text-red-700 w-max">Add link</p>
                                        }
                                    </div>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Tech Stack */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col">
                    <h3 className="text-[15px] font-bold text-gray-900 mb-5 flex items-center gap-2">
                        <Cpu className="w-4 h-4 text-gray-400" /> Tech Stack
                    </h3>
                    {mainProject.techStack && mainProject.techStack.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                            {mainProject.techStack.map(tech => (
                                <span key={tech} className="px-2.5 py-1.5 bg-gray-50 border border-gray-200 text-gray-700 rounded-md text-[12px] font-medium leading-none">
                                    {tech}
                                </span>
                            ))}
                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col justify-center items-center text-center p-4 border border-dashed border-gray-200 rounded-xl bg-gray-50">
                            <p className="text-[13px] font-medium text-gray-500">No tech added.</p>
                        </div>
                    )}
                </div>

                {/* Weekly Reviews Widget */}
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between lg:col-span-2">
                    <div>
                        <h3 className="text-[15px] font-bold text-gray-900 mb-5 flex items-center gap-2">
                            <MessageSquare className="w-4 h-4 text-gray-400" /> Reviews
                        </h3>

                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 mb-4 flex flex-col items-center justify-center text-center flex-1 min-h-[140px]">
                            <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Next Sync</p>
                            <p className="text-xl font-bold text-gray-900 mb-3 truncate">End-of-Sprint</p>
                            <div className="flex items-center gap-2 text-sm font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full">
                                <Timer className="w-4 h-4" /> 6 days left
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between items-center mb-1.5">
                            <span className="text-[12px] font-medium text-gray-600">Compliance</span>
                            <span className={`text-[12px] font-bold ${missedReviews === 0 ? 'text-emerald-600' : 'text-amber-600'}`}>{100 - (missedReviews * 20)}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${missedReviews === 0 ? 'bg-emerald-500' : missedReviews >= 2 ? 'bg-red-500' : 'bg-amber-500'}`} style={{ width: `${100 - (missedReviews * 20)}%` }} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Helpers
