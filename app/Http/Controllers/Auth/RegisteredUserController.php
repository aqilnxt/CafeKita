<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Spatie\Permission\Models\Role;
use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Inertia\Response;

class RegisteredUserController extends Controller
{
    /**
     * Show the registration page.
     */
    public function create(): Response
    {
        return Inertia::render('auth/register');
    }

    /**
     * Handle an incoming registration request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        // Validasi input registrasi
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|lowercase|email|max:255|unique:'.User::class,
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
        ]);

        // Cek apakah email milik admin atau kasir
        $adminEmail = 'admin@example.com';
        $kasirEmail = 'kasir@example.com';

        // Membuat user baru
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        // Tentukan role yang sesuai untuk user baru
        if ($request->email == $adminEmail) {
            $role = Role::firstOrCreate(['name' => 'admin']);
        } elseif ($request->email == $kasirEmail) {
            $role = Role::firstOrCreate(['name' => 'kasir']);
        } else {
            $role = Role::firstOrCreate(['name' => 'customer']);
        }

        // Assign role ke user
        $user->assignRole($role);

        // Trigger event Registered
        event(new Registered($user));

        // Login user setelah registrasi
        Auth::login($user);

        // Redirect ke dashboard sesuai role
        return to_route('dashboard');
    }
}
