"use client";

import {
    Layout,
    Plus,
    Search,
    Filter,
    MoreHorizontal,
    CheckCircle2,
    XCircle,
    FileText,
    Calendar,
    Users,
    ArrowRight,
    Briefcase,
    Zap,
    Download,
    Mail,
    Bell,
    RefreshCw,
    Trash2,
    Edit3
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

const TRACK_CONFIG = {
    CODING: [
        { name: "Web Development", description: "Design and build modern web applications and interfaces." },
        { name: "Blockchain / Web3", description: "Develop decentralized applications and smart contracts." },
        { name: "GenAI", description: "Explore and implement generative AI models and tools." },
        { name: "AI/ML", description: "Build and train artificial intelligence and machine learning systems." },
        { name: "App Development", description: "Create native and cross-platform mobile applications." }
    ],
    RESEARCH: [
        { name: "Cybersecurity", description: "Protect systems and networks from digital attacks and vulnerabilities." },
        { name: "Robotics", description: "Design, build, and operate automated robotic systems." },
        { name: "Semiconductor", description: "Research and develop advanced microchips and circuit technologies." },
        { name: "Biotechnology", description: "Apply biology and technology to develop innovative health and environmental solutions." },
        { name: "Renewable Energy", description: "Develop and optimize sustainable energy systems and storage." },
        { name: "Artificial Intelligence", description: "Deep dive into theoretical AI and neural network innovations." },
        { name: "Quantum Computing", description: "Explore the frontiers of quantum information science and computing." }
    ]
};

// Removed INITIAL_AVAILABLE and INITIAL_REQUESTS in favor of backend.

export default function AdminProjectsPage() {
    const [activeTab, setActiveTab] = useState('requests'); // default to requests
    const [available, setAvailable] = useState([]);
    const [requests, setRequests] = useState([]);
    const [presetRequests, setPresetRequests] = useState([]);
    const [tracks, setTracks] = useState(TRACK_CONFIG);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAddTrackModalOpen, setIsAddTrackModalOpen] = useState(false);
    const [isTrackEditModalOpen, setIsTrackEditModalOpen] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [editingProject, setEditingProject] = useState(null);
    const [editingTrack, setEditingTrack] = useState(null); // { category, index, track }
    const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
    const [newTrackName, setNewTrackName] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("CODING");
    const [newTrackCategory, setNewTrackCategory] = useState("CODING");
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [deleteTrackTarget, setDeleteTrackTarget] = useState(null); // { category, index, track }
    const [openTrackMenuIdx, setOpenTrackMenuIdx] = useState(null); // "CODING-0" etc.

    const fetchAll = async () => {
        setIsRefreshing(true);
        try {
            const [reqRes, poolRes] = await Promise.all([
                fetch('/api/projects?role=admin'),
                fetch('/api/admin/projects/pool')
            ]);

            let poolData = [];
            if (poolRes.ok) {
                poolData = await poolRes.json();
                setAvailable(poolData);
            }

            if (reqRes.ok) {
                const reqData = await reqRes.json();
                const poolTitles = poolData.map(p => p.title);

                const isPresetReq = (p) => p.projectType === 'preset' || (!p.projectType && poolTitles.includes(p.projectName));

                setRequests(reqData.filter(p => p.status === 'Pending' && !isPresetReq(p)));
                setPresetRequests(reqData.filter(isPresetReq));
            }
        } catch (error) {
            console.error("Failed to fetch project requests or pool:", error);
        } finally {
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchAll();
    }, []);

    const handleAction = async (id, type) => {
        try {
            const status = type === 'approve' ? 'Approved' : 'Rejected';
            const res = await fetch('/api/projects', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status })
            });
            if (res.ok) {
                if (type === 'approve') {
                    toast.success("Project Request Approved. Email sent to Intern.");
                } else {
                    toast.error("Project Request Rejected. Notification sent.");
                }
                setRequests(prev => prev.filter(r => r._id !== id));
                setIsDetailsModalOpen(false);
                setSelectedRequest(null);
            } else {
                toast.error("Failed to update status.");
            }
        } catch (error) {
            console.error(error);
            toast.error("Could not complete action");
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-10">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-gray-50 pb-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-[0.4em] text-gray-300">
                        <Briefcase className="w-3 h-3" /> System Asset Control
                    </div>
                    <div className="flex items-center gap-4">
                        <h1 className="text-3xl font-black text-gray-900 tracking-tighter uppercase leading-none">
                            Project Management
                        </h1>
                        <button
                            onClick={fetchAll}
                            disabled={isRefreshing}
                            className={`p-2 bg-gray-50 hover:bg-gray-100 rounded-xl transition-all border border-gray-100/50 ${isRefreshing ? 'opacity-50 cursor-not-allowed' : ''}`}
                            title="Refresh Data"
                        >
                            <RefreshCw className={`w-4 h-4 text-gray-600 ${isRefreshing ? 'animate-spin' : ''}`} />
                        </button>
                    </div>
                </div>

                <div className="flex bg-gray-50 p-1 rounded-xl border border-gray-100/50 shadow-inner">
                    <button
                        onClick={() => setActiveTab('available')}
                        className={`px-5 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === 'available' ? 'bg-white shadow-sm text-black border border-gray-100' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        Pool
                    </button>
                    <button
                        onClick={() => setActiveTab('requests')}
                        className={`px-5 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all relative ${activeTab === 'requests' ? 'bg-white shadow-sm text-black border border-gray-100' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        Requests
                        {requests.length > 0 && (
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-white text-[7px] rounded-full flex items-center justify-center border border-white font-black animate-pulse">
                                {requests.length}
                            </span>
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('preset')}
                        className={`px-5 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all relative ${activeTab === 'preset' ? 'bg-white shadow-sm text-black border border-gray-100' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        Preset Requests
                    </button>
                    <button
                        onClick={() => setActiveTab('tracks')}
                        className={`px-5 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${activeTab === 'tracks' ? 'bg-white shadow-sm text-black border border-gray-100' : 'text-gray-400 hover:text-gray-600'}`}
                    >
                        Tracks
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <AnimatePresence mode="wait">
                {activeTab === 'available' ? (
                    <motion.div
                        key="pool"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                    >
                        <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl shadow-gray-200/20 overflow-hidden">
                            <div className="p-6 border-b border-gray-50 flex flex-col md:flex-row justify-between items-center gap-4">
                                <div className="relative w-full md:w-80">
                                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-300" />
                                    <input placeholder="Search asset pool..." className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border-0 rounded-xl text-[11px] font-bold focus:ring-4 focus:ring-black/5 outline-none" />
                                </div>
                                <button
                                    onClick={() => setIsAddModalOpen(true)}
                                    className="w-full md:w-auto px-6 py-3 bg-black text-white rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:scale-[1.02] transition-all shadow-lg shadow-black/10"
                                >
                                    <Plus className="w-4 h-4" />
                                    New Asset
                                </button>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-gray-50/50 text-gray-400 uppercase font-black text-[8px] tracking-[0.3em]">
                                        <tr>
                                            <th className="px-8 py-4">Descriptor</th>
                                            <th className="px-4 py-4">Domain</th>
                                            <th className="px-4 py-4">Interns</th>
                                            <th className="px-4 py-4">Status</th>
                                            <th className="px-8 py-4 text-right">Settings</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {available.map(item => (
                                            <tr
                                                key={item._id || item.id}
                                                onClick={() => {
                                                    setEditingProject(item);
                                                    setIsEditModalOpen(true);
                                                }}
                                                className="hover:bg-gray-50/30 transition-all group border-b border-gray-50 last:border-0 cursor-pointer"
                                            >
                                                <td className="px-8 py-5">
                                                    <div className="flex items-center gap-3.5">
                                                        <div className="p-2.5 bg-gray-50 rounded-lg group-hover:bg-white group-hover:shadow-sm border border-transparent group-hover:border-gray-100 transition-all">
                                                            <Briefcase className="w-4 h-4 text-gray-900" />
                                                        </div>
                                                        <div>
                                                            <p className="text-[12px] font-black text-gray-900 uppercase tracking-tight">{item.title}</p>
                                                            <p className="text-[8px] text-gray-300 font-black uppercase mt-0.5">TTL: {item.deadline}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-5">
                                                    <span className="px-3 py-1 bg-gray-50 text-[8px] font-black uppercase rounded-full border border-gray-100 text-gray-500">{item.track}</span>
                                                </td>
                                                <td className="px-4 py-5 font-black text-[11px] text-gray-800">
                                                    {item.enrolled}
                                                </td>
                                                <td className="px-4 py-5">
                                                    <div className="flex items-center gap-1.5">
                                                        <div className="w-1 h-1 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]" />
                                                        <span className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">Active</span>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-5 text-right">
                                                    <button className="p-2 hover:bg-white hover:shadow-md rounded-lg transition-all border border-transparent hover:border-gray-50"><MoreHorizontal className="w-4 h-4 text-gray-300" /></button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </motion.div>
                ) : activeTab === 'requests' ? (
                    <motion.div
                        key="requests"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-8"
                    >
                        {requests.length === 0 && (
                            <div className="col-span-full py-20 text-center">
                                <p className="text-gray-400 font-black uppercase tracking-widest">No pending proposals found.</p>
                            </div>
                        )}
                        {requests.map(req => (
                            <div
                                key={req._id || req.id}
                                onClick={() => {
                                    setSelectedRequest(req);
                                    setIsDetailsModalOpen(true);
                                }}
                                className="bg-white p-7 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/20 relative overflow-hidden group cursor-pointer hover:border-black/5 hover:shadow-2xl hover:shadow-gray-300/30 transition-all active:scale-[0.99]"
                            >
                                <div className="absolute top-0 right-0 p-6 opacity-5">
                                    <Zap className="w-32 h-32 -mr-12 -mt-12" />
                                </div>
                                <div className="relative z-10 space-y-6">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-1">
                                            <p className="text-[8px] font-black text-rose-500 uppercase tracking-widest leading-none">Protocol Request • {new Date(req.requestedAt).toLocaleDateString()}</p>
                                            <h3 className="text-xl font-black text-gray-900 uppercase leading-tight tracking-tighter">{req.projectName}</h3>
                                            <div className="flex items-center gap-2 mt-2">
                                                <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-[7px] font-black uppercase">{req.internName?.substring(0, 2) || 'JD'}</div>
                                                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">{req.internName}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100/50">
                                        <div className="p-2 bg-white rounded-lg shadow-sm border border-gray-100">
                                            <FileText className="w-3.5 h-3.5 text-rose-500" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-[10px] font-black text-gray-900 uppercase leading-none">{req.track || "Tech Stack Overview"}</p>
                                        </div>
                                        <button
                                            onClick={(e) => { e.stopPropagation(); toast.success("Downloading Document..."); }}
                                            className="p-1.5 hover:bg-white rounded-lg transition-all text-gray-400 hover:text-black"
                                        >
                                            <Download className="w-3.5 h-3.5" />
                                        </button>
                                    </div>

                                    <div className="flex gap-3 pt-2">
                                        <div className="flex-1 py-3 bg-gray-900 group-hover:bg-black text-white rounded-xl text-[8px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-lg">
                                            <Zap className="w-3 h-3 text-amber-400" /> View Detailed Protocol
                                        </div>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleAction(req._id, 'reject');
                                            }}
                                            className="px-4 py-3 bg-gray-50 hover:bg-rose-50 hover:text-rose-600 rounded-xl text-[8px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 border border-transparent hover:border-rose-100"
                                        >
                                            Reject
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                ) : activeTab === 'preset' ? (
                    <motion.div
                        key="preset"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-8"
                    >
                        {presetRequests.length === 0 && (
                            <div className="col-span-full py-20 text-center">
                                <p className="text-gray-400 font-black uppercase tracking-widest">No preset project allocations found.</p>
                            </div>
                        )}
                        {presetRequests.map(req => (
                            <div
                                key={req.id || req._id}
                                onClick={() => {
                                    setSelectedRequest(req);
                                    setIsDetailsModalOpen(true);
                                }}
                                className="bg-white p-7 rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/20 relative overflow-hidden group cursor-pointer hover:border-black/5 hover:shadow-2xl hover:shadow-gray-300/30 transition-all active:scale-[0.99]"
                            >
                                <div className="absolute top-0 right-0 p-6 opacity-5">
                                    <Zap className="w-32 h-32 -mr-12 -mt-12" />
                                </div>
                                <div className="relative z-10 space-y-6">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-1">
                                            <p className="text-[8px] font-black text-emerald-500 uppercase tracking-widest leading-none">Preset Allocation • {new Date(req.requestedAt).toLocaleDateString()}</p>
                                            <h3 className="text-xl font-black text-gray-900 uppercase leading-tight tracking-tighter">{req.projectName}</h3>
                                            <div className="flex items-center gap-2 mt-2">
                                                <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-[7px] font-black uppercase">{req.internName?.substring(0, 2) || 'JD'}</div>
                                                <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">{req.internName}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100/50">
                                        <div className="p-2 bg-white rounded-lg shadow-sm border border-gray-100">
                                            <FileText className="w-3.5 h-3.5 text-emerald-500" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-[10px] font-black text-gray-900 uppercase leading-none">{req.track || "Tech Stack Overview"}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                ) : (
                    <motion.div
                        key="tracks"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="space-y-6"
                    >
                        <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl shadow-gray-200/20">
                            <div className="flex justify-between items-center mb-10">
                                <div>
                                    <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">Academic Tracks</h3>
                                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-1">Define learning pathways for interns</p>
                                </div>
                                <button
                                    onClick={() => setIsAddTrackModalOpen(true)}
                                    className="px-6 py-3 bg-black text-white rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2 hover:scale-[1.02] transition-all shadow-lg"
                                >
                                    <Plus className="w-4 h-4" /> Add New Track
                                </button>
                            </div>

                            <div className="space-y-12">
                                {Object.entries(tracks).map(([category, trackList]) => (
                                    <div key={category} className="space-y-4">
                                        <div className="flex items-center gap-3 ml-2">
                                            <div className={`w-2 h-2 rounded-full ${category === 'CODING' ? 'bg-black' : 'bg-rose-500'}`} />
                                            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">{category === 'CODING' ? 'Scientific Programming' : 'Research & Innovations'}</h4>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {trackList.map((track, i) => {
                                                const menuKey = `${category}-${i}`;
                                                return (
                                                    <div
                                                        key={track.name || i}
                                                        className="group p-6 bg-gray-50 border border-gray-100 rounded-[1.5rem] flex flex-col gap-3 hover:bg-white hover:shadow-xl hover:shadow-gray-200/30 transition-all relative overflow-visible"
                                                    >
                                                        <div className="flex items-center justify-between">
                                                            <div
                                                                className="p-3 bg-white rounded-xl shadow-sm border border-gray-50 group-hover:scale-110 transition-transform cursor-pointer"
                                                                onClick={() => {
                                                                    setEditingTrack({ category, index: i, track });
                                                                    setIsTrackEditModalOpen(true);
                                                                    setOpenTrackMenuIdx(null);
                                                                }}
                                                            >
                                                                {category === 'CODING' ? <Briefcase className="w-5 h-5 text-black" /> : <Zap className="w-5 h-5 text-rose-500" />}
                                                            </div>

                                                            {/* ••• Menu */}
                                                            <div className="relative">
                                                                <button
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        setOpenTrackMenuIdx(prev => prev === menuKey ? null : menuKey);
                                                                    }}
                                                                    className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors text-gray-300 hover:text-gray-700"
                                                                >
                                                                    <MoreHorizontal className="w-4 h-4" />
                                                                </button>

                                                                {openTrackMenuIdx === menuKey && (
                                                                    <div
                                                                        className="absolute right-0 top-8 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 overflow-hidden min-w-[130px]"
                                                                        onClick={e => e.stopPropagation()}
                                                                    >
                                                                        <button
                                                                            onClick={() => {
                                                                                setEditingTrack({ category, index: i, track });
                                                                                setIsTrackEditModalOpen(true);
                                                                                setOpenTrackMenuIdx(null);
                                                                            }}
                                                                            className="w-full flex items-center gap-2.5 px-4 py-3 text-[10px] font-black text-gray-700 uppercase tracking-widest hover:bg-gray-50 transition-colors"
                                                                        >
                                                                            <Edit3 className="w-3.5 h-3.5" /> Edit Track
                                                                        </button>
                                                                        <div className="h-px bg-gray-50" />
                                                                        <button
                                                                            onClick={() => {
                                                                                setDeleteTrackTarget({ category, index: i, track });
                                                                                setOpenTrackMenuIdx(null);
                                                                            }}
                                                                            className="w-full flex items-center gap-2.5 px-4 py-3 text-[10px] font-black text-red-500 uppercase tracking-widest hover:bg-red-50 transition-colors"
                                                                        >
                                                                            <Trash2 className="w-3.5 h-3.5" /> Delete
                                                                        </button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>

                                                        <div
                                                            className="cursor-pointer"
                                                            onClick={() => {
                                                                setEditingTrack({ category, index: i, track });
                                                                setIsTrackEditModalOpen(true);
                                                            }}
                                                        >
                                                            <h5 className="text-[12px] font-black text-gray-900 uppercase tracking-tight">{track.name}</h5>
                                                            <p className="text-[9px] text-gray-400 font-bold leading-relaxed mt-1 line-clamp-2">
                                                                {track.description || "No description provided for this protocol."}
                                                            </p>
                                                        </div>
                                                        <div className="flex items-center gap-1.5 mt-1">
                                                            <div className="w-1 h-1 rounded-full bg-emerald-500" />
                                                            <span className="text-[7px] font-black text-gray-400 uppercase tracking-widest">Active Node</span>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Add Project Modal */}
            <AnimatePresence>
                {isAddModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAddModalOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-2xl" />
                        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="relative bg-white rounded-[2.5rem] p-8 max-w-2xl w-full shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[90vh]">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <p className="text-[8px] font-black text-gray-300 uppercase tracking-[0.4em] mb-1">Asset Integration</p>
                                    <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">New Base Project</h3>
                                </div>
                                <button onClick={() => setIsAddModalOpen(false)} className="p-2 bg-gray-50 rounded-xl hover:bg-rose-50 hover:text-rose-500 transition-all border border-gray-100"><XCircle className="w-5 h-5" /></button>
                            </div>

                            <form className="space-y-8 overflow-y-auto pr-4 custom-scrollbar" onSubmit={async (e) => {
                                e.preventDefault();
                                const formData = new FormData(e.target);
                                const newProject = {
                                    category: selectedCategory,
                                    title: formData.get('title'),
                                    track: formData.get('track'),
                                    difficulty: formData.get('difficulty'),
                                    type: formData.get('type'),
                                    description: formData.get('description'),
                                    realWorld: formData.get('realWorld'),
                                    matters: formData.get('matters'),
                                    existingSolutions: formData.get('existingSolutions'),
                                    objectives: formData.get('objectives'),
                                    features: formData.get('features'),
                                    techStack: formData.get('techStack'),
                                    apis: formData.get('apis'),
                                    dataset: formData.get('dataset'),
                                    researchBackground: formData.get('researchBackground'),
                                    hypothesis: formData.get('hypothesis'),
                                    innovation: formData.get('innovation'),
                                    relevance: formData.get('relevance'),
                                    researchOutput: formData.get('researchOutput'),
                                    startDate: formData.get('startDate'),
                                    endDate: formData.get('endDate'),
                                    milestones: formData.get('milestones'),
                                    status: "Active",
                                    deadline: formData.get('deadline') || "1 Month",
                                    enrolled: 0
                                };

                                try {
                                    const res = await fetch('/api/admin/projects/pool', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify(newProject)
                                    });
                                    if (res.ok) {
                                        const savedProject = await res.json();
                                        setAvailable(prev => [savedProject, ...prev]);
                                        toast.success("Project Deployed to Pool");
                                        setIsAddModalOpen(false);
                                    } else {
                                        toast.error("Deployment Failed");
                                    }
                                } catch (err) {
                                    console.error(err);
                                    toast.error("Internal Error");
                                }
                            }}>
                                {/* Phase 1: Classification */}
                                <div className="space-y-4">
                                    <h4 className="text-[9px] font-black text-black uppercase tracking-widest border-l-4 border-black pl-3">Phase I: Classification</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest ml-1">Asset Category</label>
                                            <select
                                                value={selectedCategory}
                                                onChange={(e) => setSelectedCategory(e.target.value)}
                                                className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-[12px] font-bold focus:ring-4 focus:ring-black/5 outline-none"
                                            >
                                                <option value="CODING">Coding Project</option>
                                                <option value="RESEARCH">Research & Development</option>
                                            </select>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest ml-1">Specific Track</label>
                                            <select name="track" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-[12px] font-bold focus:ring-4 focus:ring-black/5 outline-none">
                                                {tracks[selectedCategory].map((t, i) => (
                                                    <option key={t.name || i} value={t.name}>{t.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest ml-1">Problem Descriptor</label>
                                            <input name="title" required className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-[12px] font-bold focus:ring-4 focus:ring-black/5 outline-none" placeholder="E.g. Neural Link Interface..." />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest ml-1">Difficulty Matrix</label>
                                            <select name="difficulty" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-[12px] font-bold focus:ring-4 focus:ring-black/5 outline-none">
                                                <option>Beginner</option>
                                                <option>Intermediate</option>
                                                <option>Advanced</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest ml-1">Asset Type</label>
                                            <select name="type" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-[12px] font-bold focus:ring-4 focus:ring-black/5 outline-none">
                                                <option>Coding Project</option>
                                                <option>Research Paper</option>
                                                <option>Prototype Development</option>
                                                <option>Hybrid (Coding + Research)</option>
                                            </select>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest ml-1">TTL / Duration</label>
                                            <input name="deadline" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-[12px] font-bold focus:ring-4 focus:ring-black/5 outline-none" placeholder="1 Month" />
                                        </div>
                                    </div>
                                </div>

                                {/* Phase 2: Narrative */}
                                <div className="space-y-4 pt-4">
                                    <h4 className="text-[9px] font-black text-black uppercase tracking-widest border-l-4 border-black pl-3">Phase II: Context & Narrative</h4>
                                    <div className="space-y-1.5">
                                        <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest ml-1">Scope Description</label>
                                        <textarea name="description" rows="3" required className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-[12px] font-bold focus:ring-4 focus:ring-black/5 outline-none resize-none" placeholder="Core problem statement..." />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest ml-1">Real-world Scenario</label>
                                            <textarea name="realWorld" rows="2" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-[12px] font-bold focus:ring-4 focus:ring-black/5 outline-none resize-none" placeholder="Scenario explanation..." />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest ml-1">Industry Impact</label>
                                            <textarea name="matters" rows="2" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-[12px] font-bold focus:ring-4 focus:ring-black/5 outline-none resize-none" placeholder="Why this matters..." />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest ml-1">Existing Solutions</label>
                                        <input name="existingSolutions" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-[12px] font-bold focus:ring-4 focus:ring-black/5 outline-none" placeholder="Any currently existing implementations..." />
                                    </div>
                                </div>

                                {/* Phase 3: Requirements */}
                                <div className="space-y-4 pt-4">
                                    <h4 className="text-[9px] font-black text-black uppercase tracking-widest border-l-4 border-black pl-3">Phase III: Strategic Alignment</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest ml-1">Build Objectives</label>
                                            <textarea name="objectives" rows="2" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-[12px] font-bold focus:ring-4 focus:ring-black/5 outline-none resize-none" placeholder="What should be built?" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest ml-1">Expected Features</label>
                                            <textarea name="features" rows="2" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-[12px] font-bold focus:ring-4 focus:ring-black/5 outline-none resize-none" placeholder="Key feature list..." />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest ml-1">Stack (CSV)</label>
                                            <input name="techStack" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 text-[10px] font-bold outline-none" placeholder="React, Node..." />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest ml-1">Required APIs</label>
                                            <input name="apis" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 text-[10px] font-bold outline-none" placeholder="OpenAI, Stripe..." />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest ml-1">Dataset URL</label>
                                            <input name="dataset" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 text-[10px] font-bold outline-none" placeholder="Kaggle/S3 link..." />
                                        </div>
                                    </div>
                                </div>
                                {/* Phase 4: Research Specific (Conditional) */}
                                {selectedCategory === "RESEARCH" && (
                                    <div className="space-y-4 pt-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                        <h4 className="text-[9px] font-black text-rose-500 uppercase tracking-widest border-l-4 border-rose-500 pl-3">Phase IV: Research Intelligence</h4>
                                        <div className="space-y-1.5">
                                            <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest ml-1">Research Background</label>
                                            <textarea name="researchBackground" rows="3" className="w-full bg-rose-50/30 border border-rose-100 rounded-xl px-4 py-3 text-[12px] font-bold focus:ring-4 focus:ring-rose-500/5 outline-none resize-none" placeholder="Existing research summary & gaps..." />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest ml-1">Scientific Hypothesis</label>
                                                <textarea name="hypothesis" rows="2" className="w-full bg-rose-50/30 border border-rose-100 rounded-xl px-4 py-3 text-[12px] font-bold focus:ring-4 focus:ring-rose-500/5 outline-none resize-none" placeholder="What hypothesis should they test?" />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest ml-1">Expected Innovation</label>
                                                <textarea name="innovation" rows="2" className="w-full bg-rose-50/30 border border-rose-100 rounded-xl px-4 py-3 text-[12px] font-bold focus:ring-4 focus:ring-rose-500/5 outline-none resize-none" placeholder="What innovation is expected?" />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest ml-1">Industry Relevance</label>
                                                <input name="relevance" className="w-full bg-rose-50/30 border border-rose-100 rounded-xl px-4 py-3 text-[12px] font-bold outline-none" placeholder="How does this help industry?" />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest ml-1">Target Output</label>
                                                <select name="researchOutput" className="w-full bg-rose-50/30 border border-rose-100 rounded-xl px-4 py-3 text-[12px] font-bold outline-none">
                                                    <option>Research Paper (PDF)</option>
                                                    <option>Functional Prototype</option>
                                                    <option>Simulation Dataset</option>
                                                    <option>Experimental Analysis</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Phase 5: Timeline */}
                                <div className="space-y-4 pt-4">
                                    <h4 className="text-[9px] font-black text-emerald-500 uppercase tracking-widest border-l-4 border-emerald-500 pl-3">Phase V: Execution Timeline</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest ml-1">Protocol Start</label>
                                            <input name="startDate" type="date" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-[12px] font-bold focus:ring-4 focus:ring-black/5 outline-none" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest ml-1">Protocol End</label>
                                            <input name="endDate" type="date" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-[12px] font-bold focus:ring-4 focus:ring-black/5 outline-none" />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest ml-1">Key Milestones (CSV)</label>
                                        <textarea name="milestones" rows="2" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-[12px] font-bold focus:ring-4 focus:ring-black/5 outline-none resize-none" placeholder="E.g. Alpha Launch, Beta Test, Paper Submission..." />
                                    </div>
                                </div>

                                <div className="pt-6 pb-2">
                                    <button type="submit" className="w-full py-4 bg-black text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-xl hover:scale-[1.01] transition-all border border-black group flex items-center justify-center gap-3">
                                        Initialize Protocol Deployment <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Edit Project Modal */}
            <AnimatePresence>
                {isEditModalOpen && editingProject && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsEditModalOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-2xl" />
                        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="relative bg-white rounded-[2.5rem] p-8 max-w-2xl w-full shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[90vh]">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <p className="text-[8px] font-black text-gray-300 uppercase tracking-[0.4em] mb-1">Asset Configuration</p>
                                    <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">Modify Project</h3>
                                </div>
                                <button onClick={() => setIsEditModalOpen(false)} className="p-2 bg-gray-50 rounded-xl hover:bg-rose-50 hover:text-rose-500 transition-all border border-gray-100"><XCircle className="w-5 h-5" /></button>
                            </div>

                            <form className="space-y-8 overflow-y-auto pr-4 custom-scrollbar" onSubmit={(e) => {
                                e.preventDefault();
                                const formData = new FormData(e.target);
                                setAvailable(prev => prev.map(p => p.id === editingProject.id ? {
                                    ...p,
                                    title: formData.get('title'),
                                    track: formData.get('track'),
                                    difficulty: formData.get('difficulty'),
                                    type: formData.get('type'),
                                    description: formData.get('description'),
                                    deadline: formData.get('deadline'),
                                    realWorld: formData.get('realWorld'),
                                    matters: formData.get('matters'),
                                    existingSolutions: formData.get('existingSolutions'),
                                    objectives: formData.get('objectives'),
                                    features: formData.get('features'),
                                    techStack: formData.get('techStack'),
                                    apis: formData.get('apis'),
                                    dataset: formData.get('dataset'),
                                    researchBackground: formData.get('researchBackground'),
                                    hypothesis: formData.get('hypothesis'),
                                    innovation: formData.get('innovation'),
                                    relevance: formData.get('relevance'),
                                    researchOutput: formData.get('researchOutput'),
                                    startDate: formData.get('startDate'),
                                    endDate: formData.get('endDate'),
                                    milestones: formData.get('milestones'),
                                } : p));
                                toast.success("Project Configuration Updated");
                                setIsEditModalOpen(false);
                            }}>
                                {/* Phase 1: Classification */}
                                <div className="space-y-4">
                                    <h4 className="text-[9px] font-black text-black uppercase tracking-widest border-l-4 border-black pl-3">Phase I: Classification</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest ml-1">Asset Category</label>
                                            <input disabled value={editingProject.category || "CODING"} className="w-full bg-gray-100 border border-gray-100 rounded-xl px-4 py-3 text-[12px] font-bold text-gray-400 cursor-not-allowed" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest ml-1">Specific Track</label>
                                            <select name="track" defaultValue={editingProject.track} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-[12px] font-bold focus:ring-4 focus:ring-black/5 outline-none">
                                                {tracks[editingProject.category || "CODING"].map((t, i) => (
                                                    <option key={t.name || i} value={t.name}>{t.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest ml-1">Problem Descriptor</label>
                                            <input name="title" defaultValue={editingProject.title} required className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-[12px] font-bold focus:ring-4 focus:ring-black/5 outline-none" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest ml-1">Difficulty Matrix</label>
                                            <select name="difficulty" defaultValue={editingProject.difficulty} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-[12px] font-bold focus:ring-4 focus:ring-black/5 outline-none">
                                                <option>Beginner</option>
                                                <option>Intermediate</option>
                                                <option>Advanced</option>
                                            </select>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest ml-1">Asset Type</label>
                                            <select name="type" defaultValue={editingProject.type} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-[12px] font-bold focus:ring-4 focus:ring-black/5 outline-none">
                                                <option>Coding Project</option>
                                                <option>Research Paper</option>
                                                <option>Prototype Development</option>
                                                <option>Hybrid (Coding + Research)</option>
                                            </select>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest ml-1">TTL / Duration</label>
                                            <input name="deadline" defaultValue={editingProject.deadline} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-[12px] font-bold focus:ring-4 focus:ring-black/5 outline-none" />
                                        </div>
                                    </div>
                                </div>

                                {/* Phase 2: Narrative */}
                                <div className="space-y-4 pt-4">
                                    <h4 className="text-[9px] font-black text-black uppercase tracking-widest border-l-4 border-black pl-3">Phase II: Context & Narrative</h4>
                                    <div className="space-y-1.5">
                                        <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest ml-1">Scope Description</label>
                                        <textarea name="description" defaultValue={editingProject.description} rows="3" required className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-[12px] font-bold focus:ring-4 focus:ring-black/5 outline-none resize-none" />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest ml-1">Real-world Scenario</label>
                                            <textarea name="realWorld" defaultValue={editingProject.realWorld} rows="2" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-[12px] font-bold focus:ring-4 focus:ring-black/5 outline-none resize-none" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest ml-1">Industry Impact</label>
                                            <textarea name="matters" defaultValue={editingProject.matters} rows="2" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-[12px] font-bold focus:ring-4 focus:ring-black/5 outline-none resize-none" />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest ml-1">Existing Solutions</label>
                                        <input name="existingSolutions" defaultValue={editingProject.existingSolutions} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-[12px] font-bold focus:ring-4 focus:ring-black/5 outline-none" />
                                    </div>
                                </div>

                                {/* Phase 3: Requirements */}
                                <div className="space-y-4 pt-4">
                                    <h4 className="text-[9px] font-black text-black uppercase tracking-widest border-l-4 border-black pl-3">Phase III: Strategic Alignment</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest ml-1">Build Objectives</label>
                                            <textarea name="objectives" defaultValue={editingProject.objectives} rows="2" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-[12px] font-bold focus:ring-4 focus:ring-black/5 outline-none resize-none" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest ml-1">Expected Features</label>
                                            <textarea name="features" defaultValue={editingProject.features} rows="2" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-[12px] font-bold focus:ring-4 focus:ring-black/5 outline-none resize-none" />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest ml-1">Stack (CSV)</label>
                                            <input name="techStack" defaultValue={editingProject.techStack} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 text-[10px] font-bold outline-none" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest ml-1">Required APIs</label>
                                            <input name="apis" defaultValue={editingProject.apis} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 text-[10px] font-bold outline-none" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest ml-1">Dataset URL</label>
                                            <input name="dataset" defaultValue={editingProject.dataset} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 text-[10px] font-bold outline-none" />
                                        </div>
                                    </div>
                                </div>

                                {/* Phase 4: Research (Conditional) */}
                                {(editingProject.category === "RESEARCH") && (
                                    <div className="space-y-4 pt-4 animate-in fade-in slide-in-from-top-2 duration-300">
                                        <h4 className="text-[9px] font-black text-rose-500 uppercase tracking-widest border-l-4 border-rose-500 pl-3">Phase IV: Research Intelligence</h4>
                                        <div className="space-y-1.5">
                                            <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest ml-1">Research Background</label>
                                            <textarea name="researchBackground" defaultValue={editingProject.researchBackground} rows="3" className="w-full bg-rose-50/30 border border-rose-100 rounded-xl px-4 py-3 text-[12px] font-bold focus:ring-4 focus:ring-rose-500/5 outline-none resize-none" />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest ml-1">Scientific Hypothesis</label>
                                                <textarea name="hypothesis" defaultValue={editingProject.hypothesis} rows="2" className="w-full bg-rose-50/30 border border-rose-100 rounded-xl px-4 py-3 text-[12px] font-bold focus:ring-4 focus:ring-rose-500/5 outline-none resize-none" />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest ml-1">Expected Innovation</label>
                                                <textarea name="innovation" defaultValue={editingProject.innovation} rows="2" className="w-full bg-rose-50/30 border border-rose-100 rounded-xl px-4 py-3 text-[12px] font-bold focus:ring-4 focus:ring-rose-500/5 outline-none resize-none" />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest ml-1">Industry Relevance</label>
                                                <input name="relevance" defaultValue={editingProject.relevance} className="w-full bg-rose-50/30 border border-rose-100 rounded-xl px-4 py-3 text-[12px] font-bold outline-none" />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest ml-1">Target Output</label>
                                                <select name="researchOutput" defaultValue={editingProject.researchOutput} className="w-full bg-rose-50/30 border border-rose-100 rounded-xl px-4 py-3 text-[12px] font-bold outline-none">
                                                    <option>Research Paper (PDF)</option>
                                                    <option>Functional Prototype</option>
                                                    <option>Simulation Dataset</option>
                                                    <option>Experimental Analysis</option>
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Phase 5: Timeline */}
                                <div className="space-y-4 pt-4">
                                    <h4 className="text-[9px] font-black text-emerald-500 uppercase tracking-widest border-l-4 border-emerald-500 pl-3">Phase V: Execution Timeline</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest ml-1">Protocol Start</label>
                                            <input name="startDate" defaultValue={editingProject.startDate} type="date" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-[12px] font-bold focus:ring-4 focus:ring-black/5 outline-none" />
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest ml-1">Protocol End</label>
                                            <input name="endDate" defaultValue={editingProject.endDate} type="date" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-[12px] font-bold focus:ring-4 focus:ring-black/5 outline-none" />
                                        </div>
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest ml-1">Key Milestones (CSV)</label>
                                        <textarea name="milestones" defaultValue={editingProject.milestones} rows="2" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-[12px] font-bold focus:ring-4 focus:ring-black/5 outline-none resize-none" />
                                    </div>
                                </div>

                                <div className="pt-6">
                                    <button type="submit" className="w-full py-4 bg-black text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-xl hover:scale-[1.01] transition-all border border-black group">
                                        Sync Configuration Changes <ArrowRight className="inline-block w-3.5 h-3.5 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Proposal Details Modal */}
            <AnimatePresence>
                {isDetailsModalOpen && selectedRequest && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsDetailsModalOpen(false)} className="absolute inset-0 bg-black/40 backdrop-blur-md" />
                        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="relative bg-white rounded-[2rem] max-w-4xl w-full shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[85vh]">
                            {/* Modal Header */}
                            <div className="p-6 border-b border-gray-50 bg-gray-50/30">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1.5">
                                        <div className="flex items-center gap-2">
                                            <span className={`px-2 py-0.5 ${selectedRequest.projectType === 'preset' ? 'bg-indigo-600' : 'bg-black'} text-white text-[6px] font-black uppercase tracking-[0.2em] rounded-full`}>
                                                {selectedRequest.projectType === 'preset' ? 'Preset Selection' : 'Custom Proposal'}
                                            </span>
                                            <span className="text-[7px] font-black text-gray-400 uppercase tracking-widest">{selectedRequest.requestedAt ? new Date(selectedRequest.requestedAt).toLocaleDateString() : selectedRequest.date}</span>
                                        </div>
                                        <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight leading-tight">{selectedRequest.projectName || selectedRequest.title}</h2>
                                        <div className="flex items-center gap-1.5 text-gray-500">
                                            <div className="w-5 h-5 rounded-full bg-gray-100 border border-white shadow-sm flex items-center justify-center text-[7px] font-black">{selectedRequest.internName?.substring(0, 2) || 'JD'}</div>
                                            <p className="text-[8px] font-black uppercase tracking-widest">{selectedRequest.internName || selectedRequest.intern}</p>
                                        </div>
                                    </div>
                                    <button onClick={() => setIsDetailsModalOpen(false)} className="p-2 bg-white rounded-xl border border-gray-100 hover:bg-rose-50 hover:text-rose-500 transition-all shadow-sm">
                                        <XCircle className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Modal Content */}
                            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                                <div className="space-y-2">
                                    <h4 className="text-[7px] font-black text-gray-400 uppercase tracking-[0.3em] flex items-center gap-1.5">
                                        <FileText className="w-3 h-3" /> Scope Overview
                                    </h4>
                                    <p className="text-[11px] text-gray-600 font-bold leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100/50">
                                        {selectedRequest.description}
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <h4 className="text-[7px] font-black text-gray-400 uppercase tracking-[0.3em] flex items-center gap-1.5">
                                        <FileText className="w-3 h-3" /> Detailed Solution
                                    </h4>
                                    <p className="text-[11px] text-gray-600 font-bold leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100/50 whitespace-pre-wrap">
                                        {selectedRequest.solution || "No detailed solution provided yet."}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-3">
                                        <h4 className="text-[7px] font-black text-gray-400 uppercase tracking-[0.3em]">Stack Orientation</h4>
                                        <div className="flex flex-wrap gap-1.5">
                                            {selectedRequest.techStack?.length > 0 ? selectedRequest.techStack.map((tech, i) => (
                                                <span key={`${tech}-${i}`} className="px-2 py-1 bg-white border border-gray-100 rounded-lg text-[8px] font-black text-gray-900 shadow-sm">{tech}</span>
                                            )) : <span className="text-[10px] text-gray-400 font-bold">Unmapped Array</span>}
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <h4 className="text-[7px] font-black text-gray-400 uppercase tracking-[0.3em]">Deployment Metrics</h4>
                                        <div className="space-y-2">
                                            {selectedRequest.repoLink && (
                                                <a href={selectedRequest.repoLink} target="_blank" rel="noreferrer" className="flex items-center gap-2 group">
                                                    <div className="w-4 h-4 bg-gray-100 flex items-center justify-center rounded-sm">
                                                        <FileText className="w-2.5 h-2.5 text-gray-500 group-hover:text-black" />
                                                    </div>
                                                    <span className="text-[9px] font-black text-gray-500 uppercase tracking-tight group-hover:text-black">Repository Link</span>
                                                </a>
                                            )}
                                            {selectedRequest.deployLink && (
                                                <a href={selectedRequest.deployLink} target="_blank" rel="noreferrer" className="flex items-center gap-2 group">
                                                    <div className="w-4 h-4 bg-emerald-50 flex items-center justify-center rounded-sm">
                                                        <Zap className="w-2.5 h-2.5 text-emerald-500 group-hover:text-emerald-700" />
                                                    </div>
                                                    <span className="text-[9px] font-black text-emerald-500 uppercase tracking-tight group-hover:text-emerald-800">Live Infrastructure</span>
                                                </a>
                                            )}
                                            {!selectedRequest.repoLink && !selectedRequest.deployLink && (
                                                <span className="text-[9px] font-black text-gray-400 uppercase tracking-tight">No Links Deployed</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 bg-gray-900 text-white rounded-xl flex items-center justify-between group cursor-pointer hover:bg-black transition-all border border-gray-800">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-white/5 rounded-lg">
                                            <Download className="w-4 h-4" />
                                        </div>
                                        <div>
                                            <p className="text-[9px] font-black uppercase tracking-tight">{selectedRequest.track || selectedRequest.document}</p>
                                        </div>
                                    </div>
                                    <ArrowRight className="w-3 h-3 opacity-30 group-hover:translate-x-1 group-hover:opacity-100 transition-all" />
                                </div>
                            </div>

                            {/* Modal Footer Actions */}
                            <div className="p-5 border-t border-gray-50 bg-gray-50/30 flex gap-3">
                                <button
                                    onClick={() => handleAction(selectedRequest._id || selectedRequest.id, 'reject')}
                                    className="px-4 py-3 bg-white hover:bg-rose-50 hover:text-rose-600 rounded-lg text-[8px] font-black uppercase tracking-widest transition-all border border-gray-200"
                                >
                                    Dismiss
                                </button>
                                <button
                                    onClick={() => handleAction(selectedRequest._id || selectedRequest.id, 'approve')}
                                    className="flex-1 py-3 bg-black hover:bg-emerald-600 text-white rounded-lg text-[8px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 shadow-xl hover:scale-[1.02]"
                                >
                                    <CheckCircle2 className="w-3.5 h-3.5" /> Confirm Deployment
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Track Edit Modal */}
            <AnimatePresence>
                {isTrackEditModalOpen && editingTrack && (
                    <div className="fixed inset-0 z-[130] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsTrackEditModalOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-2xl" />
                        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="relative bg-white rounded-[2rem] p-8 max-w-md w-full shadow-2xl border border-gray-100">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <p className="text-[8px] font-black text-gray-300 uppercase tracking-[0.4em] mb-1">{editingTrack.category} Protocol</p>
                                    <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter">Edit Track Details</h3>
                                </div>
                                <button onClick={() => setIsTrackEditModalOpen(false)} className="p-2 bg-gray-50 rounded-xl hover:bg-rose-50 hover:text-rose-500 transition-all border border-gray-100"><XCircle className="w-5 h-5" /></button>
                            </div>

                            <form className="space-y-6" onSubmit={(e) => {
                                e.preventDefault();
                                const formData = new FormData(e.target);
                                setTracks(prev => {
                                    const updated = { ...prev };
                                    updated[editingTrack.category][editingTrack.index] = {
                                        name: formData.get('name'),
                                        description: formData.get('description')
                                    };
                                    return updated;
                                });
                                toast.success("Track Configuration Updated");
                                setIsTrackEditModalOpen(false);
                            }}>
                                <div className="space-y-1.5">
                                    <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest ml-1">Track Identifier</label>
                                    <input name="name" defaultValue={editingTrack.track.name} required className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-[12px] font-bold focus:ring-4 focus:ring-black/5 outline-none" placeholder="E.g. Web Development..." />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest ml-1">Protocol Description</label>
                                    <textarea name="description" defaultValue={editingTrack.track.description} rows="4" required className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-[12px] font-bold focus:ring-4 focus:ring-black/5 outline-none resize-none" placeholder="Detail the learning outcomes and technical focus area..." />
                                </div>
                                <button type="submit" className="w-full py-4 bg-black text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg hover:scale-[1.01] transition-all border border-black flex items-center justify-center gap-2 group">
                                    Sync Protocol Changes <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* ── Delete Track Confirmation Modal ── */}
            <AnimatePresence>
                {deleteTrackTarget && (
                    <div className="fixed inset-0 z-[140] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setDeleteTrackTarget(null)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-2xl" />
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                            className="relative bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-2xl border border-gray-100">

                            {/* Red icon */}
                            <div className="w-14 h-14 bg-red-50 border border-red-100 rounded-2xl flex items-center justify-center mb-5">
                                <Trash2 className="w-6 h-6 text-red-500" />
                            </div>

                            <h3 className="text-lg font-black text-gray-900 uppercase tracking-tighter mb-1">Delete Track?</h3>
                            <p className="text-sm text-gray-500 font-medium mb-1">
                                You are about to delete the track:
                            </p>
                            <p className="text-sm font-black text-gray-900 bg-red-50 border border-red-100 rounded-xl px-4 py-2.5 mb-5">
                                {deleteTrackTarget.track.name}
                            </p>
                            <p className="text-xs text-gray-400 font-medium mb-6">
                                This will remove the track from the list. Existing intern assignments will not be affected.
                            </p>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => setDeleteTrackTarget(null)}
                                    className="flex-1 py-3 bg-gray-50 text-gray-600 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-gray-100 transition-all border border-gray-100"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => {
                                        const { category, index } = deleteTrackTarget;
                                        setTracks(prev => ({
                                            ...prev,
                                            [category]: prev[category].filter((_, i) => i !== index)
                                        }));
                                        toast.success(`Track "${deleteTrackTarget.track.name}" removed.`);
                                        setDeleteTrackTarget(null);
                                    }}
                                    className="flex-[2] py-3 bg-red-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-red-700 active:scale-95 transition-all shadow-lg shadow-red-200 flex items-center justify-center gap-2"
                                >
                                    <Trash2 className="w-4 h-4" /> Yes, Delete
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Add Track Modal */}
            <AnimatePresence>
                {isAddTrackModalOpen && (
                    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAddTrackModalOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-2xl" />
                        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="relative bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-2xl border border-gray-100">
                            <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter mb-6">Create New Track</h3>
                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest ml-1">Track Category</label>
                                    <select
                                        value={newTrackCategory}
                                        onChange={(e) => setNewTrackCategory(e.target.value)}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-[12px] font-bold focus:ring-4 focus:ring-black/5 outline-none"
                                    >
                                        <option value="CODING">Coding (Scientific/Dev)</option>
                                        <option value="RESEARCH">Research & Development</option>
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest ml-1">Track Name</label>
                                    <input
                                        autoFocus
                                        value={newTrackName}
                                        onChange={(e) => setNewTrackName(e.target.value)}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-[12px] font-bold focus:ring-4 focus:ring-black/5 outline-none"
                                        placeholder="E.g. Cyber Security..."
                                    />
                                </div>
                                <button
                                    onClick={() => {
                                        if (newTrackName.trim()) {
                                            setTracks(prev => ({
                                                ...prev,
                                                [newTrackCategory]: [...prev[newTrackCategory], { name: newTrackName.trim(), description: "" }]
                                            }));
                                            setNewTrackName("");
                                            setIsAddTrackModalOpen(false);
                                            toast.success(`Track "${newTrackName}" initialized in ${newTrackCategory}.`);
                                        }
                                    }}
                                    className="w-full py-3 bg-black text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg hover:scale-[1.01] transition-all"
                                >
                                    Confirm Initialization
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #e2e8f0;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #cbd5e1;
                }
            `}</style>
        </div>
    );
}
