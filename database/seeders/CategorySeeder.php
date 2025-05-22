<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Faker\Factory as Faker;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create('id_ID'); // Menggunakan lokal Indonesia

        $categories = [
            ['name' => 'Minuman Kopi'],
            ['name' => 'Minuman Non-Kopi'],
            ['name' => 'Makanan Berat'],
            ['name' => 'Makanan Ringan'],
            ['name' => 'Dessert'],
            ['name' => 'Snack'],
        ];

        foreach ($categories as $category) {
            Category::firstOrCreate($category);
        }

        foreach (range(1, 10) as $index) {
            DB::table('categories')->insert([
                'name' => $faker->word, // Nama kategori acak
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
