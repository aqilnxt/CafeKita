<?php

namespace App\Http\Controllers\Kasir;

use App\Http\Controllers\Controller;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Events\OrderStatusUpdated;

class OrderController extends Controller
{
    /**
     * Display a listing of orders for cashier
     */
    public function index()
    {
        try {
            // Ambil data pesanan dengan relasi user dan items
            $orders = Order::with(['user', 'items.product'])
                ->latest()
                ->get();
            
            // Kirim data pesanan ke Inertia
            return Inertia::render('Kasir/Orders/Index', [
                'orders' => $orders
            ]);
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Gagal memuat data pesanan']);
        }
    }

    /**
     * Display the specified order
     */
    public function show(Order $order)
    {
        try {
            // Memuat relasi user dan items produk untuk pesanan
            $order->load(['user', 'items.product']);
            
            // Kirim detail pesanan ke Inertia
            return Inertia::render('Kasir/Orders/Show', [
                'order' => $order
            ]);
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Gagal memuat detail pesanan']);
        }
    }

    /**
     * Update the status of the specified order
     */
    public function updateStatus(Request $request, Order $order)
    {
        try {
            // Validasi status yang diterima
            $validated = $request->validate([
                'status' => 'required|in:pending,processing,ready,completed,cancelled',
            ]);

            // Cek apakah status berbeda dengan yang sekarang
            if ($order->status === $validated['status']) {
                return back()->with('info', 'Status pesanan sudah sesuai');
            }

            // Perbarui status pesanan
            $order->update([
                'status' => $validated['status']
            ]);

            // Siarkan event tentang perubahan status pesanan
            event(new OrderStatusUpdated($order));

            // Kembalikan response dengan pesan sukses
            return back()->with('success', 'Status pesanan berhasil diperbarui');
            
        } catch (\Illuminate\Validation\ValidationException $e) {
            return back()->withErrors($e->validator->errors());
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Gagal memperbarui status pesanan']);
        }
    }
}