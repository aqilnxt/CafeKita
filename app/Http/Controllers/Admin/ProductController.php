<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    // Menampilkan daftar produk
    public function index()
    {
        $products = Product::with('category')->get();
        
        // Tambahkan formatted_price ke setiap produk
        $products->each(function ($product) {
            $product->formatted_price = "Rp " . number_format($product->price, 0, ',', '.');
        });
        
        return inertia('Admin/Products/Index', compact('products'));
    }

    // Menampilkan form untuk membuat produk
    public function create()
    {
        $categories = Category::all();
        return inertia('Admin/Products/Create', compact('categories'));
    }

    // Menyimpan produk yang baru dibuat
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'category_id' => 'required|exists:categories,id',
            'description' => 'nullable|string',
            'stock' => 'required|integer|min:0',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:20480'
        ]);

        // Handle image upload
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = time() . '_' . $image->getClientOriginalName();
            
            // Pastikan direktori ada
            $uploadPath = public_path('images/menu');
            if (!file_exists($uploadPath)) {
                mkdir($uploadPath, 0777, true);
            }
            
            // Upload gambar
            $image->move($uploadPath, $imageName);
            $validated['image'] = $imageName;
            
            \Log::info('Gambar diupload: ' . $imageName);
        } else {
            $validated['image'] = 'default.jpg';
            \Log::info('Menggunakan gambar default');
        }

        $product = Product::create($validated);
        \Log::info('Produk dibuat dengan ID: ' . $product->id);

        return redirect()->route('admin.products.index')
            ->with('success', 'Produk berhasil ditambahkan');
    }

    // Menampilkan form untuk mengedit produk
    public function edit(Product $product)
    {
        $categories = Category::all();
        return inertia('Admin/Products/Edit', compact('product', 'categories'));
    }

    // Memperbarui produk
    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'category_id' => 'required|exists:categories,id',
            'description' => 'nullable|string',
            'stock' => 'required|integer|min:0',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:20480'
        ]);

        // Handle image upload
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = time() . '_' . $image->getClientOriginalName();
            
            // Pastikan direktori ada
            $uploadPath = public_path('images/menu');
            if (!file_exists($uploadPath)) {
                mkdir($uploadPath, 0777, true);
            }
            
            // Hapus gambar lama jika bukan default
            if ($product->image && $product->image !== 'default.jpg') {
                $oldImagePath = public_path('images/menu/' . $product->image);
                if (file_exists($oldImagePath)) {
                    unlink($oldImagePath);
                }
            }
            
            // Upload gambar baru
            $image->move($uploadPath, $imageName);
            $validated['image'] = $imageName;
            
            \Log::info('Gambar diupdate: ' . $imageName);
        } else {
            // Jika tidak ada gambar baru, pertahankan gambar lama
            unset($validated['image']);
            \Log::info('Menggunakan gambar lama: ' . $product->image);
        }

        $product->update($validated);
        \Log::info('Produk diupdate dengan ID: ' . $product->id);

        return redirect()->route('admin.products.index')
            ->with('success', 'Produk berhasil diperbarui');
    }

    // Menghapus produk
    public function destroy(Product $product)
    {
        $product->delete();
        return redirect()->route('admin.products.index');
    }

    // Menampilkan detail produk
    public function show(Product $product)
    {
        $product->formatted_price = "Rp " . number_format($product->price, 0, ',', '.');
        return inertia('Admin/Products/Show', compact('product'));
    }
}
