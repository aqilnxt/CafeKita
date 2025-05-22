<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Inertia\Inertia;

class TransactionController extends Controller
{
    public function index()
    {
        $transactions = Transaction::with('items.product')->latest()->get();

        return inertia('Admin/Transactions/Index', [
            'transactions' => $transactions,
        ]);
    }

    public function report(Request $request)
    {
        $dateRange = $request->get('dateRange', 'week');
        $startDate = null;
        $endDate = Carbon::now();

        switch ($dateRange) {
            case 'today':
                $startDate = Carbon::today();
                break;
            case 'week':
                $startDate = Carbon::now()->startOfWeek();
                break;
            case 'month':
                $startDate = Carbon::now()->startOfMonth();
                break;
            case 'year':
                $startDate = Carbon::now()->startOfYear();
                break;
            default:
                $startDate = Carbon::now()->startOfWeek();
        }

        $transactions = Transaction::with('items.product')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->get();

        // Hitung total pendapatan
        $totalRevenue = $transactions->sum('total');

        // Hitung total pesanan
        $totalOrders = $transactions->count();

        // Hitung rata-rata nilai pesanan
        $averageOrderValue = $totalOrders > 0 ? $totalRevenue / $totalOrders : 0;

        // Hitung pertumbuhan dari periode sebelumnya
        $previousStartDate = null;
        $previousEndDate = (clone $startDate)->subDay();
        
        switch ($dateRange) {
            case 'today':
                $previousStartDate = (clone $startDate)->subDay();
                break;
            case 'week':
                $previousStartDate = (clone $startDate)->subWeek();
                break;
            case 'month':
                $previousStartDate = (clone $startDate)->subMonth();
                break;
            case 'year':
                $previousStartDate = (clone $startDate)->subYear();
                break;
            default:
                $previousStartDate = (clone $startDate)->subWeek();
        }
        
        $previousTransactions = Transaction::whereBetween('created_at', [$previousStartDate, $previousEndDate])->get();
        $previousRevenue = $previousTransactions->sum('total');
        
        $growthRate = $previousRevenue > 0 
            ? (($totalRevenue - $previousRevenue) / $previousRevenue) * 100 
            : 0;

        // Format data untuk grafik
        $salesData = $transactions->groupBy(function($transaction) {
            return Carbon::parse($transaction->created_at)->format('Y-m-d');
        })->map(function($dayTransactions) {
            $total = $dayTransactions->sum('total');
            $count = $dayTransactions->count();
            return [
                'date' => $dayTransactions->first()->created_at->format('Y-m-d'),
                'total_sales' => $total,
                'total_orders' => $count,
                'average_order_value' => $count > 0 ? $total / $count : 0
            ];
        })->values();

        return inertia('Admin/Reports/Sales', [
            'salesData' => $salesData,
            'totalRevenue' => $totalRevenue,
            'totalOrders' => $totalOrders,
            'averageOrderValue' => $averageOrderValue,
            'growthRate' => round($growthRate, 2)
        ]);
    }
}
