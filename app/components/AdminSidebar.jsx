
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
    { icon: Settings, label: "Settings", href: "/admin/settings" },
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
            <div className="p-4 m-4 bg-gray-50 rounded-2xl border border-gray-100">
                <div className="flex items-center gap-3 mb-4 p-2">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-black border-2 border-white shadow-md"></div>
                    <div className="overflow-hidden">
                        <p className="text-sm font-bold text-gray-900 truncate">Admin User</p>
                        <p className="text-xs text-gray-500 truncate">System Admin</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => window.dispatchEvent(new CustomEvent('open-report-issue'))}
                        className="flex-1 py-2 px-3 bg-white hover:bg-gray-50 text-[10px] font-black uppercase tracking-widest text-gray-400 rounded-xl border border-gray-200 transition-all flex items-center justify-center gap-2"
                    >
                        <Settings className="w-3.5 h-3.5" />
                        Report
                    </button>
                    <button
                        onClick={handleLogout}
                        className="flex-1 py-2 px-3 bg-white hover:bg-gray-50 text-[10px] font-black uppercase tracking-widest text-gray-400 rounded-xl border border-gray-200 transition-all flex items-center justify-center gap-2"
                    >
                        <LogOut className="w-3.5 h-3.5" />
                        Exit
                    </button>
                </div>
            </div>
        </aside>
    );
}
