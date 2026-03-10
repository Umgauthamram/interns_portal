"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, User, Mail, Calendar, Phone, Award, Github, Link as LinkIcon, Activity, Star, Eye, CheckCircle, RefreshCw, CalendarCheck, Plus, Trash2, Clock, Video, TrendingUp, ChevronDown, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { toast } from "react-hot-toast";

export default function InternDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const id = params?.id;

    const [user, setUser] = useState(null);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProject, setSelectedProject] = useState(null);
    const [isIssuing, setIsIssuing] = useState(false);
    const [showCertificateModal, setShowCertificateModal] = useState(false);

    // Weekly Review state
    const [weeklyReviews, setWeeklyReviews] = useState([]);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [reviewForm, setReviewForm] = useState({
        weekLabel: '',
        meetingDate: '',
        meetingTime: '',
        meetingLink: '',
        progressStatus: 'On Track',
        progressNote: '',
        adminFeedback: '',
    });
    const [savingReview, setSavingReview] = useState(false);

    const handleIssueCertificate = () => {
        setIsIssuing(true);
        setTimeout(() => {
            toast.success(`Certificate issued to ${user.fullName}!`);
            setIsIssuing(false);
            setShowCertificateModal(false);
        }, 1500);
    };

    useEffect(() => {
        if (!id) return;

        const fetchDetails = async () => {
            try {
                const [userRes, reviewsRes] = await Promise.all([
                    fetch(`/api/admin/users/${id}`),
                    fetch(`/api/weekly-review?internId=${id}`),
                ]);
                if (userRes.ok) {
                    const data = await userRes.json();
                    setUser(data.user);
                    setProjects(data.projects || []);
                }
                if (reviewsRes.ok) {
                    const rData = await reviewsRes.json();
                    setWeeklyReviews(Array.isArray(rData) ? rData : []);
                }
            } catch (err) {
                console.error("Error fetching user details", err);
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [id]);

    const calculateEndDate = (joinDate, durationString) => {
        if (!joinDate || !durationString) return "N/A";
        const start = new Date(joinDate);
        const months = parseInt(durationString.split(' ')[0]) || 0;
        start.setMonth(start.getMonth() + months);
        return start.toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full min-h-[50vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="p-8 text-center text-gray-500">
                <p>User not found.</p>
                <button onClick={() => router.back()} className="mt-4 px-4 py-2 border rounded-xl hover:bg-gray-50 text-sm font-bold">Go Back</button>
            </div>
        );
    }

    return (
        <div className="-mt-8 -mx-8">
            {/* Top Area: Full Width Intern Profile Header */}
            <div className="bg-white px-8 pt-8 pb-12 border-b border-gray-100 shadow-sm relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-50 rounded-full blur-[120px] opacity-70 -translate-y-1/4 translate-x-1/4 pointer-events-none" />

                <div className="w-full relative z-10 flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <button
                        onClick={() => router.push('/admin/users')}
                        className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-black transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" /> Back to Users
                    </button>

                    {user.role?.toLowerCase() === 'intern' && (
                        <button
                            onClick={() => setShowCertificateModal(true)}
                            className="bg-emerald-50 text-emerald-600 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-600 hover:text-white transition-all flex items-center gap-2 border border-emerald-100 shadow-sm"
                        >
                            <Award className="w-4 h-4" /> Issue Certificate
                        </button>
                    )}
                </div>

                <div className="flex flex-col md:flex-row gap-8 items-start relative z-10">
                    {/* Profile Picture with Cartoon Avatar Fallback */}
                    <div className="w-36 h-36 shrink-0 rounded-[2.5rem] bg-gray-50 shadow-xl shadow-gray-200/50 border-[4px] border-white overflow-hidden relative z-20">
                        {user.profilePicture || user.image ? (
                            <img src={user.profilePicture || user.image} alt={user.fullName} className="w-full h-full object-cover" />
                        ) : (
                            <img src={`https://avatar.iran.liara.run/public/${user.gender?.toLowerCase() === 'female' ? 'girl' : 'boy'}?username=${encodeURIComponent(user.fullName || user.email)}`} alt={user.fullName} className="w-full h-full object-cover" />
                        )}
                    </div>

                    <div className="flex-1 space-y-5 w-full pt-2">
                        <div>
                            <div className="flex items-center gap-3 mb-1">
                                <h1 className="text-3xl font-black text-gray-900 tracking-tight">{user.fullName}</h1>
                                <span className={`px-2.5 py-1 rounded-full text-[10px] uppercase font-bold border ${user.role === 'admin' ? 'bg-purple-50 text-purple-700 border-purple-100' : 'bg-blue-50 text-blue-700 border-blue-100'}`}>
                                    {user.role}
                                </span>
                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${user.status === 'Active' ? 'text-green-700 bg-green-50 border border-green-100' : 'text-gray-500 bg-gray-100 border border-gray-200'}`}>
                                    <div className={`w-1.5 h-1.5 rounded-full ${user.status === 'Active' ? 'bg-green-500' : 'bg-gray-500'}`}></div>
                                    {user.status || 'Active'}
                                </span>
                            </div>
                            <p className="text-sm font-bold text-gray-400 flex items-center gap-2">
                                <Mail className="w-4 h-4" /> {user.email}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-5 border-t border-gray-50">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">Track Selection</p>
                                <p className="text-sm font-bold text-gray-900">{user.track || 'Unassigned'}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">Phone Number</p>
                                <p className="text-sm font-bold text-gray-900 flex items-center gap-1">
                                    <Phone className="w-3 h-3 text-gray-400" /> {user.phone || 'N/A'}
                                </p>
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">Timeline Status</p>
                                <p className="text-sm font-bold text-gray-900">{user.duration || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-1.5">Internship Duration</p>
                                <p className="text-xs font-bold text-gray-500 flex items-center gap-1.5">
                                    <Calendar className="w-3.5 h-3.5" />
                                    {new Date(user.joinDate).toLocaleDateString()} &rarr; {calculateEndDate(user.joinDate, user.duration)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Area: Projects */}
            <div className="p-8 space-y-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                        <Activity className="w-6 h-6 text-emerald-500" /> Submitted Protocols
                    </h2>

                    {projects.length > 0 && (
                        <div className="w-full md:w-96 bg-gray-900 rounded-[2rem] p-6 shadow-xl border border-gray-800 space-y-4">
                            <div className="flex justify-between items-center px-1">
                                <label className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em]">Rapid Integration Select</label>
                            </div>
                            <select
                                onChange={(e) => {
                                    const proj = projects.find(p => p._id === e.target.value);
                                    if (proj) setSelectedProject(proj);
                                }}
                                className="w-full bg-black border border-white/10 rounded-xl px-4 py-2 text-[11px] font-black text-white uppercase tracking-wider outline-none focus:border-emerald-500 transition-colors"
                            >
                                <option value="">Select Protocol</option>
                                {projects.map(p => (
                                    <option key={p._id} value={p._id}>{p.projectName}</option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>

                {projects.length === 0 ? (
                    <div className="bg-white border-2 border-dashed border-gray-100 p-20 rounded-[3rem] text-center text-gray-400 font-bold uppercase tracking-widest text-xs">
                        No active deployments detected.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {projects.map(project => (
                            <div
                                key={project._id}
                                onClick={() => setSelectedProject(project)}
                                className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer group"
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <div
                                        className="w-10 h-10 rounded-xl flex items-center justify-center shadow-inner"
                                        style={{ backgroundColor: `${project.colorHex}20`, color: project.colorHex || '#8b5cf6' }}
                                    >
                                        <Star className="w-5 h-5 fill-current" />
                                    </div>
                                    <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${project.status === 'Approved' ? 'bg-green-50 text-green-600' :
                                        project.status === 'Rejected' ? 'bg-red-50 text-red-600' :
                                            'bg-yellow-50 text-yellow-600'
                                        }`}>
                                        {project.status}
                                    </span>
                                </div>

                                <h3 className="text-lg font-bold text-gray-900 group-hover:text-black transition-colors">{project.projectName}</h3>
                                <p className="text-xs text-gray-500 mt-2 line-clamp-2">{project.description}</p>

                                <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between items-center text-xs font-bold text-gray-400">
                                    <span>{new Date(project.requestedAt).toLocaleDateString()}</span>
                                    {project.progress > 0 && <span>Progress: {project.progress}%</span>}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Project Details Modal */}
            <AnimatePresence>
                {selectedProject && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setSelectedProject(null)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="relative w-full max-w-2xl bg-white rounded-[2.5rem] p-8 shadow-2xl overflow-y-auto max-h-[90vh]">
                            <div className="flex justify-between items-start mb-6">
                                <div className="flex items-center gap-4">
                                    <div
                                        className="w-12 h-12 rounded-xl flex items-center justify-center"
                                        style={{ backgroundColor: `${selectedProject.colorHex}20`, color: selectedProject.colorHex || '#8b5cf6' }}
                                    >
                                        <Star className="w-6 h-6 fill-current" />
                                    </div>
                                    <div>
                                        <h3 className="text-2xl font-black text-gray-900 tracking-tight">{selectedProject.projectName}</h3>
                                        <p className="text-xs font-bold text-gray-400 mt-1 uppercase tracking-widest">{selectedProject.projectType} Project</p>
                                    </div>
                                </div>
                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${selectedProject.status === 'Approved' ? 'bg-green-50 text-green-600 border border-green-100' :
                                    selectedProject.status === 'Rejected' ? 'bg-red-50 text-red-600 border border-red-100' :
                                        'bg-yellow-50 text-yellow-600 border border-yellow-100'
                                    }`}>
                                    {selectedProject.status}
                                </span>
                            </div>

                            <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100 mb-6">
                                <p className="text-sm font-medium text-gray-700 leading-relaxed text-balance">
                                    {selectedProject.description}
                                </p>
                            </div>

                            <div className="space-y-6">
                                {/* Tech Stack */}
                                {selectedProject.techStack && selectedProject.techStack.length > 0 && (
                                    <div>
                                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Tech Stack</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedProject.techStack.map(tech => (
                                                <span key={tech} className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-lg text-xs font-bold border border-gray-200">
                                                    {tech}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Admin Progress Control */}
                                <div className="p-6 bg-gray-900 rounded-[2rem] border border-gray-800 shadow-xl space-y-4">
                                    <div className="flex justify-between items-center">
                                        <h4 className="text-[10px] font-black text-white/40 uppercase tracking-widest flex items-center gap-2">
                                            <Activity className="w-3 h-3 text-emerald-400" /> Integration Level Control
                                        </h4>
                                        <div className="bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
                                            <span className="text-sm font-black text-emerald-400">{selectedProject.progress || 0}%</span>
                                        </div>
                                    </div>
                                    <div className="relative w-full h-4 bg-white/5 rounded-full overflow-hidden flex items-center">
                                        <div
                                            className="absolute left-0 h-full bg-gradient-to-r from-emerald-500 to-emerald-400 transition-all duration-300"
                                            style={{ width: `${selectedProject.progress || 0}%` }}
                                        />
                                        <input
                                            type="range"
                                            min="0"
                                            max="100"
                                            value={selectedProject.progress || 0}
                                            onChange={(e) => setSelectedProject({ ...selectedProject, progress: parseInt(e.target.value) })}
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                        />
                                    </div>
                                    <button
                                        onClick={async () => {
                                            setIsIssuing(true);
                                            try {
                                                const res = await fetch('/api/projects', {
                                                    method: 'PUT',
                                                    headers: { 'Content-Type': 'application/json' },
                                                    body: JSON.stringify({
                                                        id: selectedProject._id,
                                                        progress: selectedProject.progress
                                                    })
                                                });
                                                if (res.ok) {
                                                    setProjects(prev => prev.map(p => p._id === selectedProject._id ? { ...p, progress: selectedProject.progress } : p));
                                                    toast.success("Intelligence Progress Synced");
                                                } else {
                                                    toast.error("Sync Failed");
                                                }
                                            } catch (err) {
                                                toast.error("Network Error");
                                            } finally {
                                                setIsIssuing(false);
                                            }
                                        }}
                                        disabled={isIssuing}
                                        className="w-full py-3 bg-white text-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-400 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                    >
                                        {isIssuing ? <RefreshCw className="w-3 h-3 animate-spin" /> : <CheckCircle className="w-3 h-3" />}
                                        Sync Integration Level
                                    </button>
                                </div>

                                {/* Links */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {selectedProject.repoLink ? (
                                        <Link href={selectedProject.repoLink} target="_blank" className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors border border-gray-100 group">
                                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                                <Github className="w-5 h-5 text-gray-900 group-hover:scale-110 transition-transform" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Source Code</p>
                                                <p className="text-sm font-bold text-gray-900 truncate max-w-[200px]">GitHub Repository</p>
                                            </div>
                                        </Link>
                                    ) : (
                                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100 opacity-60">
                                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                                <Github className="w-5 h-5 text-gray-400" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Source Code</p>
                                                <p className="text-sm font-bold text-gray-400">Not provided</p>
                                            </div>
                                        </div>
                                    )}

                                    {selectedProject.deployLink ? (
                                        <Link href={selectedProject.deployLink} target="_blank" className="flex items-center gap-3 p-4 bg-blue-50/50 rounded-2xl hover:bg-blue-50 transition-colors border border-blue-100 group">
                                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-blue-600">
                                                <LinkIcon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Live Deployment</p>
                                                <p className="text-sm font-bold text-blue-900 truncate max-w-[200px]">View Application</p>
                                            </div>
                                        </Link>
                                    ) : (
                                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100 opacity-60">
                                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                                                <LinkIcon className="w-5 h-5 text-gray-400" />
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Live Deployment</p>
                                                <p className="text-sm font-bold text-gray-400">Not provided</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="pt-6 mt-6 border-t border-gray-100 flex justify-end">
                                    <button onClick={() => setSelectedProject(null)} className="px-6 py-2.5 bg-black text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg hover:bg-gray-800 transition-colors">
                                        Close Details
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* ── Weekly Review Section ── */}
            <div className="px-8 pb-10 space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-black text-gray-900 tracking-tight flex items-center gap-3">
                        <CalendarCheck className="w-6 h-6 text-blue-500" /> Weekly Reviews
                    </h2>
                    <button
                        onClick={() => setShowReviewForm(v => !v)}
                        className="flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-gray-800 transition-all shadow-lg"
                    >
                        <Plus className="w-4 h-4" /> {showReviewForm ? 'Cancel' : 'Schedule Review'}
                    </button>
                </div>

                {/* New Review Form */}
                <AnimatePresence>
                    {showReviewForm && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="bg-white border border-gray-100 rounded-[2rem] p-8 shadow-sm space-y-6"
                        >
                            <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">Schedule New Weekly Review</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Week Label</label>
                                    <input
                                        placeholder="e.g. Week 3, Sprint 1"
                                        value={reviewForm.weekLabel}
                                        onChange={e => setReviewForm(f => ({ ...f, weekLabel: e.target.value }))}
                                        className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 outline-none focus:ring-2 focus:ring-black/10"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Meeting Date</label>
                                    <input
                                        type="date"
                                        value={reviewForm.meetingDate}
                                        onChange={e => setReviewForm(f => ({ ...f, meetingDate: e.target.value }))}
                                        className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 outline-none focus:ring-2 focus:ring-black/10"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Meeting Time</label>
                                    <input
                                        type="time"
                                        value={reviewForm.meetingTime}
                                        onChange={e => setReviewForm(f => ({ ...f, meetingTime: e.target.value }))}
                                        className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 outline-none focus:ring-2 focus:ring-black/10"
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Meeting Link (Google Meet / Zoom)</label>
                                    <input
                                        placeholder="https://meet.google.com/..."
                                        value={reviewForm.meetingLink}
                                        onChange={e => setReviewForm(f => ({ ...f, meetingLink: e.target.value }))}
                                        className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 outline-none focus:ring-2 focus:ring-black/10"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Progress Status</label>
                                <div className="relative">
                                    <select
                                        value={reviewForm.progressStatus}
                                        onChange={e => setReviewForm(f => ({ ...f, progressStatus: e.target.value }))}
                                        className="w-full appearance-none bg-gray-50 rounded-xl px-4 py-3 pr-10 text-sm font-bold text-gray-900 outline-none focus:ring-2 focus:ring-black/10"
                                    >
                                        {['On Track', 'Needs Attention', 'Behind Schedule', 'Excellent', 'Completed'].map(s => (
                                            <option key={s} value={s}>{s}</option>
                                        ))}
                                    </select>
                                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Progress Note (visible to intern)</label>
                                <textarea
                                    rows={2}
                                    placeholder="Brief note on this week's progress..."
                                    value={reviewForm.progressNote}
                                    onChange={e => setReviewForm(f => ({ ...f, progressNote: e.target.value }))}
                                    className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 outline-none focus:ring-2 focus:ring-black/10 resize-none"
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Admin Feedback (internal)</label>
                                <textarea
                                    rows={2}
                                    placeholder="Internal observations or action items..."
                                    value={reviewForm.adminFeedback}
                                    onChange={e => setReviewForm(f => ({ ...f, adminFeedback: e.target.value }))}
                                    className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm font-bold text-gray-900 outline-none focus:ring-2 focus:ring-black/10 resize-none"
                                />
                            </div>

                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={() => setShowReviewForm(false)}
                                    className="px-6 py-2.5 text-xs font-black uppercase text-gray-400 hover:text-black transition-colors"
                                >Cancel</button>
                                <button
                                    disabled={savingReview || !reviewForm.weekLabel || !reviewForm.meetingDate || !reviewForm.meetingTime || !reviewForm.meetingLink}
                                    onClick={async () => {
                                        setSavingReview(true);
                                        try {
                                            const res = await fetch('/api/weekly-review', {
                                                method: 'POST',
                                                headers: { 'Content-Type': 'application/json' },
                                                body: JSON.stringify({ ...reviewForm, internId: id, internEmail: user.email })
                                            });
                                            if (res.ok) {
                                                const newReview = await res.json();
                                                setWeeklyReviews(prev => [newReview, ...prev]);
                                                setShowReviewForm(false);
                                                setReviewForm({ weekLabel: '', meetingDate: '', meetingTime: '', meetingLink: '', progressStatus: 'On Track', progressNote: '', adminFeedback: '' });
                                                toast.success('Weekly review scheduled!');
                                            } else {
                                                toast.error('Failed to schedule review.');
                                            }
                                        } catch { toast.error('Error saving review.'); }
                                        finally { setSavingReview(false); }
                                    }}
                                    className="px-6 py-2.5 bg-black text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg hover:bg-gray-800 transition-all disabled:opacity-50 flex items-center gap-2"
                                >
                                    {savingReview ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <CalendarCheck className="w-3.5 h-3.5" />}
                                    {savingReview ? 'Saving...' : 'Schedule Review'}
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Reviews Timeline */}
                {weeklyReviews.length === 0 ? (
                    <div className="p-10 bg-gray-50 rounded-[2rem] text-center border border-gray-100">
                        <CalendarCheck className="w-8 h-8 text-gray-300 mx-auto mb-3" />
                        <p className="text-sm font-bold text-gray-400">No weekly reviews scheduled yet.</p>
                        <p className="text-xs text-gray-400 mt-1">Click "Schedule Review" to create the first one.</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {weeklyReviews.map((review) => {
                            const statusColors = {
                                'On Track': 'bg-blue-50 text-blue-700 border-blue-100',
                                'Needs Attention': 'bg-amber-50 text-amber-700 border-amber-100',
                                'Behind Schedule': 'bg-rose-50 text-rose-700 border-rose-100',
                                'Excellent': 'bg-emerald-50 text-emerald-700 border-emerald-100',
                                'Completed': 'bg-gray-900 text-white border-gray-800',
                            };
                            return (
                                <div key={review._id} className="bg-white rounded-[1.5rem] p-6 border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center gap-5">
                                    <div className="flex-1 space-y-3">
                                        <div className="flex items-center gap-3 flex-wrap">
                                            <span className="font-black text-gray-900 text-sm uppercase tracking-tight">{review.weekLabel}</span>
                                            <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase border ${statusColors[review.progressStatus] || 'bg-gray-50 text-gray-500 border-gray-100'}`}>
                                                {review.progressStatus}
                                            </span>
                                            <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase border ${review.meetingStatus === 'Completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                    review.meetingStatus === 'Cancelled' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                                                        'bg-sky-50 text-sky-600 border-sky-100'
                                                }`}>{review.meetingStatus}</span>
                                        </div>
                                        <div className="flex items-center gap-4 text-xs font-bold text-gray-400 flex-wrap">
                                            <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" />{new Date(review.meetingDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                                            <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" />{review.meetingTime}</span>
                                            <a href={review.meetingLink} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 text-blue-500 hover:underline"><Video className="w-3.5 h-3.5" />Join Meeting</a>
                                        </div>
                                        {review.progressNote && <p className="text-xs text-gray-500 italic bg-gray-50 rounded-lg px-3 py-2">{review.progressNote}</p>}
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0">
                                        {review.meetingStatus === 'Scheduled' && (
                                            <button
                                                onClick={async () => {
                                                    const res = await fetch(`/api/weekly-review/${review._id}`, {
                                                        method: 'PUT',
                                                        headers: { 'Content-Type': 'application/json' },
                                                        body: JSON.stringify({ meetingStatus: 'Completed' })
                                                    });
                                                    if (res.ok) {
                                                        setWeeklyReviews(prev => prev.map(r => r._id === review._id ? { ...r, meetingStatus: 'Completed' } : r));
                                                        toast.success('Marked as completed!');
                                                    }
                                                }}
                                                className="px-3 py-1.5 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-lg text-[9px] font-black uppercase hover:bg-emerald-100 transition-all"
                                            >
                                                <CheckCircle className="w-3.5 h-3.5" />
                                            </button>
                                        )}
                                        <button
                                            onClick={async () => {
                                                if (!confirm('Delete this review?')) return;
                                                const res = await fetch(`/api/weekly-review/${review._id}`, { method: 'DELETE' });
                                                if (res.ok) {
                                                    setWeeklyReviews(prev => prev.filter(r => r._id !== review._id));
                                                    toast.success('Review deleted.');
                                                }
                                            }}
                                            className="p-1.5 bg-rose-50 text-rose-400 rounded-lg hover:bg-rose-100 transition-all"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Issue Certificate Modal */}
            <AnimatePresence>
                {showCertificateModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowCertificateModal(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-sm bg-white rounded-[2.5rem] p-8 shadow-2xl">
                            <h3 className="text-xl font-black text-gray-900 flex items-center gap-2 mb-2">
                                <Award className="w-5 h-5 text-emerald-500" />
                                Issue Certificate
                            </h3>
                            <p className="text-[11px] font-bold text-gray-400 mb-6 font-medium">Process completion protocol for {user.fullName}</p>

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
                                <button onClick={() => setShowCertificateModal(false)} className="flex-1 py-3 text-[10px] font-black uppercase text-gray-400">Cancel</button>
                                <button
                                    onClick={handleIssueCertificate}
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
        </div >
    );
}
