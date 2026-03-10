
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import Link from "next/link";

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [terminatedInfo, setTerminatedInfo] = useState(null); // { contact }
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    useEffect(() => {
        const userEmail = typeof window !== 'undefined' ? localStorage.getItem("userEmail") : null;
        const userRole = typeof window !== 'undefined' ? localStorage.getItem("userRole") : null;
        if (userEmail && userRole) {
            router.push(userRole === 'admin' ? '/admin' : '/dashboard');
        }
    }, [router]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setTerminatedInfo(null);

        try {
            const res = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            const data = await res.json();

            if (res.ok) {
                toast.success("Login Successful");
                localStorage.setItem("userEmail", data.user.email);
                localStorage.setItem("userRole", data.user.role || 'intern');
                localStorage.setItem("loginTimestamp", Date.now().toString());

                document.cookie = `userRole=${data.user.role || 'intern'}; path=/; max-age=10800`;
                document.cookie = `userEmail=${data.user.email}; path=/; max-age=10800`;

                if (data.user.role === 'admin') {
                    router.push("/admin");
                } else {
                    router.push("/dashboard");
                }
            } else if (res.status === 403 && data.terminated) {
                // Terminated account — show inline banner
                setTerminatedInfo({ contact: data.contact });
            } else {
                toast.error(data.message || "Login Failed");
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative min-h-screen w-screen bg-slate-50 font-sans flex items-center justify-center overflow-hidden p-4">

            {/* Premium Animated Gradient Blobs */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] bg-purple-300/40 rounded-full mix-blend-multiply filter blur-[80px] opacity-70 animate-pulse" style={{ animationDuration: '7s' }}></div>
                <div className="absolute top-[20%] right-[-10%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] bg-sky-300/40 rounded-full mix-blend-multiply filter blur-[80px] opacity-70 animate-pulse" style={{ animationDuration: '5s' }}></div>
                <div className="absolute bottom-[-20%] left-[20%] w-[70vw] h-[70vw] max-w-[900px] max-h-[900px] bg-indigo-300/40 rounded-full mix-blend-multiply filter blur-[80px] opacity-70 animate-pulse" style={{ animationDuration: '9s' }}></div>
            </div>

            <div className="w-full max-w-md bg-white/70 backdrop-blur-3xl rounded-[2.5rem] shadow-[0_8px_40px_rgba(0,0,0,0.08)] border border-white/60 p-8 space-y-6 relative z-10">
                <div className="text-center">
                    <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-gray-900/10">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5" />
                            <path d="M9 18h6" />
                            <path d="M10 22h4" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Welcome Back</h1>
                    <p className="text-gray-500 mt-2 text-sm">Sign in to your InternPortal account</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Email Address</label>
                        <input
                            type="email"
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-gray-900"
                            placeholder="name@example.com"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">Password</label>
                        <input
                            type="password"
                            required
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all text-gray-900"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        />
                    </div>

                    {terminatedInfo && (
                        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 space-y-1">
                            <p className="text-sm font-black text-red-700">⛔ Account Terminated</p>
                            <p className="text-xs text-red-500 font-medium">Your internship account has been terminated and access has been revoked.</p>
                            <p className="text-xs font-bold text-red-600 mt-1">
                                For queries, contact:{" "}
                                <a href={`mailto:${terminatedInfo.contact}`} className="underline hover:text-red-800">
                                    {terminatedInfo.contact}
                                </a>
                            </p>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3.5 bg-black text-white font-bold rounded-xl hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-gray-900/10 active:scale-[0.98]"
                    >
                        {loading ? "Signing in..." : "Sign In"}
                    </button>
                </form>

                <div className="text-center text-sm text-gray-500">
                    Don&apos;t have an account?{" "}
                    <Link href="/internship/register" className="text-black font-semibold hover:underline">
                        Register
                    </Link>
                </div>
            </div>
        </div>
    );
}
