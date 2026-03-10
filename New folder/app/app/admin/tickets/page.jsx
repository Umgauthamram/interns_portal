"use client";

import { useState, useEffect } from "react";
import { Bug, RefreshCw, CheckCircle, AlertCircle, Clock, X, User, Mail, Calendar, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";

export default function AdminTicketsPage() {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedTicket, setSelectedTicket] = useState(null);

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/tickets");
            if (res.ok) {
                const data = await res.json();
                setTickets(data);
            }
        } catch (error) {
            console.error("Failed to fetch tickets", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, newStatus) => {
        const tid = toast.loading("Updating Status...");
        try {
            const res = await fetch("/api/tickets", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, status: newStatus }),
            });

            if (res.ok) {
                toast.success("Status updated!", { id: tid });
                fetchTickets();
            } else {
                toast.error("Update failed", { id: tid });
            }
        } catch (error) {
            toast.error("Error updating status", { id: tid });
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'Resolved': return <CheckCircle className="w-4 h-4 text-emerald-500" />;
            case 'In Progress': return <Clock className="w-4 h-4 text-amber-500" />;
            default: return <AlertCircle className="w-4 h-4 text-red-500" />;
        }
    };

    const getTypeColor = (type) => {
        switch (type) {
            case 'Bug Report': return 'bg-red-50 text-red-700 border-red-100';
            case 'Suggest a Feature (UI)': return 'bg-amber-50 text-amber-700 border-amber-100';
            case 'Change Problem Statement': return 'bg-blue-50 text-blue-700 border-blue-100';
            default: return 'bg-gray-50 text-gray-700 border-gray-100';
        }
    };

    return (
        <div className="space-y-8">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-gray-900 tracking-tight">
                        User Reports & Tickets
                    </h1>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-[0.2em] mt-1">
                        Manage bug reports and feature requests
                    </p>
                </div>
                <button
                    onClick={fetchTickets}
                    className="p-3 bg-white rounded-xl border border-gray-100 hover:bg-gray-50 text-gray-400 hover:text-gray-600 transition-all shadow-sm"
                    title="Refresh"
                >
                    <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </button>
            </header>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
                {[
                    { label: "Open", count: tickets.filter(t => t.status === 'Open').length, color: "bg-red-50 text-red-600" },
                    { label: "In Progress", count: tickets.filter(t => t.status === 'In Progress').length, color: "bg-amber-50 text-amber-600" },
                    { label: "Resolved", count: tickets.filter(t => t.status === 'Resolved').length, color: "bg-emerald-50 text-emerald-600" },
                ].map((stat) => (
                    <div key={stat.label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                        <h3 className="text-2xl font-black text-gray-900">{stat.count}</h3>
                        <p className={`text-[9px] font-black uppercase tracking-widest mt-1 ${stat.color} px-2 py-0.5 rounded-full inline-block`}>{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Tickets List */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                {loading && tickets.length === 0 ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-black"></div>
                    </div>
                ) : tickets.length === 0 ? (
                    <div className="text-center py-20">
                        <Bug className="w-12 h-12 text-gray-200 mx-auto mb-4" />
                        <p className="text-gray-400 font-bold text-sm">No tickets reported yet.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-50">
                        {tickets.map((ticket) => (
                            <div
                                key={ticket._id}
                                onClick={() => setSelectedTicket(ticket)}
                                className="p-5 hover:bg-gray-50/50 transition-colors cursor-pointer group"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 space-y-2">
                                        <div className="flex items-center gap-2">
                                            {getStatusIcon(ticket.status)}
                                            <span className={`px-2.5 py-0.5 text-[8px] font-black uppercase tracking-widest rounded-full border ${getTypeColor(ticket.type)}`}>
                                                {ticket.type}
                                            </span>
                                        </div>
                                        <p className="text-sm font-medium text-gray-900 group-hover:text-black transition-colors">{ticket.description}</p>
                                        <div className="flex items-center gap-4 text-xs text-gray-400">
                                            <div className="flex items-center gap-1.5">
                                                <User className="w-3 h-3" />
                                                <span>{ticket.reportedBy || "Anonymous"}</span>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                <Calendar className="w-3 h-3" />
                                                <span>{new Date(ticket.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                                        <select
                                            className="text-[10px] bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 focus:outline-none focus:ring-8 focus:ring-black/5 font-black text-gray-600 appearance-none cursor-pointer hover:border-gray-200 transition-all uppercase tracking-widest"
                                            value={ticket.status}
                                            onChange={(e) => handleStatusUpdate(ticket._id, e.target.value)}
                                        >
                                            <option value="Open">Open</option>
                                            <option value="In Progress">In Progress</option>
                                            <option value="Resolved">Resolved</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <AnimatePresence>
                {selectedTicket && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setSelectedTicket(null)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-md"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 30 }}
                            className="relative w-full max-w-4xl bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                        >
                            {/* Header Section */}
                            <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-gray-50/50 backdrop-blur-xl">
                                <div className="flex items-center gap-6">
                                    <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center shadow-lg border-2 ${getTypeColor(selectedTicket.type).split(' ')[0]} ${getTypeColor(selectedTicket.type).split(' ')[2]}`}>
                                        <Bug className={`w-8 h-8 ${getTypeColor(selectedTicket.type).split(' ')[1]}`} />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <h2 className="text-2xl font-black text-gray-900 tracking-tighter uppercase">{selectedTicket.type}</h2>
                                            {getStatusIcon(selectedTicket.status)}
                                        </div>
                                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mt-1">Ticket Reference: {selectedTicket._id}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setSelectedTicket(null)}
                                    className="p-4 bg-white border border-gray-100 rounded-2xl text-gray-400 hover:text-black hover:bg-gray-50 transition-all shadow-sm"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            {/* Horizontal Body Sections */}
                            <div className="flex-1 overflow-y-auto custom-scrollbar">
                                <div className="divide-y divide-gray-100">
                                    {/* Section 1: Reporter Info (Horizontal Layout) */}
                                    <div className="p-10 bg-white grid grid-cols-1 md:grid-cols-2 gap-12">
                                        <div className="space-y-4">
                                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] ml-1">Reporter Details</label>
                                            <div className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100/50 flex items-center gap-5">
                                                <div className="w-12 h-12 bg-black rounded-2xl flex items-center justify-center text-white shadow-xl">
                                                    <User className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-gray-900">{selectedTicket.reportedBy || "Anonymous User"}</p>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.1em] mt-0.5">Contributor</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] ml-1">Timestamp</label>
                                            <div className="bg-gray-50 p-6 rounded-[2rem] border border-gray-100/50 flex items-center gap-5">
                                                <div className="w-12 h-12 bg-white border border-gray-100 rounded-2xl flex items-center justify-center text-gray-400 shadow-sm">
                                                    <Calendar className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <p className="text-sm font-black text-gray-900">{new Date(selectedTicket.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.1em] mt-0.5">{new Date(selectedTicket.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Section 2: Full Description (Horizontal Layout - Wide) */}
                                    <div className="p-10 bg-gray-50/30">
                                        <div className="space-y-6">
                                            <div className="flex items-center justify-between">
                                                <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.3em] ml-1">Detailed Description</label>
                                                <div className="px-3 py-1 bg-white rounded-lg border border-gray-100 text-[8px] font-black text-gray-400 uppercase tracking-widest">System Record</div>
                                            </div>
                                            <div className="bg-white p-8 md:p-12 rounded-[3rem] border border-gray-100 shadow-sm relative overflow-hidden group">
                                                <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rounded-full blur-[60px] opacity-50 group-hover:opacity-100 transition-opacity" />
                                                <MessageSquare className="absolute top-8 right-10 w-8 h-8 text-gray-100" />
                                                <p className="text-lg font-medium text-gray-900 leading-relaxed relative z-10">
                                                    "{selectedTicket.description}"
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Section 3: Status Management (Horizontal Action Bar) */}
                                    <div className="p-10 bg-white">
                                        <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-black p-8 rounded-[2.5rem] shadow-2xl shadow-black/20">
                                            <div className="flex items-center gap-5">
                                                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-white ring-px ring-white/20">
                                                    <RefreshCw className={`w-6 h-6 ${loading ? 'animate-spin' : ''}`} />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-black text-white uppercase tracking-widest">Update Operations</p>
                                                    <p className="text-[9px] font-medium text-white/40 uppercase tracking-[0.2em] mt-1">Manage current ticket lifecycle</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 w-full md:w-auto">
                                                {['Open', 'In Progress', 'Resolved'].map((status) => (
                                                    <button
                                                        key={status}
                                                        onClick={() => handleStatusUpdate(selectedTicket._id, status).then(() => setSelectedTicket(prev => ({ ...prev, status })))}
                                                        className={`flex-1 md:flex-initial px-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${selectedTicket.status === status
                                                                ? 'bg-white text-black scale-105 shadow-xl ring-4 ring-white/10'
                                                                : 'bg-white/5 text-white/40 hover:bg-white/10 hover:text-white border border-white/10'
                                                            }`}
                                                    >
                                                        {status}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
