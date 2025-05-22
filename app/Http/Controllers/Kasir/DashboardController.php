<?php

namespace App\Http\Controllers\Kasir;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $pendingOrders = Order::where('status', 'pending')
            ->with('user')
            ->latest()
            ->get();

        $todayTransactions = Transaction::whereDate('created_at', today())
            ->selectRaw('SUM(total) as total, COUNT(*) as count')
            ->first();

        return Inertia::render('Kasir/Dashboard', [
            'pendingOrders' => $pendingOrders,
            'todayTransactions' => [
                'total' => $todayTransactions->total ?? 0,
                'count' => $todayTransactions->count ?? 0
            ]
        ]);
    }
} 