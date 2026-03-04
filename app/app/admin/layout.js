
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AdminSidebar } from "@/components/AdminSidebar";
import { toast } from "react-hot-toast";

export default function AdminLayout({ children }) {
    const router = useRouter();
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        const role = typeof window !== 'undefined' ? localStorage.getItem('userRole') : null;
        const email = typeof window !== 'undefined' ? localStorage.getItem('userEmail') : null;

        if (!role || !email || (role !== 'admin' && role !== 'developer')) {
            toast.error("Unauthorized Access: Admins only.");
            router.push("/login?redirect=/admin");
        } else {
            setAuthorized(true);
        }
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
