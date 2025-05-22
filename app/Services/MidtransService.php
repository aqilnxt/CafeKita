<?php

namespace App\Services;

use App\Models\Order;
use Midtrans\Config;
use Midtrans\Snap;

class MidtransService
{
    public function __construct()
    {
        Config::$serverKey = config('services.midtrans.server_key');
        Config::$isProduction = config('services.midtrans.is_production');
        Config::$isSanitized = true;
        Config::$is3ds = true;
    }

    public function createTransaction(Order $order)
    {
        $params = [
            'transaction_details' => [
                'order_id' => 'ORDER-' . $order->id,
                'gross_amount' => (int) $order->total,
            ],
            'customer_details' => [
                'first_name' => $order->user->name,
                'email' => $order->user->email,
            ],
            'item_details' => $this->getItemDetails($order),
        ];

        try {
            $snapToken = Snap::getSnapToken($params);
            return $snapToken;
        } catch (\Exception $e) {
            throw new \Exception('Gagal membuat transaksi: ' . $e->getMessage());
        }
    }

    private function getItemDetails(Order $order)
    {
        $items = [];
        foreach ($order->items as $item) {
            $items[] = [
                'id' => $item->product_id,
                'price' => (int) $item->price,
                'quantity' => $item->quantity,
                'name' => $item->product->name,
            ];
        }
        return $items;
    }

    public function handleCallback($payload)
    {
        $orderId = explode('-', $payload['order_id'])[1];
        $order = Order::findOrFail($orderId);
        
        $payment = $order->payment ?? $order->payment()->create([
            'payment_method' => $payload['payment_type'],
            'amount' => $payload['gross_amount'],
            'status' => $payload['transaction_status'],
            'transaction_id' => $payload['transaction_id'],
            'payment_details' => $payload,
        ]);

        if ($payload['transaction_status'] === 'settlement') {
            $payment->update([
                'status' => 'success',
                'paid_at' => now(),
            ]);
            
            $order->update(['status' => 'processing']);
        } elseif (in_array($payload['transaction_status'], ['expire', 'cancel', 'deny', 'failure'])) {
            $payment->update([
                'status' => 'failed',
            ]);
            
            $order->update(['status' => 'cancelled']);
        }

        return $payment;
    }
} 