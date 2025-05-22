<?php

namespace App\Http\Controllers\Kasir;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TransactionKasirController extends Controller
{
    public function create()
    {
        // Ambil semua produk untuk ditampilkan di form kasir
        $products = Product::all();
        return Inertia::render('Kasir/TransactionForm', [
            'products' => $products,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'cart' => 'required|array',
            'total' => 'required|numeric',
            'paid' => 'required|numeric',
            'change' => 'required|numeric',
        ]);

        $transaction = Transaction::create([
            'user_id' => auth()->id(),
            'total' => $request->total,
            'paid' => $request->paid,
            'change' => $request->change,
        ]);

        foreach ($request->cart as $item) {
            $transaction->items()->create([
                'product_id' => $item['id'],
                'quantity' => $item['quantity'],
                'price' => $item['price'],
                'subtotal' => $item['price'] * $item['quantity'],
            ]);
        }

        return redirect()->route('kasir.invoice', $transaction->id);
    }

    public function invoice($id)
    {
        $transaction = Transaction::with('items.product', 'user')->findOrFail($id);

        return Inertia::render('Kasir/Invoice', [
            'transaction' => $transaction,
        ]);
    }
}
