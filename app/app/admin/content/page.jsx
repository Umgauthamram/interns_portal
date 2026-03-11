
"use client";

import { useState, useEffect } from "react";
import {
    Plus,
    Youtube,
    FileText,
    Eye,
    CheckCircle2,
    Trash2,
    ExternalLink,
    Play,
    BookOpen,
    Save,
    Send,
    ChevronRight,
    Search,
    Brain,
    Monitor,
    Database,
    Cpu,
    Sparkles,
    Clock,
    User,
    ChevronLeft,
    Layers,
    Link as LinkIcon2,
    Minus,
    Image as ImageIcon
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";

// Removed MOCK_TOPICS

export default function AdminLiveBookPage() {
    const [view, setView] = useState("library"); // library, course, module, editor
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [selectedModule, setSelectedModule] = useState(null);
    const [topics, setTopics] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [isAddCourseModalOpen, setIsAddCourseModalOpen] = useState(false);
    const [isAddModuleModalOpen, setIsAddModuleModalOpen] = useState(false);
    const [newCourseData, setNewCourseData] = useState({ title: "", desc: "", tracks: [] });
    const [newModuleData, setNewModuleData] = useState({ title: "", desc: "" });
    const [courses, setCourses] = useState([]);
    const [availableTracks, setAvailableTracks] = useState([]);

    useEffect(() => {
        const fetchContent = async () => {
            try {
                const [cRes, tRes, trRes] = await Promise.all([
                    fetch('/api/admin/content/courses'),
                    fetch('/api/admin/content/topics'),
                    fetch('/api/admin/tracks')
                ]);
                if (cRes.ok) setCourses(await cRes.json());
                if (tRes.ok) setTopics(await tRes.json());
                if (trRes.ok) {
                    const data = await trRes.json();
                    const extracted = [];
                    if (data.CODING) data.CODING.forEach(t => extracted.push(t.name));
                    if (data.RESEARCH) data.RESEARCH.forEach(t => extracted.push(t.name));
                    setAvailableTracks(extracted);
                }
            } catch (err) {
                console.error("Fetch content error:", err);
            }
        };
        fetchContent();
    }, []);

    const [activeTopic, setActiveTopic] = useState({
        id: null,
        title: "",
        status: "Draft",
        course: "",
        module: "",
        blocks: [{ type: "text", content: "" }]
    });

    const [previewMode, setPreviewMode] = useState(false);
    const [projectionSize, setProjectionSize] = useState("phone"); // phone or laptop

    const addBlock = (type) => {
        const defaultContent = type === 'link' ? JSON.stringify({ label: '', url: '' }) : '';
        setActiveTopic(prev => ({
            ...prev,
            blocks: [...prev.blocks, { type, content: defaultContent }]
        }));
    };

    // Helper: update a sub-field of a JSON block (for link)
    const updateLinkField = (index, field, value) => {
        const newBlocks = [...activeTopic.blocks];
        const parsed = (() => { try { return JSON.parse(newBlocks[index].content); } catch { return { label: '', url: '' }; } })();
        parsed[field] = value;
        newBlocks[index].content = JSON.stringify(parsed);
        setActiveTopic(prev => ({ ...prev, blocks: newBlocks }));
    };

    const parseLinkBlock = (content) => {
        try { return JSON.parse(content); } catch { return { label: content, url: '' }; }
    };

    const updateBlock = (index, value) => {
        const newBlocks = [...activeTopic.blocks];
        newBlocks[index].content = value;
        setActiveTopic(prev => ({ ...prev, blocks: newBlocks }));
    };

    const removeBlock = (index) => {
        const newBlocks = activeTopic.blocks.filter((_, i) => i !== index);
        setActiveTopic(prev => ({ ...prev, blocks: newBlocks }));
    };

    const handleSaveTopic = async (e) => {
        e.preventDefault();
        const payload = { ...activeTopic, course: selectedCourse.title, module: selectedModule.title };

        try {
            if (activeTopic._id) {
                const res = await fetch('/api/admin/content/topics', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ ...payload, id: activeTopic._id })
                });
                if (res.ok) {
                    const updated = await res.json();
                    setTopics(prev => prev.map(t => t._id === updated._id ? updated : t));
                    toast.success("Intelligence Instance Updated.");
                }
            } else {
                const res = await fetch('/api/admin/content/topics', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                if (res.ok) {
                    const created = await res.json();
                    setTopics(prev => [created, ...prev]);
                    toast.success("New Protocol Integrated.");
                }
            }
            setIsEditing(false);
            setView("module");
        } catch (err) {
            toast.error("Failed to Sync Memory.");
        }
    };

    const handlePublish = async (id) => {
        try {
            const res = await fetch('/api/admin/content/topics', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id, status: 'Published' })
            });
            if (res.ok) {
                const updated = await res.json();
                setTopics(prev => prev.map(t => t._id === id ? updated : t));
                toast.success("Intelligence Distributed to LiveBook.");
            }
        } catch (e) {
            toast.error("Failed to distribute intel.");
        }
    };

    const getYoutubeId = (url) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url?.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const renderHeader = () => (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
            <div className="space-y-2">
                <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-300">
                    <span
                        className="cursor-pointer hover:text-black transition-colors"
                        onClick={() => { setView("library"); setSelectedCourse(null); setSelectedModule(null); }}
                    >Admin</span>
                    {(selectedCourse && view !== "library") && (
                        <>
                            <ChevronRight className="w-3 h-3" />
                            <span
                                className="cursor-pointer hover:text-black transition-colors"
                                onClick={() => { setView("course"); setSelectedModule(null); }}
                            >
                                {selectedCourse.title}
                            </span>
                        </>
                    )}
                    {(selectedModule && (view === "module" || view === "editor" || view === "preview")) && (
                        <>
                            <ChevronRight className="w-3 h-3" />
                            <span className="text-black">{selectedModule.title}</span>
                        </>
                    )}
                </div>
                <h1 className="text-3xl font-black text-gray-900 tracking-tighter uppercase leading-none">
                    {view === "library" ? "LiveBook Central" : view === "course" ? selectedCourse?.title : selectedModule?.title || "Editor"}
                </h1>
            </div>

            <div className="flex gap-4">
                {view === "library" && (
                    <button
                        onClick={() => setIsAddCourseModalOpen(true)}
                        className="bg-black text-white px-6 py-3 rounded-xl flex items-center gap-2 font-black uppercase text-[9px] tracking-widest shadow-xl hover:scale-105 transition-all"
                    >
                        <Plus className="w-4 h-4" /> New LiveBook
                    </button>
                )}
                {view === "course" && (
                    <button
                        onClick={() => setIsAddModuleModalOpen(true)}
                        className="bg-black text-white px-6 py-3 rounded-xl flex items-center gap-2 font-black uppercase text-[9px] tracking-widest shadow-xl hover:scale-105 transition-all"
                    >
                        <Plus className="w-4 h-4" /> Add Module
                    </button>
                )}
                {view === "module" && (
                    <button
                        onClick={() => {
                            setActiveTopic({ id: null, title: "", status: "Draft", blocks: [{ type: "text", content: "" }] });
                            setIsEditing(true);
                            setView("editor");
                        }}
                        className="bg-black text-white px-6 py-3 rounded-xl flex items-center gap-2 font-black uppercase text-[9px] tracking-widest shadow-xl hover:scale-105 transition-all"
                    >
                        <Plus className="w-4 h-4" /> New Topic
                    </button>
                )}
            </div>
        </div>
    );

    return (
        <div className="relative min-h-screen">
            <div className="fixed inset-0 pointer-events-none z-[-1] opacity-[0.2]"
                style={{
                    backgroundImage: `radial-gradient(#000 1px, transparent 1px)`,
                    backgroundSize: '32px 32px'
                }}
            />

            <div className="p-8 lg:p-12 space-y-10 max-w-[1600px] mx-auto">
                {renderHeader()}

                <AnimatePresence mode="wait">
                    {view === "library" && (
                        <motion.div key="library" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {courses.map(course => (
                                <div key={course._id} onClick={() => { setSelectedCourse(course); setView("course"); }} className="group bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-xl hover:shadow-2xl hover:translate-y-[-5px] transition-all cursor-pointer relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.1] transition-opacity">
                                        <BookOpen className="w-32 h-32" />
                                    </div>
                                    <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter mb-2">{course.title}</h3>
                                    <p className="text-xs text-gray-400 font-medium mb-6">{course.desc}</p>
                                    <div className="flex flex-col gap-3">
                                        <div className="flex items-center gap-2 text-[10px] font-black text-gray-300 uppercase tracking-widest">
                                            <Layers className="w-4 h-4" /> {course.modules.length} Modules
                                        </div>
                                        <div className="flex flex-wrap gap-1">
                                            {(!course.tracks || course.tracks.length === 0) ? (
                                                <span className="px-2 py-0.5 bg-gray-100 text-gray-400 rounded text-[8px] font-black uppercase tracking-widest shadow-sm">All Tracks</span>
                                            ) : (
                                                course.tracks.map(t => (
                                                    <span key={t} className="px-2 py-0.5 bg-black text-white rounded text-[8px] font-black uppercase tracking-widest shadow-sm">{t}</span>
                                                ))
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </motion.div>
                    )}

                    {view === "course" && (
                        <motion.div key="course" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                            <button onClick={() => { setView("library"); setSelectedCourse(null); }} className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400 hover:text-black transition-colors mb-4 focus:outline-none">
                                <ChevronLeft className="w-4 h-4" /> Back to Library
                            </button>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {selectedCourse.modules.map((mod, i) => (
                                    <div key={mod.id} onClick={() => { setSelectedModule(mod); setView("module"); }} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-lg hover:border-black transition-all cursor-pointer">
                                        <span className="text-[9px] font-black text-gray-300 uppercase tracking-widest mb-1 block">Module {i + 1}</span>
                                        <h4 className="text-lg font-black text-gray-900 uppercase tracking-tighter">{mod.title}</h4>
                                    </div>
                                ))}
                            </div>
                        </motion.div>
                    )}

                    {view === "module" && (
                        <motion.div key="module" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                            <button onClick={() => { setView("course"); setSelectedModule(null); }} className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400 hover:text-black transition-colors mb-4 focus:outline-none">
                                <ChevronLeft className="w-4 h-4" /> Back to Modules
                            </button>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {topics.filter(t => t.course === selectedCourse.title && t.module === selectedModule.title).map(topic => (
                                    <div
                                        key={topic.id}
                                        onClick={() => { setActiveTopic(topic); setView("preview"); }}
                                        className="bg-white p-8 rounded-[3rem] border border-gray-100 shadow-xl flex flex-col justify-between group h-full hover:shadow-2xl hover:border-black transition-all cursor-pointer"
                                    >
                                        <div>
                                            <div className="flex justify-between items-start mb-6">
                                                <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-lg shadow-black/5 flex items-center gap-2 ${topic.status === 'Published' ? 'bg-emerald-500 text-white' : 'bg-orange-50 text-orange-600 border border-orange-100'}`}>
                                                    {topic.status === 'Published' && <CheckCircle2 className="w-3 h-3" />}
                                                    {topic.status}
                                                </div>
                                                <span className="text-[10px] font-black text-gray-200 uppercase tracking-widest">v{topic._id?.toString().slice(-4) || '1'}</span>
                                            </div>
                                            <h4 className="text-xl font-black text-gray-900 uppercase tracking-tighter leading-tight mb-4">{topic.title}</h4>
                                            <p className="text-[12px] text-gray-400 font-medium line-clamp-2 mb-6">
                                                {topic.blocks?.find(b => b.type === 'text')?.content || "Dynamic Content Architecture Block"}
                                            </p>
                                        </div>

                                        <div className="space-y-4 pt-6 border-t border-gray-50">
                                            <div className="flex items-center justify-between text-[10px] font-black text-gray-300 uppercase tracking-widest">
                                                <span>Updated {new Date(topic.updatedAt).toLocaleDateString()}</span>
                                            </div>

                                            <div className="flex gap-3">
                                                <button
                                                    onClick={(e) => { e.stopPropagation(); setActiveTopic(topic); setIsEditing(true); setView("editor"); }}
                                                    className="flex-1 py-3 bg-gray-50 text-gray-900 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all shadow-sm flex items-center justify-center gap-2"
                                                >
                                                    <ExternalLink className="w-3 h-3" /> Modify Intel
                                                </button>

                                                {topic.status === 'Draft' && (
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); handlePublish(topic._id || topic.id); }}
                                                        className="flex-1 py-3 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl hover:scale-105 active:scale-95 transition-all flex items-center justify-center gap-2"
                                                    >
                                                        <Send className="w-3 h-3" /> Distribute
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <div onClick={() => { setActiveTopic({ id: null, title: "", status: "Draft", blocks: [{ type: "text", content: "" }] }); setIsEditing(true); setView("editor"); }} className="bg-gray-50 border-4 border-dashed border-gray-100 rounded-[3rem] p-12 flex flex-col items-center justify-center text-gray-300 hover:text-black hover:border-black transition-all cursor-pointer group hover:bg-white hover:shadow-2xl">
                                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 transition-transform">
                                        <Plus className="w-8 h-8" />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-[0.3em]">Init New Topic</span>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {view === "editor" && (
                        <motion.div key="editor" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="grid grid-cols-1 xl:grid-cols-2 gap-12">
                            <div className="bg-white p-6 lg:p-8 rounded-[2.5rem] border border-gray-100 shadow-xl space-y-6">
                                <div className="flex items-center justify-between border-b border-gray-50 pb-5">
                                    <h2 className="text-[8px] font-black uppercase tracking-[0.4em] text-gray-300">Intel Constructor</h2>
                                    <div className="flex gap-2 flex-wrap">
                                        <button type="button" onClick={() => addBlock('text')} className="px-3 py-2 bg-gray-50 rounded-xl text-[8px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all">+ Text</button>
                                        <button type="button" onClick={() => addBlock('image')} className="px-3 py-2 bg-gray-50 rounded-xl text-[8px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all">+ Photo</button>
                                        <button type="button" onClick={() => addBlock('youtube')} className="px-3 py-2 bg-gray-50 rounded-xl text-[8px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all">+ Video</button>
                                        <button type="button" onClick={() => addBlock('link')} className="px-3 py-2 bg-blue-50 text-blue-700 rounded-xl text-[8px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all">+ Link</button>
                                        <button type="button" onClick={() => addBlock('gap')} className="px-3 py-2 bg-gray-50 rounded-xl text-[8px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all">+ Gap</button>
                                    </div>
                                </div>

                                <form onSubmit={handleSaveTopic} className="space-y-5">
                                    <div className="space-y-1.5">
                                        <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest ml-1">Topic Title</label>
                                        <input className="w-full bg-gray-50 rounded-lg px-4 py-3 text-[10px] font-bold outline-none" value={activeTopic.title} onChange={e => setActiveTopic({ ...activeTopic, title: e.target.value })} placeholder="Analysis Header..." />
                                    </div>

                                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                        {activeTopic.blocks.map((block, idx) => (
                                            <div key={idx} className="relative group/block bg-gray-50/50 p-3 rounded-xl border border-transparent hover:border-gray-100 transition-all">
                                                <button type="button" onClick={() => removeBlock(idx)} className="absolute -right-1.5 -top-1.5 w-5 h-5 bg-white shadow-md rounded-full flex items-center justify-center text-gray-300 hover:text-red-500 opacity-0 group-hover/block:opacity-100 transition-all z-20"><Trash2 className="w-2.5 h-2.5" /></button>
                                                {block.type === 'text' ? (
                                                    <textarea className="w-full bg-transparent border-0 text-[10px] font-medium focus:ring-0 outline-none resize-none" rows="3" value={block.content} onChange={(e) => updateBlock(idx, e.target.value)} placeholder="Payload metadata..." />
                                                ) : block.type === 'image' ? (
                                                    <div className="flex items-center gap-3">
                                                        <ImageIcon className="w-3.5 h-3.5 text-blue-500" />
                                                        <input className="flex-1 bg-transparent border-0 text-[10px] font-bold focus:ring-0 outline-none" value={block.content} onChange={(e) => updateBlock(idx, e.target.value)} placeholder="Image URL (Direct Link)" />
                                                    </div>
                                                ) : block.type === 'youtube' ? (
                                                    <div className="flex items-center gap-3">
                                                        <Youtube className="w-3.5 h-3.5 text-red-500" />
                                                        <input className="flex-1 bg-transparent border-0 text-[10px] font-bold focus:ring-0 outline-none" value={block.content} onChange={(e) => updateBlock(idx, e.target.value)} placeholder="YouTube Link" />
                                                    </div>
                                                ) : block.type === 'link' ? (
                                                    <div className="space-y-1.5">
                                                        <div className="flex items-center gap-2">
                                                            <LinkIcon2 className="w-3.5 h-3.5 text-blue-500 shrink-0" />
                                                            <input
                                                                className="flex-1 bg-white border border-blue-100 rounded-lg px-2.5 py-1.5 text-[10px] font-bold focus:ring-2 focus:ring-blue-100 outline-none"
                                                                value={parseLinkBlock(block.content).label}
                                                                onChange={e => updateLinkField(idx, 'label', e.target.value)}
                                                                placeholder="Label (e.g. React Docs)"
                                                            />
                                                        </div>
                                                        <input
                                                            className="w-full bg-white border border-blue-100 rounded-lg px-2.5 py-1.5 text-[10px] font-medium text-blue-600 focus:ring-2 focus:ring-blue-100 outline-none ml-[22px]"
                                                            value={parseLinkBlock(block.content).url}
                                                            onChange={e => updateLinkField(idx, 'url', e.target.value)}
                                                            placeholder="https://..."
                                                        />
                                                    </div>
                                                ) : block.type === 'gap' ? (
                                                    <div className="flex items-center gap-3 py-1">
                                                        <Minus className="w-3.5 h-3.5 text-gray-300" />
                                                        <div className="flex-1 border-t-2 border-dashed border-gray-200" />
                                                        <span className="text-[8px] font-black text-gray-300 uppercase tracking-widest">Gap / Spacer</span>
                                                        <div className="flex-1 border-t-2 border-dashed border-gray-200" />
                                                        <Minus className="w-3.5 h-3.5 text-gray-300" />
                                                    </div>
                                                ) : null}
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex gap-4 pt-3 border-t border-gray-50">
                                        <button type="button" onClick={() => setView("module")} className="flex-1 py-2 text-[8px] font-black uppercase tracking-widest text-gray-300 hover:text-black transition-colors">Abort</button>
                                        <button type="submit" className="flex-[2] py-3 bg-black text-white rounded-lg text-[8px] font-black uppercase tracking-widest shadow-lg hover:scale-105 active:scale-95 transition-all">Sync Memory</button>
                                    </div>
                                </form>
                            </div>

                            <div className="flex flex-col gap-4">
                                <div className="flex items-center justify-between px-4">
                                    <div className="text-[9px] font-black text-gray-300 uppercase tracking-[0.4em] flex items-center gap-2"><Monitor className="w-3 h-3" /> Projection</div>
                                    <div className="bg-gray-50 p-1 rounded-lg flex gap-1">
                                        <button onClick={() => setProjectionSize("phone")} className={`p-1.5 rounded-md transition-all ${projectionSize === 'phone' ? 'bg-black text-white shadow-md' : 'text-gray-400 hover:text-black'}`}>
                                            <Monitor className="w-3.5 h-3.5 rotate-180 scale-x-50 scale-y-110" /> {/* Phone proxy */}
                                        </button>
                                        <button onClick={() => setProjectionSize("laptop")} className={`p-1.5 rounded-md transition-all ${projectionSize === 'laptop' ? 'bg-black text-white shadow-md' : 'text-gray-400 hover:text-black'}`}>
                                            <Monitor className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                                <div className="bg-gray-100 p-4 rounded-[2.5rem] flex-1 flex flex-col items-center justify-center min-h-[550px] shadow-inner relative overflow-hidden">
                                    <motion.div
                                        animate={{
                                            width: projectionSize === 'phone' ? '280px' : '90%',
                                            height: projectionSize === 'phone' ? '550px' : '400px',
                                            borderRadius: projectionSize === 'phone' ? '2rem' : '1rem'
                                        }}
                                        className="bg-white shadow-2xl overflow-y-auto custom-scrollbar flex flex-col border border-gray-200 transition-all duration-500"
                                    >
                                        <div className="p-8 lg:p-12 space-y-10">
                                            <div className={`${projectionSize === 'laptop' ? 'text-left' : 'text-center'} space-y-4`}>
                                                <div className={`w-8 h-8 bg-black text-white rounded-lg flex items-center justify-center text-[10px] font-black ${projectionSize === 'phone' ? 'mx-auto' : ''}`}>3.X</div>
                                                <h3 className={`${projectionSize === 'phone' ? 'text-[14px]' : 'text-[28px]'} font-black text-gray-900 uppercase tracking-tighter leading-none`}>{activeTopic.title || "Subject"}</h3>
                                            </div>

                                            <div className="h-px bg-gray-100 w-full" />

                                            <div className="space-y-10">
                                                {activeTopic.blocks.map((block, idx) => (
                                                    <div key={idx} className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                                                        {block.type === 'text' ? (
                                                            <div className="h-full flex flex-col justify-center">
                                                                <p className={`${projectionSize === 'phone' ? 'text-[10px]' : 'text-[16px]'} text-gray-500 font-medium leading-relaxed`}>{block.content || "Connecting to core intelligence protocol... Metadata missing."}</p>
                                                            </div>
                                                        ) : block.type === 'image' ? (
                                                            block.content ? (
                                                                <div className="w-full rounded-[1.5rem] overflow-hidden bg-gray-50 shadow-sm border border-gray-100">
                                                                    <img src={block.content} alt="Content" className="w-full h-auto object-cover" />
                                                                </div>
                                                            ) : (
                                                                <div className="aspect-video w-full rounded-[1.5rem] bg-gray-50 border-2 border-dashed border-gray-100 flex items-center justify-center"><ImageIcon className="w-6 h-6 text-gray-200" /></div>
                                                            )
                                                        ) : block.type === 'youtube' ? (
                                                            block.content && getYoutubeId(block.content) ? (
                                                                <div className="aspect-video w-full rounded-[1.5rem] overflow-hidden bg-black shadow-xl">
                                                                    <iframe className="w-full h-full" src={`https://www.youtube.com/embed/${getYoutubeId(block.content)}`} frameBorder="0" allowFullScreen />
                                                                </div>
                                                            ) : (
                                                                <div className="aspect-video w-full rounded-[1.5rem] bg-gray-50 border-2 border-dashed border-gray-100 flex items-center justify-center"><Youtube className="w-6 h-6 text-gray-200" /></div>
                                                            )
                                                        ) : block.type === 'link' ? (() => {
                                                            const lnk = parseLinkBlock(block.content);
                                                            return lnk.url ? (
                                                                <a href={lnk.url} target="_blank" rel="noopener noreferrer"
                                                                    className="flex items-center gap-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 hover:bg-blue-100 transition-colors group">
                                                                    <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center shrink-0">
                                                                        <LinkIcon2 className="w-3.5 h-3.5 text-white" />
                                                                    </div>
                                                                    <div className="flex-1 min-w-0">
                                                                        <p className={`${projectionSize === 'phone' ? 'text-[10px]' : 'text-[13px]'} font-black text-blue-700 truncate`}>{lnk.label || lnk.url}</p>
                                                                        <p className={`${projectionSize === 'phone' ? 'text-[8px]' : 'text-[10px]'} text-blue-400 font-medium truncate`}>{lnk.url}</p>
                                                                    </div>
                                                                    <ExternalLink className="w-3.5 h-3.5 text-blue-400 group-hover:text-blue-600" />
                                                                </a>
                                                            ) : (
                                                                <div className="bg-blue-50 border-2 border-dashed border-blue-100 rounded-xl px-4 py-3 flex items-center gap-2 text-blue-300">
                                                                    <LinkIcon2 className="w-4 h-4" />
                                                                    <span className={`${projectionSize === 'phone' ? 'text-[8px]' : 'text-[11px]'} font-black uppercase tracking-widest`}>Reference Link — enter URL</span>
                                                                </div>
                                                            );
                                                        })() : block.type === 'gap' ? (
                                                            <div style={{ height: '2cm' }} />
                                                        ) : null}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                    {view === "preview" && (
                        <motion.div key="preview" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="space-y-8">
                            <div className="flex items-center justify-between">
                                <button onClick={() => setView("module")} className="flex items-center gap-2 text-[10px] font-black uppercase text-gray-400 hover:text-black transition-colors focus:outline-none">
                                    <ChevronLeft className="w-4 h-4" /> Back to Modules
                                </button>
                                <div className="bg-gray-50 p-1 rounded-lg flex gap-1 scale-90">
                                    <button onClick={() => setProjectionSize("phone")} className={`p-1.5 rounded-md transition-all ${projectionSize === 'phone' ? 'bg-black text-white shadow-md' : 'text-gray-400 hover:text-black'}`}>
                                        <Monitor className="w-3.5 h-3.5 rotate-180 scale-x-50 scale-y-110" />
                                    </button>
                                    <button onClick={() => setProjectionSize("laptop")} className={`p-1.5 rounded-md transition-all ${projectionSize === 'laptop' ? 'bg-black text-white shadow-md' : 'text-gray-400 hover:text-black'}`}>
                                        <Monitor className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-8 lg:p-12 rounded-[3.5rem] flex flex-col items-center justify-center min-h-[700px] shadow-inner relative overflow-hidden">
                                <motion.div
                                    animate={{
                                        width: projectionSize === 'phone' ? '300px' : '90%',
                                        maxWidth: projectionSize === 'laptop' ? '1200px' : '300px',
                                        height: projectionSize === 'phone' ? '600px' : 'auto',
                                        minHeight: projectionSize === 'laptop' ? '600px' : 'auto',
                                        borderRadius: projectionSize === 'phone' ? '2.5rem' : '1.5rem'
                                    }}
                                    className="bg-white shadow-2xl overflow-y-auto custom-scrollbar flex flex-col border border-gray-200 transition-all duration-500 mb-12"
                                >
                                    <div className="p-8 lg:p-16 space-y-12">
                                        <div className={`${projectionSize === 'laptop' ? 'text-left' : 'text-center'} space-y-4`}>
                                            <div className={`w-10 h-10 bg-black text-white rounded-xl flex items-center justify-center text-[12px] font-black ${projectionSize === 'phone' ? 'mx-auto' : ''}`}>3.X</div>
                                            <h3 className={`${projectionSize === 'phone' ? 'text-[18px]' : 'text-[42px]'} font-black text-gray-900 uppercase tracking-tighter leading-none`}>{activeTopic.title || "Subject"}</h3>
                                        </div>

                                        <div className="h-px bg-gray-100 w-full" />

                                        <div className="space-y-12">
                                            {activeTopic.blocks.map((block, idx) => (
                                                <div key={idx} className="animate-in fade-in slide-in-from-bottom-2 duration-500">
                                                    {block.type === 'text' ? (
                                                        <div className="h-full flex flex-col justify-center">
                                                            <p className={`${projectionSize === 'phone' ? 'text-[11px]' : 'text-[18px]'} text-gray-500 font-medium leading-relaxed max-w-3xl`}>{block.content || "Connecting to core intelligence protocol..."}</p>
                                                        </div>
                                                    ) : block.type === 'image' ? (
                                                        block.content ? (
                                                            <div className="w-full rounded-[2.5rem] overflow-hidden bg-gray-50 shadow-xl border border-gray-100">
                                                                <img src={block.content} alt="Content" className="w-full h-auto object-cover" />
                                                            </div>
                                                        ) : (
                                                            <div className="aspect-video w-full rounded-[2.5rem] bg-gray-50 border-2 border-dashed border-gray-100 flex items-center justify-center"><ImageIcon className="w-8 h-8 text-gray-200" /></div>
                                                        )
                                                    ) : block.type === 'youtube' ? (
                                                        block.content && getYoutubeId(block.content) ? (
                                                            <div className="aspect-video w-full rounded-[3rem] overflow-hidden bg-black shadow-2xl">
                                                                <iframe className="w-full h-full" src={`https://www.youtube.com/embed/${getYoutubeId(block.content)}`} frameBorder="0" allowFullScreen />
                                                            </div>
                                                        ) : (
                                                            <div className="aspect-video w-full rounded-[3rem] bg-gray-50 border-2 border-dashed border-gray-100 flex items-center justify-center"><Youtube className="w-10 h-10 text-gray-200" /></div>
                                                        )
                                                    ) : block.type === 'link' ? (() => {
                                                        const lnk = parseLinkBlock(block.content);
                                                        return lnk.url ? (
                                                            <a href={lnk.url} target="_blank" rel="noopener noreferrer"
                                                                className="flex items-center gap-4 bg-blue-50 border border-blue-100 rounded-2xl px-6 py-4 hover:bg-blue-100 transition-colors group">
                                                                <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shrink-0">
                                                                    <LinkIcon2 className="w-5 h-5 text-white" />
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <p className={`${projectionSize === 'phone' ? 'text-[12px]' : 'text-[16px]'} font-black text-blue-700 truncate`}>{lnk.label || lnk.url}</p>
                                                                    <p className={`${projectionSize === 'phone' ? 'text-[9px]' : 'text-[11px]'} text-blue-400 font-medium truncate mt-0.5`}>{lnk.url}</p>
                                                                </div>
                                                                <ExternalLink className="w-4 h-4 text-blue-400 group-hover:text-blue-600" />
                                                            </a>
                                                        ) : (
                                                            <div className="bg-blue-50 border-2 border-dashed border-blue-100 rounded-2xl px-6 py-4 flex items-center gap-3 text-blue-300">
                                                                <LinkIcon2 className="w-5 h-5" />
                                                                <span className={`${projectionSize === 'phone' ? 'text-[9px]' : 'text-[13px]'} font-black uppercase tracking-widest`}>Reference Link — enter URL in editor</span>
                                                            </div>
                                                        );
                                                    })() : block.type === 'gap' ? (
                                                        <div style={{ height: '2cm' }} />
                                                    ) : null}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            <AnimatePresence>
                {isAddCourseModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAddCourseModalOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-2xl" />
                        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="relative bg-white rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl border border-gray-100">
                            <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter mb-6">Initialize New LiveBook</h3>
                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest ml-1">LiveBook Title</label>
                                    <input
                                        autoFocus
                                        value={newCourseData.title}
                                        onChange={(e) => setNewCourseData({ ...newCourseData, title: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-[12px] font-bold focus:ring-4 focus:ring-black/5 outline-none"
                                        placeholder="E.g. Quantum Computing..."
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest ml-1">Directive / Description</label>
                                    <textarea
                                        value={newCourseData.desc}
                                        onChange={(e) => setNewCourseData({ ...newCourseData, desc: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-[12px] font-bold focus:ring-4 focus:ring-black/5 outline-none resize-none"
                                        rows="3"
                                        placeholder="Core objective of this asset..."
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest ml-1">Assigned Tracks</label>
                                    <div className="flex flex-wrap gap-2 pt-1 max-h-32 overflow-y-auto custom-scrollbar pr-2">
                                        {availableTracks.map(track => {
                                            const isSelected = newCourseData.tracks.includes(track);
                                            return (
                                                <button
                                                    key={track}
                                                    type="button"
                                                    onClick={() => {
                                                        const fresh = [...newCourseData.tracks];
                                                        if (isSelected) {
                                                            fresh.splice(fresh.indexOf(track), 1);
                                                        } else {
                                                            fresh.push(track);
                                                        }
                                                        setNewCourseData({ ...newCourseData, tracks: fresh });
                                                    }}
                                                    className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all shadow-sm ${isSelected ? 'bg-black text-white hover:bg-gray-800' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                                                >
                                                    {track}
                                                </button>
                                            );
                                        })}
                                        {availableTracks.length === 0 && <span className="text-xs text-gray-400">Loading tracks...</span>}
                                    </div>
                                </div>
                                <button
                                    onClick={async () => {
                                        if (newCourseData.title.trim()) {
                                            const newCourse = { title: newCourseData.title, desc: newCourseData.desc, tracks: newCourseData.tracks, modules: [] };
                                            try {
                                                const res = await fetch('/api/admin/content/courses', {
                                                    method: 'POST',
                                                    headers: { 'Content-Type': 'application/json' },
                                                    body: JSON.stringify(newCourse)
                                                });
                                                if (res.ok) {
                                                    const saved = await res.json();
                                                    setCourses(prev => [...prev, saved]);
                                                    setNewCourseData({ title: "", desc: "", tracks: [] });
                                                    setIsAddCourseModalOpen(false);
                                                    toast.success("Intelligence Asset Initialized.");
                                                }
                                            } catch (e) {
                                                toast.error("Network Error.");
                                            }
                                        }
                                    }}
                                    className="w-full py-4 bg-black text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg hover:scale-[1.01] transition-all"
                                >
                                    Confirm Protocol
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <AnimatePresence>
                {isAddModuleModalOpen && (
                    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAddModuleModalOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-2xl" />
                        <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.98 }} className="relative bg-white rounded-[2rem] p-8 max-w-sm w-full shadow-2xl border border-gray-100">
                            <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter mb-6">Create New Module</h3>
                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest ml-1">Module Title</label>
                                    <input
                                        autoFocus
                                        value={newModuleData.title}
                                        onChange={(e) => setNewModuleData({ ...newModuleData, title: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-[12px] font-bold focus:ring-4 focus:ring-black/5 outline-none"
                                        placeholder="E.g. Advanced Cryptography..."
                                    />
                                </div>
                                <div className="space-y-1.5 mt-4">
                                    <label className="text-[8px] font-black text-gray-400 uppercase tracking-widest ml-1">Module Description</label>
                                    <textarea
                                        value={newModuleData.desc}
                                        onChange={(e) => setNewModuleData({ ...newModuleData, desc: e.target.value })}
                                        className="w-full bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-[12px] font-bold focus:ring-4 focus:ring-black/5 outline-none resize-none"
                                        rows="3"
                                        placeholder="Summarize the core topics in this module..."
                                    />
                                </div>
                                <button
                                    onClick={async () => {
                                        if (newModuleData.title.trim() && newModuleData.desc.trim()) {
                                            const newModule = { id: Date.now().toString(), title: newModuleData.title.trim(), desc: newModuleData.desc.trim() };
                                            try {
                                                const updatedCourse = { ...selectedCourse, modules: [...selectedCourse.modules, newModule] };
                                                const res = await fetch('/api/admin/content/courses', {
                                                    method: 'PUT',
                                                    headers: { 'Content-Type': 'application/json' },
                                                    body: JSON.stringify({ id: selectedCourse._id, modules: updatedCourse.modules })
                                                });
                                                if (res.ok) {
                                                    const saved = await res.json();
                                                    setCourses(prev => prev.map(c => c._id === saved._id ? saved : c));
                                                    setSelectedCourse(saved);
                                                    setNewModuleData({ title: "", desc: "" });
                                                    setIsAddModuleModalOpen(false);
                                                    toast.success("Intelligence Module Integrated.");
                                                }
                                            } catch (e) {
                                                toast.error("Network Error.");
                                            }
                                        } else {
                                            toast.error("Please fill all fields.");
                                        }
                                    }}
                                    className="w-full py-3 bg-black text-white rounded-xl text-[9px] font-black uppercase tracking-widest shadow-lg hover:scale-[1.01] transition-all"
                                >
                                    Confirm Integration
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar { width: 8px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #f3f4f6; border-radius: 20px; border: 4px solid white; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #e5e7eb; }
            `}</style>
        </div>
    );
}
