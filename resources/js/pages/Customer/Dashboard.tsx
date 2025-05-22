import React from 'react';
import { Head } from '@inertiajs/react';
import CustomerLayout from '@/layouts/CustomerLayout';
import { Order, PageProps } from '@/types';
import { Link } from '@inertiajs/react';

interface Props extends PageProps {
    recentOrders: Order[];
    stats: {
        total_orders: number;
        favorite_products: Array<{
            product: {
                id: number;
                name: string;
                price: number;
                image: string;
            };
            count: number;
        }>;
    };
}

export default function Dashboard({ auth, recentOrders, stats }: Props) {
    return (
        <CustomerLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Dashboard</h2>}
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h3 className="text-lg font-medium mb-4">Selamat Datang, {auth.user.name}!</h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                <Link
                                    href={route('customer.menu')}
                                    className="bg-[#967259] hover:bg-[#7D5A44] text-white rounded-lg p-6 transition duration-150"
                                >
                                    <h4 className="text-lg font-medium mb-2">Lihat Menu</h4>
                                    <p className="text-sm opacity-90">Jelajahi menu kami yang lezat</p>
                                </Link>

                                <Link
                                    href={route('customer.orders')}
                                    className="bg-[#967259] hover:bg-[#7D5A44] text-white rounded-lg p-6 transition duration-150"
                                >
                                    <h4 className="text-lg font-medium mb-2">Pesanan Saya</h4>
                                    <p className="text-sm opacity-90">Lihat status pesanan Anda</p>
                                </Link>

                                <Link
                                    href={route('customer.profile')}
                                    className="bg-[#967259] hover:bg-[#7D5A44] text-white rounded-lg p-6 transition duration-150"
                                >
                                    <h4 className="text-lg font-medium mb-2">Profil Saya</h4>
                                    <p className="text-sm opacity-90">Kelola informasi profil Anda</p>
                                </Link>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <div className="bg-gray-50 p-6 rounded-lg">
                                    <h4 className="text-lg font-medium mb-4">Statistik Pesanan</h4>
                                    <p className="text-2xl font-bold text-[#967259]">{stats.total_orders}</p>
                                    <p className="text-sm text-gray-500">Total Pesanan</p>
                                </div>

                                <div className="bg-gray-50 p-6 rounded-lg">
                                    <h4 className="text-lg font-medium mb-4">Produk Favorit</h4>
                                    {stats.favorite_products.length > 0 ? (
                                        <div className="space-y-2">
                                            {stats.favorite_products.map((item) => (
                                                <div key={item.product.id} className="flex items-center">
                                                    <img
                                                        src={`/images/menu/${item.product.image}`}
                                                        alt={item.product.name}
                                                        className="w-10 h-10 object-cover rounded"
                                                    />
                                                    <div className="ml-3">
                                                        <p className="text-sm font-medium">{item.product.name}</p>
                                                        <p className="text-xs text-gray-500">Dipesan {item.count} kali</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-sm text-gray-500">Belum ada produk favorit</p>
                                    )}
                                </div>
                            </div>

                            <div className="mt-8">
                                <h4 className="text-lg font-medium mb-4">Pesanan Terakhir</h4>
                                {recentOrders.length > 0 ? (
                                    <div className="bg-white shadow overflow-hidden sm:rounded-md">
                                        <ul className="divide-y divide-gray-200">
                                            {recentOrders.map((order) => (
                                                <li key={order.id}>
                                                    <Link
                                                        href={route('customer.orders.show', order.id)}
                                                        className="block hover:bg-gray-50"
                                                    >
                                                        <div className="px-4 py-4 sm:px-6">
                                                            <div className="flex items-center justify-between">
                                                                <div className="flex items-center">
                                                                    <p className="text-sm font-medium text-[#967259] truncate">
                                                                        Pesanan #{order.id}
                                                                    </p>
                                                                    <p className={`ml-2 px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                                        order.status === 'completed' ? 'bg-green-100 text-green-800' :
                                                                        order.status === 'processing' ? 'bg-yellow-100 text-yellow-800' :
                                                                        order.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                                        'bg-gray-100 text-gray-800'
                                                                    }`}>
                                                                        {order.status}
                                                                    </p>
                                                                </div>
                                                                <div className="ml-2 flex-shrink-0 flex">
                                                                    <p className="text-sm text-gray-500">
                                                                        Rp {(Number(order.total_amount) || 0).toLocaleString('id-ID')}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <div className="mt-2 sm:flex">
                                                                <p className="flex items-center text-sm text-gray-500">
                                                                    {new Date(order.created_at).toLocaleDateString()}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ) : (
                                    <p className="text-gray-500">Belum ada pesanan</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </CustomerLayout>
    );
} 