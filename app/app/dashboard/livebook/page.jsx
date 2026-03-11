
"use client";

import { useState, useEffect } from "react";
import {
    BookOpen,
    Play,
    ArrowRight,
    ChevronLeft,
    Clock,
    User,
    Sparkles,
    Search,
    ChevronDown,
    MoreHorizontal,
    LayoutGrid,
    Layers,
    FileText,
    Brain,
    Monitor,
    Database,
    Cpu,
    CheckCircle2,
    Diamond,
    Zap
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Configuration for Semester Structure
const SEMESTERS = [
    { id: 4, name: "Semester 4", status: "Current", active: true, icons: [Brain, Cpu, Database] },
    { id: 3, name: "Semester 3", status: "Completed", icons: [Monitor, Layers, Database] },
    { id: 2, name: "Semester 2", status: "Completed", icons: [Cpu, LayoutGrid, Layers] },
    { id: 1, name: "Semester 1", status: "Completed", icons: [FileText, LayoutGrid, Database] },
];

// Format content helper
const formatBlockContent = (content) => {
    if (!content) return null;
    if (/<[a-z][\s\S]*>/i.test(content)) {
        return <div dangerouslySetInnerHTML={{ __html: content }} className="prose max-w-none text-gray-700" />;
    }
    return (
        <div className="space-y-2">
            {content.split('\n').map((line, j) => {
                if (!line.trim()) return <div key={j} className="h-2" />;
                if (line.includes(':') && line.split(':')[0].split(' ').length <= 4) {
                    const parts = line.split(':');
                    const key = parts[0];
                    const rest = parts.slice(1).join(':');
                    if (rest.trim()) {
                        return (
                            <p key={j} className="text-[15px] text-gray-700 leading-relaxed">
                                <strong className="text-black font-bold">{key}:</strong>{rest}
                            </p>
                        );
                    } else {
                        return <h4 key={j} className="text-[16px] font-black text-gray-900 mt-4 tracking-tight uppercase">{line}</h4>;
                    }
                }
                if (line.trim().match(/^[-*•]\s+/)) {
                    return <li key={j} className="ml-6 text-[15px] text-gray-700 leading-relaxed list-disc">{line.replace(/^[-*•]\s+/, '')}</li>;
                }
                if (line.trim().match(/^\d+\.\s+/)) {
                    return <li key={j} className="ml-6 text-[15px] text-gray-700 leading-relaxed list-decimal">{line.replace(/^\d+\.\s+/, '')}</li>;
                }
                // Short lines without punctuation might be headers
                if (line.length > 2 && line.length < 40 && !line.includes('.') && !line.includes(',')) {
                    return <h4 key={j} className="text-[16px] font-black text-gray-900 mt-4 tracking-tight uppercase">{line}</h4>;
                }
                return <p key={j} className="text-[15px] text-gray-700 leading-relaxed">{line}</p>;
            })}
        </div>
    );
};

export default function LiveBookDashboard() {
    const [view, setView] = useState("library"); // library, overview, lesson
    const [selectedSemester, setSelectedSemester] = useState(4);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [selectedLesson, setSelectedLesson] = useState(null);
    const [expandedModule, setExpandedModule] = useState(null);

    const [courses, setCourses] = useState([]);
    const [topics, setTopics] = useState([]);
    const [userTrack, setUserTrack] = useState("");

    useEffect(() => {
        const fetchContent = async () => {
            const email = localStorage.getItem("userEmail");
            let uTrack = "";
            try {
                if (email) {
                    const userRes = await fetch(`/api/user/me?email=${email}`);
                    if (userRes.ok) {
                        const userData = await userRes.json();
                        uTrack = userData.track || "";
                        setUserTrack(uTrack);
                    }
                }
            } catch (e) {
                console.error(e);
            }

            try {
                const [cRes, tRes] = await Promise.all([
                    fetch('/api/admin/content/courses'),
                    fetch('/api/admin/content/topics')
                ]);
                if (cRes.ok) {
                    const allCourses = await cRes.json();

                    const filteredCourses = allCourses.filter(c => {
                        if (!c.tracks || c.tracks.length === 0) return true;

                        return c.tracks.some(adminConfiguredTrack => {
                            const adminT = adminConfiguredTrack || "";
                            const tr = uTrack || "";

                            // High flexibility error-tolerant regex matching
                            if (tr.includes("Blockchain") && adminT.includes("Blockchain")) return true;
                            if (tr.includes("Gen") && adminT.includes("Gen")) return true;
                            if (tr.includes("App Development") && adminT.includes("App Development")) return true;

                            return adminT.toLowerCase() === tr.toLowerCase();
                        });
                    });

                    setCourses(filteredCourses);
                }
                if (tRes.ok) setTopics((await tRes.json()).filter(t => t.status === "Published"));
            } catch (err) {
                console.error("Fetch content error:", err);
            }
        };
        fetchContent();
    }, []);

    return (
        <div className="relative min-h-screen">
            <div className="max-w-[1600px] mx-auto px-10 py-8">
                <AnimatePresence mode="wait">
                    {view === "library" && (
                        <motion.div
                            key="library"
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            className="space-y-12"
                        >
                            {/* Main Grid: Courses */}
                            <div className="space-y-12">
                                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                                    <h1 className="text-4xl font-black text-gray-900 tracking-tighter">Livebooks</h1>
                                    <div className="relative group w-full md:w-80">
                                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 group-focus-within:text-black transition-colors" />
                                        <input className="w-full pl-14 pr-6 py-4 bg-white border border-gray-100 rounded-2xl text-[10px] font-black uppercase tracking-widest outline-none shadow-sm focus:ring-8 focus:ring-black/5 transition-all" placeholder="Ctrl K to search" />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10">
                                    {courses.map((course) => (
                                        <motion.div
                                            key={course.id}
                                            onClick={() => {
                                                setSelectedCourse(course);
                                                setView("overview");
                                            }}
                                            className="bg-gradient-to-br from-[#fffbeb] to-white rounded-[1.5rem] p-6 border border-amber-100/50 shadow-sm hover:shadow-2xl hover:shadow-amber-500/10 hover:translate-y-[-5px] transition-all cursor-pointer group flex flex-col justify-between min-h-[340px] relative overflow-hidden"
                                        >
                                            <div className="space-y-6 relative z-10">
                                                <div className="p-4 rounded-xl w-fit group-hover:bg-amber-500 transition-all border border-amber-50 shadow-sm">
                                                    <Brain className="w-8 h-8 text-amber-500 group-hover:text-white transition-colors" />
                                                </div>
                                                <div className="space-y-3">
                                                    <h3 className="text-xl font-black text-gray-900 leading-[1.1] uppercase tracking-tighter group-hover:text-amber-600 transition-colors">{course.title}</h3>
                                                    <p className="text-[12px] text-gray-400 font-medium leading-relaxed line-clamp-3 opacity-90">{course.desc}</p>
                                                </div>
                                            </div>

                                            <div className="pt-8 border-t border-amber-50/50 flex items-center justify-between relative z-10">
                                                <div className="flex items-center gap-5">
                                                    <div className="flex items-center gap-2" title="Modules">
                                                        <Layers className="w-3.5 h-3.5 text-amber-400" />
                                                        <span className="text-[12px] font-black text-gray-900 tracking-tight">{course.modules?.length || 0}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2" title="Topics">
                                                        <BookOpen className="w-3.5 h-3.5 text-amber-400" />
                                                        <span className="text-[12px] font-black text-gray-900 tracking-tight">{topics.filter(t => t.course === course.title).length}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2" title="Units">
                                                        <Zap className="w-3.5 h-3.5 text-amber-400" />
                                                        <span className="text-[12px] font-black text-gray-900 tracking-tight">
                                                            {topics.filter(t => t.course === course.title).reduce((acc, b) => acc + (b.blocks?.length || 0), 0)}
                                                        </span>
                                                    </div>
                                                </div>

                                                <button className="p-2.5 bg-white border border-amber-100 rounded-xl text-amber-500 hover:bg-amber-500 hover:text-white transition-all shadow-sm">
                                                    <ArrowRight className="w-4 h-4" />
                                                </button>
                                            </div>

                                            <div className="absolute top-0 right-0 p-8 opacity-[0.02] group-hover:opacity-[0.06] transition-opacity pointer-events-none transform -rotate-12 translate-x-4 -translate-y-4">
                                                <Brain className="w-40 h-40" />
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {view === "overview" && (
                        <motion.div
                            key="overview"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            className="flex-1 flex flex-col"
                        >
                            {/* Course Header: Fixed/Sticky */}
                            <div className="px-8 py-3 sticky top-0 z-20 bg-white/80 backdrop-blur-xl border-b border-gray-50">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-6">
                                        <button onClick={() => setView("library")} className="p-2 hover:bg-gray-50 rounded-xl transition-colors text-gray-400 hover:text-black">
                                            <ChevronLeft className="w-6 h-6" />
                                        </button>
                                        <div className="h-10 w-px bg-gray-100 mx-2" />
                                        <div className="flex items-center gap-5">
                                            <div className="p-2.5 bg-gradient-to-br from-amber-50 to-white rounded-xl shadow-sm border border-amber-100">
                                                <Brain className="w-6 h-6 text-amber-500" />
                                            </div>
                                            <div className="space-y-1">
                                                <h1 className="text-xl font-black text-gray-900 tracking-tighter uppercase leading-none">{selectedCourse?.title}</h1>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex-1 p-8 lg:p-12 flex flex-col items-center custom-scrollbar overflow-y-auto">
                                {/* Timeline */}
                                <div className="w-full max-w-4xl space-y-0 relative">
                                    {/* Central Line Removed */}

                                    {selectedCourse?.modules?.map((mod, idx) => (
                                        <div key={mod.id} className="mb-12 bg-white/60 backdrop-blur-3xl border border-white/80 shadow-2xl shadow-gray-200/40 rounded-[2.5rem] p-8 lg:p-10 relative overflow-hidden group/module transition-all duration-500 hover:bg-white/90 w-full flex flex-col">
                                            {/* Decorative Background for Module */}
                                            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-gray-100/80 via-purple-50/40 to-transparent blur-[60px] rounded-full opacity-60 -translate-y-10 translate-x-10 pointer-events-none transition-opacity duration-500 group-hover/module:opacity-100" />

                                            {/* Module Header */}
                                            <div className="flex gap-6 md:gap-8 items-start relative z-10 w-full">
                                                <div className="w-16 h-16 md:w-20 md:h-20 bg-white border border-gray-100 rounded-[1.2rem] md:rounded-[1.5rem] flex flex-col items-center justify-center shadow-lg shadow-gray-200/30 flex-shrink-0 group-hover/module:border-gray-100 transition-colors duration-500">
                                                    <span className="text-[6px] md:text-[7px] font-black uppercase tracking-[0.2em] text-gray-400 mb-0.5">Module</span>
                                                    <span className="text-2xl md:text-3xl font-black text-gray-900 leading-none">{idx + 1}</span>
                                                </div>
                                                <div className="flex-1 space-y-2 md:space-y-3 pt-1 md:pt-2 w-full">
                                                    <div
                                                        onClick={() => setExpandedModule(expandedModule === mod.id ? null : mod.id)}
                                                        className="flex items-center justify-between cursor-pointer group/header w-full"
                                                    >
                                                        <h3 className="text-lg md:text-xl font-black text-gray-900 uppercase tracking-tight group-hover/header:text-black transition-colors duration-300">{mod.title}</h3>
                                                        <div className={`p-2 rounded-full transition-all duration-300 shadow-sm ${expandedModule === mod.id ? 'bg-gray-100 text-black shadow-gray-200/50' : 'bg-white border border-gray-100 text-gray-400 group-hover/header:bg-gray-50'}`}>
                                                            <ChevronDown className={`w-5 h-5 transition-transform duration-500 ${expandedModule === mod.id ? 'rotate-180' : ''}`} />
                                                        </div>
                                                    </div>
                                                    <p className="text-[11px] md:text-[12px] text-gray-500 leading-relaxed font-medium opacity-90 max-w-2xl">{mod.desc}</p>
                                                </div>
                                            </div>

                                            {/* Lessons */}
                                            <AnimatePresence>
                                                {expandedModule === mod.id && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: "auto", opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        className="space-y-4 md:space-y-6 mt-8 md:mt-12 ml-4 md:ml-10 relative flex-1"
                                                    >
                                                        {/* Line connecting lessons */}
                                                        <div className="absolute left-[23px] top-6 bottom-6 w-px bg-gradient-to-b from-gray-200 via-gray-200 to-transparent z-0 hidden md:block" />

                                                        {topics.filter(t => t.course === selectedCourse.title && t.module === mod.title).map((lesson, lIdx) => (
                                                            <div
                                                                key={lesson._id}
                                                                onClick={() => {
                                                                    setSelectedLesson(lesson);
                                                                    setView("lesson");
                                                                }}
                                                                className="flex gap-6 md:gap-8 items-start group cursor-pointer relative p-4 md:p-6 bg-transparent hover:bg-white border border-transparent hover:border-gray-100 rounded-3xl transition-all duration-300 hover:shadow-xl hover:shadow-gray-200/50 hover:-translate-y-1 w-full"
                                                            >
                                                                {/* Lesson Bubble */}
                                                                <div className="w-10 h-10 md:w-12 md:h-12 bg-gray-900 group-hover:bg-black text-white rounded-[1rem] flex items-center justify-center text-[12px] md:text-[14px] font-black transition-all duration-500 shadow-lg shadow-black/10 group-hover:shadow-black/30 group-hover:scale-110 z-10 shrink-0 ring-4 ring-white">
                                                                    {idx + 1}.{lIdx + 1}
                                                                </div>

                                                                <div className="flex-1 space-y-1.5 md:space-y-2 pt-0.5 md:pt-1">
                                                                    <div className="flex items-center gap-3">
                                                                        <h4 className="text-sm md:text-base font-black text-gray-800 uppercase tracking-tight group-hover:text-black transition-colors duration-300">{lesson.title}</h4>
                                                                        <div className="w-1.5 h-1.5 rounded-full bg-black opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                                                    </div>
                                                                    <p className="text-[10px] md:text-[12px] text-gray-500 font-medium group-hover:text-gray-600 transition-colors duration-300 leading-relaxed line-clamp-2 pr-4 md:pr-12">
                                                                        {lesson.blocks?.find(b => b.type === 'text')?.content || 'Dive into this chapter to uncover key concepts and specialized intel.'}
                                                                    </p>
                                                                </div>

                                                                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 -translate-x-4 group-hover:translate-x-0 absolute right-6 top-1/2 -translate-y-1/2 shadow-inner shadow-gray-200/50">
                                                                    <ArrowRight className="w-4 h-4 text-black" />
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </motion.div>
                                                )}
                                            </AnimatePresence>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {view === "lesson" && (
                        <motion.div
                            key="lesson"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, y: 50 }}
                            className="space-y-2 pb-20"
                        >
                            <div className="flex items-center justify-between px-4">
                                <button onClick={() => setView("overview")} className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 hover:text-black transition-all">
                                    <ChevronLeft className="w-5 h-5" /> Back
                                </button>
                                <div className="flex items-center gap-6">


                                </div>
                            </div>

                            <div className="max-w-4xl mx-auto mt-6 bg-white border border-gray-100 shadow-2xl shadow-gray-200/40 rounded-[3rem] space-y-10 p-8 md:p-10 lg:p-16 relative overflow-hidden text-left mb-20">
                                {/* Decorative elements */}
                                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-gray-100/60 via-purple-50/30 to-transparent rounded-full blur-[100px] opacity-80 -translate-y-20 pointer-events-none" />

                                <div className="space-y-6 text-left relative z-10">
                                    <div className="w-12 h-12 bg-black text-white rounded-2xl flex items-center justify-center text-[12px] font-black shadow-lg shadow-black/30 ring-4 ring-gray-100"><BookOpen className="w-5 h-5" /></div>
                                    <h1 className="text-[32px] md:text-[40px] font-black text-gray-900 uppercase tracking-tighter leading-[1.1]">{selectedLesson?.title || "Lesson"}</h1>
                                </div>
                                <div className="h-px bg-gradient-to-r from-gray-200 via-gray-100 to-transparent w-full relative z-10" />

                                <div className="space-y-10 relative z-10">
                                    {selectedLesson?.blocks?.map((block, i) => (
                                        <div key={i} className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                                            {block.type === 'text' ? (
                                                <div className="h-full flex flex-col justify-center">
                                                    {formatBlockContent(block.content)}
                                                </div>
                                            ) : block.type === 'image' && block.content ? (
                                                <div className="w-full rounded-[1.5rem] overflow-hidden bg-gray-50 shadow-sm border border-gray-100">
                                                    <img src={block.content} alt="Content" className="w-full h-auto object-cover shadow-2xl" />
                                                </div>
                                            ) : block.type === 'youtube' && block.content ? (
                                                <div className="aspect-video w-full rounded-[1.5rem] overflow-hidden bg-black shadow-xl">
                                                    {block.content.includes('youtu') ? (
                                                        <iframe className="w-full h-full" src={`https://www.youtube.com/embed/${block.content.match(/^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/)?.[2]}`} frameBorder="0" allowFullScreen />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center"><Play className="w-10 h-10 text-gray-500" /></div>
                                                    )}
                                                </div>
                                            ) : null}
                                        </div>
                                    ))}
                                </div>
                                {/* Launch Assignment Protocol removed */}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar { width: 8px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #f3f4f6; border-radius: 20px; border: 4px solid white; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #e5e7eb; }
            `}</style>
        </div >
    );
}

