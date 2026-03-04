import Link from "next/link";
import { ArrowRight, Code, Cpu, Database, Globe, Layers, Zap } from "lucide-react";

export default function InternshipLandingPage() {
    return (
        <div className="min-h-screen bg-slate-900 text-white font-sans selection:bg-cyan-500 selection:text-white overflow-x-hidden">
            {/* Grid Background */}
            <div className="fixed inset-0 z-0 opacity-20 pointer-events-none">
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-cyan-500 opacity-20 blur-[100px]"></div>
                <div className="absolute right-0 bottom-0 -z-10 h-[310px] w-[310px] rounded-full bg-blue-500 opacity-20 blur-[100px]"></div>
            </div>

            {/* Sticky Transparent Header */}
            <header className="sticky top-0 z-50 backdrop-blur-md bg-slate-900/50 border-b border-white/10">
                <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-2 font-bold text-xl tracking-tighter">
                        <Zap className="h-6 w-6 text-cyan-400" />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500">
                            InternshipPro
                        </span>
                    </div>
                    <nav className="hidden md:flex gap-8 text-sm font-medium text-slate-300">
                        <Link href="#features" className="hover:text-cyan-400 transition-colors">Tracks</Link>
                        <Link href="#mentors" className="hover:text-cyan-400 transition-colors">Mentorship</Link>
                        <Link href="#faq" className="hover:text-cyan-400 transition-colors">FAQ</Link>
                    </nav>
                    <Link
                        href="/internship/register"
                        className="px-6 py-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-semibold shadow-lg shadow-cyan-500/20 transition-all transform hover:scale-105"
                    >
                        Apply Now
                    </Link>
                </div>
            </header>

            {/* Hero Section */}
            <section className="relative z-10 pt-32 pb-20 px-6 text-center">
                <div className="max-w-4xl mx-auto space-y-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800/50 border border-slate-700/50 text-cyan-400 text-sm font-medium mb-4 animate-fade-in-up">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                        </span>
                        Now accepting applications for Summer 2026
                    </div>

                    <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-tight bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-slate-400">
                        Accelerate Your <br />
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600">
                            Career Journey
                        </span>
                    </h1>

                    <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
                        Master real-world skills through immersive projects and expert mentorship.
                        Join the elite community of future tech leaders.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
                        <Link
                            href="/internship/register"
                            className="group px-8 py-4 rounded-full bg-blue-600 hover:bg-blue-500 text-white font-bold text-lg shadow-xl shadow-blue-900/20 transition-all flex items-center gap-2"
                        >
                            Start Your Journey
                            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <Link
                            href="#tracks"
                            className="px-8 py-4 rounded-full bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 text-white font-semibold text-lg backdrop-blur-sm transition-all"
                        >
                            Explore Tracks
                        </Link>
                    </div>
                </div>
            </section>

            {/* Bento Grid Features - Tracks */}
            <section id="tracks" className="relative z-10 py-24 px-6">
                <div className="container mx-auto max-w-6xl">
                    <div className="text-center mb-16 space-y-4">
                        <h2 className="text-3xl md:text-5xl font-bold">Choose Your Path</h2>
                        <p className="text-slate-400 max-w-2xl mx-auto">
                            Select from our specialized tracks designed to make you industry-ready.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
                        {/* Card 1: Web Dev - Large Span */}
                        <div className="md:col-span-2 group relative overflow-hidden rounded-3xl bg-slate-800/40 border border-white/10 p-8 backdrop-blur-md hover:border-blue-500/50 transition-all duration-500">
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="relative z-10 h-full flex flex-col justify-between">
                                <div className="p-3 bg-blue-900/30 w-fit rounded-xl">
                                    <Globe className="h-8 w-8 text-blue-400" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold mb-2 text-white">Full Stack Web Development</h3>
                                    <p className="text-slate-400">Master React, Next.js, Node.js, and modern CSS frameworks. Build scalable applications from scratch.</p>
                                </div>
                            </div>
                            <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl group-hover:bg-blue-500/30 transition-all"></div>
                        </div>

                        {/* Card 2: AI - Tall */}
                        <div className="md:row-span-2 group relative overflow-hidden rounded-3xl bg-slate-800/40 border border-white/10 p-8 backdrop-blur-md hover:border-purple-500/50 transition-all duration-500">
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="relative z-10 h-full flex flex-col justify-between">
                                <div className="p-3 bg-purple-900/30 w-fit rounded-xl">
                                    <Cpu className="h-8 w-8 text-purple-400" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold mb-2 text-white">AI & Machine Learning</h3>
                                    <p className="text-slate-400 mb-6">Dive deep into neural networks, natural language processing, and computer vision. Work with PyTorch and TensorFlow.</p>
                                    <ul className="space-y-2 text-sm text-slate-500">
                                        <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>Python Mastery</li>
                                        <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>Deep Learning</li>
                                        <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-purple-500"></div>Model Deployment</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Card 3: Blockchain */}
                        <div className="group relative overflow-hidden rounded-3xl bg-slate-800/40 border border-white/10 p-8 backdrop-blur-md hover:border-cyan-500/50 transition-all duration-500">
                            <div className="absolute inset-0 bg-gradient-to-br from-cyan-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="relative z-10 h-full flex flex-col justify-between">
                                <div className="p-3 bg-cyan-900/30 w-fit rounded-xl">
                                    <Database className="h-8 w-8 text-cyan-400" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold mb-2 text-white">Blockchain & Crypto</h3>
                                    <p className="text-slate-400">Smart contracts, Solidity, and dApp development.</p>
                                </div>
                            </div>
                        </div>

                        {/* Card 4: DevOps */}
                        <div className="group relative overflow-hidden rounded-3xl bg-slate-800/40 border border-white/10 p-8 backdrop-blur-md hover:border-emerald-500/50 transition-all duration-500">
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="relative z-10 h-full flex flex-col justify-between">
                                <div className="p-3 bg-emerald-900/30 w-fit rounded-xl">
                                    <Layers className="h-8 w-8 text-emerald-400" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold mb-2 text-white">Cloud & DevOps</h3>
                                    <p className="text-slate-400">AWS, Docker, Kubernetes, and CI/CD pipelines.</p>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="border-t border-white/10 bg-slate-900 py-12 px-6">
                <div className="container mx-auto text-center text-slate-500 text-sm">
                    <p>&copy; 2026 InternshipPro. Built for the future.</p>
                </div>
            </footer>
        </div>
    );
}
