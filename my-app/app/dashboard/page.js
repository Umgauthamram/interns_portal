'use client';
import styles from './dashboard.module.css';
import Link from 'next/link';

export default function Dashboard() {
    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1 className={styles.title}>Welcome back, Intern!</h1>
                <p className={styles.subtitle}>Track your progress and manage your projects.</p>
            </header>

            <div className={styles.grid}>
                <div className={styles.card}>
                    <h3 className={styles.cardTitle}>Current Course</h3>
                    <p className={styles.cardContent}>Web Development (Module 3/10)</p>
                    <div className={styles.progressBar}>
                        <div className={styles.progressFill} style={{ width: '30%' }}></div>
                    </div>
                    <Link href="/dashboard/course" className={styles.linkButton}>Continue Learning</Link>
                </div>

                <div className={styles.card}>
                    <h3 className={styles.cardTitle}>Active Project</h3>
                    <p className={styles.cardContent}>E-Commerce Platform</p>
                    <span className={styles.statusBadge}>In Progress</span>
                    <Link href="/dashboard/projects" className={styles.linkButton}>View Details</Link>
                </div>

                <div className={styles.card}>
                    <h3 className={styles.cardTitle}>Upcoming Deadlines</h3>
                    <ul className={styles.list}>
                        <li>Project Phase 1 - <span className={styles.date}>Mar 15</span></li>
                        <li>Quiz 2 - <span className={styles.date}>Mar 20</span></li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
