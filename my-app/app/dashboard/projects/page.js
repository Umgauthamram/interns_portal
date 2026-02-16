'use client';
import { useState } from 'react';
import styles from './projects.module.css';

export default function Projects() {
    const [activeTab, setActiveTab] = useState('current');
    const [ownProject, setOwnProject] = useState({ title: '', problem: '', solution: '', tech: '' });

    const handleOwnProjectSubmit = async (e) => {
        e.preventDefault();
        // Simulate API call
        alert('Project proposal sent to Admin for review!');
        setOwnProject({ title: '', problem: '', solution: '', tech: '' });
    };

    return (
        <div className={styles.container}>
            <div className={styles.tabs}>
                <button
                    className={`${styles.tab} ${activeTab === 'current' ? styles.active : ''}`}
                    onClick={() => setActiveTab('current')}
                >
                    Current Project
                </button>
                <button
                    className={`${styles.tab} ${activeTab === 'submission' ? styles.active : ''}`}
                    onClick={() => setActiveTab('submission')}
                >
                    Submission
                </button>
                <button
                    className={`${styles.tab} ${activeTab === 'new' ? styles.active : ''}`}
                    onClick={() => setActiveTab('new')}
                >
                    Add New Project
                </button>
            </div>

            <div className={styles.content}>
                {activeTab === 'current' && (
                    <div className={styles.panel}>
                        <h2 className={styles.title}>E-Commerce Platform</h2>
                        <p className={styles.desc}>Build a full-stack e-commerce application with React and Node.js.</p>
                        <div className={styles.status}>Status: In Progress</div>
                        <div className={styles.techStack}>
                            <span>React</span>
                            <span>Node.js</span>
                            <span>MongoDB</span>
                        </div>
                    </div>
                )}

                {activeTab === 'submission' && (
                    <div className={styles.panel}>
                        <h2 className={styles.title}>Project Submission</h2>
                        <form className={styles.form} onSubmit={(e) => { e.preventDefault(); alert('Submitted!'); }}>
                            <input type="text" placeholder="GitHub Repository URL" className={styles.input} required />
                            <input type="text" placeholder="Live Demo URL" className={styles.input} />
                            <textarea placeholder="Description of work done..." className={styles.textarea} required></textarea>
                            <button type="submit" className="btn-primary">Submit Project</button>
                        </form>
                    </div>
                )}

                {activeTab === 'new' && (
                    <div className={styles.panel}>
                        <h2 className={styles.title}>Select New Project</h2>
                        <div className={styles.options}>
                            <div className={styles.optionCard}>
                                <h3>Get Project</h3>
                                <p>Choose from our curated list of industry-standard projects.</p>
                                <button className={styles.btnSecondary} onClick={() => alert('Assigned: Social Media Dashboard')}>Select</button>
                            </div>

                            <div className={styles.optionCard}>
                                <h3>Your Own Project</h3>
                                <p>Propose your own problem statement and solution.</p>
                                <form onSubmit={handleOwnProjectSubmit}>
                                    <input
                                        type="text"
                                        placeholder="Project Title"
                                        className={styles.input}
                                        value={ownProject.title}
                                        onChange={e => setOwnProject({ ...ownProject, title: e.target.value })}
                                        required
                                    />
                                    <textarea
                                        placeholder="Problem Statement"
                                        className={styles.textarea}
                                        value={ownProject.problem}
                                        onChange={e => setOwnProject({ ...ownProject, problem: e.target.value })}
                                        required
                                    ></textarea>
                                    <textarea
                                        placeholder="Proposed Solution"
                                        className={styles.textarea}
                                        value={ownProject.solution}
                                        onChange={e => setOwnProject({ ...ownProject, solution: e.target.value })}
                                        required
                                    ></textarea>
                                    <input
                                        type="text"
                                        placeholder="Tech Stack"
                                        className={styles.input}
                                        value={ownProject.tech}
                                        onChange={e => setOwnProject({ ...ownProject, tech: e.target.value })}
                                        required
                                    />
                                    <button type="submit" className="btn-primary">Submit Proposal</button>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
