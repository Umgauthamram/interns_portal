
"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
    LayoutDashboard,
    BookOpen,
    Users,
    Layout,
    BarChart2,
    Settings,
    LogOut,
    Shield,
    Calendar,
    UserPlus,
    Bug
} from "lucide-react";
import { motion } from "motion/react";

const sidebarItems = [
    { icon: LayoutDashboard, label: "Overview", href: "/admin" },
    { icon: Layout, label: "Projects", href: "/admin/projects" },
    { icon: Users, label: "Users", href: "/admin/users" },
    { icon: UserPlus, label: "Manage Admins", href: "/admin/manage-admins" },
    { icon: Layout, label: "Content", href: "/admin/content" },
    { icon: Calendar, label: "Schedule", href: "/admin/schedule" },
    { icon: Bug, label: "Tickets", href: "/admin/tickets" },
];

export function AdminSidebar() {
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = () => {
        localStorage.clear();
        document.cookie = "userRole=; path=/; max-age=0";
        document.cookie = "userEmail=; path=/; max-age=0";
        router.push("/login");
    };

    return (
        <aside className="fixed left-0 top-0 h-screen w-64 bg-white text-gray-900 flex flex-col z-50 border-r border-gray-200 shadow-sm">
            {/* Logo Area */}
            <div className="p-8 pb-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center shadow-lg shadow-gray-900/10">
                    <Shield className="w-6 h-6 text-white" />
                </div>
                <div>
                    <h1 className="text-lg font-bold tracking-tight text-gray-900">Admin<span className="text-black">Panel</span></h1>
                    <p className="text-xs text-gray-500 font-medium">Administrator Access</p>
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

                            {/* Active Indicator */}
                            {isActive && (
                                <motion.div
                                    layoutId="activeTabAdmin"
                                    className="absolute inset-0 bg-black rounded-xl border border-gray-900"
                                    initial={false}
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                        </Link>
                    );
                })}
            </nav>

            {/* Admin Profile / Logout */}
            <div className="p-3 mx-4 mb-4 bg-gray-50 rounded-[2rem] border border-gray-100 flex items-center justify-between shadow-sm">
                <button
                    onClick={() => router.push('/admin/settings')}
                    className="w-12 h-12 rounded-full bg-blue-50 shadow-md border-[3px] border-white flex items-center justify-center cursor-pointer hover:scale-105 transition-transform overflow-hidden"
                    title="Settings"
                >
                    <img src="https://api.dicebear.com/7.x/micah/svg?seed=admin&backgroundColor=transparent" alt="Admin" className="w-full h-full object-cover scale-110" />
                </button>
                <button
                    onClick={handleLogout}
                    className="h-12 px-5 flex items-center justify-center gap-2 bg-white hover:bg-red-50 text-gray-400 hover:text-red-500 rounded-[1.5rem] border border-gray-200 transition-all shadow-sm flex-1 ml-3"
                    title="Logout"
                >
                    <span className="text-[10px] font-black uppercase tracking-widest hidden lg:block">Logout</span>
                    <LogOut className="w-4 h-4" />
                </button>
            </div>
        </aside>
    );
}
