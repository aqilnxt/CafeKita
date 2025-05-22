<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn('deleted_at');  // Hapus kolom 'deleted_at'
        });
    }
    
    public function down()
    {
        Schema::table('products', function (Blueprint $table) {
            $table->timestamp('deleted_at')->nullable();  // Tambahkan kolom 'deleted_at' lagi
        });
    }
    
};
