
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

// Removed MOCK_COURSES and MOCK_LEARNING_PATH

export default function LiveBookDashboard() {
    const [view, setView] = useState("library"); // library, overview, lesson
    const [selectedSemester, setSelectedSemester] = useState(4);
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [selectedLesson, setSelectedLesson] = useState(null);
    const [expandedModule, setExpandedModule] = useState(null);

    const [courses, setCourses] = useState([]);
    const [topics, setTopics] = useState([]);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const [cRes, tRes] = await Promise.all([
                    fetch('/api/admin/content/courses'),
                    fetch('/api/admin/content/topics')
                ]);
                if (cRes.ok) setCourses(await cRes.json());
                if (tRes.ok) setTopics((await tRes.json()).filter(t => t.status === "Published"));
            } catch (err) {
                console.error("Fetch content error:", err);
            }
        };
        fetchContent();
    }, []);

    return (
        <div className="relative min-h-screen">
            {/* Subtle Dot Grid Background */}
            <div className="fixed inset-0 pointer-events-none z-[-1] opacity-[0.2]"
                style={{
                    backgroundImage: `radial-gradient(#000 1px, transparent 1px)`,
                    backgroundSize: '32px 32px'
                }}
            />

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

                                            <div className="pt-10 border-t border-amber-50 flex items-center justify-between relative z-10">
                                                <div className="flex items-center gap-6">
                                                    <div className="flex items-center gap-2.5">
                                                        <Diamond className="w-4 h-4 text-amber-400" />
                                                        <span className="text-[11px] font-black text-gray-900 tracking-widest">{course.credits || 6}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2.5">
                                                        <Layers className="w-4 h-4 text-amber-400" />
                                                        <span className="text-[11px] font-black text-gray-900 tracking-widest">{course.modules?.length || 0}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2.5">
                                                        <BookOpen className="w-4 h-4 text-amber-400" />
                                                        <span className="text-[11px] font-black text-gray-900 tracking-widest">{topics.filter(t => t.course === course.title).length}</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-xl border border-amber-100/50 shadow-sm">
                                                    <div className="relative w-7 h-7">
                                                        <svg className="w-full h-full transform -rotate-90">
                                                            <circle cx="14" cy="14" r="11" fill="none" stroke="#fef3c7" strokeWidth="2.5" />
                                                            <circle cx="14" cy="14" r="11" fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeDasharray="70" strokeDashoffset={70 - (70 * (course.progress || 0) / 100)} strokeLinecap="round" />
                                                        </svg>
                                                    </div>
                                                    <span className="text-[10px] font-black text-amber-600 ml-0.5">{course.progress || 0}%</span>
                                                </div>
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
                                        <div key={mod.id} className="space-y-16">
                                            {/* Module Header */}
                                            <div className="flex gap-8 items-start relative z-10">
                                                <div className="w-20 h-20 bg-white border-2 border-[#fafafa] rounded-[1.5rem] flex flex-col items-center justify-center shadow-xl shadow-gray-200/50 flex-shrink-0">
                                                    <span className="text-[7px] font-black uppercase tracking-widest text-gray-400 mb-0.5">Module</span>
                                                    <span className="text-3xl font-black text-gray-900 leading-none">{idx + 1}</span>
                                                </div>
                                                <div className="flex-1 space-y-3 pt-2">
                                                    <div
                                                        onClick={() => setExpandedModule(expandedModule === mod.id ? null : mod.id)}
                                                        className="flex items-center justify-between cursor-pointer group/header"
                                                    >
                                                        <h3 className="text-lg font-black text-gray-900 uppercase tracking-tighter group-hover/header:text-black transition-colors">{mod.title}</h3>
                                                        <ChevronDown
                                                            className={`w-5 h-5 text-gray-300 transition-transform ${expandedModule === mod.id ? 'rotate-180' : ''}`}
                                                        />
                                                    </div>
                                                    <p className="text-[12px] text-gray-400 leading-relaxed font-medium opacity-80 max-w-xl">{mod.desc}</p>
                                                </div>
                                            </div>

                                            {/* Lessons */}
                                            <AnimatePresence>
                                                {expandedModule === mod.id && (
                                                    <motion.div
                                                        initial={{ height: 0, opacity: 0 }}
                                                        animate={{ height: "auto", opacity: 1 }}
                                                        exit={{ height: 0, opacity: 0 }}
                                                        className="space-y-14 ml-10 pl-4 overflow-hidden"
                                                    >
                                                        {topics.filter(t => t.course === selectedCourse.title && t.module === mod.title).map((lesson, lIdx) => (
                                                            <div
                                                                key={lesson._id}
                                                                onClick={() => {
                                                                    setSelectedLesson(lesson);
                                                                    setView("lesson");
                                                                }}
                                                                className="flex gap-12 items-start group cursor-pointer relative"
                                                            >
                                                                {/* Lesson Bubble */}
                                                                <div className="w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center text-[12px] font-black transition-all duration-300 shadow-xl shadow-black/20 z-10">
                                                                    {idx + 1}.{lIdx + 1}
                                                                </div>

                                                                <div className="flex-1 space-y-1 pt-1 border-b border-gray-50 pb-6 group-hover:border-black/10 transition-all">
                                                                    <h4 className="text-sm font-black text-gray-800 uppercase tracking-tight group-hover:text-black">{lesson.title}</h4>
                                                                    <p className="text-[10px] text-gray-400 font-medium group-hover:text-gray-600 transition-colors leading-relaxed opacity-70">
                                                                        {lesson.blocks?.find(b => b.type === 'text')?.content || 'Review module intel.'}
                                                                    </p>
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

                            <div className="max-w-4xl mx-auto space-y-10 px-6 lg:px-10 pt-4 pb-16 relative overflow-hidden text-left">
                                {/* Decorative elements */}
                                <div className="absolute top-0 right-0 w-96 h-96 bg-gray-50 rounded-full blur-[100px] opacity-50 -translate-x-20 -translate-y-20 pointer-events-none" />

                                <div className="space-y-4 text-left relative z-10">
                                    <div className="w-8 h-8 bg-black text-white rounded-lg flex items-center justify-center text-[10px] font-black shadow-lg shadow-black/20">3.4</div>
                                    <h1 className="text-[28px] font-black text-gray-900 uppercase tracking-tighter leading-none">{selectedLesson?.title || "Assignment: Analyzing a Multilingual Ad"}</h1>
                                </div>
                                <div className="h-px bg-gray-100 w-full relative z-10" />

                                <div className="space-y-10 relative z-10">
                                    {selectedLesson?.blocks?.map((block, i) => (
                                        <div key={i} className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                                            {block.type === 'text' ? (
                                                <div className="h-full flex flex-col justify-center">
                                                    <p className="text-[16px] text-gray-600 font-medium leading-relaxed text-left whitespace-pre-wrap">{block.content}</p>
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

                                <button className="w-full py-4 bg-black text-white rounded-xl text-[10px] font-black uppercase tracking-[0.3em] shadow-lg hover:scale-[1.01] active:scale-95 transition-all relative z-10 flex items-center justify-center gap-4 group">
                                    <Sparkles className="w-3.5 h-3.5 group-hover:animate-spin" /> Launch Assignment Protocol
                                </button>
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
