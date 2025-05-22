import React from 'react';
import { Head, useForm } from '@inertiajs/react';
import KasirLayout from '@/layouts/KasirLayout';
import { Order, PageProps } from '@/types';

interface Props extends PageProps {
    order: Order;
}

export default function Show({ auth, order }: Props) {
    const { patch } = useForm();

    const updateStatus = (status: string) => {
        patch(route('kasir.orders.update-status', order.id), {
            status: status
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'processing':
                return 'bg-blue-100 text-blue-800';
            case 'ready':
                return 'bg-green-100 text-green-800';
            case 'completed':
                return 'bg-gray-100 text-gray-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'pending':
                return 'Menunggu';
            case 'processing':
                return 'Diproses';
            case 'ready':
                return 'Siap Diambil';
            case 'completed':
                return 'Selesai';
            case 'cancelled':
                return 'Dibatalkan';
            default:
                return status;
        }
    };

    return (
        <KasirLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Detail Pesanan</h2>}
        >
            <Head title="Detail Pesanan" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            {/* Informasi Pesanan */}
                            <div className="mb-8">
                                <h3 className="text-lg font-medium mb-4">Informasi Pesanan</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-500">ID Pesanan</p>
                                        <p className="font-medium">#{order.id}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Pelanggan</p>
                                        <p className="font-medium">{order.user.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Total</p>
                                        <p className="font-medium">Rp {order.total_amount.toLocaleString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Tanggal</p>
                                        <p className="font-medium">{new Date(order.created_at).toLocaleDateString()}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Status Pesanan */}
                            <div className="mb-8">
                                <h3 className="text-lg font-medium mb-4">Status Pesanan</h3>
                                <div className="flex items-center space-x-4">
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                                        {getStatusLabel(order.status)}
                                    </span>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => updateStatus('processing')}
                                            className={`px-3 py-1 rounded text-sm ${
                                                order.status === 'processing'
                                                    ? 'bg-blue-500 text-white'
                                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                            }`}
                                        >
                                            Proses
                                        </button>
                                        <button
                                            onClick={() => updateStatus('ready')}
                                            className={`px-3 py-1 rounded text-sm ${
                                                order.status === 'ready'
                                                    ? 'bg-green-500 text-white'
                                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                            }`}
                                        >
                                            Siap
                                        </button>
                                        <button
                                            onClick={() => updateStatus('completed')}
                                            className={`px-3 py-1 rounded text-sm ${
                                                order.status === 'completed'
                                                    ? 'bg-gray-500 text-white'
                                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                            }`}
                                        >
                                            Selesai
                                        </button>
                                        <button
                                            onClick={() => updateStatus('cancelled')}
                                            className={`px-3 py-1 rounded text-sm ${
                                                order.status === 'cancelled'
                                                    ? 'bg-red-500 text-white'
                                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                            }`}
                                        >
                                            Batalkan
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Daftar Item */}
                            <div>
                                <h3 className="text-lg font-medium mb-4">Daftar Item</h3>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Produk
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Harga
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Jumlah
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Subtotal
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {order.items.map((item) => (
                                                <tr key={item.id}>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <div className="flex items-center">
                                                            <img
                                                                src={`/images/menu/${item.product.image}`}
                                                                alt={item.product.name}
                                                                className="w-10 h-10 object-cover rounded"
                                                            />
                                                            <div className="ml-4">
                                                                <div className="text-sm font-medium text-gray-900">
                                                                    {item.product.name}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        Rp {item.price.toLocaleString()}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {item.quantity}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        Rp {(item.price * item.quantity).toLocaleString()}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </KasirLayout>
    );
} 