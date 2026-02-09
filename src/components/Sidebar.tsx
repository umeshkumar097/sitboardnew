"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const Icons = {
    Dashboard: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="7" height="9" x="3" y="3" rx="1" /><rect width="7" height="5" x="14" y="3" rx="1" /><rect width="7" height="9" x="14" y="12" rx="1" /><rect width="7" height="5" x="3" y="16" rx="1" /></svg>
    ),
    Building: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="8" height="18" x="8" y="2" rx="1" ry="1" /><path d="M4 22h16" /><line x1="12" x2="12" y1="22" y2="18" /></svg>
    ),
    Briefcase: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></svg>
    ),
    Users: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M22 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" /></svg>
    ),
    Settings: () => (
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path></svg>
    )
};

export default function Sidebar({ user, isOpen, setIsOpen }: { user: any, isOpen: boolean, setIsOpen: (v: boolean) => void }) {
    const pathname = usePathname();

    const navItems = [];

    // Common items
    navItems.push({ name: 'Dashboard', href: '/dashboard', icon: Icons.Dashboard });
    navItems.push({ name: 'Projects', href: '/dashboard/projects', icon: Icons.Building });

    if (user.role === 'super_admin') {
        navItems.push({ name: 'Companies', href: '/dashboard/companies', icon: Icons.Briefcase });
        navItems.push({ name: 'Users', href: '/dashboard/users', icon: Icons.Users });
    }

    if (user.role === 'company_admin') {
        navItems.push({ name: 'Agents', href: '/dashboard/agents', icon: Icons.Users });
        navItems.push({ name: 'Leads', href: '/dashboard/leads', icon: Icons.Users }); // Reusing Users icon for now or need a new one
    }

    if (user.role === 'agent') {
        navItems.push({ name: 'Leads', href: '/dashboard/leads', icon: Icons.Users });
    }

    // Add Settings at the end
    navItems.push({ name: 'Settings', href: '/dashboard/settings', icon: Icons.Settings });

    return (
        <>
            <div
                className={`fixed inset-0 bg-gray-900/50 z-40 md:hidden transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={() => setIsOpen(false)}
            />

            <aside className={`
                w-64 bg-white border-r border-gray-100 h-screen flex flex-col fixed left-0 top-0 z-50
                transition-transform duration-300 ease-in-out
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                md:translate-x-0
            `}>
                <div className="h-16 flex items-center px-6 border-b border-gray-50">
                    <div className="flex items-center gap-2 font-bold text-lg text-slate-800 tracking-tight">
                        <div className="w-6 h-6 rounded bg-slate-900 flex items-center justify-center text-white text-xs">S</div>
                        SiteBoard
                    </div>
                </div>

                <div className="p-4 space-y-1 overflow-y-auto flex-1">
                    <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3 mt-2">
                        Platform
                    </div>
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setIsOpen(false)}
                                className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all ${isActive
                                    ? 'bg-gray-50 text-slate-900 shadow-sm border border-gray-100'
                                    : 'text-gray-500 hover:bg-gray-50 hover:text-slate-900'
                                    }`}
                            >
                                <item.icon />
                                {item.name}
                            </Link>
                        );
                    })}
                </div>

                <div className="p-4 border-t border-gray-50">
                    <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                        <p className="text-xs font-medium text-gray-500 mb-1 uppercase">Current Plan</p>
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-slate-800">Enterprise</span>
                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
}
