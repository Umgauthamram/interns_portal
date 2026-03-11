"use client";

import { useState, useEffect } from "react";
import { Plus, Edit3, Trash2, XCircle, ArrowRight, Briefcase, Zap, MoreHorizontal, Layout } from "lucide-react";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminTracksPage() {
    const [tracks, setTracks] = useState({ CODING: [], RESEARCH: [] });
    const [isAddTrackModalOpen, setIsAddTrackModalOpen] = useState(false);
    const [isTrackEditModalOpen, setIsTrackEditModalOpen] = useState(false);
    const [editingTrack, setEditingTrack] = useState(null);
    const [deleteTrackTarget, setDeleteTrackTarget] = useState(null);
    const [newTrackName, setNewTrackName] = useState("");
    const [newTrackCategory, setNewTrackCategory] = useState("CODING");
    const [openTrackMenuIdx, setOpenTrackMenuIdx] = useState(null);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchTracks = async () => {
        setIsRefreshing(true);
        try {
            const res = await fetch("/api/admin/tracks");
            if (res.ok) {
                const data = await res.json();
                setTracks(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchTracks();
    }, []);

    const handleAddTrackSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const name = formData.get("name");
        const description = formData.get("description");
        const category = newTrackCategory;

        try {
            const res = await fetch("/api/admin/tracks", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, description, category })
            });

            if (res.ok) {
                toast.success("New Academic Track Added.");
                fetchTracks();
                setIsAddTrackModalOpen(false);
                setNewTrackName("");
            } else {
                toast.error("Track could not be added.");
            }
        } catch (err) {
            toast.error("Error creating track.");
        }
    };

    const handleEditTrackSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const name = formData.get("name");
        const description = formData.get("description");

        try {
            const res = await fetch("/api/admin/tracks", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: editingTrack.id, name, description })
            });

            if (res.ok) {
                toast.success("Track Configuration Updated.");
                fetchTracks();
                setIsTrackEditModalOpen(false);
                setEditingTrack(null);
            } else {
                toast.error("Could not update track.");
            }
        } catch (err) {
            toast.error("Error updating track.");
        }
    };

    const handleDeleteTrack = async (id) => {
        try {
            const res = await fetch(`/api/admin/tracks?id=${id}`, {
                method: "DELETE"
            });

            if (res.ok) {
                toast.success("Track successfully removed.");
                fetchTracks();
                setDeleteTrackTarget(null);
            } else {
                toast.error("Could not delete track.");
            }
        } catch (err) {
            toast.error("Error deleting track.");
        }
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-10">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-gray-50 pb-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-[0.4em] text-gray-300">
                        <Layout className="w-3 h-3" /> System Architecture
                    </div>
                    <div className="flex items-center gap-4">
                        <h1 className="text-3xl font-black text-gray-900 tracking-tighter uppercase leading-none">
                            Academic Tracks
                        </h1>
                    </div>
                </div>
            </div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-xl shadow-gray-200/20">
                    <div className="flex justify-between items-center mb-10">
                        <div>
                            <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tighter">Current Pathways</h3>
                            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mt-1">Define learning pathways for interns</p>
                        </div>
                        <button
                            onClick={() => setIsAddTrackModalOpen(true)}
                            disabled={isRefreshing}
                            className={`px-6 py-3 bg-black text-white rounded-xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2 hover:scale-[1.02] transition-all shadow-lg ${isRefreshing ? 'opacity-50' : ''}`}
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
                                            <div key={track._id} className="group p-6 bg-gray-50 border border-gray-100 rounded-[1.5rem] flex flex-col gap-3 hover:bg-white hover:shadow-xl hover:shadow-gray-200/30 transition-all relative overflow-visible">
                                                <div className="flex items-center justify-between">
                                                    <div
                                                        className="p-3 bg-white rounded-xl shadow-sm border border-gray-50 group-hover:scale-110 transition-transform cursor-pointer"
                                                        onClick={() => {
                                                            setEditingTrack({ ...track, id: track._id });
                                                            setIsTrackEditModalOpen(true);
                                                        }}
                                                    >
                                                        {category === 'CODING' ? <Briefcase className="w-5 h-5 text-black" /> : <Zap className="w-5 h-5 text-rose-500" />}
                                                    </div>

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
                                                            <div className="absolute right-0 top-8 bg-white border border-gray-100 rounded-2xl shadow-xl z-[60] overflow-hidden min-w-[130px]" onClick={e => e.stopPropagation()}>
                                                                <button
                                                                    onClick={() => {
                                                                        setEditingTrack({ ...track, id: track._id });
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
                                                                        setDeleteTrackTarget(track);
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

                                                <div className="cursor-pointer" onClick={() => {
                                                    setEditingTrack({ ...track, id: track._id });
                                                    setIsTrackEditModalOpen(true);
                                                }}>
                                                    <h5 className="font-black text-gray-900 tracking-tight leading-tight">{track.name}</h5>
                                                    <p className="text-[12px] font-bold text-gray-400 mt-2 line-clamp-2">{track.description}</p>
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

            {/* Add Track Modal */}
            <AnimatePresence>
                {isAddTrackModalOpen && (
                    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAddTrackModalOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-2xl" />
                        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="relative bg-white rounded-[2rem] p-8 max-w-md w-full shadow-2xl border border-gray-100">
                            <div className="flex justify-between items-center mb-6">
                                <div>
                                    <p className="text-[8px] font-black text-gray-300 uppercase tracking-[0.4em] mb-1">New Pipeline</p>
                                    <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter">Add Academic Track</h3>
                                </div>
                                <button onClick={() => setIsAddTrackModalOpen(false)} className="p-2 bg-gray-50 rounded-xl hover:bg-rose-50 hover:text-rose-500 transition-all border border-gray-100"><XCircle className="w-5 h-5" /></button>
                            </div>

                            <form className="space-y-6" onSubmit={handleAddTrackSubmit}>
                                <div className="space-y-1.5">
                                    <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest ml-1">Asset Category</label>
                                    <select
                                        value={newTrackCategory}
                                        onChange={(e) => setNewTrackCategory(e.target.value)}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-[12px] font-bold focus:ring-4 focus:ring-black/5 outline-none"
                                    >
                                        <option value="CODING">Scientific Programming</option>
                                        <option value="RESEARCH">Research & Innovations</option>
                                    </select>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest ml-1">Track Identifier</label>
                                    <input name="name" value={newTrackName} onChange={e => setNewTrackName(e.target.value)} required className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-[12px] font-bold focus:ring-4 focus:ring-black/5 outline-none" placeholder="E.g. Web Development..." />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest ml-1">Protocol Description</label>
                                    <textarea name="description" rows="4" required className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-[12px] font-bold focus:ring-4 focus:ring-black/5 outline-none resize-none" placeholder="Detail the learning outcomes and technical focus area..." />
                                </div>
                                <button type="submit" className="w-full py-4 bg-black text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg hover:scale-[1.01] transition-all border border-black flex items-center justify-center gap-2 group">
                                    Initialize Track <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Edit Track Modal */}
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

                            <form className="space-y-6" onSubmit={handleEditTrackSubmit}>
                                <div className="space-y-1.5">
                                    <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest ml-1">Track Identifier</label>
                                    <input name="name" defaultValue={editingTrack.name} required className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-[12px] font-bold focus:ring-4 focus:ring-black/5 outline-none" placeholder="E.g. Web Development..." />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest ml-1">Protocol Description</label>
                                    <textarea name="description" defaultValue={editingTrack.description} rows="4" required className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-[12px] font-bold focus:ring-4 focus:ring-black/5 outline-none resize-none" placeholder="Detail the learning outcomes and technical focus area..." />
                                </div>
                                <button type="submit" className="w-full py-4 bg-black text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg hover:scale-[1.01] transition-all border border-black flex items-center justify-center gap-2 group">
                                    Sync Protocol Changes <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Delete Track Modal */}
            <AnimatePresence>
                {deleteTrackTarget && (
                    <div className="fixed inset-0 z-[140] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setDeleteTrackTarget(null)} className="absolute inset-0 bg-black/60 backdrop-blur-2xl" />
                        <motion.div initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-2xl border border-gray-100">
                            <div className="w-14 h-14 bg-red-50 border border-red-100 rounded-2xl flex items-center justify-center mb-5">
                                <Trash2 className="w-6 h-6 text-red-500" />
                            </div>
                            <h3 className="text-lg font-black text-gray-900 uppercase tracking-tighter mb-1">Delete Track?</h3>
                            <p className="text-sm text-gray-500 font-medium mb-1">
                                You are about to delete the track:
                            </p>
                            <p className="text-sm font-black text-gray-900 bg-red-50 border border-red-100 rounded-xl px-4 py-2.5 mb-5">
                                {deleteTrackTarget.name}
                            </p>
                            <p className="text-xs text-gray-400 font-medium mb-6">
                                This will remove the track from the list. Existing intern assignments will not be affected.
                            </p>

                            <div className="flex gap-3">
                                <button onClick={() => setDeleteTrackTarget(null)} className="flex-1 py-3 bg-gray-50 text-gray-600 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-gray-100 transition-all border border-gray-100">
                                    Cancel
                                </button>
                                <button onClick={() => handleDeleteTrack(deleteTrackTarget._id)} className="flex-1 py-3 bg-red-500 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-red-600 transition-all border border-red-500">
                                    Delete
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
