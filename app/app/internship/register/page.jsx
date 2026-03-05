"use client";

import { Sun, ChevronRight, ChevronLeft, Check } from "lucide-react";
import Link from "next/link";
import Script from "next/script";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import { WarpBackground } from "@/components/ui/warp-background";
import { DropdownDatePicker } from "@/components/ui/dropdown-date-picker";

export default function RegistrationPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const totalSteps = 4;

    const prices = {
        "3-months": "2,999",
        "4-months": "3,999",
        "6-months": "5,999"
    };

    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        dob: "",
        phone: "",
        gender: "",
        address: "",
        track: "",
        duration: "",
        mode: "remote",
        expandedRnD: false // New state for accordion
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    useEffect(() => {
        const userEmail = typeof window !== 'undefined' ? localStorage.getItem("userEmail") : null;
        const userRole = typeof window !== 'undefined' ? localStorage.getItem("userRole") : null;
        if (userEmail && userRole) {
            router.push(userRole === 'admin' ? '/admin' : '/dashboard');
        }
    }, [router]);

    const handleNext = (e) => {
        e.preventDefault();

        if (step === 1) {
            if (!formData.fullName || !formData.email || !formData.password) {
                toast.error("Please fill in all fields");
                return;
            }
        }
        if (step === 2) {
            if (!formData.dob || !formData.phone || !formData.gender || !formData.address) {
                toast.error("Please fill in all details");
                return;
            }
        }
        if (step === 3) {
            if (!formData.track || !formData.duration) {
                toast.error("Please select track and duration");
                return;
            }
        }

        if (step < totalSteps) {
            setStep(step + 1);
        }
    };

    const handleBack = (e) => {
        e.preventDefault();
        if (step > 1) {
            setStep(step - 1);
        }
    };

    const handlePayment = async () => {
        const loadingToast = toast.loading("Processing Registration...");

        try {
            const response = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                toast.dismiss(loadingToast);
                toast.success("Registration Successful! Please log in.");

                setTimeout(() => {
                    window.location.href = "/login";
                }, 1500);
            } else {
                toast.dismiss(loadingToast);
                const errorData = await response.json();
                toast.error(errorData.message || "Registration Failed");
            }
        } catch (error) {
            toast.dismiss(loadingToast);
            console.error("Registration Error:", error);
            toast.error("An error occurred. Please try again.");
        }
    };



    const handleSubmit = (e) => {
        e.preventDefault();
        if (step === 4) {
            handlePayment();
        } else {
            // Fallback for steps 1-3
            console.log(formData);
        }
    };

    return (
        <div className="relative min-h-screen w-screen bg-slate-50 font-sans flex items-center justify-center overflow-hidden">

            {/* Premium Animated Gradient Blobs */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] bg-purple-300/40 rounded-full mix-blend-multiply filter blur-[80px] opacity-70 animate-pulse" style={{animationDuration: '7s'}}></div>
                <div className="absolute top-[20%] right-[-10%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] bg-sky-300/40 rounded-full mix-blend-multiply filter blur-[80px] opacity-70 animate-pulse" style={{animationDuration: '5s'}}></div>
                <div className="absolute bottom-[-20%] left-[20%] w-[70vw] h-[70vw] max-w-[900px] max-h-[900px] bg-indigo-300/40 rounded-full mix-blend-multiply filter blur-[80px] opacity-70 animate-pulse" style={{animationDuration: '9s'}}></div>
            </div>

            <div className="w-full max-w-3xl mx-auto space-y-8 bg-white/70 backdrop-blur-3xl lg:px-12 pb-12 pt-16 rounded-[2.5rem] shadow-[0_8px_40px_rgba(0,0,0,0.08)] border border-white/60 min-h-[500px] flex flex-col justify-center relative z-10 transition-all overflow-hidden m-4">

                {/* Top Progress Bar */}
                <div className="absolute top-0 left-0 w-full bg-gray-100 h-1.5">
                    <div
                        className="bg-black h-full transition-all duration-500 ease-in-out"
                        style={{ width: `${(step / totalSteps) * 100}%` }}
                    ></div>
                </div>

                {/* Header */}
                <div className="text-center space-y-4 -mt-7 ">
                    <h2 className="text-3xl font-bold text-black tracking-tight">
                        {step === 1 && "Personal Details"}
                        {step === 2 && "Profile Information"}
                        {step === 3 && "Preferences"}
                        {step === 4 && "Review & Payment"}
                    </h2>
                    <p className="text-gray-500 -mt-4">
                        {step === 1 && "Let's start with your basic information."}
                        {step === 2 && "Tell us a bit more about yourself."}
                        {step === 3 && "Customize your internship experience."}
                        {step === 4 && "Finalize your registration."}
                    </p>
                </div>

                <form className="space-y-6 flex-1 flex flex-col justify-between" onSubmit={handleSubmit}>
                    <div className="space-y-6">
                        {/* Step 1: Name & Email */}
                        {step === 1 && (
                            <div className="space-y-6 animate-fade-in max-w-2xl mx-auto w-full">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Full Name</label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleChange}
                                        placeholder="John Doe"
                                        required
                                        className="w-full text-black px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                                        autoFocus
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="john@example.com"
                                        required
                                        className="w-full text-black px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Password</label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="Create a password"
                                        required
                                        className="w-full text-black px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Step 2: DOB, Phone, Gender, Address */}
                        {step === 2 && (
                            <div className="space-y-6 animate-fade-in max-w-3xl mx-auto w-full">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Date of Birth</label>
                                        <DropdownDatePicker
                                            selected={formData.dob}
                                            onSelect={(date) => {
                                                if (date) {
                                                    const offsetDate = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
                                                    const dateString = offsetDate.toISOString().split('T')[0];
                                                    setFormData(prev => ({ ...prev, dob: dateString }));
                                                } else {
                                                    setFormData(prev => ({ ...prev, dob: "" }));
                                                }
                                            }}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Phone Number</label>
                                        <input
                                            type="tel"
                                            required
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="+1 (555) 000-0000"
                                            className="w-full text-black px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Gender</label>
                                    <select
                                        required
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleChange}
                                        className="w-full text-black px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all bg-white"
                                    >
                                        <option value="">Select Gender</option>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                        <option value="Other">Other</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Current Address</label>
                                    <textarea
                                        required
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        rows="2"
                                        placeholder="123 Main St, City, Country"
                                        className="w-full text-black px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all resize-none"
                                    ></textarea>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Internship Preferences */}
                        {step === 3 && (
                            <div className="space-y-6 animate-fade-in max-w-4xl mx-auto w-full">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Interest Track</label>
                                    <select
                                        required
                                        value={
                                            ['Cybersecurity', 'Blockchain', 'Robotics & Autonomous System', 'Semiconductor and Advanced Chip Design', 'Biotechnology and Bioengineering', 'Renewable Energy and Advanced Materials'].includes(formData.track)
                                                ? "Research and Development"
                                                : formData.track
                                        }
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            if (val === "Research and Development") {
                                                setFormData(prev => ({ ...prev, track: "Research and Development" }));
                                            } else {
                                                handleChange({ target: { name: 'track', value: val } });
                                            }
                                        }}
                                        className="w-full text-black px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all bg-white"
                                    >
                                        <option value="">Select a Track</option>
                                        <option value="Web Development">Web Development</option>
                                        <option value="App Development (NextJS, Flutter)">App Development (NextJS, Flutter)</option>
                                        <option value="Blockchain/Web3">Blockchain/Web3</option>
                                        <option value="Gen AI">Gen AI</option>
                                        <option value="AI/ML">AI/ML</option>
                                        <option value="Research and Development">Research and Development</option>
                                    </select>
                                </div>

                                {/* Conditional R&D Dropdown */}
                                {(formData.track === "Research and Development" || ['Cybersecurity', 'Blockchain', 'Robotics & Autonomous System', 'Semiconductor and Advanced Chip Design', 'Biotechnology and Bioengineering', 'Renewable Energy and Advanced Materials'].includes(formData.track)) && (
                                    <div className="space-y-2 animate-fade-in">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Specialization</label>
                                        <select
                                            required
                                            name="track"
                                            value={formData.track === "Research and Development" ? "" : formData.track}
                                            onChange={handleChange}
                                            className="w-full text-black px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all bg-white"
                                        >
                                            <option value="">Select Specialization</option>
                                            <option value="Cybersecurity">Cybersecurity</option>
                                            <option value="Blockchain">Blockchain</option>
                                            <option value="Robotics & Autonomous System">Robotics & Autonomous System</option>
                                            <option value="Semiconductor and Advanced Chip Design">Semiconductor and Advanced Chip Design</option>
                                            <option value="Biotechnology and Bioengineering">Biotechnology and Bioengineering</option>
                                            <option value="Renewable Energy and Advanced Materials">Renewable Energy and Advanced Materials</option>
                                        </select>
                                    </div>
                                )}

                                <div className="space-y-4">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Internship Duration</label>
                                    <div className="grid grid-cols-3 gap-4">
                                        {['3-months', '4-months', '6-months'].map((duration) => (
                                            <button
                                                key={duration}
                                                type="button"
                                                onClick={() => handleChange({ target: { name: 'duration', value: duration } })}
                                                className={`w-full py-4 px-2 rounded-xl border transition-all duration-300 font-medium text-sm flex items-center justify-center gap-2
                                                        ${formData.duration === duration
                                                        ? 'bg-black text-white border-black shadow-lg scale-[1.02]'
                                                        : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400 hover:bg-gray-50'
                                                    }`}
                                            >
                                                {formData.duration === duration && <Check className="w-4 h-4 shrink-0" />}
                                                {duration.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase())}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 4: Payment Summary */}
                        {step === 4 && (
                            <div className="space-y-6 animate-fade-in max-w-lg mx-auto w-full">
                                <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 space-y-4">
                                    <h3 className="text-lg font-bold text-black border-b border-gray-200 pb-2">Order Summary</h3>

                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-600">Full Name</span>
                                        <span className="font-medium text-black">{formData.fullName}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-600">Track</span>
                                        <span className="font-medium text-black">{formData.track}</span>
                                    </div>
                                    <div className="flex justify-between items-center text-sm">
                                        <span className="text-gray-600">Duration</span>
                                        <span className="font-medium text-black">{formData.duration.replace('-', ' ')}</span>
                                    </div>

                                    <div className="pt-4 border-t border-gray-200 flex justify-between items-center">
                                        <span className="text-base font-bold text-black">Total to Pay</span>
                                        <span className="text-2xl font-bold text-black">₹{prices[formData.duration]}</span>
                                    </div>
                                </div>

                                <div className="bg-blue-50 p-4 rounded-lg flex items-start gap-3 border border-blue-100">
                                    <div className="bg-blue-100 p-1 rounded-full text-blue-600 mt-0.5">
                                        <Check className="w-4 h-4" />
                                    </div>
                                    <p className="text-xs text-blue-800">
                                        After secure payment via Razorpay, your account credentials will be emailed to <strong>{formData.email}</strong>.
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Navigation Buttons */}
                    <div className={`grid grid-cols-3 gap-4 pt-8 max-w-2xl mx-auto w-full`}>
                        {step > 1 ? (
                            <button
                                type="button"
                                onClick={handleBack}
                                className="col-span-1 bg-gray-100 hover:bg-gray-200 text-black font-bold py-4 rounded-lg transition-all flex items-center justify-center gap-2"
                            >
                                <ChevronLeft className="w-5 h-5" /> Back
                            </button>
                        ) : (
                            null
                        )}

                        {step < totalSteps ? (
                            <button
                                type="button"
                                onClick={handleNext}
                                className={`${step === 1 ? 'col-span-3' : 'col-span-2'} bg-black hover:bg-neutral-800 text-white font-bold py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2`}
                            >
                                Next Step <ChevronRight className="w-5 h-5" />
                            </button>
                        ) : (
                            <button
                                type="submit"
                                className="col-span-2 bg-black hover:bg-neutral-800 text-white font-bold py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
                            >
                                {step === 4 ? `Pay ₹${prices[formData.duration] || '0'}` : 'Create Account'} <ChevronRight className="w-5 h-5" />
                            </button>
                        )}
                    </div>

                    <p className="text-center text-sm text-gray-600 mt-4">
                        Already have an account?{" "}
                        <Link href="/login" className="text-black hover:underline font-semibold">
                            Log in
                        </Link>
                    </p>
                </form>
            </div >
            <Script src="https://checkout.razorpay.com/v1/checkout.js" />
        </div >
    );
}
