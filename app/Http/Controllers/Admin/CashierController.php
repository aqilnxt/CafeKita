<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;

class CashierController extends Controller
{
    /**
     * Menampilkan daftar kasir
     */
    public function index()
    {
        $cashiers = User::role('kasir')->get();
        
        return inertia('Admin/Cashiers/Index', [
            'cashiers' => $cashiers
        ]);
    }

    /**
     * Menampilkan form untuk membuat kasir baru
     */
    public function create()
    {
        return inertia('Admin/Cashiers/Create');
    }

    /**
     * Menyimpan kasir baru
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        $role = Role::firstOrCreate(['name' => 'kasir']);
        $user->assignRole($role);

        return redirect()->route('admin.cashiers.index')->with('message', 'Kasir berhasil ditambahkan');
    }

    /**
     * Menampilkan form edit kasir
     */
    public function edit(User $cashier)
    {
        return inertia('Admin/Cashiers/Edit', [
            'cashier' => $cashier
        ]);
    }

    /**
     * Mengupdate data kasir
     */
    public function update(Request $request, User $cashier)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:users,email,' . $cashier->id,
            'password' => 'nullable|string|min:8|confirmed',
        ]);

        $data = [
            'name' => $validated['name'],
            'email' => $validated['email'],
        ];

        if (!empty($validated['password'])) {
            $data['password'] = Hash::make($validated['password']);
        }

        $cashier->update($data);

        return redirect()->route('admin.cashiers.index')->with('message', 'Kasir berhasil diperbarui');
    }

    /**
     * Menghapus kasir
     */
    public function destroy(User $cashier)
    {
        $cashier->delete();
        
        return redirect()->route('admin.cashiers.index')->with('message', 'Kasir berhasil dihapus');
    }
} 