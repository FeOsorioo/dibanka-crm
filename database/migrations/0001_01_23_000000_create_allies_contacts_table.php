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
        Schema::create('allies_contacts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('campaign_id')->constrained('campaign')->onDelete('cascade');
            $table->foreignId('payroll_id')->constrained('payrolls')->onDelete('cascade');
            $table->foreignId('operator_entity_id')->constrained('operator_entities')->onDelete('cascade')->nullable();
            $table->string('name');
            $table->string('email');
            $table->string('phone');
            $table->string('update_phone');
            $table->string('identification_type');
            $table->string('identification_number');
            $table->boolean('is_active')->default(1);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('allies_contacts');
    }
};
