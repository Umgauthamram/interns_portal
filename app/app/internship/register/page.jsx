"use client";

import { Sun, ChevronRight, ChevronLeft, Check, Upload, FileText } from "lucide-react";
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
    const totalSteps = 6;

    const prices = {
        "3-months": "12,000",
        "4-months": "16,000",
        "6-months": "24,000"
    };

    const [formData, setFormData] = useState({
        fullName: "", email: "", password: "",
        phone: "", gender: "", dob: "",
        aadhaarNumber: "", passportPhoto: "", aadhaarCard: "",
        educationQualification: "", courseName: "", collegeName: "", workingDetails: "", resumeDocument: "",
        track: "", duration: "", mode: "remote"
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileUpload = async (e, fieldName) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            toast.error("File size must be under 5MB");
            e.target.value = null;
            return;
        }

        // Map internal names to API folders
        const typeMap = {
            'passportPhoto': 'profile_photo',
            'aadhaarCard': 'Aadhar',
            'resumeDocument': 'resume'
        };

        const loadingToast = toast.loading(`Uploading ${fieldName.replace(/([A-Z])/g, ' $1').toLowerCase()}...`);

        try {
            const uploadFormData = new FormData();
            uploadFormData.append("file", file);
            uploadFormData.append("type", typeMap[fieldName] || fieldName);
            uploadFormData.append("email", formData.email || "anonymous");

            const res = await fetch("/api/upload", {
                method: "POST",
                body: uploadFormData,
            });

            const data = await res.json();

            if (res.ok) {
                setFormData(prev => ({ ...prev, [fieldName]: data.url }));
                toast.success("File uploaded successfully");
            } else {
                throw new Error(data.message || "Upload failed");
            }
        } catch (error) {
            console.error("Upload error:", error);
            toast.error("File upload failed. Please try again.");
            e.target.value = null;
        } finally {
            toast.dismiss(loadingToast);
        }
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

        if (step === 1 && (!formData.fullName || !formData.email || !formData.password)) {
            toast.error("Please fill in all details for this section."); return;
        }
        if (step === 2 && (!formData.phone || !formData.gender || !formData.dob)) {
            toast.error("Please fill in Mobile, Gender, and DOB."); return;
        }
        if (step === 3 && (!formData.aadhaarNumber || !formData.passportPhoto || !formData.aadhaarCard)) {
            toast.error("Please provide Aadhaar and upload both verification documents."); return;
        }
        if (step === 4 && (!formData.educationQualification || !formData.courseName)) {
            toast.error("Please fill in at least Qualification and Course."); return;
        }
        if (step === 5 && (!formData.track || !formData.duration)) {
            toast.error("Please select a track and duration."); return;
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
        if (!formData.resumeDocument) {
            toast.error("Please upload your CV / Resume before proceeding to payment.");
            return;
        }
        const amountStr = prices[formData.duration];
        if (!amountStr) {
            toast.error("Invalid duration selected.");
            return;
        }

        const amount = parseInt(amountStr.replace(",", ""));
        const loadingToast = toast.loading("Initializing Payment...");

        try {
            // 1. Create Order
            const orderRes = await fetch("/api/razorpay/order", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount, receipt: `reg_${formData.email}` }),
            });

            if (!orderRes.ok) throw new Error("Could not create payment order.");
            const order = await orderRes.json();
            toast.dismiss(loadingToast);

            // 2. Open Razorpay Modal
            const options = {
                key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: order.currency,
                name: "Internship Portal",
                description: `Registration for ${formData.track} - ${formData.duration}`,
                order_id: order.id,
                handler: async function (response) {
                    const verifyToast = toast.loading("Verifying Payment...");

                    try {
                        // 3. Verify Payment
                        const verifyRes = await fetch("/api/razorpay/verify", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                            }),
                        });

                        if (verifyRes.ok) {
                            toast.dismiss(verifyToast);
                            const finalLoading = toast.loading("Finalizing Registration...");

                            // 4. Final Registration
                            const regRes = await fetch("/api/register", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({
                                    ...formData,
                                    paymentId: response.razorpay_payment_id,
                                    orderId: response.razorpay_order_id
                                }),
                            });

                            if (regRes.ok) {
                                toast.dismiss(finalLoading);
                                toast.success("Registration Successful! Redirecting to dashboard...");

                                // Direct login: Store credentials and redirect
                                localStorage.setItem('userEmail', formData.email);
                                localStorage.setItem('userRole', 'intern');
                                localStorage.setItem('userName', formData.fullName);

                                setTimeout(() => { window.location.href = "/dashboard"; }, 1500);
                            } else {
                                toast.dismiss(finalLoading);
                                const errorData = await regRes.json();
                                toast.error(errorData.message || "Account creation failed. Contact support with payment ID.");
                            }
                        } else {
                            toast.dismiss(verifyToast);
                            toast.error("Payment verification failed.");
                        }
                    } catch (err) {
                        toast.dismiss(verifyToast);
                        console.error(err);
                        toast.error("An error occurred during verification.");
                    }
                },
                prefill: {
                    name: formData.fullName,
                    email: formData.email,
                    contact: formData.phone,
                },
                theme: { color: "#000000" },
                modal: {
                    ondismiss: function () {
                        toast.error("Payment cancelled.");
                    }
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (error) {
            toast.dismiss(loadingToast);
            console.error("Payment Error:", error);
            toast.error(error.message || "Failed to initiate payment.");
        }
    };



    const handleSubmit = (e) => {
        e.preventDefault();
        if (step === 6) {
            handlePayment();
        } else {
            console.log(formData);
        }
    };

    return (
        <div className="relative min-h-screen w-screen bg-slate-50 font-sans flex items-center justify-center overflow-hidden">

            {/* Premium Animated Gradient Blobs */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] max-w-[800px] max-h-[800px] bg-purple-300/40 rounded-full mix-blend-multiply filter blur-[80px] opacity-70 animate-pulse" style={{ animationDuration: '7s' }}></div>
                <div className="absolute top-[20%] right-[-10%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] bg-sky-300/40 rounded-full mix-blend-multiply filter blur-[80px] opacity-70 animate-pulse" style={{ animationDuration: '5s' }}></div>
                <div className="absolute bottom-[-20%] left-[20%] w-[70vw] h-[70vw] max-w-[900px] max-h-[900px] bg-indigo-300/40 rounded-full mix-blend-multiply filter blur-[80px] opacity-70 animate-pulse" style={{ animationDuration: '9s' }}></div>
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
                        {step === 3 && "Identity Verification"}
                        {step === 4 && "Education Details"}
                        {step === 5 && "Preferences"}
                        {step === 6 && "Review & Payment"}
                    </h2>
                    <p className="text-gray-500 -mt-4">
                        {step === 1 && "Let's start with your basic information."}
                        {step === 2 && "Enter your contact and demographic details."}
                        {step === 3 && "Securely verify your official identity."}
                        {step === 4 && "Tell us about your academic background."}
                        {step === 5 && "Customize your internship experience."}
                        {step === 6 && "Finalize your registration setup."}
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
                            </div>
                        )}

                        {/* Step 3: Identity Verification */}
                        {step === 3 && (
                            <div className="space-y-6 animate-fade-in max-w-2xl mx-auto w-full">
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Aadhaar Number</label>
                                    <input
                                        type="text"
                                        name="aadhaarNumber"
                                        value={formData.aadhaarNumber}
                                        onChange={handleChange}
                                        placeholder="1234 5678 9012"
                                        required
                                        className="w-full text-black px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Upload Passport Size Photo</label>
                                    <input
                                        type="file"
                                        accept="image/png, image/jpeg"
                                        onChange={(e) => handleFileUpload(e, 'passportPhoto')}
                                        required
                                        className="w-full text-black px-4 py-3 bg-white rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer text-sm"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Upload Copy of Aadhaar Card</label>
                                    <input
                                        type="file"
                                        accept="image/png, image/jpeg, application/pdf"
                                        onChange={(e) => handleFileUpload(e, 'aadhaarCard')}
                                        required
                                        className="w-full text-black px-4 py-3 bg-white rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer text-sm"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Step 4: Education & Professional Details */}
                        {step === 4 && (
                            <div className="space-y-6 animate-fade-in max-w-3xl mx-auto w-full">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Education Qualification</label>
                                        <select
                                            required
                                            name="educationQualification"
                                            value={formData.educationQualification}
                                            onChange={handleChange}
                                            className="w-full text-black px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all bg-white"
                                        >
                                            <option value="">Select Status</option>
                                            <option value="Pursuing">Pursuing</option>
                                            <option value="Completed">Completed</option>
                                            <option value="None">None</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Course / Degree Name</label>
                                        <input
                                            type="text"
                                            name="courseName"
                                            value={formData.courseName}
                                            onChange={handleChange}
                                            placeholder="e.g. B.Tech Computer Science"
                                            required
                                            className="w-full text-black px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] ml-1">College / Institution Name (Or none)</label>
                                    <input
                                        type="text"
                                        name="collegeName"
                                        value={formData.collegeName}
                                        onChange={handleChange}
                                        placeholder="Institution Name"
                                        className="w-full text-black px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Working Details (if applicable or none)</label>
                                    <input
                                        type="text"
                                        name="workingDetails"
                                        value={formData.workingDetails}
                                        onChange={handleChange}
                                        placeholder="Current job/internship details"
                                        className="w-full text-black px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none transition-all"
                                    />
                                </div>
                            </div>
                        )}

                        {/* Step 5: Internship Preferences */}
                        {step === 5 && (
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
                                        <option value="App Development (React Native, Flutter)">App Development (React Native, Flutter)</option>
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

                        {/* Step 6: Payment Summary */}
                        {step === 6 && (
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

                                {/* Resume Upload Section - Directly before payment info */}
                                <div className={`p-6 rounded-2xl border-2 transition-all ${formData.resumeDocument ? 'bg-emerald-50/50 border-emerald-100' : 'bg-orange-50/50 border-orange-100 border-dashed'}`}>
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`p-2 rounded-xl ${formData.resumeDocument ? 'bg-emerald-100 text-emerald-600' : 'bg-orange-100 text-orange-600'}`}>
                                                <FileText className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-black text-gray-900 uppercase tracking-tight">Professional Resume</h4>
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">Please upload your CV (PDF only)</p>
                                            </div>
                                        </div>
                                        {formData.resumeDocument && (
                                            <div className="bg-emerald-500 text-white p-1 rounded-full">
                                                <Check className="w-3 h-3" />
                                            </div>
                                        )}
                                    </div>

                                    <div className="relative">
                                        <input
                                            type="file"
                                            accept="application/pdf"
                                            onChange={(e) => handleFileUpload(e, 'resumeDocument')}
                                            className="hidden"
                                            id="resume-final-upload"
                                        />
                                        <label
                                            htmlFor="resume-final-upload"
                                            className={`flex items-center justify-center gap-3 w-full py-4 rounded-xl border-2 border-dashed cursor-pointer transition-all ${formData.resumeDocument
                                                ? 'bg-white border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                                                : 'bg-white border-orange-200 text-orange-700 hover:bg-orange-50'
                                                }`}
                                        >
                                            <Upload className="w-4 h-4" />
                                            <span className="text-[11px] font-black uppercase tracking-[0.1em]">
                                                {formData.resumeDocument ? 'Update / Change Resume' : 'Choose Resume File'}
                                            </span>
                                        </label>
                                    </div>

                                    {formData.resumeDocument && (
                                        <p className="text-[10px] font-bold text-emerald-600 mt-3 flex items-center gap-2 px-1">
                                            <Check className="w-3 h-3" /> Successfully linked to your profile
                                        </p>
                                    )}
                                </div>

                                <div className="bg-blue-50 p-4 rounded-xl flex items-start gap-3 border border-blue-100">
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
                    <div className={`grid grid-cols-3 gap-4 pt-8 max-w-2xl mx-auto w-full flex-shrink-0`}>
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
                                {step === 6 ? `Pay ₹${prices[formData.duration] || '0'}` : 'Create Account'} <ChevronRight className="w-5 h-5" />
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
            </div>
            <Script src="https://checkout.razorpay.com/v1/checkout.js" />
        </div>
    );
}
