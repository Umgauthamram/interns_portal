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
    Edit3,
    X
} from "lucide-react";
import React, { useState, useEffect, useRef } from "react";
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

const TRACK_FORM_FIELDS = {
    "Web Development": [
        { name: "title", label: "Project Title", type: "text", required: true },
        { name: "documentLink", label: "Documentation Link (Notion/Docs)", type: "url", placeholder: "https://docs.google.com/..." },
        { name: "description", label: "Problem Statement", type: "textarea", rows: 3, required: true },
        { name: "features", label: "Core Features", type: "textarea", rows: 2 },
        { name: "techStack", label: "Tech Stack", type: "text", placeholder: "React, Node.js, MongoDB..." },
        { name: "apis", label: "APIs / Integrations", type: "text", placeholder: "Stripe, OpenAI, Firebase..." },
        { name: "repoLink", label: "GitHub Repository", type: "url", placeholder: "https://github.com/..." },
        { name: "demoLink", label: "Live Demo Link", type: "url", placeholder: "https://vercel.app/..." },
        { name: "documentFile", label: "Documentation File", type: "file" }
    ],
    "Blockchain / Web3": [
        { name: "title", label: "Project Title", type: "text", required: true },
        { name: "documentLink", label: "Documentation Link (Notion/Docs)", type: "url", placeholder: "https://docs.google.com/..." },
        { name: "description", label: "Problem Statement", type: "textarea", rows: 3, required: true },
        { name: "blockchainNetwork", label: "Blockchain Network", type: "text", placeholder: "Ethereum, Polygon, Solana..." },
        { name: "smartContractLang", label: "Smart Contract Language", type: "text", placeholder: "Solidity, Rust, Vyper..." },
        { name: "tokenStandard", label: "Token Standard", type: "text", placeholder: "ERC-20, ERC-721, SPL..." },
        { name: "walletIntegration", label: "Wallet Integration", type: "text", placeholder: "MetaMask, WalletConnect..." },
        { name: "techStack", label: "Tech Stack", type: "text", placeholder: "Next.js, Hardhat, Ethers.js..." },
        { name: "storageUsed", label: "IPFS / Storage Used", type: "text", placeholder: "IPFS, Filecoin, Arweave..." },
        { name: "repoLink", label: "GitHub Repository", type: "url", placeholder: "https://github.com/..." },
        { name: "demoLink", label: "Demo / Testnet Link", type: "url", placeholder: "https://testnet.example.com/..." },
        { name: "deploymentNetwork", label: "Deployment Network", type: "dropdown", options: ["Mainnet", "Testnet"] },
        { name: "documentFile", label: "Documentation File", type: "file" }
    ],
    "GenAI": [
        { name: "title", label: "Project Title", type: "text", required: true },
        { name: "documentLink", label: "Documentation Link (Notion/Docs)", type: "url", placeholder: "https://docs.google.com/..." },
        { name: "description", label: "Problem Statement", type: "textarea", rows: 3, required: true },
        { name: "useCase", label: "Use Case", type: "text", placeholder: "Chatbot, Content Generator, Summarizer..." },
        { name: "targetUsers", label: "Target Users", type: "text", placeholder: "Students, Developers, Enterprises..." },
        { name: "modelUsed", label: "Model / API Used", type: "text", placeholder: "GPT-4, Gemini, LLaMA, Claude..." },
        { name: "dataset", label: "Dataset Source", type: "text", placeholder: "Hugging Face, Kaggle, custom..." },
        { name: "aiTools", label: "AI Tools / Libraries", type: "text", placeholder: "LangChain, Hugging Face, Pinecone..." },
        { name: "vectorDatabase", label: "Vector Database", type: "text", placeholder: "Pinecone, ChromaDB, Weaviate..." },
        { name: "techStack", label: "Tech Stack ", type: "text", placeholder: "FastAPI, Next.js, Python..." },
        { name: "repoLink", label: "GitHub Repository", type: "url", placeholder: "https://github.com/..." },
        { name: "demoLink", label: "Demo Link", type: "url", placeholder: "https://..." },
        { name: "deploymentPlatform", label: "Deployment Platform", type: "text", placeholder: "Vercel, Railway, HuggingFace Spaces..." },
        { name: "documentFile", label: "Documentation File", type: "file" }
    ],
    "AI/ML": [
        { name: "title", label: "Project Title", type: "text", required: true },
        { name: "documentLink", label: "Documentation Link (Notion/Docs)", type: "url", placeholder: "https://docs.google.com/..." },
        { name: "description", label: "Problem Statement", type: "textarea", rows: 3, required: true },
        { name: "mlTaskType", label: "ML Task Type", type: "text", placeholder: "Classification, NLP, CV, Regression..." },
        { name: "dataset", label: "Dataset Source", type: "text", placeholder: "Kaggle, UCI, custom dataset..." },
        { name: "algorithms", label: "Algorithms / Models Used", type: "text", placeholder: "CNN, Transformer, SVM..." },
        { name: "mlFramework", label: "ML Framework", type: "text", placeholder: "TensorFlow, PyTorch, Scikit-Learn..." },
        { name: "techStack", label: "Tech Stack", type: "text", placeholder: "Python, FastAPI, Streamlit..." },
        { name: "trainingEnvironment", label: "Training Environment", type: "text", placeholder: "Local / AWS / GCP / GPU..." },
        { name: "repoLink", label: "GitHub Repository", type: "url", placeholder: "https://github.com/..." },
        { name: "demoLink", label: "Demo / Model API Link", type: "url", placeholder: "https://..." },
        { name: "deploymentPlatform", label: "Deployment Method", type: "text", placeholder: "HuggingFace, FastAPI, Flask..." },
        { name: "documentFile", label: "Documentation File", type: "file" }
    ],
    "App Development": [
        { name: "title", label: "Project Title", type: "text", required: true },
        { name: "documentLink", label: "Documentation Link (Notion/Docs)", type: "url", placeholder: "https://docs.google.com/..." },
        { name: "description", label: "Problem Statement", type: "textarea", rows: 3, required: true },
        { name: "targetPlatform", label: "Target Platform", type: "dropdown", options: ["Android", "iOS", "Cross-platform"] },
        { name: "appCategory", label: "App Category", type: "text", placeholder: "E-commerce, HealthTech, FinTech..." },
        { name: "features", label: "Core Features", type: "textarea", rows: 2, placeholder: "Auth, Push Notifs, Offline Mode..." },
        { name: "techStack", label: "Tech Stack / Framework ", type: "text", placeholder: "Flutter, React Native, Firebase..." },
        { name: "apis", label: "APIs / Integrations", type: "text", placeholder: "Maps API, Stripe, FCM..." },
        { name: "repoLink", label: "GitHub Repository", type: "url", placeholder: "https://github.com/..." },
        { name: "demoLink", label: "APK / TestFlight / Demo Link", type: "url", placeholder: "https://..." },
        { name: "deploymentPlatform", label: "Deployment Platform", type: "text", placeholder: "Play Store, App Store, Expo..." },
        { name: "documentFile", label: "Documentation File", type: "file" }
    ],
    "RESEARCH": [
        { name: "title", label: "Research Title", type: "text", required: true },
        { name: "documentLink", label: "Research Document Link (Notion/Docs)", type: "url", placeholder: "https://docs.google.com/..." },
        { name: "description", label: "Problem Statement", type: "textarea", rows: 3, required: true },
        { name: "referenceLink", label: "Reference Links (comma-separated URLs)", type: "urlArray", placeholder: "https://paper1.com, https://paper2.com..." },
        { name: "documentFile", label: "Research Document File", type: "file" }
    ]
};


