
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminSidebar } from "@/components/AdminSidebar";
import { toast } from "react-hot-toast";

export default function AdminLayout({ children }) {
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            const email = typeof window !== 'undefined' ? localStorage.getItem('userEmail') : null;
            if (!email) {
                toast.error("Unauthorized Access: Please log in.");
                router.push("/login?redirect=/admin");
                return;
            }

            // Verify with server
            try {
                const res = await fetch(`/api/user/me?email=${email}`);
                if (res.ok) {
                    const user = await res.json();
                    if (user.role !== 'admin') {
                        toast.error("Unauthorized Access: Admins only.");
                        localStorage.clear();
                        document.cookie = "userRole=; path=/; max-age=0";
                        document.cookie = "userEmail=; path=/; max-age=0";
                        router.push("/login");
                        return;
                    }
                    localStorage.setItem('userRole', 'admin');
                    document.cookie = "userRole=admin; path=/; max-age=10800";
                    setAuthorized(true);
                } else {
                    localStorage.clear();
                    document.cookie = "userRole=; path=/; max-age=0";
                    document.cookie = "userEmail=; path=/; max-age=0";
                    router.push("/login");
                }
            } catch (error) {
                localStorage.clear();
                document.cookie = "userRole=; path=/; max-age=0";
                document.cookie = "userEmail=; path=/; max-age=0";
                router.push("/login");
            }
        };

        checkAuth();
    }, [router]);

    if (!authorized) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
            </div>
        );
    }

    return (
        <div className="flex bg-transparent min-h-screen relative">
            {/* Admin Sidebar */}
            <AdminSidebar />

            {/* Main Content Area */}
            <main className="flex-1 md:ml-64 transition-all duration-300">
                <div className="p-8 max-w-7xl mx-auto space-y-8 animate-fade-in">
                    {children}
                </div>
            </main>
        </div>
    );
}
