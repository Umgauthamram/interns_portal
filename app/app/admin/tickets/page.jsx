"use client";

import { useState, useEffect } from "react";
import { Bug, RefreshCw, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { toast } from "react-hot-toast";

export default function AdminTicketsPage() {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);

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
                            <div key={ticket._id} className="p-5 hover:bg-gray-50/50 transition-colors">
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 space-y-2">
                                        <div className="flex items-center gap-2">
                                            {getStatusIcon(ticket.status)}
                                            <span className={`px-2.5 py-0.5 text-[8px] font-black uppercase tracking-widest rounded-full border ${getTypeColor(ticket.type)}`}>
                                                {ticket.type}
                                            </span>
                                        </div>
                                        <p className="text-sm font-medium text-gray-900">{ticket.description}</p>
                                        <div className="flex items-center gap-4 text-xs text-gray-400">
                                            <span>By: {ticket.reportedBy || "Anonymous"}</span>
                                            <span>{new Date(ticket.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                        </div>
                                    </div>
                                    <select
                                        className="text-xs bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black/10 font-bold text-gray-600"
                                        value={ticket.status}
                                        onChange={(e) => handleStatusUpdate(ticket._id, e.target.value)}
                                    >
                                        <option value="Open">Open</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Resolved">Resolved</option>
                                    </select>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
