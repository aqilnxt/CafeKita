<?php

namespace App\Http\Controllers\Kasir;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;

class KasirController extends Controller
{
    public function dashboard()
    {
        $todayTransactions = Transaction::whereDate('created_at', today())
            ->selectRaw('COUNT(*) as count, SUM(total) as total')
            ->first();

        $pendingOrders = Order::with('user')
            ->where('status', 'pending')
            ->latest()
            ->take(5)
            ->get();

        return Inertia::render('Kasir/Dashboard', [
            'todayTransactions' => [
                'count' => $todayTransactions->count ?? 0,
                'total' => $todayTransactions->total ?? 0,
            ],
            'pendingOrders' => $pendingOrders
        ]);
    }
} 