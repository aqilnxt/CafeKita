import React from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import { PageProps } from '@/types';
import { Link } from '@inertiajs/react';

interface Props extends PageProps {
    stats: {
        totalProducts: number;
        totalCategories: number;
        totalTransactions: number;
        totalCashiers: number;
        todayRevenue: number;
        monthlyRevenue: number;
    };
}

export default function Dashboard({ auth, stats }: Props) {
    return (
        <AdminLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Pendapatan</h3>
                                <div className="space-y-4">
                                    <div className="bg-blue-50 p-4 rounded-lg">
                                        <p className="text-sm text-blue-600">Hari Ini</p>
                                        <p className="text-2xl font-semibold text-blue-700">
                                            Rp {stats.todayRevenue.toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="bg-green-50 p-4 rounded-lg">
                                        <p className="text-sm text-green-600">Bulan Ini</p>
                                        <p className="text-2xl font-semibold text-green-700">
                                            Rp {stats.monthlyRevenue.toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Statistik</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-purple-50 p-4 rounded-lg">
                                        <p className="text-sm text-purple-600">Total Produk</p>
                                        <p className="text-2xl font-semibold text-purple-700">
                                            {stats.totalProducts}
                                        </p>
                                    </div>
                                    <div className="bg-yellow-50 p-4 rounded-lg">
                                        <p className="text-sm text-yellow-600">Total Kategori</p>
                                        <p className="text-2xl font-semibold text-yellow-700">
                                            {stats.totalCategories}
                                        </p>
                                    </div>
                                    <div className="bg-red-50 p-4 rounded-lg">
                                        <p className="text-sm text-red-600">Total Transaksi</p>
                                        <p className="text-2xl font-semibold text-red-700">
                                            {stats.totalTransactions}
                                        </p>
                                    </div>
                                    <div className="bg-indigo-50 p-4 rounded-lg">
                                        <p className="text-sm text-indigo-600">Total Kasir</p>
                                        <p className="text-2xl font-semibold text-indigo-700">
                                            {stats.totalCashiers}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                            <div className="p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">Aksi Cepat</h3>
                                <div className="space-y-4">
                                    <Link
                                        href={route('admin.products.create')}
                                        className="block w-full text-center bg-blue-500 hover:bg-blue-600 text-white rounded-lg p-4 transition duration-150"
                                    >
                                        Tambah Produk
                                    </Link>
                                    <Link
                                        href={route('admin.categories.create')}
                                        className="block w-full text-center bg-green-500 hover:bg-green-600 text-white rounded-lg p-4 transition duration-150"
                                    >
                                        Tambah Kategori
                                    </Link>
                                    <Link
                                        href={route('admin.cashiers.create')}
                                        className="block w-full text-center bg-purple-500 hover:bg-purple-600 text-white rounded-lg p-4 transition duration-150"
                                    >
                                        Tambah Kasir
                                    </Link>
                                    <Link
                                        href={route('admin.reports.sales')}
                                        className="block w-full text-center bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg p-4 transition duration-150"
                                    >
                                        Lihat Laporan
                                    </Link>
                                </div>
                    </div>
                    </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
