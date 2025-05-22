import React from 'react';
import { Head, Link } from '@inertiajs/react';
import KasirLayout from '@/layouts/KasirLayout';
import { ShoppingCartIcon, ClipboardDocumentListIcon } from '@heroicons/react/24/outline';

interface Props {
    auth: {
        user: any;
    };
}

export default function Dashboard({ auth }: Props) {
    return (
        <KasirLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-6">Selamat Datang, {auth.user.name}!</h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <Link
                                    href={route('kasir.transactions.create')}
                                    className="flex items-center p-6 bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow"
                                >
                                    <div className="p-3 rounded-full bg-[#967259] bg-opacity-10">
                                        <ShoppingCartIcon className="h-8 w-8 text-[#967259]" />
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-lg font-medium text-gray-900">Transaksi Baru</h3>
                                        <p className="mt-1 text-sm text-gray-500">Buat transaksi baru untuk pelanggan</p>
                                    </div>
                                </Link>

                                <Link
                                    href={route('kasir.orders.index')}
                                    className="flex items-center p-6 bg-white border rounded-lg shadow-sm hover:shadow-md transition-shadow"
                                >
                                    <div className="p-3 rounded-full bg-[#967259] bg-opacity-10">
                                        <ClipboardDocumentListIcon className="h-8 w-8 text-[#967259]" />
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-lg font-medium text-gray-900">Daftar Pesanan</h3>
                                        <p className="mt-1 text-sm text-gray-500">Lihat dan kelola pesanan pelanggan</p>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </KasirLayout>
    );
}
