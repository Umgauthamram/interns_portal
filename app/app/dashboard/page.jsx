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
    // ── Coding Tracks ──────────────────────────────────────────────────────
    "Web Development": {
        overview: "Build full-stack real-world applications. You will learn frontend UI development, backend logic, APIs, secure authentication, database management, and cloud deployment pipelines.",
        skills: ["React / Next.js", "Node.js / APIs", "Tailwind CSS", "Databases", "Authentication"],
        career: "Prepares you for roles like Full-Stack Developer, Frontend Engineer, and Systems Architect.",
    },
    "Blockchain / Web3": {
        overview: "Step into the decentralised future. Learn smart contract development, dApp integration, blockchain fundamentals, and wallet interactions on Ethereum and beyond.",
        skills: ["Solidity", "Ethers.js / Web3.js", "Smart Contracts", "Hardhat", "IPFS"],
        career: "Prepares you for roles like Blockchain Developer, Web3 Engineer, and Smart Contract Auditor.",
    },
    "GenAI": {
        overview: "Master large language models, retrieval-augmented generation apps, and prompt engineering. Build production-grade AI pipelines integrating LLMs, vector databases, and agents.",
        skills: ["LangChain", "OpenAI API", "HuggingFace", "Vector DBs", "Prompt Engineering"],
        career: "Prepares you for roles like AI Engineer, ML Consultant, and Solutions Architect.",
    },
    "AI/ML": {
        overview: "Dive deep into statistical learning, neural networks, predictive modelling, and model training methodologies. Take models from research to production.",
        skills: ["Python", "TensorFlow / PyTorch", "Scikit-Learn", "Pandas", "Model Deployment"],
        career: "Prepares you for roles like Machine Learning Engineer and Data Scientist.",
    },
    "App Development": {
        overview: "Create robust, cross-platform mobile applications. Explore mobile architectures, responsive layouts, device integrations, and App Store readiness.",
        skills: ["Flutter / React Native", "State Management", "REST APIs", "Firebase", "UI Animation"],
        career: "Prepares you for roles like Mobile Developer, iOS/Android Engineer.",
    },

    // ── Research Tracks ────────────────────────────────────────────────────
    "Robotics & Autonomous System Track": {
        overview: "Design and build autonomous systems — from sensor fusion and path planning to real-time control systems. Bridge software intelligence with physical hardware.",
        skills: ["ROS / ROS2", "Computer Vision", "Sensor Fusion", "Path Planning", "Embedded C++"],
        career: "Prepares you for roles like Robotics Engineer, Autonomous Systems Developer, and Control Systems Researcher.",
    },
    "Cybersecurity": {
        overview: "Explore ethical hacking, threat modelling, secure system design, and vulnerability research. Learn to defend systems against modern adversarial attacks.",
        skills: ["Penetration Testing", "Network Security", "Cryptography", "OSINT", "Forensics"],
        career: "Prepares you for roles like Security Analyst, Penetration Tester, and SOC Engineer.",
    },
    "Semiconductor": {
        overview: "Investigate semiconductor physics, chip architecture, fabrication processes, and VLSI design. Work at the intersection of physics and digital electronics.",
        skills: ["VLSI Design", "VHDL / Verilog", "Spice Simulation", "Semiconductor Physics", "EDA Tools"],
        career: "Prepares you for roles like IC Design Engineer, Chip Architect, and Fab Process Engineer.",
    },
    "Biotechnology": {
        overview: "Apply computational and engineering principles to biological systems — from genomics and protein modelling to lab-on-chip devices and synthetic biology.",
        skills: ["Bioinformatics", "CRISPR Concepts", "Protein Modelling", "Lab Techniques", "Python (BioPython)"],
        career: "Prepares you for roles like Bioinformatics Analyst, Research Scientist, and Biotech Engineer.",
    },
    "Renewable Energy": {
        overview: "Research sustainable energy technologies — solar, wind, battery storage, and smart grid architectures. Contribute to the clean energy transition through applied engineering.",
        skills: ["Energy Systems Modelling", "MATLAB / Simulink", "Power Electronics", "Grid Analysis", "Solar/Wind Tech"],
        career: "Prepares you for roles like Energy Systems Engineer, Sustainability Consultant, and Power Electronics Designer.",
    },
    "Artificial Intelligence": {
        overview: "Conduct foundational AI research spanning reinforcement learning, knowledge representation, multi-agent systems, and AI safety. Push the boundaries of general intelligence research.",
        skills: ["Deep Learning", "Reinforcement Learning", "Knowledge Graphs", "Research Methods", "Python / JAX"],
        career: "Prepares you for roles like AI Research Scientist, ML Researcher, and Research Engineer.",
    },
    "Quantum Computing": {
        overview: "Explore quantum algorithms, quantum circuits, and error correction. Implement and simulate quantum programs using platforms like Qiskit and understand the path to quantum advantage.",
        skills: ["Qiskit / Cirq", "Quantum Gates", "Quantum Algorithms", "Linear Algebra", "Error Correction"],
        career: "Prepares you for roles like Quantum Engineer, Quantum Algorithm Researcher, and Quantum Software Developer.",
    },

    // ── Generic fallbacks ──────────────────────────────────────────────────
    "__RESEARCH__": {
        overview: "Conduct in-depth research, develop prototypes, and produce technical documentation in your specialist field. Drive innovation through rigorous scientific methodology.",
        skills: ["Research Methods", "Prototyping", "Scientific Analysis", "Technical Writing", "Literature Review"],
        career: "Prepares you for roles like R&D Engineer, Research Scientist, and Domain Specialist.",
    },
    "__CODING__": {
        overview: "Apply software engineering principles to build, test, and deploy real-world technical projects. Grow your skills across the full development lifecycle.",
        skills: ["Software Engineering", "Version Control", "Testing", "APIs", "Deployment"],
        career: "Prepares you for various engineering roles in the tech industry.",
    },
};

