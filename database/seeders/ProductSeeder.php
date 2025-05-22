<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\Category;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        $categories = Category::pluck('id', 'name');

        $products = [
            // Menu Kopi
            [
                'name' => 'Espresso',
                'price' => 18000,
                'category_id' => $categories['Minuman Kopi'] ?? 1,  
                'description' => 'Espresso shot, kopi pekat khas Italia.',
            ],
            [
                'name' => 'Americano',
                'price' => 20000,
                'category_id' => $categories['Minuman Kopi'] ?? 1,
                'description' => 'Espresso dengan tambahan air panas.',
            ],
            [
                'name' => 'Cappuccino',
                'price' => 25000,
                'category_id' => $categories['Minuman Kopi'] ?? 1,
                'description' => 'Espresso, susu, dan foam susu.',
            ],
            [
                'name' => 'Latte',
                'price' => 25000,
                'category_id' => $categories['Minuman Kopi'] ?? 1,
                'description' => 'Espresso dan susu steamed.',
            ],
            [
                'name' => 'Caramel Macchiato',
                'price' => 28000,
                'category_id' => $categories['Minuman Kopi'] ?? 1,
                'description' => 'Latte dengan sirup caramel.',
            ],
            [
                'name' => 'Mocha',
                'price' => 27000,
                'category_id' => $categories['Minuman Kopi'] ?? 1,
                'description' => 'Kopi, coklat, dan susu.',
            ],
            [
                'name' => 'Affogato',
                'price' => 30000,
                'category_id' => $categories['Minuman Kopi'] ?? 1,
                'description' => 'Espresso dengan es krim vanilla.',
            ],
            [
                'name' => 'Kopi Susu Gula Aren',
                'price' => 22000,
                'category_id' => $categories['Minuman Kopi'] ?? 1,
                'description' => 'Kopi susu dengan gula aren khas Indonesia.',
            ],
            [
                'name' => 'Kopi Tubruk',
                'price' => 15000,
                'category_id' => $categories['Minuman Kopi'] ?? 1,
                'description' => 'Kopi hitam tradisional Indonesia.',
            ],
            [
                'name' => 'Cold Brew',
                'price' => 24000,
                'category_id' => $categories['Minuman Kopi'] ?? 1,
                'description' => 'Kopi seduh dingin, segar dan ringan.',
            ],
            [
                'name' => 'Kopi Vietnam Drip',
                'price' => 23000,
                'category_id' => $categories['Minuman Kopi'] ?? 1,
                'description' => 'Kopi Vietnam dengan susu kental manis.',
            ],
            [
                'name' => 'Kopi Irish',
                'price' => 32000,
                'category_id' => $categories['Minuman Kopi'] ?? 1,
                'description' => 'Kopi dengan krim dan sedikit whiskey flavor.',
            ],
            [
                'name' => 'Kopi Hazelnut',
                'price' => 26000,
                'category_id' => $categories['Minuman Kopi'] ?? 1,
                'description' => 'Kopi dengan sirup hazelnut.',
            ],
            [
                'name' => 'Kopi Vanilla Latte',
                'price' => 26000,
                'category_id' => $categories['Minuman Kopi'] ?? 1,
                'description' => 'Latte dengan sirup vanilla.',
            ],
            // Minuman Non-Kopi
            [
                'name' => 'Teh Manis',
                'price' => 10000,
                'category_id' => $categories['Minuman Non-Kopi'] ?? 2,
                'description' => 'Teh manis hangat atau dingin.',
            ],
            [
                'name' => 'Lemon Tea',
                'price' => 12000,
                'category_id' => $categories['Minuman Non-Kopi'] ?? 2,
                'description' => 'Teh dengan perasan lemon segar.',
            ],
            [
                'name' => 'Matcha Latte',
                'price' => 25000,
                'category_id' => $categories['Minuman Non-Kopi'] ?? 2,
                'description' => 'Susu dengan bubuk matcha.',
            ],
            // Makanan Berat
            [
                'name' => 'Nasi Goreng',
                'price' => 25000,
                'category_id' => $categories['Makanan Berat'] ?? 3,
                'description' => 'Nasi goreng spesial dengan telur.',
            ],
            [
                'name' => 'Mie Goreng',
                'price' => 22000,
                'category_id' => $categories['Makanan Berat'] ?? 3,
                'description' => 'Mie goreng dengan sayur dan ayam.',
            ],
            // Makanan Ringan
            [
                'name' => 'Roti Bakar',
                'price' => 12000,
                'category_id' => $categories['Makanan Ringan'] ?? 4,
                'description' => 'Roti bakar coklat keju.',
            ],
            [
                'name' => 'French Fries',
                'price' => 15000,
                'category_id' => $categories['Makanan Ringan'] ?? 4,
                'description' => 'Kentang goreng renyah.',
            ],
            // Dessert
            [
                'name' => 'Pudding Coklat',
                'price' => 13000,
                'category_id' => $categories['Dessert'] ?? 5,
                'description' => 'Puding coklat lembut dengan vla.',
            ],
            [
                'name' => 'Cheesecake',
                'price' => 20000,
                'category_id' => $categories['Dessert'] ?? 5,
                'description' => 'Cheesecake lembut dan creamy.',
            ],
            // Snack
            [
                'name' => 'Keripik Kentang',
                'price' => 8000,
                'category_id' => $categories['Snack'] ?? 6,
                'description' => 'Keripik kentang renyah.',
            ],
            [
                'name' => 'Onion Ring',
                'price' => 10000,
                'category_id' => $categories['Snack'] ?? 6,
                'description' => 'Cincin bawang goreng renyah.',
            ],
        ];

        foreach ($products as $product) {
            Product::firstOrCreate(
                ['name' => $product['name']],
                array_merge($product, ['stock' => 50])
            );
        }
    }
} 