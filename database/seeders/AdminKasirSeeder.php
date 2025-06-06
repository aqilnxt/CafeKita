<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AdminKasirSeeder extends Seeder
{
    public function run(): void
    {
        // Buat atau ambil user admin berdasarkan email
        $admin = User::firstOrCreate(
            ['email' => 'admin@cafe.com'],
            [
                'name' => 'Admin',
                'password' => Hash::make('password123'),
                // tambahkan field lain jika perlu
            ]
        );

        // Buat atau ambil user kasir berdasarkan email
        $kasir = User::firstOrCreate(
            ['email' => 'kasir@cafe.com'],
            [
                'name' => 'Kasir',
                'password' => Hash::make('kasir123'),
            ]
        );

        // Assign role kasir jika belum ada
        if (!$kasir->hasRole('kasir')) {
            $kasir->assignRole('kasir');
        }

        if (!$admin->hasRole('admin')) {
            $admin->assignRole('admin');
        }
        
    }
}
