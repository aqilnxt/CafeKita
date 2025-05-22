import React, { useEffect, useState } from 'react';
import { Link } from '@inertiajs/react';
import Echo from 'laravel-echo';

interface OrderStatus {
    id: number;
    status: string;
    status_label: string;
    updated_at: string;
}

const OrderStatusNotification: React.FC = () => {
    const [notifications, setNotifications] = useState<OrderStatus[]>([]);

    useEffect(() => {
        const userId = document.querySelector('meta[name="user-id"]')?.getAttribute('content');
        
        if (!userId) return;

        const echo = new Echo({
            broadcaster: 'pusher',
            key: import.meta.env.VITE_PUSHER_APP_KEY,
            cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
            forceTLS: true
        });

        echo.private(`orders.${userId}`)
            .listen('OrderStatusUpdated', (e: any) => {
                setNotifications(prev => [e, ...prev].slice(0, 5));
            });

        return () => {
            echo.leave(`orders.${userId}`);
        };
    }, []);

    if (notifications.length === 0) {
        return null;
    }

    return (
        <div className="fixed bottom-4 right-4 z-50">
            {notifications.map((notification) => (
                <div
                    key={`${notification.id}-${notification.updated_at}`}
                    className="bg-white rounded-lg shadow-lg p-4 mb-4 w-80"
                >
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-lg font-semibold">Update Status Pesanan</h3>
                            <p className="text-sm text-gray-600">
                                Pesanan #{notification.id}
                            </p>
                            <p className="text-sm font-medium text-indigo-600">
                                {notification.status_label}
                            </p>
                            <p className="text-xs text-gray-500">
                                {notification.updated_at}
                            </p>
                        </div>
                        <Link
                            href={route('customer.orders.show', notification.id)}
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

export default OrderStatusNotification; 