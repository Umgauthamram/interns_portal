"use client";

import {
    Mail, Phone, MapPin, Calendar, Briefcase,
    Clock, Laptop, ShieldCheck, Lock, X, Check, Smile,
    Upload, Camera, Image as ImageIcon, CreditCard, Fingerprint, FileCheck
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { toast } from "react-hot-toast";

// 12 curated cartoon avatar seeds for DiceBear "micah" style
const AVATAR_SEEDS = [
    "Zephyr", "Nova", "Cosmo", "Pixel", "Cipher",
    "Echo", "Vega", "Blaze", "Orion", "Lyra",
    "Atlas", "Iris"
];

const dicebear = (seed) =>
    `https://api.dicebear.com/7.x/micah/svg?seed=${encodeURIComponent(seed)}&backgroundColor=transparent`;

export default function SettingsPage() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [showAvatarPicker, setShowAvatarPicker] = useState(false);
    const [pickerTab, setPickerTab] = useState('upload'); // 'upload' | 'camera' | 'avatar'
    const [chosenSeed, setChosenSeed] = useState(null);
    const [savingAvatar, setSavingAvatar] = useState(false);
    const [passwords, setPasswords] = useState({ newPassword: '', confirmPassword: '' });
    const [isSubmittingPassword, setIsSubmittingPassword] = useState(false);
    // Photo upload
    const [uploadPreview, setUploadPreview] = useState(null);
    const fileInputRef = useRef(null);
    // Camera
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const streamRef = useRef(null);
    const [cameraActive, setCameraActive] = useState(false);
    const [cameraSnapshot, setCameraSnapshot] = useState(null);

    const fetchUser = async () => {
        const email = typeof window !== 'undefined' ? localStorage.getItem('userEmail') : null;
        if (!email) { setLoading(false); return; }
        try {
            const res = await fetch(`/api/user/me?email=${email}`);
            if (res.ok) {
                const data = await res.json();
                setUser({ ...data, joinDate: data.joinDate ? new Date(data.joinDate).toISOString().split('T')[0] : 'N/A' });
                setChosenSeed(data.avatarSeed || data.fullName?.split(' ')[0] || "User");
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchUser(); }, []);

    const handleSaveAvatar = async (seed) => {
        setSavingAvatar(true);
        try {
            const res = await fetch('/api/user/me', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: user.email, avatarSeed: seed, profilePic: '' })
            });
            if (res.ok) {
                // Optimistic update — instant, no extra network call
                setChosenSeed(seed);
                setUser(prev => ({ ...prev, avatarSeed: seed, profilePicture: '' }));
                toast.success('Avatar updated!');
                closePickerClean();
            } else {
                const err = await res.json().catch(() => ({}));
                toast.error(err.message || 'Failed to save avatar.');
            }
        } catch { toast.error('Error saving avatar.'); }
        finally { setSavingAvatar(false); }
    };

    const handleSavePhoto = async (base64OrUrl) => {
        setSavingAvatar(true);
        try {
            let finalUrl = base64OrUrl;

            // If it's a base64 (from camera or old preview), upload to R2 first
            if (base64OrUrl.startsWith('data:')) {
                const blob = await (await fetch(base64OrUrl)).blob();
                const file = new File([blob], `${user.fullName?.replace(/\s+/g, '_')}_profile.jpg`, { type: 'image/jpeg' });
                const formData = new FormData();
                formData.append('file', file);
                formData.append('type', 'profile');
                formData.append('email', user.email);

                const upRes = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData
                });
                if (upRes.ok) {
                    const { url } = await upRes.json();
                    finalUrl = url;
                }
            }

            const res = await fetch('/api/user/me', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: user.email, profilePic: finalUrl, avatarSeed: '' })
            });
            if (res.ok) {
                setUser(prev => ({ ...prev, profilePicture: finalUrl, avatarSeed: '' }));
                setChosenSeed(user.fullName?.split(' ')[0] || 'User');
                toast.success('Profile photo updated!');
                closePickerClean();
            } else {
                const err = await res.json().catch(() => ({}));
                toast.error(err.message || 'Failed to save photo.');
            }
        } catch { toast.error('Error saving photo.'); }
        finally { setSavingAvatar(false); }
    };

    const handleIdUpload = async (file, type) => {
        const loadingToast = toast.loading(`Uploading ${type === 'aadhaarCard' ? 'Aadhaar' : 'Photo'}...`);
        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('type', type === 'aadhaarCard' ? 'aadhaar' : 'passport');
            formData.append('email', user.email);

            const upRes = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            });

            if (upRes.ok) {
                const { url } = await upRes.json();
                const res = await fetch('/api/user/me', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: user.email, [type]: url })
                });

                if (res.ok) {
                    setUser(prev => ({ ...prev, [type]: url }));
                    toast.success('Document uploaded successfully!', { id: loadingToast });
                } else {
                    toast.error('Failed to update profile.', { id: loadingToast });
                }
            } else {
                toast.error('Upload failed.', { id: loadingToast });
            }
        } catch (error) {
            console.error(error);
            toast.error('Processing error.', { id: loadingToast });
        }
    };

    const closePickerClean = () => {
        stopCamera();
        setShowAvatarPicker(false);
        setUploadPreview(null);
        setCameraSnapshot(null);
    };

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
            streamRef.current = stream;
            if (videoRef.current) videoRef.current.srcObject = stream;
            setCameraActive(true);
            setCameraSnapshot(null);
        } catch { toast.error("Camera access denied or not available."); }
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(t => t.stop());
            streamRef.current = null;
        }
        setCameraActive(false);
    };

    const takeSnapshot = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!video || !canvas) return;
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        canvas.getContext('2d').drawImage(video, 0, 0);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setCameraSnapshot(dataUrl);
        stopCamera();
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) { toast.error('Image must be under 5 MB'); return; }
        const reader = new FileReader();
        reader.onload = (ev) => setUploadPreview(ev.target.result);
        reader.readAsDataURL(file);
    };

    const handlePasswordUpdate = async (e) => {
        e.preventDefault();
        if (passwords.newPassword !== passwords.confirmPassword) { toast.error("Passwords do not match!"); return; }
        if (passwords.newPassword.length < 6) { toast.error("Password must be at least 6 characters."); return; }
        setIsSubmittingPassword(true);
        try {
            const res = await fetch('/api/user/me', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: user.email, password: passwords.newPassword })
            });
            if (res.ok) {
                toast.success("Password updated successfully!");
                setIsPasswordModalOpen(false);
                setPasswords({ newPassword: '', confirmPassword: '' });
            } else { toast.error("Failed to update password"); }
        } catch { toast.error("Error updating password"); }
        finally { setIsSubmittingPassword(false); }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black" /></div>;
    if (!user) return <div className="min-h-screen flex items-center justify-center flex-col gap-4"><h2 className="text-xl font-bold text-gray-800">User credentials not found.</h2></div>;

    const activeSeed = chosenSeed || user.avatarSeed || user.fullName?.split(' ')[0] || 'User';
    const avatarSrc = (user.profilePicture && user.profilePicture.length > 10)
        ? user.profilePicture
        : `https://api.dicebear.com/7.x/micah/svg?seed=${encodeURIComponent(activeSeed)}&backgroundColor=transparent`;

    return (
        <div className="relative min-h-screen p-8 max-w-7xl mx-auto space-y-8">

            {/* ── Profile Header ── */}
            <div className="bg-white rounded-[2rem] p-10 shadow-xl border border-gray-100 flex flex-col md:flex-row items-center md:items-start gap-10 relative overflow-hidden">
                {/* Full background gradient that covers the whole card */}
                <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-emerald-50/50 pointer-events-none" />

                {/* Avatar */}
                <div className="relative shrink-0 z-10">
                    <div className="w-40 h-40 rounded-full border-4 border-white shadow-xl bg-gray-50 overflow-hidden">
                        <img
                            src={avatarSrc}
                            alt="Avatar"
                            className="w-full h-full scale-110 object-cover"
                        />
                    </div>
                    {/* Emoji / change avatar button */}
                    <button
                        onClick={() => setShowAvatarPicker(true)}
                        className="absolute -bottom-1 -right-1 w-10 h-10 bg-black text-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform z-20"
                        title="Change Avatar"
                    >
                        <Smile className="w-5 h-5" />
                    </button>
                </div>

                {/* Info */}
                <div className="flex-1 space-y-6 z-10 text-center md:text-left mt-2 md:mt-0">
                    <div>
                        <h1 className="text-4xl font-black text-gray-900 tracking-tighter uppercase mb-2">{user.fullName}</h1>
                        <div className="inline-block px-4 py-1.5 bg-black text-white rounded-full text-[10px] font-black uppercase tracking-widest shadow-md">
                            {user.track || "Intern"}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100/80">
                        {[
                            { icon: Mail, value: user.email },
                            { icon: Phone, value: user.phone || "Not Provided" },
                            { icon: MapPin, value: user.address || "Not Provided" },
                            { icon: Calendar, value: user.dob || "Not Provided" },
                        ].map(({ icon: Icon, value }, i) => (
                            <div key={i} className="flex items-center justify-center md:justify-start gap-3">
                                <div className="w-10 h-10 rounded-xl bg-white/70 border border-gray-100 flex items-center justify-center shrink-0 shadow-sm">
                                    <Icon className="w-5 h-5 text-gray-400" />
                                </div>
                                <div className="text-sm font-bold text-gray-700">{value}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Bottom Cards ── */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Internship Overview */}
                <div className="bg-white rounded-[2rem] p-10 shadow-lg border border-gray-100 relative overflow-hidden group hover:shadow-xl transition-all h-full">
                    <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                        <Briefcase className="w-32 h-32 -mr-10 -mt-10" />
                    </div>
                    <h3 className="text-2xl font-black text-gray-900 tracking-tighter uppercase mb-8 flex items-center gap-3">
                        <Laptop className="w-6 h-6 shrink-0" /> Internship Overview
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative z-10">
                        {[
                            { icon: Laptop, label: "Track", value: user.track },
                            { icon: Clock, label: "Duration", value: user.duration },
                            { icon: MapPin, label: "Work Mode", value: user.mode },
                            { icon: Calendar, label: "Join Date", value: user.joinDate },
                        ].map(({ icon: Icon, label, value }) => (
                            <div key={label} className="bg-gray-50 border border-gray-100 rounded-2xl p-5 hover:bg-white hover:shadow-md transition-all">
                                <div className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 flex items-center gap-2">
                                    <Icon className="w-3 h-3" /> {label}
                                </div>
                                <p className="text-lg font-bold text-gray-900">{value || "N/A"}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Security */}
                <div className="bg-black rounded-[2rem] p-10 shadow-2xl relative overflow-hidden group hover:shadow-black/40 transition-all h-full flex flex-col justify-between">
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Lock className="w-40 h-40 text-white -mr-16 -mt-16" />
                    </div>
                    <div className="relative z-10">
                        <h3 className="text-2xl font-black text-white tracking-tighter uppercase mb-4 flex items-center gap-3">
                            <ShieldCheck className="w-6 h-6 shrink-0" /> Security Protocol
                        </h3>
                        <p className="text-gray-400 text-sm font-medium leading-relaxed max-w-sm mb-10">
                            Maintain strict access control. Change your password regularly and avoid reusing passwords.
                        </p>
                    </div>
                    <button
                        onClick={() => setIsPasswordModalOpen(true)}
                        className="relative z-10 bg-white text-black px-8 py-5 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl hover:scale-105 active:scale-95 transition-all w-full flex items-center justify-center gap-3 group/btn"
                    >
                        <Lock className="w-5 h-5 group-hover/btn:-rotate-12 transition-transform" />
                        Update Password
                    </button>
                </div>
            </div>

            {/* ── ID Verification Section ── */}
            <div className="bg-white rounded-[2rem] p-10 shadow-xl border border-gray-100 space-y-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                    <Fingerprint className="w-32 h-32 -mr-10 -mt-10" />
                </div>
                <div className="relative z-10">
                    <h3 className="text-2xl font-black text-gray-900 tracking-tighter uppercase mb-2 flex items-center gap-3">
                        <ShieldCheck className="w-6 h-6 text-emerald-500" /> Identity Verification
                    </h3>
                    <p className="text-gray-400 text-sm font-medium">Please upload valid identity documents to activate your internship profile.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                    {/* Aadhaar Card */}
                    <div className="group bg-gray-50 border border-gray-100 rounded-3xl p-6 hover:bg-white hover:shadow-xl transition-all">
                        <div className="flex items-center justify-between mb-6">
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                                <Fingerprint className="w-6 h-6 text-blue-500" />
                            </div>
                            {user.aadhaarCard ? (
                                <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase rounded-lg border border-emerald-100 flex items-center gap-1.5">
                                    <Check className="w-3 h-3" /> Verified Secure
                                </span>
                            ) : (
                                <span className="px-3 py-1 bg-amber-50 text-amber-600 text-[10px] font-black uppercase rounded-lg border border-amber-100">
                                    Pending Upload
                                </span>
                            )}
                        </div>
                        <h4 className="text-sm font-black uppercase tracking-tight text-gray-900 mb-2">Aadhaar Card (Front/Back)</h4>
                        <p className="text-xs text-gray-400 font-medium mb-6">Clear photo of your Aadhaar card for KYC verification.</p>

                        {user.aadhaarCard ? (
                            <div className="relative aspect-video rounded-2xl overflow-hidden border border-gray-100 mb-4 bg-white group/img">
                                <img src={user.aadhaarCard} className="w-full h-full object-cover" alt="Aadhaar" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                    <label className="bg-white text-black px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest cursor-pointer hover:scale-105 active:scale-95 transition-all">
                                        Update Proof
                                        <input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && handleIdUpload(e.target.files[0], 'aadhaarCard')} />
                                    </label>
                                </div>
                            </div>
                        ) : (
                            <label className="w-full flex flex-col items-center justify-center p-8 bg-white border-2 border-dashed border-gray-200 rounded-2xl hover:border-black hover:bg-gray-50 transition-all cursor-pointer group/label">
                                <Upload className="w-6 h-6 text-gray-300 group-hover/label:text-black mb-2" />
                                <span className="text-[10px] font-black uppercase tracking-widest">Click to upload</span>
                                <input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && handleIdUpload(e.target.files[0], 'aadhaarCard')} />
                            </label>
                        )}
                    </div>

                    {/* Intern Identity Photo */}
                    <div className="group bg-gray-50 border border-gray-100 rounded-3xl p-6 hover:bg-white hover:shadow-xl transition-all">
                        <div className="flex items-center justify-between mb-6">
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                                <Camera className="w-6 h-6 text-indigo-500" />
                            </div>
                            {user.passportPhoto ? (
                                <span className="px-3 py-1 bg-indigo-50 text-indigo-600 text-[10px] font-black uppercase rounded-lg border border-indigo-100 flex items-center gap-1.5">
                                    <FileCheck className="w-3 h-3" /> Digital Photo
                                </span>
                            ) : (
                                <span className="px-3 py-1 bg-amber-50 text-amber-600 text-[10px] font-black uppercase rounded-lg border border-amber-100">
                                    Required
                                </span>
                            )}
                        </div>
                        <h4 className="text-sm font-black uppercase tracking-tight text-gray-900 mb-2">Formal Profile Photo</h4>
                        <p className="text-xs text-gray-400 font-medium mb-6">A clear formal headshot for identity and certificate generation.</p>

                        {user.passportPhoto ? (
                            <div className="relative aspect-video rounded-2xl overflow-hidden border border-gray-100 mb-4 bg-white group/img">
                                <img src={user.passportPhoto} className="w-full h-full object-cover" alt="ID Photo" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                    <button onClick={() => { setPickerTab('camera'); setShowAvatarPicker(true); startCamera(); }} className="bg-white text-black px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all">
                                        Open Camera
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex gap-3">
                                <button onClick={() => { setPickerTab('camera'); setShowAvatarPicker(true); startCamera(); }} className="flex-1 flex flex-col items-center justify-center p-8 bg-white border border-gray-100 rounded-2xl hover:border-black transition-all group/btn">
                                    <Camera className="w-6 h-6 text-gray-300 group-hover/btn:text-black mb-2" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-center">Capture Live</span>
                                </button>
                                <label className="flex-1 flex flex-col items-center justify-center p-8 bg-white border border-gray-100 rounded-2xl hover:border-black transition-all cursor-pointer group/label">
                                    <Upload className="w-6 h-6 text-gray-300 group-hover/label:text-black mb-2" />
                                    <span className="text-[10px] font-black uppercase tracking-widest text-center">Upload File</span>
                                    <input type="file" className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && handleIdUpload(e.target.files[0], 'passportPhoto')} />
                                </label>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* ── Photo / Avatar Picker Modal ── */}
            {showAvatarPicker && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-md" onClick={closePickerClean} />
                    <div className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden">

                        {/* Header */}
                        <div className="px-7 pt-7 pb-5 border-b border-gray-50 flex items-center justify-between bg-gray-50/40">
                            <div>
                                <h3 className="text-lg font-black text-gray-900 uppercase tracking-tighter">Profile Photo</h3>
                                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-0.5">Upload, take, or pick an avatar</p>
                            </div>
                            <button onClick={closePickerClean} className="w-9 h-9 bg-white border border-gray-100 rounded-xl flex items-center justify-center text-gray-400 hover:text-red-500 transition-all">
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Tabs */}
                        <div className="flex bg-gray-50 mx-6 mt-5 p-1 rounded-2xl border border-gray-100">
                            {[{ id: 'upload', label: 'Upload', icon: Upload }, { id: 'camera', label: 'Camera', icon: Camera }, { id: 'avatar', label: 'Avatar', icon: Smile }].map(tab => (
                                <button key={tab.id} onClick={() => { setPickerTab(tab.id); if (tab.id === 'camera') startCamera(); else stopCamera(); }}
                                    className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${pickerTab === tab.id ? 'bg-white shadow-sm text-black border border-gray-100' : 'text-gray-400 hover:text-gray-600'
                                        }`}>
                                    <tab.icon className="w-3.5 h-3.5" />{tab.label}
                                </button>
                            ))}
                        </div>

                        <div className="p-6">

                            {/* ── Upload Tab ── */}
                            {pickerTab === 'upload' && (
                                <div className="space-y-4">
                                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                                    {uploadPreview ? (
                                        <div className="flex flex-col items-center gap-4">
                                            <img src={uploadPreview} alt="Preview" className="w-36 h-36 rounded-full object-cover border-4 border-white shadow-xl" />
                                            <div className="flex gap-3 w-full">
                                                <button onClick={() => { setUploadPreview(null); fileInputRef.current.value = ''; }}
                                                    className="flex-1 py-3 bg-gray-50 text-gray-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-100 transition-all">
                                                    Retake
                                                </button>
                                                <button onClick={() => handleSavePhoto(uploadPreview)} disabled={savingAvatar}
                                                    className="flex-[2] py-3 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 shadow-lg">
                                                    {savingAvatar ? 'Saving...' : 'Use This Photo'}
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <button onClick={() => fileInputRef.current.click()}
                                            className="w-full flex flex-col items-center justify-center gap-3 border-2 border-dashed border-gray-200 rounded-3xl py-10 hover:border-black hover:bg-gray-50 transition-all group">
                                            <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center group-hover:bg-black group-hover:text-white transition-all">
                                                <Upload className="w-6 h-6 text-gray-400 group-hover:text-white" />
                                            </div>
                                            <div className="text-center">
                                                <p className="text-xs font-black text-gray-700">Click to upload a photo</p>
                                                <p className="text-[10px] text-gray-400 font-medium mt-0.5">JPG, PNG, WebP · max 5 MB</p>
                                            </div>
                                        </button>
                                    )}
                                </div>
                            )}

                            {/* ── Camera Tab ── */}
                            {pickerTab === 'camera' && (
                                <div className="space-y-4">
                                    <canvas ref={canvasRef} className="hidden" />
                                    {cameraSnapshot ? (
                                        <div className="flex flex-col items-center gap-4">
                                            <img src={cameraSnapshot} alt="Snapshot" className="w-36 h-36 rounded-full object-cover border-4 border-white shadow-xl" />
                                            <div className="flex gap-3 w-full">
                                                <button onClick={() => { setCameraSnapshot(null); startCamera(); }}
                                                    className="flex-1 py-3 bg-gray-50 text-gray-500 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-gray-100 transition-all">
                                                    Retake
                                                </button>
                                                <button onClick={() => handleSavePhoto(cameraSnapshot)} disabled={savingAvatar}
                                                    className="flex-[2] py-3 bg-black text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 shadow-lg">
                                                    {savingAvatar ? 'Saving...' : 'Use This Photo'}
                                                </button>
                                            </div>
                                        </div>
                                    ) : cameraActive ? (
                                        <div className="flex flex-col items-center gap-4">
                                            <video ref={videoRef} autoPlay playsInline className="w-full rounded-3xl bg-black aspect-square object-cover" />
                                            <button onClick={takeSnapshot}
                                                className="w-16 h-16 bg-black text-white rounded-full flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all">
                                                <Camera className="w-6 h-6" />
                                            </button>
                                        </div>
                                    ) : (
                                        <button onClick={startCamera}
                                            className="w-full flex flex-col items-center justify-center gap-3 border-2 border-dashed border-gray-200 rounded-3xl py-10 hover:border-black hover:bg-gray-50 transition-all group">
                                            <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center group-hover:bg-black transition-all">
                                                <Camera className="w-6 h-6 text-gray-400 group-hover:text-white" />
                                            </div>
                                            <div className="text-center">
                                                <p className="text-xs font-black text-gray-700">Open camera</p>
                                                <p className="text-[10px] text-gray-400 font-medium mt-0.5">Click to activate your webcam</p>
                                            </div>
                                        </button>
                                    )}
                                </div>
                            )}

                            {/* ── Avatar Tab ── */}
                            {pickerTab === 'avatar' && (
                                <div className="grid grid-cols-4 gap-3">
                                    {AVATAR_SEEDS.map(seed => (
                                        <button key={seed} onClick={() => handleSaveAvatar(seed)} disabled={savingAvatar}
                                            className={`relative rounded-2xl overflow-hidden border-2 transition-all hover:scale-105 active:scale-95 ${chosenSeed === seed ? 'border-black shadow-lg shadow-black/20' : 'border-gray-100 hover:border-gray-300'
                                                }`}>
                                            <div className="bg-gray-50 p-2 aspect-square flex items-center justify-center">
                                                <img src={dicebear(seed)} alt={seed} className="w-full" />
                                            </div>
                                            {chosenSeed === seed && (
                                                <div className="absolute top-1 right-1 w-5 h-5 bg-black rounded-full flex items-center justify-center">
                                                    <Check className="w-3 h-3 text-white" />
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                    {savingAvatar && <p className="col-span-4 text-center text-[10px] font-black text-gray-400 uppercase tracking-widest mt-2">Saving...</p>}
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            )}

            {/* ── Password Modal ── */}
            {isPasswordModalOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setIsPasswordModalOpen(false)} />
                    <div className="relative w-full max-w-md bg-white rounded-[2.5rem] p-10 shadow-2xl">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-2xl font-black text-gray-900 tracking-tighter uppercase">Reset Key</h3>
                            <button onClick={() => setIsPasswordModalOpen(false)} className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center text-gray-500 hover:bg-rose-50 hover:text-rose-500 transition-all">
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        <form onSubmit={handlePasswordUpdate} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">New Password</label>
                                <input type="password" required value={passwords.newPassword}
                                    onChange={e => setPasswords({ ...passwords, newPassword: e.target.value })}
                                    className="w-full bg-gray-50 border-0 rounded-[1.5rem] px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-black/5 outline-none"
                                    placeholder="Enter new password" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] ml-2">Confirm Password</label>
                                <input type="password" required value={passwords.confirmPassword}
                                    onChange={e => setPasswords({ ...passwords, confirmPassword: e.target.value })}
                                    className="w-full bg-gray-50 border-0 rounded-[1.5rem] px-6 py-4 text-sm font-bold focus:ring-4 focus:ring-black/5 outline-none"
                                    placeholder="Confirm new password" />
                            </div>
                            <button type="submit" disabled={isSubmittingPassword}
                                className="w-full py-4 mt-4 bg-black text-white rounded-[1.5rem] text-[11px] font-black uppercase tracking-[0.2em] shadow-xl hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50">
                                {isSubmittingPassword ? "Processing..." : "Confirm Update"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
