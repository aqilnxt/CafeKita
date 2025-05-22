<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\Request;

class TransactionController extends Controller
{
    // Menampilkan semua transaksi (jika diperlukan)
    public function index()
    {
        $transactions = Transaction::with('items.product')->latest()->get();
        return inertia('Admin/Transactions/Index', compact('transactions'));
    }

    // Laporan penjualan berdasarkan tanggal
    public function report(Request $request)
    {
        $request->validate([
            'start_date' => 'required|date',
            'end_date'   => 'required|date|after_or_equal:start_date',
        ]);

        $transactions = Transaction::whereBetween('created_at', [
            $request->start_date,
            $request->end_date
        ])->get();

        return inertia('Admin/Reports/SalesReport', compact('transactions'));
    }
}
