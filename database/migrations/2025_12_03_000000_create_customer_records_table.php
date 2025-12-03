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
        Schema::create('customer_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('stylist_id')->nullable()->constrained('staff')->nullOnDelete();
            $table->date('visit_date');
            $table->string('hair_type')->nullable(); // e.g., Dry, Oily, Normal, Curly, Straight
            $table->string('scalp_condition')->nullable(); // e.g., Healthy, Dandruff, Sensitive
            $table->text('notes')->nullable(); // Technical notes, color formulas, etc.
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('customer_records');
    }
};
