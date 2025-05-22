<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\Category;
use Inertia\Inertia;

class MenuController extends Controller
{
    public function welcome()
    {
        // Ambil 6 produk terbaru untuk hero section
        $featuredProducts = Product::with('category')
            ->latest()
            ->take(6)
            ->get();

        // Ambil semua kategori
        $categories = Category::all();

        return Inertia::render('welcome', [
            'featuredProducts' => $featuredProducts,
            'categories' => $categories,
        ]);
    }

    public function menu()
    {
        // Ambil semua produk dengan kategori
        $products = Product::with('category')->get();
        
        // Ambil semua kategori
        $categories = Category::all();

        return Inertia::render('menu', [
            'products' => $products,
            'categories' => $categories,
        ]);
    }
} 