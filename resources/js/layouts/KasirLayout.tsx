import React, { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import {
    HomeIcon,
    ShoppingCartIcon,
    ClipboardDocumentListIcon,
    ArrowLeftOnRectangleIcon,
    UserCircleIcon,
} from '@heroicons/react/24/outline';

interface Props {
    children: React.ReactNode;
    user: any;
    header?: React.ReactNode;
}

const navigation = [
    { name: 'Dashboard', href: route('kasir.dashboard'), icon: HomeIcon },
    { name: 'Transaksi Baru', href: route('kasir.transactions.create'), icon: ShoppingCartIcon },
    { name: 'Pesanan', href: route('kasir.orders.index'), icon: ClipboardDocumentListIcon },
];

export default function KasirLayout({ children, user, header }: Props) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Mobile sidebar */}
            <div
                className={`fixed inset-0 z-40 lg:hidden ${
                    sidebarOpen ? 'block' : 'hidden'
                }`}
            >
                <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
                <div className="fixed inset-y-0 left-0 flex w-72 flex-col bg-white">
                    <div className="flex h-16 items-center justify-between px-4 border-b">
                        <h1 className="text-xl font-bold text-[#967259]">Kopi Kita</h1>
                        <button
                            type="button"
                            className="text-gray-500 hover:text-gray-600"
                            onClick={() => setSidebarOpen(false)}
                        >
                            <span className="sr-only">Close sidebar</span>
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                    <div className="flex-1 overflow-y-auto px-4 py-4">
                        <nav className="space-y-1">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-lg ${
                                        route().current(item.href)
                                            ? 'bg-[#967259] text-white'
                                            : 'text-gray-700 hover:bg-[#967259] hover:text-white'
                                    }`}
                                >
                                    <item.icon
                                        className={`mr-3 h-6 w-6 flex-shrink-0 ${
                                            route().current(item.href)
                                                ? 'text-white'
                                                : 'text-gray-500 group-hover:text-white'
                                        }`}
                                    />
                                    {item.name}
                                </Link>
                            ))}
                        </nav>
                    </div>
                    <div className="border-t border-gray-200 p-4">
                        <div className="relative">
                            <button
                                onClick={() => setProfileOpen(!profileOpen)}
                                className="flex items-center w-full text-left focus:outline-none"
                            >
                                <div className="flex-shrink-0">
                                    <div className="h-8 w-8 rounded-full bg-[#967259] flex items-center justify-center text-white">
                                        {user.name.charAt(0)}
                                    </div>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-gray-700">{user.name}</p>
                                    <p className="text-xs text-gray-500">Kasir</p>
                                </div>
                            </button>
                            {profileOpen && (
                                <div className="absolute bottom-full left-0 mb-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                                    <div className="py-1">
                                        <Link
                                            href={route('profile.edit')}
                                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            <UserCircleIcon className="h-5 w-5 mr-2 text-gray-500" />
                                            Profil
                                        </Link>
                                        <Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-2 text-gray-500" />
                                            Keluar
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Desktop sidebar */}
            <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
                <div className="flex min-h-0 flex-1 flex-col border-r border-gray-200 bg-white">
                    <div className="flex h-16 items-center px-4 border-b">
                        <h1 className="text-xl font-bold text-[#967259]">Kopi Kita</h1>
                    </div>
                    <div className="flex flex-1 flex-col overflow-y-auto px-4 py-4">
                        <nav className="space-y-1">
                            {navigation.map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className={`group flex items-center px-2 py-2 text-sm font-medium rounded-lg ${
                                        route().current(item.href)
                                            ? 'bg-[#967259] text-white'
                                            : 'text-gray-700 hover:bg-[#967259] hover:text-white'
                                    }`}
                                >
                                    <item.icon
                                        className={`mr-3 h-6 w-6 flex-shrink-0 ${
                                            route().current(item.href)
                                                ? 'text-white'
                                                : 'text-gray-500 group-hover:text-white'
                                        }`}
                                    />
                                    {item.name}
                                </Link>
                            ))}
                        </nav>
                    </div>
                    <div className="border-t border-gray-200 p-4">
                        <div className="relative">
                            <button
                                onClick={() => setProfileOpen(!profileOpen)}
                                className="flex items-center w-full text-left focus:outline-none"
                            >
                                <div className="flex-shrink-0">
                                    <div className="h-8 w-8 rounded-full bg-[#967259] flex items-center justify-center text-white">
                                        {user.name.charAt(0)}
                                    </div>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-gray-700">{user.name}</p>
                                    <p className="text-xs text-gray-500">Kasir</p>
                                </div>
                            </button>
                            {profileOpen && (
                                <div className="absolute bottom-full left-0 mb-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                                    <div className="py-1">
                                        <Link
                                            href={route('profile.edit')}
                                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            <UserCircleIcon className="h-5 w-5 mr-2 text-gray-500" />
                                            Profil
                                        </Link>
                                        <Link
                                            href={route('logout')}
                                            method="post"
                                            as="button"
                                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            <ArrowLeftOnRectangleIcon className="h-5 w-5 mr-2 text-gray-500" />
                                            Keluar
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main content */}
            <div className="lg:pl-72">
                <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-white shadow">
                    <button
                        type="button"
                        className="px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#967259] lg:hidden"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <span className="sr-only">Open sidebar</span>
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                        </svg>
                    </button>
                    <div className="flex flex-1 justify-between px-4">
                        <div className="flex flex-1 items-center">
                            {header}
                        </div>
                    </div>
                </div>

                <main className="py-6">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
} 