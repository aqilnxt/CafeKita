import React, { PropsWithChildren, ReactNode, useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import { PageProps } from '@/types';
import { 
    HomeIcon, 
    ShoppingCartIcon, 
    UserIcon, 
    CreditCardIcon,
    BellIcon,
    Bars3Icon,
    XMarkIcon,
    ArrowRightOnRectangleIcon
} from '@heroicons/react/24/outline';

interface Props {
    user: any;
    header?: ReactNode;
    children: ReactNode;
}

export default function AuthenticatedLayout({ user, header, children }: PropsWithChildren<Props>) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { auth } = usePage<PageProps>().props;

    const navigation = [
        { name: 'Dashboard', href: route('dashboard'), icon: HomeIcon },
        { name: 'Pesanan', href: route('customer.orders.index'), icon: ShoppingCartIcon },
        { name: 'Pembayaran', href: route('customer.payments.index'), icon: CreditCardIcon },
        { name: 'Profil', href: route('profile.edit'), icon: UserIcon },
    ];

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            {/* Mobile sidebar */}
            <div className={`fixed inset-0 z-40 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
                <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)}></div>
                <div className="fixed inset-y-0 left-0 flex w-64 flex-col bg-white dark:bg-gray-800">
                    <div className="flex h-16 items-center justify-between px-4">
                        <Link href={route('dashboard')} className="flex items-center">
                            <img src="/images/logo.png" alt="Logo" className="h-8 w-8" />
                            <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">Kopi Kita</span>
                        </Link>
                        <button onClick={() => setSidebarOpen(false)} className="text-gray-500 hover:text-gray-600">
                            <XMarkIcon className="h-6 w-6" />
                        </button>
                    </div>
                    <nav className="flex-1 space-y-1 px-2 py-4">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="group flex items-center rounded-md px-2 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
                            >
                                <item.icon className="mr-3 h-6 w-6" />
                                {item.name}
                            </Link>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Desktop sidebar */}
            <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
                <div className="flex min-h-0 flex-1 flex-col bg-white dark:bg-gray-800">
                    <div className="flex h-16 items-center px-4">
                        <Link href={route('dashboard')} className="flex items-center">
                            <img src="/images/logo.png" alt="Logo" className="h-8 w-8" />
                            <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">Kopi Kita</span>
                        </Link>
                    </div>
                    <nav className="flex-1 space-y-1 px-2 py-4">
                        {navigation.map((item) => (
                            <Link
                                key={item.name}
                                href={item.href}
                                className="group flex items-center rounded-md px-2 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-700 dark:hover:text-white"
                            >
                                <item.icon className="mr-3 h-6 w-6" />
                                {item.name}
                            </Link>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Main content */}
            <div className="lg:pl-64">
                {/* Top navbar */}
                <div className="sticky top-0 z-10 flex h-16 flex-shrink-0 bg-white dark:bg-gray-800 shadow">
                    <button
                        type="button"
                        className="px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 lg:hidden"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <Bars3Icon className="h-6 w-6" />
                    </button>

                    <div className="flex flex-1 justify-between px-4">
                        <div className="flex flex-1">
                            {header}
                        </div>
                        <div className="ml-4 flex items-center md:ml-6">
                            {/* Notifications */}
                            <button className="rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                                <BellIcon className="h-6 w-6" />
                            </button>

                            {/* Profile dropdown */}
                            <div className="relative ml-3">
                                <div className="flex items-center">
                                    <span className="text-sm text-gray-700 dark:text-gray-300 mr-2">
                                        {user?.name}
                                    </span>
                                    <Link
                                        href={route('logout')}
                                        method="post"
                                        as="button"
                                        className="rounded-full bg-white p-1 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                                    >
                                        <ArrowRightOnRectangleIcon className="h-6 w-6" />
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Page content */}
                <main className="py-6">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
} 