<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Review;
use App\Models\Product;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ReviewController extends Controller
{
    public function store(Request $request, Product $product)
    {
        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000',
            'order_id' => 'nullable|exists:orders,id'
        ]);

        // Pastikan user hanya bisa review produk yang sudah dibeli
        if ($request->order_id) {
            $order = Order::findOrFail($request->order_id);
            if ($order->user_id !== auth()->id()) {
                abort(403);
            }
        }

        $review = Review::create([
            'user_id' => auth()->id(),
            'product_id' => $product->id,
            'order_id' => $request->order_id,
            'rating' => $request->rating,
            'comment' => $request->comment
        ]);

        return back()->with('success', 'Review berhasil ditambahkan');
    }

    public function update(Request $request, Review $review)
    {
        // Pastikan user hanya bisa mengedit review miliknya
        if ($review->user_id !== auth()->id()) {
            abort(403);
        }

        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string|max:1000'
        ]);

        $review->update([
            'rating' => $request->rating,
            'comment' => $request->comment
        ]);

        return back()->with('success', 'Review berhasil diperbarui');
    }

    public function destroy(Review $review)
    {
        // Pastikan user hanya bisa menghapus review miliknya
        if ($review->user_id !== auth()->id()) {
            abort(403);
        }

        $review->delete();

        return back()->with('success', 'Review berhasil dihapus');
    }
} 