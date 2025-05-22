import React, { useState } from 'react';
import { Head } from '@inertiajs/react';
import AdminLayout from '@/layouts/AdminLayout';
import { PageProps } from '@/types';
import {
    ArrowUpIcon,
    ArrowDownIcon,
    CurrencyDollarIcon,
    ShoppingCartIcon,
    ChartBarIcon,
} from '@heroicons/react/24/outline';

type SalesData = {
    date: string;
    total_sales: number;
    total_orders: number;
    average_order_value: number;
};

type Props = PageProps & {
    salesData: SalesData[];
    totalRevenue: number;
    totalOrders: number;
    averageOrderValue: number;
    growthRate: number;
};

export default function Sales({ auth, salesData, totalRevenue, totalOrders, averageOrderValue, growthRate }: Props) {
    const [dateRange, setDateRange] = useState('week');

    const stats = [
        {
            name: 'Total Pendapatan',
            value: `Rp ${totalRevenue.toLocaleString('id-ID')}`,
            change: `${growthRate}%`,
            changeType: growthRate >= 0 ? 'increase' : 'decrease',
            icon: CurrencyDollarIcon,
        },
        {
            name: 'Total Pesanan',
            value: totalOrders.toLocaleString('id-ID'),
            change: `${growthRate}%`,
            changeType: growthRate >= 0 ? 'increase' : 'decrease',
            icon: ShoppingCartIcon,
        },
        {
            name: 'Rata-rata Nilai Pesanan',
            value: `Rp ${averageOrderValue.toLocaleString('id-ID')}`,
            change: `${growthRate}%`,
            changeType: growthRate >= 0 ? 'increase' : 'decrease',
            icon: ChartBarIcon,
        },
    ];

    return (
        <AdminLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Laporan Penjualan</h2>}
        >
            <Head title="Laporan Penjualan" />

            <div className="bg-white rounded-lg shadow">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-medium text-gray-900">Ringkasan Penjualan</h3>
                        <select
                            value={dateRange}
                            onChange={(e) => setDateRange(e.target.value)}
                            className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-[#967259] focus:border-[#967259] sm:text-sm rounded-md"
                        >
                            <option value="today">Hari Ini</option>
                            <option value="week">Minggu Ini</option>
                            <option value="month">Bulan Ini</option>
                            <option value="year">Tahun Ini</option>
                        </select>
                    </div>

                    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {stats.map((item) => (
                            <div
                                key={item.name}
                                className="relative bg-white pt-5 px-4 pb-12 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden"
                            >
                                <dt>
                                    <div className="absolute bg-[#967259] rounded-md p-3">
                                        <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
                                    </div>
                                    <p className="ml-16 text-sm font-medium text-gray-500 truncate">{item.name}</p>
                                </dt>
                                <dd className="ml-16 pb-6 flex items-baseline sm:pb-7">
                                    <p className="text-2xl font-semibold text-gray-900">{item.value}</p>
                                    <p
                                        className={`ml-2 flex items-baseline text-sm font-semibold ${
                                            item.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
                                        }`}
                                    >
                                        {item.changeType === 'increase' ? (
                                            <ArrowUpIcon className="h-5 w-5 flex-shrink-0 self-center text-green-500" />
                                        ) : (
                                            <ArrowDownIcon className="h-5 w-5 flex-shrink-0 self-center text-red-500" />
                                        )}
                                        <span className="sr-only">{item.changeType === 'increase' ? 'Increased' : 'Decreased'} by</span>
                                        {item.change}
                                    </p>
                                </dd>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Detail Penjualan</h3>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Tanggal
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Total Penjualan
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Jumlah Pesanan
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Rata-rata Nilai Pesanan
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {salesData.map((data, index) => (
                                        <tr key={index} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {new Date(data.date).toLocaleDateString('id-ID')}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                Rp {data.total_sales.toLocaleString('id-ID')}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {data.total_orders}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                Rp {data.average_order_value.toLocaleString('id-ID')}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}
