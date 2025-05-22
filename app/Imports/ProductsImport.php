<?php

namespace App\Imports;

use App\Models\Product;
use Maatwebsite\Excel\Concerns\ToModel;
use Maatwebsite\Excel\Concerns\WithHeadingRow;
use Maatwebsite\Excel\Concerns\WithValidation;

class ProductsImport implements ToModel, WithHeadingRow, WithValidation
{
    public function model(array $row)
    {
        return new Product([
            'name' => $row['nama'],
            'description' => $row['deskripsi'],
            'price' => $row['harga'],
            'stock' => $row['stok'],
            'category_id' => $row['kategori_id'],
            'image' => $row['gambar'] ?? 'default.jpg',
        ]);
    }

    public function rules(): array
    {
        return [
            'nama' => 'required|string|max:255',
            'deskripsi' => 'required|string',
            'harga' => 'required|numeric|min:0',
            'stok' => 'required|integer|min:0',
            'kategori_id' => 'required|exists:categories,id',
            'gambar' => 'nullable|string|max:255',
        ];
    }
} 