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
        Schema::create('allies_special_cases', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('contact_id')->constrained('allies_contacts')->onDelete('cascade');
            $table->foreignId('operator_entity_id')->constrained('operator_entities')->onDelete('cascade')->nullable();
            $table->string('management_messi');
            $table->string('id_call');
            $table->string('id_messi');
            $table->string('observations');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('allies_special_cases');
    }
};
