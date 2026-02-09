"use client";

import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import TopNav from '@/components/TopNav';
import { usePathname } from 'next/navigation';

export default function DashboardLayoutClient({
    children,
    user
}: {
    children: React.ReactNode,
    user: any
}) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const pathname = usePathname();

    // Close sidebar on route change
    useEffect(() => {
        setSidebarOpen(false);
    }, [pathname]);

    return (
        <div className="flex min-h-screen bg-gray-50/50 overscroll-none text-slate-900 font-sans antialiased">
            <Sidebar user={user} isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

            <div className="flex-1 flex flex-col md:ml-64 transition-all duration-300">
                <TopNav user={user} onMenuClick={() => setSidebarOpen(true)} />
                <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
                    {children}
                </main>
            </div>
        </div>
    );
}
