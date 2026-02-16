import Sidebar from '../../components/Sidebar';

export default function DashboardLayout({ children }) {
    return (
        <div className="layout-container">
            <Sidebar />
            <main className="main-content">
                {children}
            </main>
        </div>
    );
}
