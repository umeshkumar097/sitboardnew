"use client";

import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import BrandLogo from './BrandLogo';

const Icons = {
    Menu: () => (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
    ),
    LogOut: () => (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
    ),
    Bell: () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
    )
};

export default function TopNav({ user, onMenuClick }: { user: any, onMenuClick: () => void }) {
    const router = useRouter();
    const pathname = usePathname();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    // Get page title from pathname
    const getPageTitle = () => {
        const parts = pathname.split('/').filter(Boolean);
        if (parts.length === 1) return 'Dashboard';
        return parts[parts.length - 1].split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    };

    const handleLogout = async () => {
        await fetch('/api/auth/logout', { method: 'POST' });
        router.push('/login');
        router.refresh();
    };

    return (
        <header className="h-14 bg-white border-b border-gray-100 flex items-center justify-between px-4 sticky top-0 z-30">
            {/* Left: Mobile Menu & Breadcrumb */}
            <div className="flex items-center gap-4">
                <button onClick={onMenuClick} className="md:hidden text-gray-500 hover:text-slate-900">
                    <Icons.Menu />
                </button>
                <div className="md:hidden">
                    <BrandLogo className="w-5 h-5" textClassName="text-sm" />
                </div>
                <div className="hidden sm:flex flex-col">
                    <h1 className="text-sm font-semibold text-slate-800 tracking-tight leading-tight">
                        {getPageTitle()}
                    </h1>
                </div>
            </div>

            {/* Right: Actions & Profile */}
            <div className="flex items-center gap-3">
                <button className="text-gray-400 hover:text-slate-800 transition-colors relative p-1.5 hover:bg-slate-50 rounded-full">
                    <Icons.Bell />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>

                <div className="border-l border-gray-100 h-6 mx-1 hidden sm:block"></div>

                <div className="relative">
                    <button
                        onClick={() => setDropdownOpen(!dropdownOpen)}
                        className="flex items-center gap-3 appearance-none focus:outline-none group"
                    >
                        <div className="text-right hidden sm:block">
                            <p className="text-xs font-semibold text-slate-700 group-hover:text-slate-900">{user.name}</p>
                            <p className="text-[10px] text-gray-400 mt-0.5 capitalize">{user.role?.replace('_', ' ')}</p>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 text-sm font-bold border border-gray-200 group-hover:border-gray-300 transition-colors">
                            {user.name?.[0]?.toUpperCase() || 'U'}
                        </div>
                    </button>

                    {dropdownOpen && (
                        <>
                            <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)}></div>
                            <div className="absolute right-0 mt-3 w-48 bg-white border border-gray-100 shadow-xl rounded-lg z-20 py-1 animate-in fade-in zoom-in duration-200">
                                <div className="px-4 py-2 border-b border-gray-50 sm:hidden">
                                    <p className="text-sm font-semibold">{user.name}</p>
                                    <p className="text-xs text-gray-500">{user.role}</p>
                                </div>
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                >
                                    <Icons.LogOut />
                                    Sign Out
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
