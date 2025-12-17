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
        Schema::table('stores', function (Blueprint $table) {
            $table->json('business_hours')->nullable()->after('description');
            $table->json('regular_holidays')->nullable()->after('business_hours');
            $table->json('temporary_closures')->nullable()->after('regular_holidays');
            $table->integer('min_reservation_unit')->default(30)->after('temporary_closures');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('stores', function (Blueprint $table) {
            $table->dropColumn([
                'business_hours',
                'regular_holidays',
                'temporary_closures',
                'min_reservation_unit',
            ]);
        });
    }
};
