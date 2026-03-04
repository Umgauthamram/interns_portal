"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "react-hot-toast";

export function SessionManager() {
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const checkSession = () => {
            // skip check on login/register pages
            if (pathname === "/login" || pathname === "/internship/register" || pathname === "/") {
                return;
            }

            const loginTimestamp = localStorage.getItem("loginTimestamp");
            if (loginTimestamp) {
                const now = Date.now();
                const threeHoursInMs = 3 * 60 * 60 * 1000;

                if (now - parseInt(loginTimestamp) > threeHoursInMs) {
                    localStorage.clear();
                    toast.error("Session expired. Please log in again.");
                    router.push("/login");
                }
            }
        };

        // Check on mount and on route change
        checkSession();

        // Optional: periodic check every minute
        const interval = setInterval(checkSession, 60000);
        return () => clearInterval(interval);
    }, [pathname, router]);

    return null;
}
