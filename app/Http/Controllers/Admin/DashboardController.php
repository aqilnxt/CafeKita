<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Category;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $stats = [
            'totalProducts' => Product::count(),
            'totalCategories' => Category::count(),
            'totalTransactions' => Transaction::count(),
            'totalCashiers' => User::role('kasir')->count(),
            'todayRevenue' => Transaction::whereDate('created_at', today())->sum('total'),
            'monthlyRevenue' => Transaction::whereMonth('created_at', now()->month)
                ->whereYear('created_at', now()->year)
                ->sum('total')
        ];

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats
        ]);
    }
} 