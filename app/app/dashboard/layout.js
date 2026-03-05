"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "@/components/Sidebar";
import { toast } from "react-hot-toast";

export default function DashboardLayout({ children }) {
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            const email = typeof window !== 'undefined' ? localStorage.getItem('userEmail') : null;
            const role = typeof window !== 'undefined' ? localStorage.getItem('userRole') : null;

            if (!email) {
                toast.error("Please login first.");
                router.push("/login");
                return;
            }

            // Admin users should go to admin panel
            if (role === 'admin') {
                router.push("/admin");
                return;
            }

            // Verify with server
            try {
                const res = await fetch(`/api/user/me?email=${email}`);
                if (res.ok) {
                    const user = await res.json();
                    if (user.role === 'admin') {
                        router.push("/admin");
                        return;
                    }
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
        <div className="flex bg-gray-50 min-h-screen relative">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content Area */}
            <main className="flex-1 md:ml-64 transition-all duration-300">
                <div className="p-8 max-w-7xl mx-auto space-y-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
