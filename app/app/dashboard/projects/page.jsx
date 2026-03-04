"use client";

import {
    FolderGit2,
    Plus,
    Layout,
    Code,
    Database,
    X,
    Upload,
    Globe,
    Zap,
    Target,
    ArrowRight,
    Search,
    Flame,
    FileText,
    ChevronLeft,
    Monitor,
    Link as LinkIcon,
    Image as ImageIcon,
    CheckCircle2,
    Calendar as CalendarIcon,
    Briefcase,
    Terminal,
    Rocket
} from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { toast } from "react-hot-toast";

// Config & Mock Data
const USER_TRACK = "Web Development"; // This would normally come from useAuth or an API

const submissionColors = [
    { name: "Violet", hex: "#8b5cf6", blob: "bg-violet-600", badge: "bg-violet-50 text-violet-700" },
    { name: "Emerald", hex: "#10b981", blob: "bg-emerald-500", badge: "bg-emerald-50 text-emerald-700" },
    { name: "Blue", hex: "#3b82f6", blob: "bg-blue-500", badge: "bg-blue-50 text-blue-700" },
    { name: "Amber", hex: "#f59e0b", blob: "bg-amber-500", badge: "bg-amber-50 text-amber-700" },
    { name: "Rose", hex: "#f43f5e", blob: "bg-rose-500", badge: "bg-rose-50 text-rose-700" },
];

const TRACK_TECH_STACKS = {
    "Web Development": ["Next.js", "React", "Node.js", "Playwright", "Tailwind CSS", "MongoDB", "PostgreSQL", "Firebase"],
    "Research & Development": ["Python", "TensorFlow", "PyTorch", "Flask", "D3.js", "Scikit-Learn", "FastAPI"]
};

// Removed MOCK_PROBLEM_STATEMENTS array to rely on dynamic fetching

