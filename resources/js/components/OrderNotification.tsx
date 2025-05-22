import React, { useEffect, useState } from 'react';
import { Link } from '@inertiajs/react';
import Echo from 'laravel-echo';

interface Order {
    id: number;
    user: string;
    total: number;
    status: string;
    created_at: string;
}

const OrderNotification: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);

    useEffect(() => {
        // Subscribe ke channel orders
        const echo = new Echo({
            broadcaster: 'pusher',
            key: import.meta.env.VITE_PUSHER_APP_KEY,
            cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
            forceTLS: true
        });

        echo.private('orders')
            .listen('NewOrderCreated', (e: any) => {
                setOrders(prev => [e, ...prev].slice(0, 5));
            });

        return () => {
            echo.leave('orders');
        };
    }, []);

    if (orders.length === 0) {
        return null;
    }

    return (
        <div className="fixed bottom-4 right-4 z-50">
            {orders.map((order) => (
                <div
                    key={order.id}
                    className="bg-white rounded-lg shadow-lg p-4 mb-4 w-80"
                >
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-lg font-semibold">Pesanan Baru</h3>
                            <p className="text-sm text-gray-600">
                                Dari: {order.user}
                            </p>
                            <p className="text-sm text-gray-600">
                                Total: Rp {order.total.toLocaleString('id-ID')}
                            </p>
                            <p className="text-xs text-gray-500">
                                {order.created_at}
                            </p>
                        </div>
                        <Link
                            href={route('kasir.orders.show', order.id)}
                            className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                        >
                            Lihat Detail
                        </Link>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default OrderNotification; 