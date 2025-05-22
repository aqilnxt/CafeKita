<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminKasirSeeder extends Seeder
{
    public function run(): void
    {
        // Buat user admin, cek dulu emailnya
        $admin = User::firstOrCreate(
            ['email' => 'admin@cafe.com'],
            [
                'name' => 'Admin',
                'password' => Hash::make('password123'),
                // tambahin field lain kalau perlu
            ]
        );

        // Buat user kasir, cek email juga
        $kasir = User::firstOrCreate(
            ['email' => 'kasir@cafe.com'],
            [
                'name' => 'Kasir',
                'password' => Hash::make('kasir123'),
            ]
        );

        // Pastikan role kasir diassign cuma sekali
        if (!$kasir->hasRole('kasir')) {
            $kasir->assignRole('kasir');
        }
    }
}