const ProjectCard = ({ p, onEdit }) => {
    const pathRef = useRef(null);
    const [firePos, setFirePos] = useState({ x: 0, y: 0, ang: 0 });

    // Precision Border Path: Mathematically synchronized with the absolute perimeter of the card.
    // Box: (0,0) to (400,330) | Radius: 32px
    const pathD = "M 32,1 L 368,1 A 31,31 0 0 1 399,32 L 399,298 A 31,31 0 0 1 368,329 L 32,329 A 31,31 0 0 1 1,298 L 1,32 A 31,31 0 0 1 32,1 Z";

    useEffect(() => {
        const updateFire = () => {
            if (pathRef.current && p.progress < 100) {
                const path = pathRef.current;
                const totalLen = path.getTotalLength();
                if (totalLen === 0) return;
                const currentLen = totalLen * (p.progress / 100);
                const pt = path.getPointAtLength(currentLen);
                const delta = 0.5;
                const nextPt = path.getPointAtLength(Math.min(totalLen, currentLen + delta));
                const angle = Math.atan2(nextPt.y - pt.y, nextPt.x - pt.x) * (180 / Math.PI);
                setFirePos({ x: pt.x, y: pt.y, ang: angle });
            }
        };
        const timer = setInterval(updateFire, 16);
        window.addEventListener('resize', updateFire);
        return () => { clearInterval(timer); window.removeEventListener('resize', updateFire); };
    }, [p.progress]);

    return (
        <div className="relative h-[330px] w-full group">
            <div className="absolute inset-0 pointer-events-none z-30 overflow-visible">
                <svg className="w-full h-full overflow-visible" viewBox="0 0 400 330" preserveAspectRatio="none">
                    <path d={pathD} fill="none" stroke="#f3f4f6" strokeWidth="2" />
                    {p.progress > 0 && (
                        <path
                            ref={pathRef}
                            d={pathD}
                            fill="none"
                            stroke={p.colorHex}
                            strokeWidth="4"
                            strokeDasharray="1400"
                            strokeDashoffset={1400 - (1400 * p.progress / 100)}
                            strokeLinecap="round"
                            style={{ transition: 'stroke-dashoffset 0.6s cubic-bezier(0.2, 0, 0, 1)' }}
                        />
                    )}
                    {p.progress < 100 && firePos.x !== 0 && (
                        <g transform={`translate(${firePos.x}, ${firePos.y}) rotate(${firePos.ang})`}>
                            {/* Proportional Kinetic Ambient Glow */}
                            <motion.circle
                                r="15"
                                fill="#ff4500"
                                animate={{ scale: [1, 1.3, 1], opacity: [0.05, 0.15, 0.05] }}
                                transition={{ duration: 1, repeat: Infinity }}
                                className="filter blur-[10px]"
                            />

                            {/* Proper High-Fidelity Clockwise Combustion Flame */}
                            <motion.g
                                animate={{
                                    scale: [1, 1.25, 1],
                                    x: [0, 2, 0]
                                }}
                                transition={{ duration: 0.2, repeat: Infinity, ease: "linear" }}
                            >
                                {/* Outer Combustion Hull (Deep Red) */}
                                <motion.path
                                    d="M 14,0 C 14,0 10,-4 0,-12 C -6,-15 -10,-8 -10,0 C -10,8 -6,15 0,12 C 10,4 14,0 14,0 Z"
                                    fill="#ff0000"
                                    animate={{
                                        d: [
                                            "M 14,-1 C 14,-1 10,-5 0,-14 C -6,-17 -10,-8 -10,0 C -10,8 -6,17 0,14 C 10,5 14,1 14,1 Z",
                                            "M 16,0 C 16,0 12,-3 0,-10 C -6,-12 -10,-6 -10,0 C -10,6 -6,12 0,10 C 12,3 16,0 16,0 Z",
                                            "M 14,1 C 14,1 10,-3 0,-12 C -6,-15 -10,-8 -10,0 C -10,8 -6,15 0,12 C 10,3 14,-1 14,-1 Z"
                                        ]
                                    }}
                                    transition={{ duration: 0.15, repeat: Infinity }}
                                    style={{ filter: "drop-shadow(0 0 10px rgba(255, 0, 0, 0.6))" }}
                                />

                                {/* Inner Energy Body (Bright Amber) */}
                                <motion.path
                                    d="M 8,0 C 8,0 4,-3 0,-8 C -4,-10 -6,-5 -6,0 C -6,5 -4,10 0,8 C 4,3 8,0 8,0 Z"
                                    fill="#ffcc00"
                                    animate={{ scale: [0.95, 1.1, 0.95] }}
                                    transition={{ duration: 0.1, repeat: Infinity }}
                                />

                                {/* Thermal Focal Point (White) */}
                                <circle cx="4" cy="0" r="2.5" fill="#ffffff" className="filter blur-[0.5px]" />
                            </motion.g>
                        </g>
                    )}
                </svg>
                {p.progress === 100 && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute top-0 left-0 -ml-1 -mt-1 z-50">
                        <div className="w-8 h-8 bg-white rounded-full border-2 border-emerald-500 flex items-center justify-center shadow-lg">
                            <div className="w-5 h-5 bg-emerald-500 rounded-full flex items-center justify-center">
                                <Target className="w-3 h-3 text-white" />
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>

            <div
                onClick={() => onEdit(p)}
                className="absolute inset-0 rounded-[2rem] p-6 overflow-hidden bg-white shadow-lg transition-all flex flex-col justify-between cursor-pointer hover:shadow-2xl hover:scale-[1.01] active:scale-[0.99] group/card"
                style={{
                    background: `linear-gradient(135deg, #ffffff 0%, #ffffff 40%, ${p.colorHex}15 100%)`
                }}
            >
                <div className="flex justify-between items-start relative z-10">
                    <div className="space-y-1">
                        <h3 className="text-xl font-black text-gray-900 uppercase leading-none tracking-tighter line-clamp-1 group-hover/card:text-black transition-colors">
                            {p.title}
                        </h3>
                        <span className="inline-block px-2 py-0.5 bg-gray-50 text-[7px] font-black uppercase text-gray-400 rounded-lg border border-gray-100">{p.track}</span>
                    </div>
                    <div className={`px-2.5 py-1 rounded-full text-[7px] font-black uppercase tracking-widest border shadow-sm flex items-center gap-1.5 ${p.progress === 100 ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : p.status === 'Pending' ? 'bg-amber-50 text-amber-600 border-amber-100' : p.status === 'Rejected' ? 'bg-rose-50 text-rose-600 border-rose-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
                        {p.progress === 100 && <X className="w-2.5 h-2.5 rotate-45" strokeWidth={3} />}
                        {p.progress === 100 ? 'COMPLETED' : p.status === 'Pending' ? 'REQUEST PENDING' : p.status === 'Rejected' ? 'REJECTED' : 'IN PROGRESS'}
                    </div>
                </div>

                <div className="space-y-3 relative z-10">
                    <div className="flex flex-wrap gap-1.5 opacity-60 group-hover:opacity-100 transition-all">
                        {p.techStack?.slice(0, 3).map((tech, i) => (
                            <span key={i} className="text-[7px] font-black uppercase tracking-tighter text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-100 group-hover/card:border-gray-200 transition-colors">{tech}</span>
                        ))}
                    </div>
                </div>

                <div className="flex items-end justify-between relative z-10">
                    <div className="space-y-1">
                        <div className="flex items-baseline gap-1">
                            <span className="text-6xl font-black text-gray-900 leading-none tracking-tighter">{p.progress}</span>
                            <span className="text-lg font-bold text-gray-200">%</span>
                        </div>
                        <p className="text-[7px] font-black text-gray-300 uppercase tracking-[0.3em] ml-0.5">Integration Level</p>
                    </div>

                    <div className="text-right space-y-0.5">
                        <div className="flex items-center gap-1 justify-end text-gray-200">
                            <CalendarIcon className="w-2.5 h-2.5" />
                            <span className="text-[7px] font-black uppercase tracking-widest">EOL</span>
                        </div>
                        <p className="text-[9px] font-black text-gray-700 uppercase">24 MAR 26</p>
                    </div>
                </div>
                <div className="absolute bottom-[-10px] right-[-10px] opacity-[0.02] group-hover/card:opacity-[0.05] transition-opacity pointer-events-none transform rotate-12">
                    <FolderGit2 className="w-32 h-32" />
                </div>
            </div>
        </div>
    );
};

export default function ProjectsPage() {
    const [projects, setProjects] = useState([]);
    const [availablePool, setAvailablePool] = useState([]);

    useEffect(() => {
        const fetchProjects = async () => {
            const email = localStorage.getItem("userEmail");
            if (!email) return;
            try {
                const res = await fetch(`/api/projects?email=${email}`);
                if (res.ok) {
                    const data = await res.json();
                    const mapped = data.map(p => ({
                        id: p._id,
                        title: p.projectName,
                        description: p.description,
                        status: p.status,
                        progress: p.progress,
                        colorHex: p.colorHex || "#8b5cf6",
                        track: p.track,
                        techStack: p.techStack || [],
                        repoLink: p.repoLink,
                        deployLink: p.deployLink,
                        solution: p.solution,
                        projectType: p.projectType
                    }));
                    setProjects(mapped);
                }
            } catch (err) {
                console.error("Fetch projects error:", err);
            }

            try {
                const poolRes = await fetch('/api/admin/projects/pool');
                if (poolRes.ok) {
                    const data = await poolRes.json();
                    const formattedPool = data.map(p => ({
                        id: p._id,
                        title: p.title,
                        track: p.track,
                        description: p.description,
                        techStack: p.techStack ? p.techStack.split(',').map(s => s.trim()) : []
                    }));
                    setAvailablePool(formattedPool);
                }
            } catch (err) {
                console.error("Fetch pool error:", err);
            }
        };
        fetchProjects();
    }, []);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalStep, setStep] = useState(1); // 1: Choose Type, 2: Form
    const [projType, setProjType] = useState(null); // 'custom' or 'preset'

    const [formData, setFormData] = useState({
        id: null, title: "", description: "", color: submissionColors[0],
        repoLink: "", deployLink: "", solution: "", techStack: [], document: null, progress: 0
    });

    const isReadOnly = formData.id && formData.progress === 100;

    const handleEdit = (project) => {
        if (project.progress === 100) {
            toast.error("Intelligence Locked: Completed deployments cannot be modified.");
            return;
        }

        // Determine if it was created as a Problem Pool (preset) or Custom Intel
        const isPreset = project.projectType === 'preset' || (!project.projectType && availablePool.some(s => s.title === project.title));

        setProjType(isPreset ? 'preset' : 'custom');
        setFormData({
            ...project,
            color: submissionColors.find(c => c.hex === project.colorHex) || submissionColors[0]
        });
        setStep(2);
        setIsModalOpen(true);
    };

    const resetModal = () => {
        setIsModalOpen(false);
        setStep(1);
        setProjType(null);
        setFormData({ id: null, title: "", description: "", color: submissionColors[0], repoLink: "", deployLink: "", solution: "", techStack: [], document: null, progress: 0 });
    };

    const handleSubmission = async (e) => {
        e.preventDefault();
        if (isReadOnly) return;
        const email = localStorage.getItem("userEmail");

        try {
            if (formData.id) {
                // Update existing
                const res = await fetch('/api/projects', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        id: formData.id,
                        title: formData.title,
                        description: formData.description,
                        colorHex: formData.color.hex,
                        techStack: formData.techStack,
                        repoLink: formData.repoLink,
                        deployLink: formData.deployLink,
                        solution: formData.solution,
                        progress: formData.progress
                    })
                });
                if (res.ok) {
                    setProjects(prev => prev.map(p => p.id === formData.id ? {
                        ...p,
                        ...formData,
                        colorHex: formData.color.hex
                    } : p));
                    toast.success("Intelligence Updated Successfully.");
                }
            } else {
                // Create new
                const res = await fetch('/api/projects', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        internEmail: email,
                        title: formData.title,
                        description: formData.description,
                        colorHex: formData.color.hex,
                        techStack: formData.techStack,
                        repoLink: formData.repoLink,
                        deployLink: formData.deployLink,
                        solution: formData.solution,
                        progress: 10,
                        track: USER_TRACK,
                        isPreset: projType === 'preset'
                    })
                });
                if (res.ok) {
                    const { project } = await res.json();
                    const newProject = {
                        id: project._id,
                        title: project.projectName,
                        description: project.description,
                        status: project.status,
                        progress: project.progress,
                        colorHex: project.colorHex,
                        track: project.track,
                        techStack: project.techStack,
                        repoLink: project.repoLink,
                        deployLink: project.deployLink,
                        solution: project.solution
                    };
                    setProjects(prev => [newProject, ...prev]);
                    toast.success("Deployment Initiated Successfully.");
                } else {
                    toast.error("Deployment failed");
                }
            }
        } catch (error) {
            console.error(error);
            toast.error("Internal Error");
        }
        resetModal();
    };

    const myStatements = availablePool.filter(s => s.track === USER_TRACK);

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-12">
            {/* Header with Protocol Action */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-black rounded-lg shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] text-white">
                        <Rocket className="w-4 h-4" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-black text-gray-900 tracking-tighter uppercase leading-none">Project Hub</h1>

                    </div>
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="group relative flex items-center gap-4 bg-black text-white px-5 py-3 rounded-[2rem] shadow-2xl hover:scale-[1.05] active:scale-95 transition-all overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                        <Plus className="w-6 h-6" />
                        <span className="text-[11px] font-black uppercase tracking-[0.2em]">Create</span>
                    </button>
                </div>
            </div>

            {/* Main Operations Grid */}
            <div className="space-y-8">
                <div className="flex items-center gap-4">
                    <div className="h-px flex-1 bg-gray-100" />
                    <div className="h-px flex-1 bg-gray-100" />
                </div>

                <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {projects.map(p => <ProjectCard key={p.id} p={p} onEdit={handleEdit} />)}
                </motion.div>
            </div>

            {/* Refined Creation Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={resetModal} className="absolute inset-0 bg-black/70 backdrop-blur-3xl" />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 40 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 40 }}
                            className="relative w-full max-w-5xl bg-white rounded-[3rem] p-10 shadow-[0_80px_160px_-30px_rgba(0,0,0,0.6)] overflow-hidden"
                        >
                            {/* Modal Header */}
                            <div className="flex justify-between items-center mb-10 relative z-10">
                                <div className="flex items-center gap-6">
                                    {modalStep > 1 && (
                                        <button onClick={() => setStep(1)} className="p-4 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-all">
                                            <ChevronLeft className="w-5 h-5" />
                                        </button>
                                    )}
                                    <div>
                                        <h3 className="text-3xl font-black text-gray-900 tracking-tighter uppercase leading-none">
                                            {formData.id ? (isReadOnly ? "Audit Level Access" : "Modify Intel") : (modalStep === 1 ? "Mission Select" : projType === 'custom' ? "Custom Intel" : "Assigned Scope")}
                                        </h3>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.5em] mt-3 ml-1">Stage {modalStep} of 2</p>
                                    </div>
                                </div>
                                <button onClick={resetModal} className="p-4 bg-rose-50 text-rose-500 rounded-2xl hover:bg-rose-100 transition-all">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="max-h-[75vh] overflow-y-auto pr-6 custom-scrollbar relative z-10 scroll-smooth">
                                {modalStep === 1 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div
                                            onClick={() => { setProjType('custom'); setStep(2); }}
                                            className="p-10 bg-gray-50 rounded-[2.5rem] border-4 border-transparent hover:border-black hover:bg-white transition-all cursor-pointer group shadow-sm hover:shadow-xl flex flex-col items-center text-center"
                                        >
                                            <div className="w-20 h-20 bg-white rounded-[1.5rem] flex items-center justify-center mb-8 group-hover:scale-110 shadow-lg transition-all">
                                                <Terminal className="w-10 h-10 text-gray-400 group-hover:text-black" />
                                            </div>
                                            <h4 className="text-xl font-black text-gray-900 uppercase tracking-tighter">Custom Project</h4>
                                            <p className="text-[12px] text-gray-400 font-medium mt-4 leading-relaxed max-w-[200px]">Propose a unique scope tailored to your strengths.</p>
                                        </div>
                                        <div
                                            onClick={() => { setProjType('preset'); setStep(2); }}
                                            className="p-10 bg-gray-50 rounded-[2.5rem] border-4 border-transparent hover:border-black hover:bg-white transition-all cursor-pointer group shadow-sm hover:shadow-xl flex flex-col items-center text-center"
                                        >
                                            <div className="w-20 h-20 bg-white rounded-[1.5rem] flex items-center justify-center mb-8 group-hover:scale-110 shadow-lg transition-all">
                                                <Target className="w-10 h-10 text-gray-400 group-hover:text-emerald-500" />
                                            </div>
                                            <h4 className="text-xl font-black text-gray-900 uppercase tracking-tighter">Problem Pool</h4>
                                            <p className="text-[12px] text-gray-400 font-medium mt-4 leading-relaxed max-w-[200px]">Deploy solutions for pre-validated challenges.</p>
                                        </div>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmission} className="space-y-12 pb-8 px-2">
                                        {projType === 'custom' ? (
                                            <div className="space-y-10">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                    <div className="space-y-2">
                                                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] ml-2">Project Title</label>
                                                        <input required disabled={isReadOnly} className="w-full bg-gray-50 border-0 rounded-[1.5rem] px-6 py-4 text-sm font-bold focus:ring-8 focus:ring-black/5 outline-none disabled:opacity-50" value={formData.title} onChange={e => setFormData({ ...formData, title: e.target.value })} placeholder="Project Name" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] ml-2">Signature Theme</label>
                                                        <div className="flex gap-3">
                                                            {submissionColors.map(c => (
                                                                <button key={c.name} type="button" disabled={isReadOnly} onClick={() => setFormData({ ...formData, color: c })} className={`w-10 h-10 rounded-xl ${c.blob} transition-all ${formData.color.name === c.name ? 'ring-4 ring-black/5 scale-110 shadow-lg' : 'hover:scale-105'}`} />
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] ml-2">Technical Description</label>
                                                    <textarea required rows="3" disabled={isReadOnly} className="w-full bg-gray-50 border-0 rounded-[2rem] px-8 py-6 text-sm font-bold focus:ring-8 focus:ring-black/5 outline-none resize-none disabled:opacity-50" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} placeholder="Project scope..." />
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                    <div className="space-y-2">
                                                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] ml-2">Tech Stack</label>
                                                        <div className="flex flex-wrap gap-1.5 pt-1">
                                                            {TRACK_TECH_STACKS[USER_TRACK].map(tech => (
                                                                <button
                                                                    key={tech}
                                                                    type="button"
                                                                    disabled={isReadOnly}
                                                                    onClick={() => {
                                                                        const exists = formData.techStack.includes(tech);
                                                                        setFormData({ ...formData, techStack: exists ? formData.techStack.filter(t => t !== tech) : [...formData.techStack, tech] });
                                                                    }}
                                                                    className={`px-3 py-1.5 rounded-lg text-[8px] font-bold uppercase transition-all border ${formData.techStack.includes(tech) ? 'bg-black text-white border-black' : 'bg-white text-gray-400 border-gray-100'}`}
                                                                >
                                                                    {tech}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] ml-2">Deliverable</label>
                                                        <div className={`relative h-20 bg-gray-50 rounded-[1.5rem] border-2 border-dashed border-gray-200 flex items-center justify-center ${isReadOnly ? 'cursor-not-allowed opacity-50' : 'hover:border-black cursor-pointer group'} transition-all overflow-hidden bg-white`}>
                                                            <input type="file" disabled={isReadOnly} className="absolute inset-0 opacity-0 cursor-pointer" />
                                                            <div className="flex items-center gap-3 text-gray-400 group-hover:text-black">
                                                                <Upload className="w-5 h-5" />
                                                                <span className="text-[8px] font-black uppercase tracking-widest">Upload .PDF</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                    <div className="space-y-2">
                                                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] ml-2">GitHub Repository (Required)</label>
                                                        <input required disabled={isReadOnly} className="w-full bg-gray-50 border-0 rounded-[1.5rem] px-6 py-4 text-sm font-bold focus:ring-8 focus:ring-black/5 outline-none disabled:opacity-50" value={formData.repoLink || ""} onChange={e => setFormData({ ...formData, repoLink: e.target.value })} placeholder="Repo URL" />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] ml-2">Live Deploy Link</label>
                                                        <input disabled={isReadOnly} className="w-full bg-gray-50 border-0 rounded-[1.5rem] px-6 py-4 text-sm font-bold focus:ring-8 focus:ring-black/5 outline-none disabled:opacity-50" value={formData.deployLink || ""} onChange={e => setFormData({ ...formData, deployLink: e.target.value })} placeholder="Vercel / Firebase URL" />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] ml-2">Initial Solution Plan</label>
                                                    <textarea required rows="3" disabled={isReadOnly} className="w-full bg-gray-50 border-0 rounded-[2rem] px-8 py-6 text-sm font-bold focus:ring-8 focus:ring-black/5 outline-none resize-none disabled:opacity-50" value={formData.solution} onChange={e => setFormData({ ...formData, solution: e.target.value })} placeholder="Architecture summary..." />
                                                </div>

                                                {formData.id && (
                                                    <div className="space-y-4 bg-gray-50/50 p-6 rounded-[2rem] border border-gray-100">
                                                        <div className="flex justify-between items-center px-2">
                                                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em]">Integration Level</label>
                                                            <div className="flex items-center group bg-white px-3 py-1.5 rounded-xl border border-gray-100 shadow-sm transition-all focus-within:border-black">
                                                                <input
                                                                    type="number"
                                                                    min="0"
                                                                    max="100"
                                                                    disabled={isReadOnly}
                                                                    value={formData.progress || 0}
                                                                    onChange={e => setFormData({ ...formData, progress: isNaN(parseInt(e.target.value)) ? '' : Math.min(100, Math.max(0, parseInt(e.target.value))) })}
                                                                    className="w-8 text-right bg-transparent text-sm font-black text-black outline-none disabled:opacity-50 appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none m-0 p-0"
                                                                    style={{ MozAppearance: 'textfield' }}
                                                                />
                                                                <span className="text-sm font-black text-gray-400 ml-0.5 group-focus-within:text-black transition-colors">%</span>
                                                            </div>
                                                        </div>
                                                        <div className="relative w-full h-4 bg-gray-100/80 rounded-full overflow-hidden flex items-center shadow-inner cursor-pointer" onClick={() => { if (!isReadOnly) { const el = document.getElementById('progress-slider-1'); if (el) el.focus(); } }}>
                                                            <div
                                                                className="absolute left-0 h-full bg-gradient-to-r from-gray-900 to-black rounded-full transition-all duration-300 pointer-events-none"
                                                                style={{ width: `${formData.progress || 0}%` }}
                                                            />
                                                            <input
                                                                id="progress-slider-1"
                                                                type="range"
                                                                min="0"
                                                                max="100"
                                                                step="1"
                                                                disabled={isReadOnly}
                                                                value={formData.progress || 0}
                                                                onChange={e => setFormData({ ...formData, progress: parseInt(e.target.value) || 0 })}
                                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                                                            />
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="space-y-12">
                                                {formData.id ? (
                                                    <div className="space-y-4">
                                                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] ml-2">Assigned Scope Parameters</label>
                                                        <div className="p-6 rounded-[2rem] bg-gray-50 border border-gray-100 shadow-sm relative overflow-hidden">
                                                            <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                                                                <Target className="w-24 h-24 -mr-6 -mt-6" />
                                                            </div>
                                                            <h4 className="text-xl font-black uppercase tracking-tighter text-gray-900 mb-2">{formData.title}</h4>
                                                            <p className="text-[12px] font-bold text-gray-400 leading-relaxed mb-6">{formData.description}</p>
                                                            <div className="flex flex-wrap gap-2 text-[8px] font-black uppercase tracking-widest">
                                                                {formData.techStack.map(t => (
                                                                    <span key={t} className="px-2.5 py-1 rounded bg-black text-white shadow-sm">{t}</span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-4">
                                                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] ml-2">Select Statement</label>
                                                        <div className="grid grid-cols-1 gap-4">
                                                            {myStatements.map(s => (
                                                                <div
                                                                    key={s.id}
                                                                    onClick={() => !isReadOnly && setFormData({ ...formData, title: s.title, description: s.description, techStack: s.techStack })}
                                                                    className={`p-6 rounded-[2rem] border-2 transition-all ${isReadOnly ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} ${formData.title === s.title ? 'bg-black text-white border-black shadow-xl' : 'bg-gray-50 border-transparent hover:border-black/5'}`}
                                                                >
                                                                    <div className="flex justify-between items-center mb-3">
                                                                        <h4 className="text-lg font-black uppercase tracking-tighter">{s.title}</h4>
                                                                        <CheckCircle2 className={`w-4 h-4 ${formData.title === s.title ? 'text-white' : 'text-gray-200'}`} />
                                                                    </div>
                                                                    <p className={`text-[12px] font-medium mb-4 leading-relaxed ${formData.title === s.title ? 'text-gray-300' : 'text-gray-400'}`}>{s.description}</p>
                                                                    <div className="flex flex-wrap gap-1.5 text-[8px] font-black uppercase tracking-widest">
                                                                        {s.techStack.map(t => (
                                                                            <span key={t} className={`px-2 py-0.5 rounded ${formData.title === s.title ? 'bg-white/10' : 'bg-gray-200 text-gray-500'}`}>{t}</span>
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}

                                                <AnimatePresence>
                                                    {formData.title && (
                                                        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
                                                            <div className="space-y-2 mb-8 mt-6">
                                                                <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] ml-2">Card Theme</label>
                                                                <div className="flex gap-3">
                                                                    {submissionColors.map(c => (
                                                                        <button key={c.name} type="button" onClick={() => !isReadOnly && setFormData({ ...formData, color: c })} className={`w-10 h-10 rounded-xl ${c.blob} transition-all ${isReadOnly ? 'cursor-not-allowed opacity-50' : ''} ${formData.color.name === c.name ? 'ring-4 ring-black/5 scale-110 shadow-lg' : 'hover:scale-105'}`} disabled={isReadOnly} />
                                                                    ))}
                                                                </div>
                                                            </div>

                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                                                                <div className="space-y-2">
                                                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] ml-2">GitHub Repository (Required)</label>
                                                                    <input required disabled={isReadOnly} className="w-full bg-gray-50 border-0 rounded-[1.5rem] px-6 py-4 text-sm font-bold focus:ring-8 focus:ring-black/5 outline-none disabled:opacity-50" value={formData.repoLink || ""} onChange={e => setFormData({ ...formData, repoLink: e.target.value })} placeholder="Repo URL" />
                                                                </div>
                                                                <div className="space-y-2">
                                                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] ml-2">Live Deploy Link</label>
                                                                    <input disabled={isReadOnly} className="w-full bg-gray-50 border-0 rounded-[1.5rem] px-6 py-4 text-sm font-bold focus:ring-8 focus:ring-black/5 outline-none disabled:opacity-50" value={formData.deployLink || ""} onChange={e => setFormData({ ...formData, deployLink: e.target.value })} placeholder="Vercel / Firebase URL" />
                                                                </div>
                                                            </div>
                                                            <div className="space-y-2">
                                                                <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] ml-2">Detailed Solution & Implementation</label>
                                                                <textarea required disabled={isReadOnly} rows="5" className="w-full bg-gray-50 border-0 rounded-[2rem] px-8 py-6 text-sm font-bold focus:ring-8 focus:ring-black/5 outline-none resize-none disabled:opacity-50" value={formData.solution} onChange={e => setFormData({ ...formData, solution: e.target.value })} placeholder="Explain your implementation, architecture, and how it solves the problem..." />
                                                            </div>

                                                            {formData.id && (
                                                                <div className="space-y-4 bg-gray-50/50 p-6 rounded-[2rem] border border-gray-100">
                                                                    <div className="flex justify-between items-center px-2">
                                                                        <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em]">Integration Level</label>
                                                                        <div className="flex items-center group bg-white px-3 py-1.5 rounded-xl border border-gray-100 shadow-sm transition-all focus-within:border-black">
                                                                            <input
                                                                                type="number"
                                                                                min="0"
                                                                                max="100"
                                                                                disabled={isReadOnly}
                                                                                value={formData.progress || 0}
                                                                                onChange={e => setFormData({ ...formData, progress: isNaN(parseInt(e.target.value)) ? '' : Math.min(100, Math.max(0, parseInt(e.target.value))) })}
                                                                                className="w-8 text-right bg-transparent text-sm font-black text-black outline-none disabled:opacity-50 appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none m-0 p-0"
                                                                                style={{ MozAppearance: 'textfield' }}
                                                                            />
                                                                            <span className="text-sm font-black text-gray-400 ml-0.5 group-focus-within:text-black transition-colors">%</span>
                                                                        </div>
                                                                    </div>
                                                                    <div className="relative w-full h-4 bg-gray-100/80 rounded-full overflow-hidden flex items-center shadow-inner cursor-pointer" onClick={() => { if (!isReadOnly) { const el = document.getElementById('progress-slider-2'); if (el) el.focus(); } }}>
                                                                        <div
                                                                            className="absolute left-0 h-full bg-gradient-to-r from-gray-900 to-black rounded-full transition-all duration-300 pointer-events-none"
                                                                            style={{ width: `${formData.progress || 0}%` }}
                                                                        />
                                                                        <input
                                                                            id="progress-slider-2"
                                                                            type="range"
                                                                            min="0"
                                                                            max="100"
                                                                            step="1"
                                                                            disabled={isReadOnly}
                                                                            value={formData.progress || 0}
                                                                            onChange={e => setFormData({ ...formData, progress: parseInt(e.target.value) || 0 })}
                                                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                                                                        />
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        )}
                                        <div className="pt-8 flex gap-6 sticky bottom-0 bg-white py-6 border-t border-gray-50">
                                            <button type="button" onClick={resetModal} className="flex-1 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-300">Abort</button>
                                            <button
                                                type="submit"
                                                disabled={!formData.title}
                                                className="flex-[3] py-4 bg-black text-white rounded-[1.5rem] text-[10px] font-black uppercase tracking-[0.2em] shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
                                            >
                                                {formData.progress === 100 ? "Update Completed Intel" : (formData.id ? "Sync Changes" : "Initiate Operation")}
                                            </button>
                                        </div>
                                    </form>
                                )}
                            </div>
                        </motion.div>
                    </div>
                )
                }
            </AnimatePresence >

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar { width: 8px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #f3f4f6; border-radius: 20px; border: 4px solid white; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #e5e7eb; }
            `}</style>
        </div >
    );
}

