'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Sidebar.module.css';

export default function Sidebar() {
    const pathname = usePathname();

    const links = [
        { name: 'Dashboard', href: '/dashboard' },
        { name: 'My Course', href: '/dashboard/course' },
        { name: 'My Projects', href: '/dashboard/projects' },
        { name: 'Submissions', href: '/dashboard/submissions' },
        { name: 'Profile', href: '/dashboard/profile' },
    ];

    return (
        <aside className={styles.sidebar}>
            <div className={styles.logo}>Internship<span className={styles.highlight}>Pro</span></div>
            <nav className={styles.nav}>
                {links.map((link) => (
                    <Link
                        key={link.name}
                        href={link.href}
                        className={`${styles.navItem} ${pathname === link.href ? styles.active : ''}`}
                    >
                        {link.name}
                    </Link>
                ))}
            </nav>
            <div className={styles.footer}>
                <button className={styles.logoutBtn}>Logout</button>
            </div>
        </aside>
    );
}
