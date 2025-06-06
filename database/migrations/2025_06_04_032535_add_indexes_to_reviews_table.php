<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('reviews', function (Blueprint $table) {
            // Mengubah rating dari integer ke tinyInteger dengan unsigned
            $table->tinyInteger('rating')->unsigned()->change();
            
            // Menambahkan index untuk performa yang lebih baik
            $table->index(['product_id', 'rating']);
            $table->index('user_id');
            
            // Menambahkan unique constraint - satu user hanya bisa review satu produk sekali
            $table->unique(['user_id', 'product_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('reviews', function (Blueprint $table) {
            // Menghapus unique constraint
            $table->dropUnique(['user_id', 'product_id']);
            
            // Menghapus index
            $table->dropIndex(['product_id', 'rating']);
            $table->dropIndex(['user_id']);
            
            // Mengubah kembali rating ke integer biasa
            $table->integer('rating')->change();
        });
    }
};