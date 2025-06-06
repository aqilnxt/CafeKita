<?php

namespace App\Events;

use App\Models\Order;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class OrderStatusUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $order;

    /**
     * Buat instance baru dari event ini.
     *
     * @param  Order  $order
     * @return void
     */
    public function __construct(Order $order)
    {
        $this->order = $order;
    }

    /**
     * Tentukan saluran untuk menyiarkan event ini.
     *
     * @return Channel
     */
    public function broadcastOn()
    {
        // Broadcast ke private channel berdasarkan user_id dari order
        return new PrivateChannel('orders.' . $this->order->user_id);
    }

    /**
     * Data yang akan disiarkan saat event ini dipancarkan.
     *
     * @return array
     */
    public function broadcastWith()
    {
        return [
            'id' => $this->order->id, // ID pesanan
            'status' => $this->order->status, // Status pesanan
            'status_label' => $this->order->status_label, // Label status yang lebih manusiawi
            'updated_at' => $this->order->updated_at->diffForHumans(), // Waktu pembaruan status
        ];
    }
}
