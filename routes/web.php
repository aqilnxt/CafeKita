<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Kasir\TransactionKasirController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\CategoryController;
use App\Http\Controllers\Admin\TransactionController;
use App\Http\Controllers\Admin\CashierController;
use App\Http\Controllers\Customer\CustomerController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use App\Http\Controllers\Customer\ReviewController;
use App\Http\Controllers\Kasir\OrderController;
use App\Http\Controllers\Customer\PaymentController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\Admin\ProductImportController;
use App\Http\Controllers\Kasir\KasirController;

// Menu Routes
Route::get('/', [MenuController::class, 'welcome'])->name('welcome');

// Rute untuk halaman tentang kami
Route::get('/about', function () {
    return Inertia::render('About');
})->name('about');

// Rute untuk halaman kontak
Route::get('/contact', function () {
    return Inertia::render('Contact');
})->name('contact');

// Rute untuk pengguna yang sudah terautentikasi
Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        $user = auth()->user();
        if ($user->hasRole('admin')) {
            return redirect()->route('admin.dashboard');
        } elseif ($user->hasRole('kasir')) {
            return redirect()->route('kasir.dashboard');
        } else {
            return redirect()->route('customer.dashboard');
        }
    })->name('dashboard');
});

// Admin routes
Route::middleware(['auth', 'role:admin'])->prefix('admin')->name('admin.')->group(function () {
    // Dashboard
    Route::get('/dashboard', [App\Http\Controllers\Admin\DashboardController::class, 'index'])->name('dashboard');
    
    // Products
    Route::get('/products/import', [ProductImportController::class, 'showImportForm'])->name('products.import');
    Route::post('/products/import', [ProductImportController::class, 'import'])->name('products.import.store');
    Route::resource('products', ProductController::class);
    
    // Categories
    Route::delete('categories/delete-all', [CategoryController::class, 'deleteAll'])->name('categories.delete-all');
    Route::resource('categories', CategoryController::class);
    
    // Transactions
    Route::get('/transactions', [TransactionController::class, 'index'])->name('transactions.index');
    Route::get('/reports/sales', [TransactionController::class, 'report'])->name('reports.sales');
    Route::resource('transactions', TransactionController::class)->except(['index']);
    
    // Cashiers
    Route::resource('cashiers', CashierController::class);
});

// Kasir routes
Route::middleware(['auth', 'role:kasir'])->prefix('kasir')->name('kasir.')->group(function () {
    Route::get('/dashboard', [App\Http\Controllers\Kasir\KasirController::class, 'dashboard'])->name('dashboard');
    
    // Orders
    Route::get('/orders', [OrderController::class, 'index'])->name('orders.index');
    Route::get('/orders/{order}', [OrderController::class, 'show'])->name('orders.show');
    Route::patch('/orders/{order}/status', [OrderController::class, 'updateStatus'])->name('orders.update-status');
    
    // Transactions
    Route::get('/transactions/create', [TransactionKasirController::class, 'create'])->name('transactions.create');
    Route::post('/transactions', [TransactionKasirController::class, 'store'])->name('transactions.store');
    Route::get('/invoice/{id}', [TransactionKasirController::class, 'invoice'])->name('invoice');
});

// Customer routes
Route::middleware(['auth', 'role:customer'])->prefix('customer')->name('customer.')->group(function () {
    Route::get('/dashboard', [CustomerController::class, 'dashboard'])->name('dashboard');
    Route::get('/menu', [CustomerController::class, 'menu'])->name('menu');
    Route::get('/orders', [CustomerController::class, 'orders'])->name('orders');
    Route::get('/orders/{order}', [CustomerController::class, 'showOrder'])->name('orders.show');
    Route::post('/orders', [CustomerController::class, 'storeOrder'])->name('orders.store');
    Route::get('/profile', [CustomerController::class, 'profile'])->name('profile');
    Route::put('/profile', [CustomerController::class, 'updateProfile'])->name('profile.update');

    // Review
    Route::post('/products/{product}/reviews', [ReviewController::class, 'store'])->name('reviews.store');
    Route::put('/reviews/{review}', [ReviewController::class, 'update'])->name('reviews.update');
    Route::delete('/reviews/{review}', [ReviewController::class, 'destroy'])->name('reviews.destroy');

    // Payment routes
    Route::get('/orders/{order}/payment', [PaymentController::class, 'show'])->name('payments.show');
    Route::post('/payments/callback', [PaymentController::class, 'callback'])->name('payments.callback');
});

// Rute untuk tabel
Route::resource('tables', TableController::class);

// Autentikasi dan konfigurasi lainnya
require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
