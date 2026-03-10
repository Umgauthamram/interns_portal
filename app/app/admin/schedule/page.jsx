"use client";

import { useState, useEffect } from "react";
import { Calendar, Clock, Link as LinkIcon, Edit3, Send, Search, RefreshCw, LayoutGrid, CalendarCheck, Plus, X, CheckCircle2, AlertCircle, Minus, ExternalLink, ChevronRight } from "lucide-react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FullScreenCalendar } from "@/components/ui/fullscreen-calendar";

export default function AdminSchedulePage() {
    const router = useRouter();
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");
    const [meetingLink, setMeetingLink] = useState("");
    const [description, setDescription] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [schedules, setSchedules] = useState([]);
    const [viewMode, setViewMode] = useState("dispatch"); // 'dispatch' | 'calendar' | 'weekly'

    // Weekly Review state
    const [reviews, setReviews] = useState([]);
    const [reviewsLoading, setReviewsLoading] = useState(false);
    const [showScheduleModal, setShowScheduleModal] = useState(false);
    const [scheduling, setScheduling] = useState(false);
    const [wrInternId, setWrInternId] = useState('');
    const [wrSearch, setWrSearch] = useState('');
    const [wrMeetLink, setWrMeetLink] = useState('https://meet.google.com/vcd-gfct-jqa');
    const [filterInternId, setFilterInternId] = useState(''); // '' = all

    // Postpone Modal State
    const [postponeEvent, setPostponeEvent] = useState(null);
    const [postponeDate, setPostponeDate] = useState("");
    const [postponeTime, setPostponeTime] = useState("");
    const [postponing, setPostponing] = useState(false);

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

    const fetchReviews = async () => {
        setReviewsLoading(true);
        try {
            const res = await fetch('/api/admin/weekly-review');
            if (res.ok) setReviews(await res.json());
        } catch { /* silent */ }
        finally { setReviewsLoading(false); }
    };

    // Fetch reviews on tab-switch AND on first load (for calendar)
    useEffect(() => {
        fetchReviews();
    }, []);  // initial load
    useEffect(() => {
        if (viewMode === 'weekly') fetchReviews();
    }, [viewMode]);

    const handleAutoSchedule = async () => {
        if (!wrInternId) { toast.error('Please select an intern.'); return; }
        setScheduling(true);
        try {
            const res = await fetch('/api/admin/weekly-review', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ internId: wrInternId, meetLink: wrMeetLink }),
            });
            const data = await res.json();
            if (res.ok || res.status === 201) {
                toast.success(data.message || 'Reviews scheduled!');
                setShowScheduleModal(false);
                setWrInternId('');
                fetchReviews();
            } else { toast.error(data.message || 'Failed to schedule.'); }
        } catch { toast.error('Error scheduling reviews.'); }
        finally { setScheduling(false); }
    };

    const STATUS_STYLE = {
        Scheduled: 'bg-blue-50 text-blue-600 border-blue-100',
        Completed: 'bg-emerald-50 text-emerald-600 border-emerald-100',
        Cancelled: 'bg-red-50 text-red-500 border-red-100',
    };
    const RATING_STYLE = {
        Excellent: 'bg-emerald-50 text-emerald-700',
        'On Track': 'bg-blue-50 text-blue-700',
        'Needs Attention': 'bg-amber-50 text-amber-700',
        Behind: 'bg-red-50 text-red-600',
    };

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
                body: JSON.stringify({ userId: selectedUser, adminEmail, date, time, meetingLink, description }),
            });

            if (res.ok) {
                toast.success("Schedule Synchronized with User's Portal.");
                const newSchedule = await res.json();
                const matchedUser = users.find(u => u._id === selectedUser);
                setSchedules(prev => [...prev, {
                    ...newSchedule.schedule,
                    userId: { _id: selectedUser, fullName: matchedUser?.fullName, email: matchedUser?.email, track: matchedUser?.track }
                }].sort((a, b) => new Date(a.date) - new Date(b.date)));
                setSelectedUser(""); setDate(""); setTime(""); setMeetingLink(""); setDescription("");
            } else {
                toast.error("Schedule Dispatch Failed.");
            }
        } catch (error) {
            toast.error("System Error during transmission.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEventAction = async (action, eventData) => {
        if (action === 'postpone_request') {
            setPostponeEvent(eventData);
            setPostponeDate(eventData.datetime.split('T')[0]);
            setPostponeTime(eventData.time);
            return;
        }
        if (action === 'attended' || action === 'missed') {
            try {
                const res = await fetch('/api/admin/meetings/action', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ reviewId: eventData.id, action })
                });
                const data = await res.json();
                if (res.ok) {
                    toast.success(data.message);
                    fetchReviews();
                    if (action === 'attended' && eventData.internId) {
                        router.push(`/admin/users/${eventData.internId}`);
                    }
                } else {
                    toast.error(data.message || 'Action failed');
                }
            } catch (err) {
                toast.error('Server error during action.');
            }
        }
    };

    const handlePostponeSubmit = async () => {
        if (!postponeEvent || !postponeDate || !postponeTime) return;
        setPostponing(true);
        try {
            const res = await fetch('/api/admin/weekly-review', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: postponeEvent.id,
                    scheduledDate: postponeDate,
                    scheduledTime: postponeTime
                })
            });
            const data = await res.json();
            if (res.ok) {
                toast.success('Meeting postponed successfully!');
                setPostponeEvent(null);
                fetchReviews();
            } else {
                toast.error(data.message || 'Failed to postpone.');
            }
        } catch {
            toast.error('Error postponing meeting.');
        } finally {
            setPostponing(false);
        }
    };

    const filteredUsers = users.filter(u =>
        u.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Merge regular schedules + weekly reviews into calendar data
    const calendarData = Object.values(
        [
            // Regular one-off meetings
            ...schedules.map(s => ({
                _id: s._id,
                dateStr: new Date(s.date).toISOString().split('T')[0],
                dateObj: new Date(s.date),
                event: {
                    id: s._id,
                    name: s.userId?.fullName || 'Intern',
                    description: s.description || 'Meeting',
                    time: s.time,
                    datetime: `${new Date(s.date).toISOString().split('T')[0]}T${s.time}`,
                    meetingLink: s.meetingLink,
                    tag: 'meeting',
                },
            })),
            // Weekly review sessions
            ...reviews.map(r => {
                const dateObj = new Date(r.scheduledDate);
                const dateStr = dateObj.toISOString().split('T')[0];
                return {
                    _id: r._id,
                    dateStr,
                    dateObj,
                    event: {
                        id: r._id,
                        name: r.internName || 'Intern',
                        description: `Weekly Review — ${r.weekLabel}`,
                        time: r.scheduledTime,
                        datetime: `${dateStr}T${r.scheduledTime}`,
                        meetingLink: r.meetLink,
                        status: r.status,
                        internEmail: r.internEmail,
                        internId: r.internId,
                        tag: 'review',
                    },
                };
            }),
        ].reduce((acc, item) => {
            if (!acc[item.dateStr]) acc[item.dateStr] = { day: item.dateObj, events: [] };
            acc[item.dateStr].events.push(item.event);
            return acc;
        }, {})
    );


    return (
        // -m-8 escapes the admin layout's p-8 wrapper
        <div className="-m-8 flex" style={{ height: '100vh' }}>

            {/* ── LEFT: Title + Tabs ── */}
            <div className="w-52 shrink-0 flex flex-col gap-5 px-5 py-8 border-r border-gray-100">

                {/* Title */}
                <div className="space-y-1.5">

                    <h1 className="text-lg font-black text-gray-900 tracking-tight uppercase leading-tight">
                        Schedule<br />Management
                    </h1>
                </div>

                {/* Tabs — stacked below title */}
                <div className="flex flex-col gap-1">
                    <button
                        onClick={() => setViewMode("dispatch")}
                        className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all text-left ${viewMode === 'dispatch'
                            ? 'bg-black text-white shadow-md'
                            : 'text-gray-400 hover:bg-gray-100 hover:text-gray-800'
                            }`}
                    >
                        <Edit3 className="w-3.5 h-3.5 shrink-0" />
                        Schedule Form
                    </button>
                    <button
                        onClick={() => setViewMode("calendar")}
                        className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all text-left ${viewMode === 'calendar'
                            ? 'bg-black text-white shadow-md'
                            : 'text-gray-400 hover:bg-gray-100 hover:text-gray-800'
                            }`}
                    >
                        <LayoutGrid className="w-3.5 h-3.5 shrink-0" />
                        Calendar Map
                    </button>
                    <button
                        onClick={() => setViewMode("weekly")}
                        className={`flex items-center gap-2.5 px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all text-left ${viewMode === 'weekly'
                            ? 'bg-black text-white shadow-md'
                            : 'text-gray-400 hover:bg-gray-100 hover:text-gray-800'
                            }`}
                    >
                        <CalendarCheck className="w-3.5 h-3.5 shrink-0" />
                        Weekly Review
                    </button>
                </div>


            </div>

            {/* ── RIGHT: Form / Calendar / Weekly Review ── */}
            <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
                <AnimatePresence mode="wait">
                    {viewMode === "dispatch" ? (
                        <motion.div
                            key="form"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.15 }}
                            className="flex-1 overflow-auto p-8"
                        >
                            <div className="w-full max-w-2xl mx-auto">
                                <form onSubmit={handleSchedule} className="bg-white rounded-[2.5rem] border border-gray-100 shadow-xl p-8 space-y-8 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-6 opacity-[0.03] pointer-events-none">
                                        <Clock className="w-32 h-32 -mr-12 -mt-12" />
                                    </div>

                                    <div className="space-y-1 border-b border-gray-100 pb-4">
                                        <h3 className="text-xl font-black uppercase tracking-tight text-gray-900">Schedule Meeting</h3>
                                        <p className="text-[10px] uppercase font-black tracking-widest text-gray-400">Add a new meeting schedule to an intern's calendar.</p>
                                    </div>

                                    <div className="space-y-6 relative z-10">
                                        {/* Intern selector */}
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-2">Select Intern</label>
                                            <div className="p-4 bg-gray-50 border border-gray-100 rounded-2xl max-h-56 overflow-y-auto">
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
                                                    {filteredUsers.length === 0 && <p className="text-[10px] text-gray-400 font-bold p-2">No active interns found.</p>}
                                                    {filteredUsers.map(user => (
                                                        <div
                                                            key={user._id}
                                                            onClick={() => setSelectedUser(user._id)}
                                                            className={`p-3 rounded-xl border-2 transition-all cursor-pointer flex items-center gap-3 ${selectedUser === user._id ? 'border-black bg-white shadow-md' : 'border-transparent hover:bg-white hover:shadow-sm'}`}
                                                        >
                                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm ${selectedUser === user._id ? 'bg-black text-white' : 'bg-gray-200 text-gray-500'}`}>
                                                                {user.fullName?.charAt(0) || "U"}
                                                            </div>
                                                            <div>
                                                                <p className="text-[11px] font-black uppercase text-gray-900">{user.fullName}</p>
                                                                <p className="text-[8px] font-black tracking-widest uppercase text-gray-400">{user.track || 'Unassigned'}</p>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Date + Time */}
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-2">Date</label>
                                                <div className="relative">
                                                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                                                    <input type="date" value={date} onChange={e => setDate(e.target.value)} required
                                                        className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-12 pr-4 py-3 text-sm font-bold focus:ring-4 focus:ring-black/5 outline-none" />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-2">Time</label>
                                                <div className="relative">
                                                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                                                    <input type="time" value={time} onChange={e => setTime(e.target.value)} required
                                                        className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-12 pr-4 py-3 text-sm font-bold focus:ring-4 focus:ring-black/5 outline-none" />
                                                </div>
                                            </div>
                                        </div>

                                        {/* Meeting Link */}
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-2">Meeting Link (Zoom / Meet)</label>
                                            <div className="relative">
                                                <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                                                <input type="url" placeholder="https://zoom.us/j/..." value={meetingLink} onChange={e => setMeetingLink(e.target.value)} required
                                                    className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-12 pr-4 py-3 text-[11px] font-bold focus:ring-4 focus:ring-black/5 outline-none" />
                                            </div>
                                        </div>

                                        {/* Description */}
                                        <div className="space-y-2">
                                            <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 ml-2">Description / Purpose</label>
                                            <div className="relative">
                                                <Edit3 className="absolute left-4 top-4 w-4 h-4 text-gray-300" />
                                                <textarea rows="3" placeholder="Discuss assignment structure and API layers..." value={description}
                                                    onChange={e => setDescription(e.target.value)} required
                                                    className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-12 pr-4 py-4 text-[11px] font-bold focus:ring-4 focus:ring-black/5 outline-none resize-none" />
                                            </div>
                                        </div>
                                    </div>

                                    <button type="submit" disabled={isSubmitting}
                                        className={`w-full py-4 bg-black text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl flex items-center justify-center gap-2 group transition-all ${isSubmitting ? 'opacity-70' : 'hover:scale-[1.02] active:scale-95'}`}>
                                        {isSubmitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform" />}
                                        Schedule Meeting
                                    </button>
                                </form>
                            </div>
                        </motion.div>
                    ) : viewMode === 'calendar' ? (
                        <motion.div
                            key="calendar"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.15 }}
                            className="flex flex-col flex-1 overflow-auto"
                        >
                            <FullScreenCalendar data={calendarData} onEventAction={handleEventAction} />
                        </motion.div>
                    ) : (
                        /* ── WEEKLY REVIEW PANEL ── */
                        <motion.div
                            key="weekly"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.15 }}
                            className="flex-1 overflow-auto p-8"
                        >
                            {/* Header */}
                            <div className="flex items-center justify-between mb-6">
                                <div>
                                    <h2 className="text-2xl font-black uppercase tracking-tighter text-gray-900">Weekly Review</h2>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-0.5">Automated intern progress check-ins</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <button onClick={fetchReviews} className="p-2.5 bg-gray-50 border border-gray-100 rounded-xl hover:bg-gray-100 transition-all">
                                        <RefreshCw className={`w-4 h-4 text-gray-500 ${reviewsLoading ? 'animate-spin' : ''}`} />
                                    </button>
                                    <button
                                        onClick={() => setShowScheduleModal(true)}
                                        className="flex items-center gap-2 px-5 py-3 bg-black text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-lg"
                                    >
                                        <Plus className="w-3.5 h-3.5" /> Auto-Schedule Week
                                    </button>
                                </div>
                            </div>

                            {/* Review Table */}
                            {reviewsLoading ? (
                                <div className="flex items-center justify-center py-20">
                                    <RefreshCw className="w-6 h-6 animate-spin text-gray-300" />
                                </div>
                            ) : reviews.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-20 text-center">
                                    <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mb-4 border border-gray-100">
                                        <CalendarCheck className="w-8 h-8 text-gray-200" />
                                    </div>
                                    <p className="text-sm font-black text-gray-400 uppercase tracking-widest">No reviews scheduled yet</p>
                                    <p className="text-xs text-gray-300 mt-1 font-medium">Click "Auto-Schedule Week" to get started</p>
                                </div>
                            ) : (
                                <div className="bg-white rounded-[2rem] border border-gray-100 shadow-xl overflow-hidden">
                                    {/* Table header */}
                                    <div className="grid grid-cols-[2fr_1.2fr_1fr_1fr_1fr_auto] gap-4 px-6 py-3 bg-gray-50 border-b border-gray-100">
                                        {['Intern', 'Week', 'Date / Time', 'Status', 'Rating', ''].map((h, i) => (
                                            <span key={i} className="text-[8px] font-black text-gray-400 uppercase tracking-[0.2em]">{h}</span>
                                        ))}
                                    </div>
                                    {/* Rows */}
                                    <div className="divide-y divide-gray-50">
                                        {reviews.map(r => (
                                            <div key={r._id} className="grid grid-cols-[2fr_1.2fr_1fr_1fr_1fr_auto] gap-4 px-6 py-4 items-center hover:bg-gray-50/50 transition-colors">
                                                {/* Intern */}
                                                <div className="flex items-center gap-3 min-w-0">
                                                    <div className="w-8 h-8 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center font-black text-xs text-gray-600 shrink-0">
                                                        {r.internName?.charAt(0) || '?'}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-[11px] font-black text-gray-900 truncate uppercase">{r.internName}</p>
                                                        <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest truncate">{r.track}</p>
                                                    </div>
                                                </div>
                                                {/* Week */}
                                                <span className="text-[10px] font-bold text-gray-600 truncate">{r.weekLabel}</span>
                                                {/* Date/Time */}
                                                <div>
                                                    <p className="text-[10px] font-bold text-gray-700">{r.scheduledDate ? new Date(r.scheduledDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : '—'}</p>
                                                    <p className="text-[8px] font-black text-gray-400 uppercase tracking-widest">{r.scheduledTime || '—'}</p>
                                                </div>
                                                {/* Status */}
                                                <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border ${STATUS_STYLE[r.status] || 'bg-gray-50 text-gray-500 border-gray-100'}`}>
                                                    {r.status === 'Completed' && <CheckCircle2 className="w-2.5 h-2.5" />}
                                                    {r.status === 'Cancelled' && <X className="w-2.5 h-2.5" />}
                                                    {r.status}
                                                </span>
                                                {/* Rating */}
                                                <span className={`inline-flex px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-widest ${r.progressRating ? RATING_STYLE[r.progressRating] || 'bg-gray-50 text-gray-500' : 'bg-gray-50 text-gray-300'}`}>
                                                    {r.progressRating || 'Not set'}
                                                </span>
                                                {/* Join */}
                                                {r.meetLink ? (
                                                    <a href={r.meetLink} target="_blank" rel="noreferrer"
                                                        className="flex items-center gap-1 px-3 py-2 bg-black text-white rounded-xl text-[8px] font-black uppercase tracking-widest hover:bg-gray-800 transition-all whitespace-nowrap">
                                                        <ExternalLink className="w-3 h-3" /> Join
                                                    </a>
                                                ) : <span />}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* ── Schedule Intern Modal ── */}
            <AnimatePresence>
                {showScheduleModal && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setShowScheduleModal(false)} className="absolute inset-0 bg-black/50 backdrop-blur-md" />
                        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}
                            className="relative bg-white rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl border border-gray-100">
                            <div className="flex items-center justify-between mb-5">
                                <div>
                                    <p className="text-[8px] font-black text-gray-300 uppercase tracking-[0.4em] mb-1">Weekly Reviews</p>
                                    <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter">Schedule Intern</h3>
                                    <p className="text-[10px] text-gray-400 font-medium mt-0.5">Creates 4 weekly meetings automatically</p>
                                </div>
                                <button onClick={() => setShowScheduleModal(false)} className="w-9 h-9 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 hover:text-red-500 transition-all border border-gray-100">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                {/* Intern picker */}
                                <div className="space-y-1.5">
                                    <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest ml-1">Select Intern</label>
                                    <div className="border border-gray-100 rounded-2xl bg-gray-50 overflow-hidden">
                                        <div className="relative p-2">
                                            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                                            <input placeholder="Search intern..." value={wrSearch} onChange={e => setWrSearch(e.target.value)}
                                                className="w-full pl-9 pr-4 py-2 bg-white border border-gray-100 rounded-xl text-[10px] font-bold outline-none focus:ring-2 focus:ring-black/5" />
                                        </div>
                                        <div className="max-h-40 overflow-y-auto divide-y divide-gray-50">
                                            {users.filter(u =>
                                                u.fullName?.toLowerCase().includes(wrSearch.toLowerCase()) ||
                                                u.email?.toLowerCase().includes(wrSearch.toLowerCase())
                                            ).map(u => (
                                                <button key={u._id} onClick={() => { setWrInternId(u._id); setWrSearch(u.fullName); }}
                                                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all ${wrInternId === u._id ? 'bg-black text-white' : 'hover:bg-gray-100'}`}>
                                                    <div className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-xs shrink-0 ${wrInternId === u._id ? 'bg-white/20 text-white' : 'bg-gray-200 text-gray-600'}`}>
                                                        {u.fullName?.charAt(0)}
                                                    </div>
                                                    <div>
                                                        <p className={`text-[10px] font-black uppercase ${wrInternId === u._id ? 'text-white' : 'text-gray-900'}`}>{u.fullName}</p>
                                                        <p className={`text-[8px] font-bold ${wrInternId === u._id ? 'text-white/60' : 'text-gray-400'}`}>{u.track || 'No track'}</p>
                                                    </div>
                                                    {wrInternId === u._id && <CheckCircle2 className="w-4 h-4 ml-auto text-white/80" />}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Meet link */}
                                <div className="space-y-1.5">
                                    <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest ml-1">Meeting Link</label>
                                    <div className="relative">
                                        <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                                        <input type="url" value={wrMeetLink} onChange={e => setWrMeetLink(e.target.value)}
                                            className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-11 pr-4 py-3 text-[11px] font-bold focus:ring-4 focus:ring-black/5 outline-none" />
                                    </div>
                                </div>

                                {/* Info */}
                                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-4 space-y-2">
                                    <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest">What happens next</p>
                                    <ul className="space-y-1.5">
                                        {[
                                            '4 weekly meetings created from today',
                                            'Time slots auto-spaced 20 min apart per intern',
                                            'Confirmation emails sent to intern + admin',
                                            '24h + 1h before reminders sent automatically',
                                        ].map((item, i) => (
                                            <li key={i} className="flex items-start gap-2 text-[10px] text-blue-700 font-medium">
                                                <span className="text-blue-400 font-black mt-0.5">→</span>{item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                <button onClick={handleAutoSchedule} disabled={scheduling || !wrInternId}
                                    className="w-full py-4 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-50 shadow-lg flex items-center justify-center gap-2">
                                    {scheduling ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CalendarCheck className="w-4 h-4" />}
                                    {scheduling ? 'Scheduling...' : 'Schedule 4 Meetings'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
            {/* ── Postpone Modal ── */}
            <AnimatePresence>
                {postponeEvent && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                            onClick={() => setPostponeEvent(null)} className="absolute inset-0 bg-black/50 backdrop-blur-md" />
                        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}
                            className="relative bg-white rounded-[2.5rem] p-8 max-w-[360px] w-full shadow-2xl border border-gray-100">
                            <div className="flex items-center justify-between mb-5">
                                <div>
                                    <p className="text-[8px] font-black text-gray-300 uppercase tracking-[0.4em] mb-1">Reschedule</p>
                                    <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter">Postpone</h3>
                                </div>
                                <button onClick={() => setPostponeEvent(null)} className="w-9 h-9 bg-gray-50 rounded-xl flex items-center justify-center text-gray-400 hover:text-red-500 transition-all border border-gray-100">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest ml-1">New Date</label>
                                    <input type="date" value={postponeDate} onChange={e => setPostponeDate(e.target.value)}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-[11px] font-bold outline-none" />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest ml-1">New Time</label>
                                    <input type="time" value={postponeTime} onChange={e => setPostponeTime(e.target.value)}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-[11px] font-bold outline-none" />
                                </div>
                                <button onClick={handlePostponeSubmit} disabled={postponing}
                                    className="w-full py-4 mt-2 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.01] active:scale-95 transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                                    {postponing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Calendar className="w-4 h-4" />}
                                    {postponing ? 'Saving...' : 'Confirm Postpone'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
