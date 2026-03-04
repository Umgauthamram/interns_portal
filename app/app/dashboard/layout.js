import { Sidebar } from "@/components/Sidebar";

export default function DashboardLayout({ children }) {
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
