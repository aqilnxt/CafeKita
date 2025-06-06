<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'items' => 'required|array',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'customer_name' => 'required|string',
            'order_type' => 'required|in:dine_in,takeaway',
            'table_number' => 'nullable|string',
            'notes' => 'nullable|string',
        ]);
    
        try {
            DB::beginTransaction();
    
            $order = Order::create([
                'user_id' => auth()->id(),
                'customer_name' => $request->customer_name,
                'order_type' => $request->order_type,
                'table_number' => $request->table_number,
                'notes' => $request->notes,
                'status' => 'pending',
                'total_amount' => 0,
            ]);
    
            $totalAmount = 0;
    
            foreach ($request->items as $item) {
                $product = Product::findOrFail($item['product_id']);
                
                if ($product->stock < $item['quantity']) {
                    throw new \Exception("Stok {$product->name} tidak mencukupi");
                }
    
                $product->decrement('stock', $item['quantity']);
    
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'quantity' => $item['quantity'],
                    'price' => $product->price,
                    'subtotal' => $product->price * $item['quantity'],
                ]);
    
                $totalAmount += $product->price * $item['quantity'];
            }
    
            $order->update(['total_amount' => $totalAmount]);
    
            DB::commit();
    
            // ✅ Redirect ke halaman sukses
            return redirect()->route('customer.orders.success', $order->id);
    
        } catch (\Exception $e) {
            DB::rollBack();
            return back()->withErrors([
                'message' => 'Terjadi kesalahan: ' . $e->getMessage()
            ]);
        }
    }
    

    public function success(Order $order)
    {
        if ($order->user_id !== auth()->id()) {
            abort(403);
        }

        return Inertia::render('Customer/Payment/OrderSuccess', [
            'message' => 'Pesanan berhasil dibuat',
            'order' => $order->load('items.product'),
            'order_number' => $order->number,
        ]);
    }

}
