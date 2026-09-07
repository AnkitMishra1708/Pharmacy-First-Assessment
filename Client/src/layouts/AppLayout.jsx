import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";

const AppLayout = ({ role, userName, onLogout }) => {
    return (
        <div className="min-h-screen bg-white">
            <Navbar role={role} userName={userName} onLogout={onLogout} />
            <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
                <Outlet />
            </main>
        </div>
    );
};

export default AppLayout;