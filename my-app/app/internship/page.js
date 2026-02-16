import Link from 'next/link';
import { GridBackground } from '../../components/GridBackground';
import styles from './landing.module.css';

export default function InternshipLanding() {
    return (
        <div className={styles.container}>
            <GridBackground mask="fade-edges" />
            <header className={styles.header}>
                <h1 className={styles.logo}>Internship<span className={styles.highlight}>Pro</span></h1>
                <nav>
                    <Link href="/internship/register" className="btn-primary">Apply Now</Link>
                </nav>
            </header>

            <main className={styles.main}>
                <section className={styles.hero}>
                    <h2 className={styles.heroTitle}>
                        Accelerate Your Career with <br />
                        <span className={styles.gradientText}>World-Class Internships</span>
                    </h2>
                    <p className={styles.heroSubtitle}>
                        Gain hands-on experience in Web3, AI, Cybersecurity, and more.
                        Work on real-world projects and launch your tech journey.
                    </p>
                    <div className={styles.ctaGroup}>
                        <Link href="/internship/register" className="btn-primary">Start Your Journey</Link>
                        <Link href="#tracks" className={styles.btnSecondary}>Explore Tracks</Link>
                    </div>
                </section>

                <section id="tracks" className={styles.tracksSection}>
                    <h3 className={styles.sectionTitle}>Available Tracks</h3>
                    <div className={styles.grid}>
                        {['Web Development', 'App Development', 'Blockchain/Web3', 'Gen AI', 'Cybersecurity', 'Research & Development'].map((track) => (
                            <div key={track} className="card">
                                <h4 className={styles.cardTitle}>{track}</h4>
                                <p className={styles.cardDesc}>Master {track} with industry experts and live projects.</p>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
}
