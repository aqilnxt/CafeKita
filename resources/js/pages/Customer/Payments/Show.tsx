import React, { useEffect } from 'react';
import { Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/layouts/AuthenticatedLayout';
import { Order, PageProps } from '@/types';
import { router } from '@inertiajs/react';

declare global {
    interface Window {
        snap: any;
    }
}

interface Props extends PageProps {
    order: Order;
    snapToken: string;
}

export default function Show({ auth, order, snapToken }: Props) {
    useEffect(() => {
        // Load Midtrans Snap
        const script = document.createElement('script');
        script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
        script.setAttribute('data-client-key', import.meta.env.VITE_MIDTRANS_CLIENT_KEY);
        script.async = true;
        document.body.appendChild(script);

        script.onload = () => {
            window.snap.pay(snapToken, {
                onSuccess: function(result: any) {
                    router.visit(route('customer.orders.show', order.id), {
                        method: 'get',
                        preserveScroll: true,
                        onSuccess: () => {
                            // Show success message
                        },
                    });
                },
                onPending: function(result: any) {
                    router.visit(route('customer.orders.show', order.id), {
                        method: 'get',
                        preserveScroll: true,
                        onSuccess: () => {
                            // Show pending message
                        },
                    });
                },
                onError: function(result: any) {
                    router.visit(route('customer.orders.show', order.id), {
                        method: 'get',
                        preserveScroll: true,
                        onSuccess: () => {
                            // Show error message
                        },
                    });
                },
                onClose: function() {
                    router.visit(route('customer.orders.show', order.id), {
                        method: 'get',
                        preserveScroll: true,
                    });
                }
            });
        };

        return () => {
            document.body.removeChild(script);
        };
    }, [snapToken]);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Pembayaran</h2>}
        >
            <Head title="Pembayaran" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <h3 className="text-lg font-medium mb-4">Detail Pesanan</h3>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-gray-600">ID Pesanan</p>
                                    <p className="font-medium">{order.id}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Total</p>
                                    <p className="font-medium">Rp {order.total.toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Status</p>
                                    <p className="font-medium">{order.status}</p>
                                </div>
                            </div>

                            <div className="mt-8">
                                <h4 className="text-lg font-medium mb-4">Item Pesanan</h4>
                                <div className="space-y-4">
                                    {order.items.map((item) => (
                                        <div key={item.id} className="flex justify-between items-center">
                                            <div>
                                                <p className="font-medium">{item.product.name}</p>
                                                <p className="text-sm text-gray-600">
                                                    {item.quantity} x Rp {item.price.toLocaleString()}
                                                </p>
                                            </div>
                                            <p className="font-medium">
                                                Rp {(item.quantity * item.price).toLocaleString()}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-8">
                                <p className="text-sm text-gray-600">
                                    Silakan selesaikan pembayaran Anda menggunakan metode pembayaran yang tersedia.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
} 