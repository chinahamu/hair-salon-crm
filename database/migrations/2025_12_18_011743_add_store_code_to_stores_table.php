<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('stores', function (Blueprint $table) {
            $table->string('store_code')->nullable()->after('id');
        });

        // Backfill existing stores
        $stores = DB::table('stores')->get();
        foreach ($stores as $store) {
            DB::table('stores')
                ->where('id', $store->id)
                ->update(['store_code' => \Illuminate\Support\Str::random(10)]);
        }

        Schema::table('stores', function (Blueprint $table) {
            $table->string('store_code')->nullable(false)->unique()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('stores', function (Blueprint $table) {
            $table->dropColumn('store_code');
        });
    }
};
