import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X, User, LogOut } from "lucide-react";

const NAV_ITEMS = {
    patient: [
        { label: "Dashboard", to: "/" },
        { label: "Prescriptions", to: "/prescription" },
    ],
    pharmacist: [
        { label: "Dashboard", to: "/pharmacistDashboard" },
        { label: "Patient", to: "/patient" },
    ],
};

const Navbar = ({ role = "patient", userName = "User", onLogout }) => {
    const [isOpen, setIsOpen] = useState(false);
    const navItems = NAV_ITEMS[role] ?? [];

    return (
        <header className="border-b border-gray-200 bg-white">
            <nav className="mx-auto flex h-16 max-w-9xl items-center justify-between px-4 sm:px-6">
                <div className="flex items-center justify-center gap-2">
                    <span className="text-lg font-semibold tracking-tight text-black">
                        Pharmacy 1st
                    </span>
                    <span className="rounded-full border border-gray-300 mt-1    px-2 py-0.5 text-xs text-gray-800 capitalize">
                        {role}
                    </span>
                </div>

                <div className="hidden items-center gap-8 md:flex">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            className={({ isActive }) =>
                                `text-sm font-medium transition-colors hover:underline ${isActive
                                    ? "text-black"
                                    : "text-gray-500 hover:text-black"
                                }`
                            }
                        >
                            {item.label}
                        </NavLink>
                    ))}
                </div>

                <div className="hidden items-center gap-4 md:flex">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                        <User size={16} strokeWidth={1.75} />
                        <span>{userName}</span>
                    </div>
                    <button
                        onClick={onLogout}
                        className="flex items-center gap-2 rounded-full bg-black px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-85 active:opacity-70"
                    >
                        <LogOut size={15} strokeWidth={2} />
                        Logout
                    </button>
                </div>

                {/* Mobile menu toggle */}
                <button
                    onClick={() => setIsOpen((prev) => !prev)}
                    className="text-black md:hidden"
                    aria-label="Toggle menu"
                >
                    {isOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
            </nav>

            {isOpen && (
                <div className="border-t border-gray-200 px-4 pb-4 md:hidden">
                    <div className="flex flex-col gap-1 pt-3">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                onClick={() => setIsOpen(false)}
                                className={({ isActive }) =>
                                    `rounded-md px-3 py-2 text-sm font-medium ${isActive
                                        ? "bg-black text-white"
                                        : "text-gray-600 hover:bg-gray-100"
                                    }`
                                }
                            >
                                {item.label}
                            </NavLink>
                        ))}
                    </div>

                    <div className="mt-3 flex items-center justify-between border-t border-gray-200 pt-3">
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                            <User size={16} strokeWidth={1.75} />
                            <span>{userName}</span>
                        </div>
                        <button
                            onClick={onLogout}
                            className="flex items-center gap-2 rounded-full bg-black px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-85 active:opacity-70"
                        >
                            <LogOut size={15} strokeWidth={2} />
                            Logout
                        </button>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;