<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Category;
use App\Models\Order;
use App\Models\OrderItem;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Events\NewOrderCreated;

class CustomerController extends Controller
{
    // Menampilkan dashboard customer
    public function dashboard()
    {
        $user = Auth::user();
        $recentOrders = Order::where('user_id', $user->id)
                            ->with('items.product')
                            ->latest()
                            ->take(5)
                            ->get();
        
        $stats = [
            'total_orders' => Order::where('user_id', $user->id)->count(),
            'favorite_products' => $this->getFavoriteProducts(),
        ];
        
        return Inertia::render('Customer/Dashboard', [
            'stats' => $stats,
            'recentOrders' => $recentOrders
        ]);
    }
    
    // Menampilkan daftar menu (produk)
    public function menu()
    {
        $products = Product::with('category')->get();
        $categories = Category::whereHas('products')->get();
        
        return Inertia::render('Customer/Menu', [
            'products' => $products,
            'categories' => $categories
        ]);
    }
    
    // Menampilkan halaman untuk membuat pesanan
    public function createOrder()
    {
        $products = Product::with('category')->get();
        $categories = Category::all();
        
        return Inertia::render('Customer/CreateOrder', [
            'products' => $products,
            'categories' => $categories
        ]);
    }
    
    // Menyimpan pesanan baru
    public function storeOrder(Request $request)
    {
        $request->validate([
            'items' => 'required|array',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        try {
            DB::beginTransaction();

            // Buat order baru
            $order = Order::create([
                'user_id' => Auth::id(),
                'status' => 'pending',
                'total_amount' => 0,
            ]);

            $totalAmount = 0;

            // Tambahkan items ke order
            foreach ($request->items as $item) {
                $product = Product::findOrFail($item['product_id']);
                
                // Cek stok
                if ($product->stock < $item['quantity']) {
                    throw new \Exception("Stok {$product->name} tidak mencukupi");
                }

                // Kurangi stok
                $product->decrement('stock', $item['quantity']);

                // Tambahkan item ke order
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'quantity' => $item['quantity'],
                    'price' => $product->price,
                ]);

                $totalAmount += $product->price * $item['quantity'];
            }

            // Update total amount
            $order->update(['total_amount' => $totalAmount]);

            DB::commit();

            // Broadcast event pesanan baru
            event(new NewOrderCreated($order));

            return response()->json([
                'message' => 'Pesanan berhasil dibuat',
                'order_id' => $order->id
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Terjadi kesalahan: ' . $e->getMessage()
            ], 500);
        }
    }
    
    // Menampilkan daftar pesanan
    public function orders()
    {
        $user = Auth::user();
        $orders = Order::where('user_id', $user->id)
                        ->with('items.product')
                        ->latest()
                        ->get();
        
        return Inertia::render('Customer/Orders', [
            'orders' => $orders
        ]);
    }
    
    // Menampilkan detail pesanan
    public function showOrder(Order $order)
    {
        // Pastikan user hanya bisa melihat pesanannya sendiri
        if (Auth::id() !== $order->user_id) {
            abort(403);
        }
        
        $order->load('items.product');
        
        return Inertia::render('Customer/OrderDetail', [
            'order' => $order
        ]);
    }
    
    // Mendapatkan produk favorit customer
    private function getFavoriteProducts()
    {
        $user = Auth::user();
        
        // Ambil semua item pesanan dari user ini
        $orderItems = Order::where('user_id', $user->id)
                        ->with('items.product')
                        ->get()
                        ->pluck('items')
                        ->flatten();
        
        // Hitung jumlah pembelian per produk
        $productCounts = [];
        foreach ($orderItems as $item) {
            $productId = $item->product_id;
            if (!isset($productCounts[$productId])) {
                $productCounts[$productId] = [
                    'product' => $item->product,
                    'count' => 0
                ];
            }
            $productCounts[$productId]['count'] += $item->quantity;
        }
        
        // Urutkan berdasarkan jumlah pembelian
        usort($productCounts, function($a, $b) {
            return $b['count'] <=> $a['count'];
        });
        
        // Ambil 3 produk teratas
        return array_slice($productCounts, 0, 3);
    }
    
    // Menampilkan profil customer
    public function profile()
    {
        $user = Auth::user();
        
        return Inertia::render('Customer/Profile', [
            'user' => $user
        ]);
    }
    
    // Memperbarui profil customer
    public function updateProfile(Request $request)
    {
        $user = Auth::user();
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,'.$user->id,
            'phone' => 'nullable|string|max:20',
        ]);
        
        $user->update($validated);
        
        return redirect()->route('customer.profile')->with('success', 'Profil berhasil diperbarui!');
    }

    // Menampilkan detail produk
// Tambahkan/update method ini di CustomerController.php

    public function showProduct(Product $product)
    {
        // Load relasi yang diperlukan
        $product->load(['category', 'reviews' => function($query) {
            $query->with('user')->latest();
        }]);
        
        $user = auth()->user();
        
        // Cek apakah user sudah pernah membeli produk ini dan pesanannya completed
        $purchasedOrder = Order::where('user_id', $user->id)
            ->whereHas('items', function ($query) use ($product) {
                $query->where('product_id', $product->id);
            })
            ->where('status', 'completed')
            ->first();
        
        $hasPurchased = $purchasedOrder !== null;
        
        // Cek apakah user sudah memberikan review untuk produk ini
        $existingReview = Review::where('user_id', $user->id)
            ->where('product_id', $product->id)
            ->first();
        
        $hasReviewed = $existingReview !== null;
        $canReview = $hasPurchased && !$hasReviewed;
        
        // Hitung average rating dan total reviews
        $averageRating = $product->reviews->avg('rating') ?? 0;
        $totalReviews = $product->reviews->count();
        
        // Tambahkan data rating ke product
        $product->average_rating = round($averageRating, 1);
        $product->total_reviews = $totalReviews;
        
        return Inertia::render('Customer/ProductDetail', [
            'product' => $product,
            'canReview' => $canReview,
            'orderId' => $hasPurchased ? $purchasedOrder->id : null,
            'existingReview' => $existingReview ? [
                'id' => $existingReview->id,
                'rating' => $existingReview->rating,
                'comment' => $existingReview->comment,
            ] : null,
        ]);
    }
} 