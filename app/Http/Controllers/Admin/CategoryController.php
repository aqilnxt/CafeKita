<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    public function index()
    {
        $categories = Category::all();
        return inertia('Admin/Categories/Index', compact('categories'));
    }

    public function create()
    {
        return inertia('Admin/Categories/Create');
    }

    public function store(Request $request)
    {
        // Validasi input
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        // Membuat slug dari nama kategori
        $validated['slug'] = Str::slug($validated['name']);

        // Menyimpan kategori baru
        Category::create($validated);

        return redirect()->route('admin.categories.index');
    }

    public function edit(Category $category)
    {
        return inertia('Admin/Categories/Edit', compact('category'));
    }

    public function update(Request $request, Category $category)
    {
        // Validasi input
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        // Membuat slug baru jika nama kategori berubah
        $validated['slug'] = Str::slug($validated['name']);

        // Update kategori
        $category->update($validated);

        return redirect()->route('admin.categories.index');
    }

    public function destroy(Category $category)
    {
        // Menghapus kategori
        $category->delete();
        return redirect()->route('admin.categories.index');
    }

    public function deleteAll()
    {
        try {
            // Menghapus semua kategori
            Category::truncate();
            return redirect()->back()->with('success', 'Semua kategori berhasil dihapus');
        } catch (\Exception $e) {
            return redirect()->back()->with('error', 'Terjadi kesalahan saat menghapus kategori: ' . $e->getMessage());
        }
    }
}
