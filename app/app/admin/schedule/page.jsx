"use client";

import { useState, useEffect } from "react";
import { Calendar, Clock, Link as LinkIcon, Edit3, Send, AlertCircle, XCircle, Search, RefreshCw, Mail } from "lucide-react";
import { toast } from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import { FullScreenCalendar } from "@/components/ui/fullscreen-calendar";

export default function AdminSchedulePage() {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [meetingLink, setMeetingLink] = useState("");
    const [description, setDescription] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [schedules, setSchedules] = useState([]);
    const [viewMode, setViewMode] = useState("dispatch"); // 'dispatch' or 'calendar'

    // We can fetch valid intern users
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch("/api/admin/users");
                if (res.ok) {
                    const data = await res.json();
                    setUsers(data.filter(u => u.role?.toLowerCase() === 'intern'));
                }
            } catch (err) {
                console.error("Failed to fetch interns:", err);
            }
        };

        const fetchSchedules = async () => {
            const adminEmail = localStorage.getItem("userEmail") || "admin@example.com";
            try {
                const res = await fetch(`/api/schedule?role=admin&email=${adminEmail}`);
                if (res.ok) {
                    const data = await res.json();
                    setSchedules(data);
                }
            } catch (err) {
                console.error("Failed to fetch schedules:", err);
            }
        };

        fetchUsers();
        fetchSchedules();
    }, []);

    const handleSchedule = async (e) => {
        e.preventDefault();
        if (!selectedUser || !date || !time || !meetingLink || !description) {
            toast.error("Please fill all fields to initiate connection.");
            return;
        }

        setIsSubmitting(true);
        const adminEmail = localStorage.getItem("userEmail") || "admin@system.com";

        try {
            const res = await fetch("/api/schedule", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: selectedUser,
                    adminEmail,
                    date,
                    time,
                    meetingLink,
                    description,
                }),
            });

            if (res.ok) {
                toast.success("Schedule Synchronized with User's Portal.");
                const newSchedule = await res.json();

                // Add the populated object back artificially for live update
                const matchedUser = users.find(u => u._id === selectedUser);
                setSchedules(prev => [...prev, {
                    ...newSchedule.schedule,
                    userId: { _id: selectedUser, fullName: matchedUser?.fullName, email: matchedUser?.email, track: matchedUser?.track }
                }].sort((a, b) => new Date(a.date) - new Date(b.date)));

                setSelectedUser("");
                setDate("");
                setTime("");
                setMeetingLink("");
                setDescription("");
            } else {
                toast.error("Schedule Dispatch Failed.");
            }
        } catch (error) {
            console.error(error);
            toast.error("System Error during transmission.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const filteredUsers = users.filter(u => u.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) || u.email?.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <div className="p-8 max-w-6xl mx-auto space-y-12">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-gray-50 pb-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-[0.4em] text-gray-300">
                        <Calendar className="w-3 h-3" /> Schedule Management
                    </div>
                    <h1 className="text-3xl font-black text-gray-900 tracking-tighter uppercase leading-none">
                        Meeting & Schedule Management
                    </h1>
                </div>
                <div className="flex bg-gray-50 p-1 rounded-xl">
                    <button
                        onClick={() => setViewMode("dispatch")}
                        className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${viewMode === 'dispatch' ? 'bg-white shadow text-black' : 'text-gray-400 hover:text-gray-900'}`}
                    >
                        Schedule Form
                    </button>
                    <button
                        onClick={() => setViewMode("calendar")}
                        className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${viewMode === 'calendar' ? 'bg-white shadow text-black' : 'text-gray-400 hover:text-gray-900'}`}
                    >
                        Calendar Map
                    </button>
                </div>
            </div>

            {viewMode === "dispatch" ? (
                <div className="w-full max-w-2xl mx-auto">
                    <div className="space-y-8">
                        <form onSubmit={handleSchedule} className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl shadow-gray-200/20 p-8 space-y-8 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-6 opacity-[0.03] pointer-events-none">
                                <Clock className="w-32 h-32 -mr-12 -mt-12" />
                            </div>

                            <div className="space-y-1 border-b border-gray-100 pb-4">
                                <h3 className="text-xl font-black uppercase tracking-tight text-gray-900">Schedule Meeting</h3>
                                <p className="text-[10px] uppercase font-black tracking-widest text-gray-400">Add a new meeting schedule to an intern's calendar.</p>
                            </div>

                            <div className="space-y-6 relative z-10">
                                <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-2">Select Intern</label>
                                    <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl max-h-60 overflow-y-auto custom-scrollbar">
                                        <div className="relative mb-3 sticky top-0 bg-gray-50 z-10">
                                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                                            <input
                                                placeholder="Search by name or email..."
                                                value={searchTerm}
                                                onChange={e => setSearchTerm(e.target.value)}
                                                className="w-full pl-9 pr-4 py-2 bg-white border border-gray-100 rounded-xl text-[10px] font-bold outline-none focus:ring-4 focus:ring-black/5"
                                            />
                                        </div>
                                        <div className="space-y-1.5">
                                            {filteredUsers.length === 0 && <p className="text-[10px] text-gray-400 font-bold p-2">No active interns found in registry.</p>}
                                            {filteredUsers.map(user => (
                                                <div
                                                    key={user._id}
                                                    onClick={() => setSelectedUser(user._id)}
                                                    className={`p-3 rounded-xl border-2 transition-all cursor-pointer flex items-center gap-3 ${selectedUser === user._id ? 'border-black bg-white shadow-md' : 'border-transparent hover:bg-white hover:shadow-sm'}`}
                                                >
                                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black ${selectedUser === user._id ? 'bg-black text-white' : 'bg-gray-200 text-gray-500'}`}>
                                                        {user.fullName?.charAt(0) || "U"}
                                                    </div>
                                                    <div>
                                                        <p className="text-[11px] font-black uppercase text-gray-900">{user.fullName}</p>
                                                        <p className="text-[8px] font-black tracking-widest uppercase text-gray-400">{user.track || 'Unassigned Node'}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-2">Date</label>
                                        <div className="relative">
                                            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                                            <input
                                                type="date"
                                                value={date}
                                                onChange={(e) => setDate(e.target.value)}
                                                required
                                                className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-12 pr-4 py-3 text-sm font-bold focus:ring-4 focus:ring-black/5 outline-none"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-2">Time</label>
                                        <div className="relative">
                                            <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                                            <input
                                                type="time"
                                                value={time}
                                                onChange={(e) => setTime(e.target.value)}
                                                required
                                                className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-12 pr-4 py-3 text-sm font-bold focus:ring-4 focus:ring-black/5 outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-2">Meeting Link (Zoom / Meet)</label>
                                    <div className="relative">
                                        <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                                        <input
                                            type="url"
                                            placeholder="https://zoom.us/j/..."
                                            value={meetingLink}
                                            onChange={(e) => setMeetingLink(e.target.value)}
                                            required
                                            className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-12 pr-4 py-4 text-[11px] font-bold focus:ring-4 focus:ring-black/5 outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-2">Description / Purpose</label>
                                    <div className="relative">
                                        <Edit3 className="absolute left-4 top-4 w-4 h-4 text-gray-300" />
                                        <textarea
                                            rows="3"
                                            placeholder="Discuss assignment structure and API layers..."
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            required
                                            className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-12 pr-4 py-4 text-[11px] font-bold focus:ring-4 focus:ring-black/5 outline-none resize-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`w-full py-4 bg-black text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 group transition-all ${isSubmitting ? 'opacity-70' : 'hover:scale-[1.02] active:scale-95'}`}
                            >
                                {isSubmitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />}
                                Schedule Meeting
                            </button>
                        </form>
                    </div>
                </div>


            ) : (
                <div className="bg-white border border-gray-100 rounded-[2rem] shadow-xl overflow-hidden">
                    <FullScreenCalendar
                        data={Object.values(schedules.reduce((acc, schedule) => {
                            const dateObj = new Date(schedule.date);
                            const dayKey = dateObj.toISOString().split('T')[0];
                            if (!acc[dayKey]) acc[dayKey] = { day: dateObj, events: [] };

                            acc[dayKey].events.push({
                                id: schedule._id,
                                name: schedule.userId?.fullName || 'Target',
                                description: schedule.description,
                                time: schedule.time,
                                datetime: `${dayKey}T${schedule.time}`,
                                meetingLink: schedule.meetingLink
                            });
                            return acc;
                        }, {}))}
                    />
                </div>
            )}
        </div>
    );
}
