"use client";

import { useState, useEffect } from "react";
import { UserPlus, Bug, CheckCircle, XCircle, RefreshCw, LogOut } from "lucide-react";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function DeveloperDashboard() {
    const router = useRouter();
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [authorized, setAuthorized] = useState(false);

    // Form state
    const [adminForm, setAdminForm] = useState({
        fullName: "",
        email: "",
        phone: "",
        track: "Administration",
        duration: "Indefinite",
        password: "TempPassword123!" // Default password for new admins
    });

    useEffect(() => {
        checkAuth();
    }, []);

    const checkAuth = async () => {
        const email = typeof window !== 'undefined' ? localStorage.getItem('userEmail') : null;

        if (!email) {
            toast.error("Please login first");
            router.push("/login");
            return;
        }

        try {
            const res = await fetch(`/api/user/me?email=${email}`);
            if (res.ok) {
                const user = await res.json();
                if (user.role === 'developer' || user.role === 'admin') {
                    setAuthorized(true);
                    fetchTickets();
                } else {
                    toast.error("Unauthorized Access");
                    router.push("/dashboard");
                }
            } else {
                router.push("/login");
            }
        } catch (error) {
            router.push("/login");
        }
    };

    const fetchTickets = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/tickets");
            if (res.ok) {
                const data = await res.json();
                setTickets(data);
            }
        } catch (error) {
            console.error("Failed to fetch tickets", error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateAdmin = async (e) => {
        e.preventDefault();
        const tid = toast.loading("Creating Admin...");
        try {
            // Updated to use the new registration endpoint or seed logic? 
            // We previously made /api/admin/create. Let's use that but verify it handles password.
            // Wait, /api/admin/create used User.create({...body, role:'admin'}).
            // We need to hash password there too if we send it.
            // Or use /api/register with role override? /api/register enforces defaults usually.
            // I'll stick to /api/admin/create but I should ensure it hashes password if sent.
            // Step 1092 creation of /api/admin/create did NOT hash password.
            // I should update /api/admin/create to hash password.

            const res = await fetch("/api/admin/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(adminForm),
            });

            const data = await res.json();
            if (res.ok) {
                toast.success("Admin created successfully!", { id: tid });
                setAdminForm(prev => ({ ...prev, fullName: "", email: "", phone: "" }));
            } else {
                toast.error(data.message || "Failed to create admin", { id: tid });
            }
        } catch (error) {
            toast.error("Error creating admin", { id: tid });
        }
    };

    const handleStatusUpdate = async (id, newStatus) => {
        const tid = toast.loading("Updating Status...");
        try {
            const res = await fetch("/api/tickets", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, status: newStatus }),
            });

            if (res.ok) {
                toast.success("Status updated!", { id: tid });
                fetchTickets();
            } else {
                toast.error("Update failed", { id: tid });
            }
        } catch (error) {
            toast.error("Error updating status", { id: tid });
        }
    };

    if (!authorized) {
        return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-black"></div></div>;
    }

    return (
        <div className="min-h-screen bg-gray-50 p-8 space-y-8">
            <h1 className="text-3xl font-bold text-gray-900 flex justify-between items-center">
                Developer Console
                <div className="flex gap-2">
                    <button
                        onClick={fetchTickets}
                        className="p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-all text-gray-500 hover:text-blue-600"
                        title="Refresh Tickets"
                    >
                        <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
                    </button>
                    <button
                        onClick={() => {
                            localStorage.removeItem('userEmail');
                            localStorage.removeItem('userRole');
                            router.push('/login');
                        }}
                        className="p-2 bg-white rounded-full shadow-sm hover:shadow-md transition-all text-red-500 hover:text-red-600"
                        title="Logout"
                    >
                        <LogOut className="w-5 h-5" />
                    </button>
                </div>
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* User Reports Section */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 h-fit">
                    <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
                        <Bug className="w-5 h-5 text-red-500" />
                        User Reports & Tickets
                    </h2>

                    {loading && tickets.length === 0 ? (
                        <p>Loading tickets...</p>
                    ) : tickets.length === 0 ? (
                        <p className="text-gray-500 italic">No tickets reported yet.</p>
                    ) : (
                        <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                            {tickets.map((ticket) => (
                                <div key={ticket._id} className="p-4 border border-gray-100 rounded-xl bg-gray-50 hover:bg-white transition-colors">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className={`px-2 py-1 text-xs font-bold rounded-full ${ticket.type === 'Report a Bug' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'}`}>
                                            {ticket.type}
                                        </span>
                                        <div className="flex flex-col items-end gap-1">
                                            <span className="text-xs text-gray-400">
                                                {new Date(ticket.createdAt).toLocaleDateString()}
                                            </span>
                                            <select
                                                className="text-xs bg-white border border-gray-200 rounded px-1 py-0.5 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                value={ticket.status}
                                                onChange={(e) => handleStatusUpdate(ticket._id, e.target.value)}
                                            >
                                                <option value="Open">Open</option>
                                                <option value="In Progress">In Progress</option>
                                                <option value="Resolved">Resolved</option>
                                            </select>
                                        </div>
                                    </div>
                                    <p className="text-gray-900 text-sm mb-2 font-medium">{ticket.description}</p>
                                    <div className="text-xs text-gray-500 flex justify-between items-center pt-2 border-t border-gray-100">
                                        <span>By: {ticket.reportedBy || "Anonymous"}</span>
                                        <span className={`font-bold capitalize ${ticket.status === 'Resolved' ? 'text-green-600' :
                                                ticket.status === 'In Progress' ? 'text-amber-600' : 'text-gray-600'
                                            }`}>
                                            {ticket.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Add Admin Section */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 h-fit">
                    <h2 className="text-xl font-bold flex items-center gap-2 mb-4">
                        <UserPlus className="w-5 h-5 text-blue-600" />
                        Add New Admin
                    </h2>

                    <form onSubmit={handleCreateAdmin} className="space-y-4">
                        <div>
                            <label className="text-sm font-semibold text-gray-700">Full Name</label>
                            <input
                                className="w-full px-4 py-2 mt-1 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                placeholder="Admin Name"
                                value={adminForm.fullName}
                                onChange={e => setAdminForm({ ...adminForm, fullName: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-gray-700">Email</label>
                            <input
                                className="w-full px-4 py-2 mt-1 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                placeholder="admin@example.com"
                                type="email"
                                value={adminForm.email}
                                onChange={e => setAdminForm({ ...adminForm, email: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-gray-700">Phone</label>
                            <input
                                className="w-full px-4 py-2 mt-1 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                placeholder="+1 234 567 890"
                                value={adminForm.phone}
                                onChange={e => setAdminForm({ ...adminForm, phone: e.target.value })}
                                required
                            />
                        </div>
                        <div>
                            <label className="text-sm font-semibold text-gray-700">Default Password</label>
                            <input
                                className="w-full px-4 py-2 mt-1 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                                placeholder="Password"
                                type="password"
                                value={adminForm.password}
                                onChange={e => setAdminForm({ ...adminForm, password: e.target.value })}
                                required
                            />
                        </div>

                        <button type="submit" className="w-full bg-black text-white py-2 rounded-xl font-bold hover:bg-gray-800 transition-colors">
                            Create Admin User
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
