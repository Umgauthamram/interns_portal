"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, Link as LinkIcon, Video, CheckCircle2, AlertCircle, RefreshCw, Mail } from "lucide-react";
import { usePathname } from "next/navigation";
import { FullScreenCalendar } from "@/components/ui/fullscreen-calendar";

export default function InternSchedulePage() {
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState("calendar"); // "calendar" or "list"

    useEffect(() => {
        const fetchSchedules = async () => {
            const email = localStorage.getItem("userEmail");
            if (email) {
                try {
                    const res = await fetch(`/api/schedule?role=intern&email=${email}`);
                    if (res.ok) {
                        const data = await res.json();
                        setSchedules(data);
                    }
                } catch (err) {
                    console.error("Failed to fetch schedule data:", err);
                }
            }
            setLoading(false);
        };
        fetchSchedules();
    }, []);

    return (
        <div className="p-8 max-w-5xl mx-auto space-y-12">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6 border-b border-gray-50 pb-6">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-[8px] font-black uppercase tracking-[0.4em] text-gray-300">
                        <Calendar className="w-3 h-3" /> Event Synchronizer
                    </div>
                    <div className="flex items-center gap-4">
                        <h1 className="text-3xl font-black text-gray-900 tracking-tighter uppercase leading-none">
                            My Schedule
                        </h1>
                        {loading && <RefreshCw className="w-5 h-5 text-gray-400 animate-spin" />}
                    </div>
                </div>
                <div className="flex bg-gray-50 p-1 rounded-xl">
                    <button
                        onClick={() => setViewMode("calendar")}
                        className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${viewMode === 'calendar' ? 'bg-white shadow text-black' : 'text-gray-400 hover:text-gray-900'}`}
                    >
                        Calendar
                    </button>
                    <button
                        onClick={() => setViewMode("list")}
                        className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${viewMode === 'list' ? 'bg-white shadow text-black' : 'text-gray-400 hover:text-gray-900'}`}
                    >
                        Detailed List
                    </button>
                </div>
            </div>

            {viewMode === "list" ? (
                <div className="bg-white rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-200/20 p-8 md:p-12 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none">
                        <Video className="w-64 h-64 -mr-24 -mt-24" />
                    </div>

                    <h3 className="text-xl font-black uppercase tracking-tighter text-gray-900 mb-8 ml-2">Meeting Coordinates</h3>

                    {schedules.length === 0 && !loading && (
                        <div className="bg-gray-50 border border-gray-100 border-dashed rounded-[2.5rem] p-16 flex flex-col items-center justify-center text-center">
                            <Clock className="w-10 h-10 text-gray-300 mb-4" />
                            <p className="text-sm font-black uppercase tracking-widest text-gray-400">No incoming transmissions.</p>
                            <p className="text-[10px] font-bold text-gray-400 mt-2">Connect with a system admin for assignments.</p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                        <AnimatePresence>
                            {schedules.map((schedule, idx) => {
                                const dateObj = new Date(schedule.date);
                                const isPast = dateObj < new Date();

                                return (
                                    <motion.div
                                        key={schedule._id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.1 }}
                                        className={`bg-gray-50 p-6 rounded-[2rem] border transition-all ${isPast ? 'border-gray-100 opacity-60' : 'border-black hover:shadow-2xl hover:-translate-y-1'}`}
                                    >
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-3 rounded-2xl ${isPast ? 'bg-white' : 'bg-black text-white'} shadow-sm flex flex-col items-center justify-center min-w-[60px] border border-gray-100`}>
                                                    <span className="text-[8px] font-black uppercase tracking-widest leading-none mb-1 opacity-80">{dateObj.toLocaleString('default', { month: 'short' })}</span>
                                                    <span className="text-2xl font-black leading-none">{dateObj.getDate()}</span>
                                                </div>
                                                <div>
                                                    <p className="text-[14px] font-black uppercase tracking-tight text-gray-900">{schedule.time}</p>
                                                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 mt-0.5 flex items-center gap-1"><Mail className="w-3 h-3" /> {schedule.adminEmail}</p>
                                                </div>
                                            </div>
                                            {isPast && <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                                        </div>

                                        <div className="space-y-4">
                                            <p className="text-[12px] font-bold text-gray-500 leading-relaxed bg-white p-4 rounded-xl border border-gray-100">
                                                {schedule.description}
                                            </p>

                                            <a
                                                href={schedule.meetingLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={`w-full py-4 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all flex items-center justify-center gap-2 ${isPast ? 'bg-gray-200 text-gray-500 hover:bg-gray-300' : 'bg-blue-600 text-white shadow-xl hover:bg-blue-700 hover:scale-[1.02] active:scale-95'}`}
                                            >
                                                <LinkIcon className="w-4 h-4" /> Comm Link
                                            </a>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </AnimatePresence>
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
                                name: `Admin`,
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
