<?php

namespace App\Http\Controllers\Kasir;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index()
    {
        $orders = Order::with(['user', 'items.product'])
            ->latest()
            ->get();

        return Inertia::render('Kasir/Orders/Index', [
            'orders' => $orders
        ]);
    }

    public function show(Order $order)
    {
        $order->load(['user', 'items.product']);
        
        return Inertia::render('Kasir/Orders/Show', [
            'order' => $order
        ]);
    }

    public function updateStatus(Request $request, Order $order)
    {
        $request->validate([
            'status' => 'required|in:pending,processing,ready,completed,cancelled'
        ]);

        $order->update([
            'status' => $request->status
        ]);

        // Notifikasi ke customer tentang perubahan status
        event(new \App\Events\OrderStatusUpdated($order));

        return back()->with('success', 'Status pesanan berhasil diperbarui');
    }
} 