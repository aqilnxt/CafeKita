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
                abort(403, 'Tidak dapat memberikan review untuk pesanan orang lain');
            }
            
            // Pastikan order sudah completed
            if ($order->status !== 'completed') {
                return back()->withErrors(['message' => 'Pesanan harus selesai sebelum dapat memberikan review']);
            }
        }

        // Cek apakah user sudah pernah memberikan review untuk produk ini
        $existingReview = Review::where('user_id', auth()->id())
            ->where('product_id', $product->id)
            ->first();

        if ($existingReview) {
            return back()->withErrors(['message' => 'Anda sudah memberikan review untuk produk ini']);
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
            abort(403, 'Tidak dapat mengedit review orang lain');
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
            abort(403, 'Tidak dapat menghapus review orang lain');
        }

        $review->delete();

        return back()->with('success', 'Review berhasil dihapus');
    }
}