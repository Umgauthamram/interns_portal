'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './register.module.css';
import { GridBackground } from '../../../components/GridBackground';

export default function Register() {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        dob: '',
        phone: '',
        gender: 'Select Gender',
        address: '',
        track: 'Select Track',
        subTrack: '',
        duration: '2 Months',
        mode: 'Course + Project'
    });

    const tracks = [
        'Web Development',
        'App Development (Flutter, React Native)',
        'Blockchain/Web3',
        'Gen AI',
        'Cybersecurity',
        'Research and Development'
    ];

    const rndSubTracks = [
        'Cybersecurity',
        'Blockchain',
        'Robotics and Autonomous System',
        'Semiconductor and Advanced Chip Design',
        'Biotechnology and Bioengineering',
        'Renewable Energy and Advanced Materials'
    ];

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validateStep = (step) => {
        switch (step) {
            case 1:
                return formData.name && formData.email;
            case 2:
                return formData.dob && formData.phone && formData.gender !== 'Select Gender';
            case 3:
                return formData.address;
            case 4:
                return formData.track !== 'Select Track' &&
                    (formData.track !== 'Research and Development' || formData.subTrack);
            default: return false;
        }
    };

    const handleNext = (e) => {
        e.preventDefault();
        if (validateStep(currentStep)) {
            setCurrentStep(prev => prev + 1);
        } else {
            alert('Please fill all required fields');
        }
    };

    const handleBack = () => {
        setCurrentStep(prev => prev - 1);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                alert('Proceeding to Payment...');
                setTimeout(() => {
                    router.push('/dashboard');
                }, 1500);
            } else {
                const errorData = await res.json();
                alert(errorData.error || 'Registration failed');
            }
        } catch (error) {
            console.error('An error occurred:', error);
            alert('An error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const totalSteps = 4;
    const progressPercentage = (currentStep / totalSteps) * 100;

    return (
        <div className={styles.container}>
            <GridBackground mask="fade-edges" />

            <div className={styles.formCard}>
                {/* Progress Bar (Loading Above) */}
                <div className={styles.progressBarContainer}>
                    <div
                        className={styles.progressBarFill}
                        style={{ width: `${progressPercentage}%` }}
                    ></div>
                </div>

                {/* Left Panel: Branding */}
                <div className={styles.leftPanel}>
                    <h1 className={styles.logo}>Internship<span className={styles.highlight}>Pro</span></h1>
                    <p className={styles.subtitle}>
                        Join the next generation of tech leaders.
                        Sign in with your details to start your journey.
                        <br /><br />
                        Step {currentStep} of {totalSteps}
                    </p>
                </div>

                {/* Right Panel: Form */}
                <div className={styles.rightPanel}>
                    <h2 className={styles.stepTitle}>
                        {currentStep === 1 && 'Basic Information'}
                        {currentStep === 2 && 'Personal Details'}
                        {currentStep === 3 && 'Locality'}
                        {currentStep === 4 && 'Academic Preferences'}
                    </h2>

                    <form onSubmit={handleSubmit} className={styles.form}>

                        {/* Step 1: Identity */}
                        {currentStep === 1 && (
                            <div className={styles.grid2}>
                                <div className={styles.inputGroup}>
                                    <label>Full Name</label>
                                    <input type="text" name="name" value={formData.name} required placeholder="John Doe" onChange={handleChange} />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label>Email Address</label>
                                    <input type="email" name="email" value={formData.email} required placeholder="john@example.com" onChange={handleChange} />
                                </div>
                            </div>
                        )}

                        {/* Step 2: Personal */}
                        {currentStep === 2 && (
                            <div className={styles.grid3}>
                                <div className={styles.inputGroup}>
                                    <label>Date of Birth</label>
                                    <input type="date" name="dob" value={formData.dob} required onChange={handleChange} />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label>Phone Number</label>
                                    <input type="tel" name="phone" value={formData.phone} required placeholder="+1 234 567 890" onChange={handleChange} />
                                </div>
                                <div className={styles.inputGroup}>
                                    <label>Gender</label>
                                    <select name="gender" value={formData.gender} onChange={handleChange} required>
                                        <option disabled>Select Gender</option>
                                        <option>Male</option>
                                        <option>Female</option>
                                        <option>Other</option>
                                    </select>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Address */}
                        {currentStep === 3 && (
                            <div className={styles.inputGroup}>
                                <label>Current Address</label>
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    required
                                    placeholder="123 Main St, City, Country..."
                                    rows="4"
                                    style={{ minHeight: '120px' }}
                                    onChange={handleChange}
                                />
                            </div>
                        )}

                        {/* Step 4: Academic */}
                        {currentStep === 4 && (
                            <>
                                <div className={styles.grid2}>
                                    <div className={styles.inputGroup}>
                                        <label>Select Track</label>
                                        <select name="track" value={formData.track} onChange={handleChange} required>
                                            <option disabled>Select Track</option>
                                            {tracks.map(t => <option key={t} value={t}>{t}</option>)}
                                        </select>
                                    </div>

                                    {formData.track === 'Research and Development' && (
                                        <div className={styles.inputGroup}>
                                            <label>R&D Specialization</label>
                                            <select name="subTrack" value={formData.subTrack} onChange={handleChange} required>
                                                <option disabled value="">Select Specialization</option>
                                                {rndSubTracks.map(t => <option key={t} value={t}>{t}</option>)}
                                            </select>
                                        </div>
                                    )}
                                </div>

                                <div className={styles.grid2} style={{ marginTop: '1rem' }}>
                                    <div className={styles.inputGroup}>
                                        <label>Duration</label>
                                        <select name="duration" value={formData.duration} onChange={handleChange}>
                                            <option>2 Months</option>
                                            <option>4 Months</option>
                                            <option>6 Months</option>
                                        </select>
                                    </div>
                                    <div className={styles.inputGroup}>
                                        <label>Mode</label>
                                        <select name="mode" value={formData.mode} onChange={handleChange}>
                                            <option>Course + Project</option>
                                            <option>Only Project</option>
                                        </select>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Dynamic Navigation Buttons */}
                        <div className={styles.buttonGroup}>
                            {/* Back Button (Only if not step 1) */}
                            {currentStep > 1 ? (
                                <button type="button" onClick={handleBack} className={styles.btnBack}>
                                    Back
                                </button>
                            ) : (
                                <div></div> /* Spacer */
                            )}

                            {/* Main Action Button */}
                            {currentStep < 4 ? (
                                <button type="button" onClick={handleNext} className={styles.submitBtn}>
                                    Next
                                </button>
                            ) : (
                                <button type="submit" className={styles.submitBtn} disabled={loading}>
                                    {loading ? 'Processing...' : 'Register'}
                                </button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
