"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Clock, Link as LinkIcon, CheckCircle2, RefreshCw, Mail, LayoutList } from "lucide-react";
import { FullScreenCalendar } from "@/components/ui/fullscreen-calendar";

export default function InternSchedulePage() {
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState("calendar");

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

    const calendarData = Object.values(
        schedules.reduce((acc, schedule) => {
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
        }, {})
    );

    return (
        // -m-8 escapes the layout's p-8 padding so we own the full width
        <div className="-m-8 flex" style={{ height: 'calc(100vh - 64px)' }}>

            {/* ── LEFT: Title + View Tabs (transparent bg) ── */}
            <div className="w-48 shrink-0 flex flex-col gap-5 px-5 py-8 border-r border-gray-100">

                {/* Title */}
                <div className="space-y-1.5">
                    <p className="text-[8px] font-black uppercase tracking-[0.35em] text-gray-300 flex items-center gap-1.5">
                        <Calendar className="w-2.5 h-2.5" /> Schedule
                    </p>
                    <div className="flex items-center gap-2">
                        <h1 className="text-xl font-black text-gray-900 tracking-tight uppercase leading-tight">
                            My Schedule
                        </h1>
                        {loading && <RefreshCw className="w-3 h-3 text-gray-400 animate-spin shrink-0" />}
                    </div>
                </div>

                {/* Tabs — stacked below title */}
                <div className="flex flex-col gap-1">
                    <button
                        onClick={() => setViewMode("calendar")}
                        className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all text-left ${viewMode === 'calendar'
                                ? 'bg-black text-white shadow-md'
                                : 'text-gray-400 hover:bg-gray-100 hover:text-gray-800'
                            }`}
                    >
                        <Calendar className="w-3.5 h-3.5 shrink-0" />
                        Calendar
                    </button>
                    <button
                        onClick={() => setViewMode("list")}
                        className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all text-left ${viewMode === 'list'
                                ? 'bg-black text-white shadow-md'
                                : 'text-gray-400 hover:bg-gray-100 hover:text-gray-800'
                            }`}
                    >
                        <LayoutList className="w-3.5 h-3.5 shrink-0" />
                        Detailed List
                    </button>
                </div>
            </div>

            {/* ── RIGHT: Calendar / List — fills the rest ── */}
            <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
                <AnimatePresence mode="wait">
                    {viewMode === "calendar" ? (
                        <motion.div
                            key="calendar"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.15 }}
                            className="flex flex-col flex-1 overflow-auto"
                        >
                            <FullScreenCalendar data={calendarData} />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="list"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.15 }}
                            className="flex-1 overflow-auto p-8"
                        >
                            {schedules.length === 0 && !loading ? (
                                <div className="bg-gray-50 border border-dashed border-gray-200 rounded-[2.5rem] p-20 flex flex-col items-center justify-center text-center">
                                    <Clock className="w-10 h-10 text-gray-300 mb-4" />
                                    <p className="text-sm font-black uppercase tracking-widest text-gray-400">No meetings scheduled.</p>
                                    <p className="text-[10px] font-bold text-gray-400 mt-2">Your admin will schedule meetings here.</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <AnimatePresence>
                                        {schedules.map((schedule, idx) => {
                                            const dateObj = new Date(schedule.date);
                                            const isPast = dateObj < new Date();
                                            return (
                                                <motion.div
                                                    key={schedule._id}
                                                    initial={{ opacity: 0, y: 16 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: idx * 0.07 }}
                                                    className={`bg-white p-6 rounded-[2rem] border shadow-sm transition-all ${isPast ? 'border-gray-100 opacity-60' : 'border-gray-100 hover:border-black hover:shadow-xl hover:-translate-y-0.5'
                                                        }`}
                                                >
                                                    <div className="flex items-start justify-between mb-4">
                                                        <div className="flex items-center gap-3">
                                                            <div className={`p-3 rounded-2xl ${isPast ? 'bg-gray-50' : 'bg-black text-white'} flex flex-col items-center justify-center min-w-[52px] border border-gray-100`}>
                                                                <span className="text-[7px] font-black uppercase tracking-widest leading-none mb-0.5 opacity-70">
                                                                    {dateObj.toLocaleString('default', { month: 'short' })}
                                                                </span>
                                                                <span className="text-xl font-black leading-none">{dateObj.getDate()}</span>
                                                            </div>
                                                            <div>
                                                                <p className="text-sm font-black uppercase tracking-tight text-gray-900">{schedule.time}</p>
                                                                <p className="text-[9px] font-black uppercase tracking-wider text-gray-400 mt-0.5 flex items-center gap-1">
                                                                    <Mail className="w-3 h-3" /> {schedule.adminEmail}
                                                                </p>
                                                            </div>
                                                        </div>
                                                        {isPast && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
                                                    </div>
                                                    <div className="space-y-3">
                                                        <p className="text-xs font-bold text-gray-500 leading-relaxed bg-gray-50 p-3 rounded-xl border border-gray-100">
                                                            {schedule.description}
                                                        </p>
                                                        <a
                                                            href={schedule.meetingLink}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className={`w-full py-3 text-[10px] font-black uppercase tracking-widest rounded-xl flex items-center justify-center gap-2 transition-all ${isPast ? 'bg-gray-100 text-gray-400 hover:bg-gray-200' : 'bg-black text-white hover:bg-gray-800 active:scale-95'
                                                                }`}
                                                        >
                                                            <LinkIcon className="w-3.5 h-3.5" /> Join Meeting
                                                        </a>
                                                    </div>
                                                </motion.div>
                                            );
                                        })}
                                    </AnimatePresence>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
