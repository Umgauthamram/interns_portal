"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
    LayoutDashboard,
    BookOpen,
    FolderGit2,
    Calendar,
    MessageSquare,
    Settings,
    LogOut,
    Sparkles,
    Award
} from "lucide-react";
import { motion } from "motion/react";

const sidebarItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: BookOpen, label: "LiveBook", href: "/dashboard/livebook" },
    { icon: FolderGit2, label: "Projects", href: "/dashboard/projects" },
    { icon: Calendar, label: "Schedule", href: "/dashboard/schedule" },
    { icon: Award, label: "Certificate", href: "/dashboard/certificate" },
    { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

export function Sidebar() {
    const pathname = usePathname();
    const router = useRouter();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            const email = localStorage.getItem("userEmail");
            if (email) {
                try {
                    const res = await fetch(`/api/user/me?email=${email}`);
                    if (res.ok) {
                        const data = await res.json();
                        setUser(data);
                    }
                } catch (error) {
                    console.error("Failed to fetch user data:", error);
                }
            }
        };
        fetchUser();
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        router.push("/login");
    };

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-white text-gray-900 flex flex-col z-50 border-r border-gray-200 shadow-sm">
            {/* Logo Area */}
            <div className="p-8 pb-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center shadow-lg shadow-gray-900/10">
                    <Sparkles className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h1 className="text-lg font-bold tracking-tight text-gray-900">Intern<span className="text-black">Portal</span></h1>
                    <p className="text-xs text-gray-500 font-medium">Student Access</p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                {sidebarItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="relative group block"
                        >
                            <div className={`relative px-4 py-3.5 flex items-center gap-3 rounded-xl transition-all duration-300 z-10 ${isActive ? 'text-white font-semibold' : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'}`}>
                                <item.icon className={`w-5 h-5 transition-colors ${isActive ? 'text-white' : 'group-hover:text-gray-900'}`} strokeWidth={isActive ? 2.5 : 2} />
                                <span>{item.label}</span>
                            </div>

                            {/* Active Indicator (Light Blue background) */}
                            {isActive && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute inset-0 bg-black rounded-xl border border-gray-900"
                                    initial={false}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* User Profile / Logout */}
            <div className="p-4 m-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="flex items-center gap-3 mb-4 p-2">
                    <div className="w-10 h-10 flex items-center justify-center text-white font-bold rounded-full bg-gradient-to-br from-amber-400 to-orange-500 border-2 border-white shadow-md">
                        {user?.fullName?.charAt(0) || "U"}
                    </div>
                    <div className="overflow-hidden">
                        <p className="text-sm font-bold text-gray-900 truncate">{user?.fullName || "Loading..."}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.track || "..."}</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative group/report">
                        <button
                            onClick={() => window.dispatchEvent(new CustomEvent('open-report-issue'))}
                            className="w-11 h-11 bg-black text-white rounded-full flex items-center justify-center shadow-xl hover:scale-105 active:scale-95 transition-all z-10 relative"
                            title="Report Issue"
                        >
                            <MessageSquare className="w-5.5 h-5.5" />

                        </button>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex-1 py-3 px-5 bg-gray-900 hover:bg-black text-[10px] font-black font-semibold tracking-widest text-white rounded-xl transition-all flex items-center justify-center gap-2 group shadow-lg"
                    >
                        <LogOut className="w-3.5 h-3.5" />
                        Log out
                    </button>
                </div>
            </div>
        </aside>
    );
}
