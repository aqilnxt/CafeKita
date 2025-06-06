<?php

namespace App\Http\Controllers\Kasir;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Transaction;
use App\Models\TransactionItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class TransactionKasirController extends Controller
{
    public function create()
    {
        // Ambil semua produk dengan kategori untuk ditampilkan di form kasir
        $products = Product::with('category')->get();
        
        return Inertia::render('Kasir/TransactionForm', [
            'products' => $products,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'payment_method' => 'required|in:cash,qris',
            'cash_amount' => 'required_if:payment_method,cash|numeric|min:0',
            'total_amount' => 'required|numeric|min:0',
        ]);

        DB::beginTransaction();
        
        try {
            // Hitung total dari items
            $calculatedTotal = 0;
            $validatedItems = [];
            
            foreach ($request->items as $item) {
                $product = Product::findOrFail($item['product_id']);
                
                // Cek stok
                if ($product->stock < $item['quantity']) {
                    return back()->withErrors([
                        'items' => "Stok {$product->name} tidak mencukupi. Stok tersedia: {$product->stock}"
                    ]);
                }
                
                $subtotal = $product->price * $item['quantity'];
                $calculatedTotal += $subtotal;
                
                $validatedItems[] = [
                    'product' => $product,
                    'quantity' => $item['quantity'],
                    'price' => $product->price,
                    'subtotal' => $subtotal,
                ];
            }

            // Validasi cash amount untuk payment cash
            if ($request->payment_method === 'cash' && $request->cash_amount < $calculatedTotal) {
                return back()->withErrors([
                    'cash_amount' => 'Jumlah tunai tidak mencukupi'
                ]);
            }

            // Buat transaksi
            $transaction = Transaction::create([
                'user_id' => auth()->id(),
                'total_amount' => $calculatedTotal,
                'payment_method' => $request->payment_method,
                'cash_amount' => $request->payment_method === 'cash' ? $request->cash_amount : null,
                'change_amount' => $request->payment_method === 'cash' ? ($request->cash_amount - $calculatedTotal) : 0,
                'status' => 'completed',
            ]);

            // Buat transaction items dan update stok
            foreach ($validatedItems as $item) {
                TransactionItem::create([
                    'transaction_id' => $transaction->id,
                    'product_id' => $item['product']->id,
                    'quantity' => $item['quantity'],
                    'price' => $item['price'],
                    'subtotal' => $item['subtotal'],
                ]);

                // Update stok produk
                $item['product']->decrement('stock', $item['quantity']);
            }

            DB::commit();

            return redirect()->route('kasir.transactions.invoice', $transaction->id)
                ->with('success', 'Transaksi berhasil diproses');
                
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors([
                'error' => 'Terjadi kesalahan saat memproses transaksi: ' . $e->getMessage()
            ]);
        }
    }

    public function invoice($id)
    {
        $transaction = Transaction::with(['items.product', 'user'])
            ->findOrFail($id);

        return Inertia::render('Kasir/Invoice', [
            'transaction' => $transaction,
        ]);
    }

    public function index()
    {
        $transactions = Transaction::with(['items.product', 'user'])
            ->latest()
            ->paginate(10);

        return Inertia::render('Kasir/Transactions/Index', [
            'transactions' => $transactions,
        ]);
    }
}