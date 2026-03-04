"use client";

import { Award, Download, ExternalLink, Calendar, ShieldCheck, Mail, Info } from "lucide-react";
import { motion } from "framer-motion";

import { useState, useEffect } from "react";

export default function CertificatePage() {
    const [issuedCertificates, setIssuedCertificates] = useState([]);

    useEffect(() => {
        const fetchCertificates = async () => {
            const email = localStorage.getItem("userEmail");
            if (!email) return;
            try {
                const res = await fetch(`/api/projects?email=${email}`);
                if (res.ok) {
                    const data = await res.json();
                    const completed = data
                        .filter(p => p.progress === 100 || p.status === 'Approved')
                        .map((p, i) => ({
                            id: `CERT-${new Date(p.updatedAt || Date.now()).getFullYear()}-${String(i + 1).padStart(3, '0')}`,
                            title: p.projectName,
                            issuedDate: new Date(p.updatedAt || Date.now()).toLocaleDateString("en-US", { year: 'numeric', month: 'short', day: 'numeric' }),
                            issuer: "Umgauthamram",
                            type: "Completion",
                            image: "/cert-preview.png"
                        }));
                    setIssuedCertificates(completed);
                }
            } catch (error) {
                console.error("Failed to fetch certificates:", error);
            }
        };
        fetchCertificates();
    }, []);

    const handleDownload = (id) => {
        alert(`Downloading Certificate ${id}...`);
    };

    const handleVerify = (id) => {
        alert(`Verifying Certificate ${id} on public ledger...`);
    };

    return (
        <div className="relative min-h-screen p-6">
            <div className="relative z-10 max-w-6xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-gray-50 pb-8">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.4em] text-gray-300">
                            <ShieldCheck className="w-3 h-3" /> Encrypted Credentials
                        </div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tighter uppercase leading-none">
                            Certifications
                        </h1>
                    </div>
                </div>

                {issuedCertificates.length > 0 ? (
                    <div className="space-y-4">
                        {issuedCertificates.map((cert) => (
                            <motion.div
                                key={cert.id}
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="group bg-white rounded-3xl border border-gray-100/50 shadow-sm hover:shadow-2xl hover:border-black/10 transition-all overflow-hidden flex flex-col md:flex-row items-stretch"
                            >
                                <div className="md:w-64 bg-gray-50 relative overflow-hidden flex items-center justify-center p-4 border-r border-gray-50">
                                    <div className="w-full aspect-[4/3] bg-white rounded-2xl shadow-inner border border-gray-100 flex flex-col items-center justify-center p-4 relative group-hover:scale-[1.02] transition-transform">
                                        <Award className="w-8 h-8 text-black opacity-10 mb-2" />
                                        <div className="w-12 h-0.5 bg-black/5 mb-1" />
                                        <div className="w-8 h-0.5 bg-black/5" />

                                        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                            <div className="bg-white/90 p-2 rounded-lg shadow-xl">
                                                <ExternalLink className="w-4 h-4 text-black" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex-1 p-8 flex flex-col justify-between">
                                    <div className="flex justify-between items-start">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <h3 className="text-lg font-black text-gray-900 uppercase tracking-tighter">{cert.title}</h3>
                                                <div className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded-full text-[7px] font-black uppercase border border-emerald-100">
                                                    Official
                                                </div>
                                            </div>
                                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Metadata Hash: {cert.id}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleDownload(cert.id)}
                                                className="px-4 py-2 bg-gray-50 text-gray-900 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all border border-gray-100 shadow-sm"
                                            >
                                                Download PDF
                                            </button>
                                            <button
                                                onClick={() => handleVerify(cert.id)}
                                                className="px-4 py-2 bg-black text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-lg"
                                            >
                                                Verify Chain
                                            </button>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-8 pt-4">
                                        <div className="flex flex-col">
                                            <span className="text-[7px] font-black text-gray-300 uppercase tracking-widest">Date Issued</span>
                                            <div className="flex items-center gap-1.5 mt-0.5">
                                                <Calendar className="w-3 h-3 text-gray-400" />
                                                <span className="text-[11px] font-bold text-gray-600">{cert.issuedDate}</span>
                                            </div>
                                        </div>
                                        <div className="w-px h-6 bg-gray-100" />
                                        <div className="flex flex-col">
                                            <span className="text-[7px] font-black text-gray-300 uppercase tracking-widest">Verified by</span>
                                            <div className="flex items-center gap-1.5 mt-0.5">
                                                <ShieldCheck className="w-3 h-3 text-emerald-500" />
                                                <span className="text-[11px] font-bold text-gray-900">{cert.issuer}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-[3rem] border-2 border-dashed border-gray-50 p-20 text-center space-y-6">
                        <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto shadow-inner text-gray-200">
                            <Award className="w-8 h-8" />
                        </div>
                        <div className="space-y-2">
                            <h3 className="text-xl font-black text-gray-900 uppercase tracking-tighter">No Protocols Certified</h3>
                            <p className="text-[11px] text-gray-400 max-w-xs mx-auto font-medium">Your cryptographic achievements will manifest here once project validation is cleared.</p>
                        </div>
                    </div>
                )}


            </div>
        </div>
    );
}