// Research track names (used to detect category when user.category is unavailable)
const RESEARCH_TRACKS = ["Robotics & Autonomous System Track", "Cybersecurity", "Semiconductor", "Biotechnology", "Renewable Energy", "Artificial Intelligence", "Quantum Computing"];


export default function StudentDashboard() {
    const [user, setUser] = useState(null);
    const [projects, setProjects] = useState([]);
    const [poolProjects, setPoolProjects] = useState([]);
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);

    const [nextSync, setNextSync] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            const email = typeof window !== 'undefined' ? localStorage.getItem("userEmail") : null;
            if (!email) return;

            try {
                const [userRes, projectsRes, ticketsRes, scheduleRes] = await Promise.all([
                    fetch(`/api/user/me?email=${email}`),
                    fetch(`/api/projects?email=${email}`),
                    fetch(`/api/tickets`),
                    fetch(`/api/schedule?role=intern&email=${email}`)
                ]);

                if (userRes.ok) {
                    const userData = await userRes.json();
                    setUser(userData);

                    try {
                        const poolRes = await fetch(`/api/admin/projects/pool?track=${encodeURIComponent(userData.track || 'Web Development')}`);
                        if (poolRes.ok) {
                            const pData = await poolRes.json();
                            setPoolProjects(pData);
                        }
                    } catch (e) { console.error(e); }
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
                if (scheduleRes.ok) {
                    const scheduleData = await scheduleRes.json();
                    if (Array.isArray(scheduleData)) {
                        const now = new Date();
                        const upcoming = scheduleData
                            .map(s => ({ ...s, dateObj: new Date(s.date) }))
                            .filter(s => s.dateObj >= new Date(now.setHours(0, 0, 0, 0)))
                            .sort((a, b) => a.dateObj - b.dateObj);

                        if (upcoming.length > 0) {
                            setNextSync(upcoming[0]);
                        }
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
    const trackData = TRACK_RESOURCES[trackName]
        || (RESEARCH_TRACKS.includes(trackName) || user.category === 'RESEARCH'
            ? TRACK_RESOURCES["__RESEARCH__"]
            : TRACK_RESOURCES["__CODING__"]);
    const mainProject = projects ? projects[0] : null;
    const missedReviews = user.missedMeetings || 0;

    // ---- STATE 2 VARIABLES (PRE-CALCULATED) ----
    let avatarSeed = "Mentor" + user.fullName;
    let assistantMessage = "You're making steady progress. Make sure your live link is working!";
    let nextAction = "Submit your next 10% progress update.";
    let healthColor = "blue";
    let healthText = "On Track";
    let healthSubtext = "No blockers reported";

    if (mainProject) {
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
    }

    // Support ticket stats
    const openTickets = tickets.filter(t => t.status === 'Open').length;
    const inProgressTickets = tickets.filter(t => t.status === 'In Progress').length;
    const resolvedTickets = tickets.filter(t => t.status === 'Resolved').length;

    // Time calculations
    const lastUpdateDate = mainProject ? new Date(mainProject.updatedAt || mainProject.requestedAt).toLocaleDateString("en-US", { month: 'short', day: 'numeric' }) : "";

    // ---- MAIN RENDER WITH FRAMER MOTION TRANSITIONS ----
    return (
        <AnimatePresence mode="wait">
            {!hasProjects ? (
                <motion.div
                    key="onboarding"
                    initial={{ opacity: 0, scale: 0.98, filter: "blur(5px)" }}
                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)", transition: { duration: 0.6 } }}
                    exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)", transition: { duration: 0.8, ease: "easeIn" } }}
                    className="max-w-7xl mx-auto px-6 py-6 space-y-6 bg-gray-50/50 min-h-screen origin-center"
                >
                    {/* TOP ROW: Welcome & Mentor Avatar */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Welcome Header */}
                        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col justify-center relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                            <div className="relative z-10 space-y-4">
                                <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                                    Hi {user.fullName?.split(' ')[0]} 👋
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
                        <div className="lg:col-span-1 bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-5 relative overflow-hidden group">
                            <div className="w-24 h-24 shrink-0 bg-gray-50/80 rounded-full border border-gray-200 overflow-hidden flex items-center justify-center p-2 group-hover:scale-105 transition-transform">
                                <img src={`https://api.dicebear.com/7.x/micah/svg?seed=Mentor${user.fullName}&backgroundColor=transparent`} className="w-full h-full scale-110" alt="Mentor" />
                            </div>
                            <div className="flex-1">
                                <h3 className="text-base font-semibold text-gray-900 mb-1">Getting Started</h3>
                                <p className="text-sm text-gray-500 leading-snug mb-3">
                                    "Start by exploring your track projects below. Pick a problem statement that matches your current skill goal!"
                                </p>
                                <Link href="/dashboard/projects" className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-black text-white rounded-lg text-xs font-bold hover:bg-gray-800 transition-colors shadow-sm">
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
                                    {poolProjects.length > 0 ? (
                                        poolProjects.slice(0, 4).map((stmt, idx) => (
                                            <div key={idx} className="p-5 border border-gray-100 rounded-xl bg-gray-50 hover:bg-gray-100/50 hover:border-gray-200 transition-all flex flex-col h-full">
                                                <div className="flex justify-between items-start mb-2 gap-2">
                                                    <h3 className="text-base font-semibold text-gray-900 leading-snug">{stmt.title}</h3>
                                                    <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-full shrink-0 ${stmt.difficulty === 'Hard' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-600'}`}>
                                                        {stmt.difficulty}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-600 mb-4 flex-1 line-clamp-2">{stmt.description}</p>
                                                <div className="flex items-center gap-4 text-xs font-medium text-gray-500 mb-5">
                                                    <span className="flex items-center gap-1"><Timer className="w-3.5 h-3.5" /> {stmt.deadline || "1 Month"}</span>
                                                    <span className="flex items-center gap-1"><Code className="w-3.5 h-3.5" /> {(stmt.techStack || 'Various').split(',')[0]}</span>
                                                </div>
                                                <Link href="/dashboard/projects" className="w-full py-2 bg-white border border-gray-200 text-gray-700 text-sm font-semibold rounded-lg text-center hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm">
                                                    View Details
                                                </Link>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="col-span-1 md:col-span-2 p-6 text-center text-sm text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                            No active problem statements available for your track right now.
                                        </div>
                                    )}
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
                </motion.div>
            ) : (
                <motion.div
                    key="active"
                    initial={{ opacity: 0, scale: 0.9, filter: "blur(15px)" }}
                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)", transition: { duration: 0.7, delay: 0.1 } }}
                    className="w-full max-w-[1500px] mx-auto px-6 md:px-10 py-8 space-y-8 bg-gray-50/30 min-h-screen origin-center"
                >
                    {/* Welcome Header */}
                    <div className="mb-8">
                        <h1 className="text-4xl font-bold text-gray-900 tracking-tight">Hello, {user.fullName?.split(' ')[0]} 👋</h1>
                    </div>

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
                                {mainProject.category === 'RESEARCH' ? (
                                    <>
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-200 shrink-0"><FileText className="w-4 h-4 text-gray-500" /></div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[12px] font-semibold text-gray-900 truncate">Document Storage</p>
                                                {mainProject.documentFile ?
                                                    <a href={mainProject.documentFile} target="_blank" rel="noreferrer" className="text-[13px] font-medium text-blue-600 hover:underline truncate block">View File</a> :
                                                    <Link href="/dashboard/projects" className="text-[13px] font-medium text-red-500 border-b border-dashed border-red-300 pb-0.5 cursor-pointer hover:text-red-700 w-max">Add file</Link>
                                                }
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-200 shrink-0"><ExternalLink className="w-4 h-4 text-gray-500" /></div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[12px] font-semibold text-gray-900 truncate">Document Link</p>
                                                {mainProject.documentLink ?
                                                    <a href={mainProject.documentLink} target="_blank" rel="noreferrer" className="text-[13px] font-medium text-blue-600 hover:underline truncate block">View URL</a> :
                                                    <Link href="/dashboard/projects" className="text-[13px] font-medium text-red-500 border-b border-dashed border-red-300 pb-0.5 cursor-pointer hover:text-red-700 w-max">Add link</Link>
                                                }
                                            </div>
                                        </div>
                                    </>
                                ) : trackName === 'UI/UX Design' ? (
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
                                                    <Link href="/dashboard/projects" className="text-[13px] font-medium text-red-500 border-b border-dashed border-red-300 pb-0.5 cursor-pointer hover:text-red-700 w-max block">Add repo</Link>
                                                }
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-gray-50 rounded-lg flex items-center justify-center border border-gray-200 shrink-0"><Rocket className="w-4 h-4 text-gray-500" /></div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-[12px] font-semibold text-gray-900 truncate">{trackName?.includes('Web3') ? "Demo / Testnet" : "Live App"}</p>
                                                {mainProject.deployLink ?
                                                    <a href={mainProject.deployLink} target="_blank" className="text-[13px] font-medium text-blue-600 hover:underline truncate block">View Deploy</a> :
                                                    <Link href="/dashboard/projects" className="text-[13px] font-medium text-red-500 border-b border-dashed border-red-300 pb-0.5 cursor-pointer hover:text-red-700 w-max block">Add link</Link>
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
                                <h3 className="text-[15px] font-bold text-gray-900 mb-5 flex items-center justify-between">
                                    <span className="flex items-center gap-2"><MessageSquare className="w-4 h-4 text-gray-400" /> Reviews</span>
                                    <Link href="/dashboard/schedule" className="p-1 hover:bg-gray-50 rounded-lg group transition-colors">
                                        <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-black transition-colors" />
                                    </Link>
                                </h3>

                                <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 mb-4 flex flex-col items-center justify-center text-center flex-1 min-h-[140px]">
                                    <p className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-1">Next Sync</p>
                                    <p className="text-xl font-bold text-gray-900 mb-3 truncate">
                                        {nextSync ? (nextSync.description?.slice(0, 20) || 'Admin Review') : 'No Upcoming Sync'}
                                    </p>
                                    {nextSync ? (
                                        <div className="flex flex-col items-center gap-2">
                                            <div className="flex items-center gap-2 text-sm font-bold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-full">
                                                <Calendar className="w-4 h-4" />
                                                {new Date(nextSync.date).toLocaleDateString("en-US", { month: 'short', day: 'numeric' })} at {nextSync.time}
                                            </div>
                                            {(() => {
                                                const diff = Math.ceil((new Date(nextSync.date) - new Date()) / (1000 * 60 * 60 * 24));
                                                return diff > 0 && (
                                                    <p className="text-[10px] font-black uppercase text-gray-400">
                                                        {diff === 1 ? 'Tomorrow' : `${diff} days left`}
                                                    </p>
                                                );
                                            })()}
                                        </div>
                                    ) : (
                                        <p className="text-sm font-medium text-gray-400">Schedule will appear here</p>
                                    )}
                                </div>
                            </div>


                        </div>
                    </div>
                </motion.div>
            )
            }
        </AnimatePresence >
    );
}

// Helpers