export default function AdminProjectsPage() {
    const [activeTab, setActiveTab] = useState('available'); // default to projects pool
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
    const [selectedTrackName, setSelectedTrackName] = useState("Web Development");
    const [newTrackCategory, setNewTrackCategory] = useState("CODING");
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [deleteTrackTarget, setDeleteTrackTarget] = useState(null); // { category, index, track }
    const [openTrackMenuIdx, setOpenTrackMenuIdx] = useState(null); // "CODING-0" etc.
    const [selectedFileName, setSelectedFileName] = useState(null); // for file picker display
    const [formStep, setFormStep] = useState(1); // 1 = classification, 2 = specifications
    const [searchQuery, setSearchQuery] = useState('');
    const [searchOpen, setSearchOpen] = useState(false);
    const searchInputRef = useRef(null);

    const fetchAll = async () => {
        setIsRefreshing(true);
        try {
            const [reqRes, poolRes, tracksRes] = await Promise.all([
                fetch('/api/projects?role=admin'),
                fetch('/api/admin/projects/pool'),
                fetch('/api/admin/tracks')
            ]);

            if (tracksRes.ok) {
                const tracksData = await tracksRes.json();
                setTracks(tracksData);
            }

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
                        Projects
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
                                {/* Expandable Search Bar */}
                                <motion.div
                                    className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-xl overflow-hidden"
                                    animate={{ width: searchOpen ? 280 : 40 }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 28 }}
                                    style={{ minWidth: 40 }}
                                >
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSearchOpen(o => !o);
                                            if (!searchOpen) setTimeout(() => searchInputRef.current?.focus(), 150);
                                            else setSearchQuery('');
                                        }}
                                        className="shrink-0 w-10 h-10 flex items-center justify-center text-gray-400 hover:text-black transition-colors"
                                    >
                                        {searchOpen
                                            ? <X className="w-3.5 h-3.5" />
                                            : <Search className="w-3.5 h-3.5" />}
                                    </button>
                                    {searchOpen && (
                                        <input
                                            ref={searchInputRef}
                                            value={searchQuery}
                                            onChange={e => setSearchQuery(e.target.value)}
                                            placeholder="Search project or track..."
                                            className="flex-1 bg-transparent pr-3 text-[11px] font-bold outline-none placeholder:text-gray-300 text-gray-800"
                                        />
                                    )}
                                </motion.div>
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
                                        {available
                                            .filter(item => {
                                                if (!searchQuery.trim()) return true;
                                                const q = searchQuery.toLowerCase();
                                                return (
                                                    (item.title || '').toLowerCase().includes(q) ||
                                                    (item.track || '').toLowerCase().includes(q)
                                                );
                                            })
                                            .map(item => (
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
                ) : null}
            </AnimatePresence>

            {/* Add Project Modal */}
            <AnimatePresence>
                {isAddModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAddModalOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-2xl" />
                        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="relative bg-white rounded-[2.5rem] p-8 max-w-2xl w-full shadow-2xl overflow-hidden border border-gray-100 flex flex-col max-h-[90vh]">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <p className="text-[8px] font-black text-gray-300 uppercase tracking-[0.4em] mb-1">Asset Integration</p>
                                    <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">New Base Project</h3>
                                    {/* Step indicator */}
                                    <div className="flex items-center gap-2 mt-3">
                                        <div className={`flex items-center gap-1.5 text-[8px] font-black uppercase tracking-widest ${formStep === 1 ? 'text-black' : 'text-gray-300'}`}>
                                            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-black transition-all ${formStep === 1 ? 'bg-black text-white' : 'bg-gray-200 text-gray-400'}`}>1</div>
                                            Classification
                                        </div>
                                        <div className={`w-6 h-px ${formStep === 2 ? 'bg-black' : 'bg-gray-200'} transition-colors`} />
                                        <div className={`flex items-center gap-1.5 text-[8px] font-black uppercase tracking-widest ${formStep === 2 ? 'text-black' : 'text-gray-300'}`}>
                                            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-black transition-all ${formStep === 2 ? 'bg-black text-white' : 'bg-gray-200 text-gray-400'}`}>2</div>
                                            Specifications
                                        </div>
                                    </div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => { setIsAddModalOpen(false); setFormStep(1); setSelectedFileName(null); }}
                                    className="p-2.5 bg-gray-100 hover:bg-rose-50 hover:text-rose-500 rounded-xl transition-all border border-gray-200 shrink-0"
                                >
                                    <XCircle className="w-5 h-5" />
                                </button>
                            </div>

                            <form className="space-y-6 overflow-y-auto pr-4 custom-scrollbar" onSubmit={async (e) => {
                                e.preventDefault();
                                if (formStep === 1) { setFormStep(2); return; }
                                const formData = new FormData(e.target);

                                const baseFields = ['title', 'description', 'repoLink', 'demoLink', 'timeline', 'documentFile', 'documentLink', 'deadline'];
                                const newProject = {
                                    category: selectedCategory,
                                    track: selectedTrackName,
                                    difficulty: formData.get('difficulty'),
                                    type: formData.get('type') || "Coding Project",
                                    status: "Active",
                                    deadline: formData.get('deadline') || "1 Month",
                                    enrolled: 0,
                                    dynamicFields: {}
                                };

                                // Iterate and assign mapping
                                for (let [key, value] of formData.entries()) {
                                    if (['difficulty', 'type', 'track', 'category', 'deadline'].includes(key)) continue;

                                    if (baseFields.includes(key)) {
                                        newProject[key] = value;
                                    } else {
                                        newProject.dynamicFields[key] = value;
                                    }
                                }

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
                                {/* ── STEP 1: Classification ── */}
                                {formStep === 1 && (
                                    <div className="space-y-6">
                                        {/* Two-panel category picker */}
                                        <div className="space-y-3">
                                            <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest ml-1">Asset Category</label>
                                            <div className="grid grid-cols-2 gap-3">
                                                <button type="button" onClick={() => { setSelectedCategory("CODING"); setSelectedTrackName(tracks["CODING"]?.[0]?.name || ""); }} className={`relative p-4 rounded-2xl border-2 text-left transition-all ${selectedCategory === "CODING" ? "border-black bg-black text-white shadow-xl scale-[1.01]" : "border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-300"}`}>
                                                    <div className="text-[9px] font-black uppercase tracking-widest mb-1 opacity-60">Category</div>
                                                    <div className="text-[15px] font-black uppercase tracking-tight leading-none">💻 Coding</div>
                                                    <div className={`text-[9px] font-semibold mt-1.5 ${selectedCategory === "CODING" ? "text-gray-300" : "text-gray-400"}`}>Web, AI, Blockchain, App</div>
                                                </button>
                                                <button type="button" onClick={() => { setSelectedCategory("RESEARCH"); setSelectedTrackName(tracks["RESEARCH"]?.[0]?.name || ""); }} className={`relative p-4 rounded-2xl border-2 text-left transition-all ${selectedCategory === "RESEARCH" ? "border-black bg-black text-white shadow-xl scale-[1.01]" : "border-gray-100 bg-gray-50 text-gray-500 hover:border-gray-300"}`}>
                                                    <div className="text-[9px] font-black uppercase tracking-widest mb-1 opacity-60">Category</div>
                                                    <div className="text-[15px] font-black uppercase tracking-tight leading-none">🔬 Research</div>
                                                    <div className={`text-[9px] font-semibold mt-1.5 ${selectedCategory === "RESEARCH" ? "text-gray-300" : "text-gray-400"}`}>Science, Quantum, Bio, Energy</div>
                                                </button>
                                            </div>
                                        </div>

                                        {/* Track chip selector */}
                                        <div className="space-y-2">
                                            <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest ml-1">
                                                Specific Track — <span className={selectedCategory === "CODING" ? "text-black" : "text-indigo-500"}>{selectedCategory}</span>
                                            </label>
                                            <div className="flex flex-wrap gap-2">
                                                {(tracks[selectedCategory] || []).map((t, i) => (
                                                    <button key={t.name || i} type="button" onClick={() => setSelectedTrackName(t.name)} className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all border ${selectedTrackName === t.name ? "bg-black text-white border-black shadow-md" : "bg-white text-gray-500 border-gray-200 hover:border-black/30 hover:text-black"}`}>
                                                        {t.name}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Difficulty + Duration */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest ml-1">Difficulty Matrix</label>
                                                <select name="difficulty" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-[12px] font-bold focus:ring-4 focus:ring-black/5 outline-none">
                                                    <option>Beginner</option>
                                                    <option>Intermediate</option>
                                                    <option>Advanced</option>
                                                </select>
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest ml-1">TTL / Duration</label>
                                                <input name="deadline" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-[12px] font-bold focus:ring-4 focus:ring-black/5 outline-none" placeholder="1 Month" />
                                            </div>
                                        </div>

                                        {/* Asset Type */}
                                        <div className="space-y-1.5">
                                            <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest ml-1">Asset Type</label>
                                            <select name="type" className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-[12px] font-bold focus:ring-4 focus:ring-black/5 outline-none">
                                                <option>Coding Project</option>
                                                <option>Research Paper</option>
                                                <option>Prototype Development</option>
                                                <option>Hybrid (Coding + Research)</option>
                                            </select>
                                        </div>

                                        <div className="pt-2">
                                            <button type="submit" className="w-full py-4 bg-black text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-xl hover:scale-[1.01] transition-all flex items-center justify-center gap-3">
                                                Continue to Specifications <ArrowRight className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                )}

                                {/* ── STEP 2: Specifications ── */}
                                {formStep === 2 && (
                                    <div className="space-y-4">
                                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest border-l-4 border-black pl-3">
                                            {selectedCategory === "RESEARCH" ? "Research Specifications" : `${selectedTrackName} Specifications`}
                                        </p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            {(TRACK_FORM_FIELDS[selectedCategory === "RESEARCH" ? "RESEARCH" : selectedTrackName] || TRACK_FORM_FIELDS["Web Development"]).map((field, idx) => {
                                                const isWide = field.type === 'textarea' || field.type === 'file' || field.type === 'urlArray';
                                                return (
                                                    <div key={idx} className={`space-y-1.5 ${isWide ? 'col-span-1 md:col-span-2' : ''}`}>
                                                        <label className="flex items-center gap-1.5 text-[8px] font-black text-gray-400 uppercase tracking-widest ml-1">
                                                            {field.label}
                                                            {(field.type === 'csv') && (<span className="px-1.5 py-0.5 bg-blue-50 text-blue-500 rounded text-[7px] font-black normal-case tracking-normal">CSV</span>)}
                                                            {(field.type === 'url' || field.type === 'urlArray') && (<span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-500 rounded text-[7px] font-black normal-case tracking-normal">URL</span>)}
                                                        </label>
                                                        {field.type === 'textarea' ? (
                                                            <textarea name={field.name} rows={field.rows || 2} required={field.required} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-[12px] font-bold focus:ring-4 focus:ring-black/5 outline-none resize-none" placeholder={field.placeholder || "..."} />
                                                        ) : field.type === 'file' ? (
                                                            <label className="group flex flex-col items-center justify-center gap-2 w-full h-24 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl cursor-pointer hover:border-black hover:bg-gray-100 transition-all">
                                                                <input type="file" name={field.name} accept=".pdf,.doc,.docx,.ppt,.pptx" className="hidden" onChange={(e) => setSelectedFileName(e.target.files?.[0]?.name || null)} />
                                                                {selectedFileName ? (
                                                                    <><svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg><span className="text-[10px] font-black text-black tracking-widest text-center px-4 truncate max-w-full">{selectedFileName}</span><span className="text-[8px] text-gray-400">Click to change</span></>
                                                                ) : (
                                                                    <><svg className="w-6 h-6 text-gray-400 group-hover:text-black transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg><span className="text-[9px] font-black text-gray-400 group-hover:text-black uppercase tracking-widest transition-colors">Click to select file</span><span className="text-[8px] text-gray-300">PDF, DOC, DOCX, PPT supported</span></>
                                                                )}
                                                            </label>
                                                        ) : field.type === 'dropdown' ? (
                                                            <select name={field.name} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-[12px] font-bold focus:ring-4 focus:ring-black/5 outline-none">
                                                                {(field.options || []).map(opt => (<option key={opt} value={opt}>{opt}</option>))}
                                                            </select>
                                                        ) : field.type === 'urlArray' ? (
                                                            <textarea name={field.name} rows={2} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-[12px] font-bold focus:ring-4 focus:ring-black/5 outline-none resize-none" placeholder={field.placeholder || "https://ref1.com, https://ref2.com..."} />
                                                        ) : (
                                                            <input name={field.name} type={field.type === 'url' ? 'url' : 'text'} required={field.required} className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-[12px] font-bold focus:ring-4 focus:ring-black/5 outline-none" placeholder={field.placeholder || "..."} />
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        <div className="flex gap-3 pt-2">
                                            <button type="button" onClick={() => setFormStep(1)} className="flex-1 py-4 bg-gray-100 text-gray-700 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-gray-200 transition-all flex items-center justify-center gap-2">
                                                ← Back
                                            </button>
                                            <button type="submit" className="flex-[2] py-4 bg-black text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-xl hover:scale-[1.01] transition-all flex items-center justify-center gap-3">
                                                Initialize Protocol Deployment <ArrowRight className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </form>
                        </motion.div>
                    </div>
                )
                }
            </AnimatePresence >

            {/* Edit Project Modal */}
            < AnimatePresence >
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
                                            <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest ml-1">Stack </label>
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
                                        <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest ml-1">Key Milestones </label>
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
            </AnimatePresence >

            {/* Proposal Details Modal */}
            < AnimatePresence >
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
            </AnimatePresence >


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
        </div >
    );
}
