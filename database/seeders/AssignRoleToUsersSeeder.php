<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use Spatie\Permission\Models\Role;

class AssignRoleToUsersSeeder extends Seeder
{
    public function run(): void
    {
        // Pastikan role sudah ada
        $adminRole = Role::firstOrCreate(['name' => 'admin']);
        $kasirRole = Role::firstOrCreate(['name' => 'kasir']);
        $customerRole = Role::firstOrCreate(['name' => 'customer']);

        // Assign role ke user berdasarkan email

        // Admin
        $admin = User::firstOrCreate(
            ['email' => 'admin@example.com'],  // Gunakan email untuk memastikan user tersebut ada
            ['name' => 'Admin User', 'password' => bcrypt('password')]  // Jika belum ada, buat pengguna
        );
        $admin->assignRole($adminRole);

        // Kasir
        $kasir = User::firstOrCreate(
            ['email' => 'kasir@example.com'],  // Gunakan email untuk memastikan user tersebut ada
            ['name' => 'Kasir User', 'password' => bcrypt('password')]  // Jika belum ada, buat pengguna
        );
        $kasir->assignRole($kasirRole);

        // Customer
        $customer = User::firstOrCreate(
            ['email' => 'customer@example.com'],  // Gunakan email untuk memastikan user tersebut ada
            ['name' => 'Customer User', 'password' => bcrypt('password')]  // Jika belum ada, buat pengguna
        );
        $customer->assignRole($customerRole);
    }
}
