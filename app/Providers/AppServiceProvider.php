<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Route;
use Spatie\Permission\Middleware\RoleMiddleware;
use Inertia\Inertia;



class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Route::aliasMiddleware('role', RoleMiddleware::class);
        Route::aliasMiddleware('permission', PermissionMiddleware::class);
        Route::aliasMiddleware('role_or_permission', RoleOrPermissionMiddleware::class);   
        
        Inertia::share([
            'flash' => function () {
                return [
                    'order_number' => session('order_number'),
                    'success' => session('success'),
                    'error' => session('error'),
                ];
            },
        ]);
    }

    public static function redirectToByRole($user)
    {
        if ($user->hasRole('admin')) {
            return '/admin/dashboard';  // Redirect ke dashboard admin
        } elseif ($user->hasRole('kasir')) {
            return '/kasir/dashboard';  // Redirect ke dashboard kasir
        } else {
            return '/customer/dashboard';  // Redirect ke dashboard customer
        }
    }

}
