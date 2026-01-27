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
        Schema::create('management', function (Blueprint $table) {
            $table->id();
            $table->text('wolkvox_id');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('contact_id')->constrained('contacts')->onDelete('cascade');
            $table->foreignId('payroll_id')->nullable()->constrained('payrolls')->nullOnDelete(); // pagaduria de la gestion
            $table->boolean('solution')->default(1);
            $table->foreignId('consultation_id')->constrained('consultations')->onDelete('cascade');
            $table->foreignId('specific_id')->nullable()->constrained('specifics')->nullOnDelete();
            $table->foreignId('type_management_id')->constrained('type_management')->onDelete('cascade');
            $table->text('comments')->nullable();
            $table->date('solution_date')->nullable();
            $table->foreignId('monitoring_id')->nullable()->constrained('monitoring')->onDelete('cascade');
            $table->boolean('sms')->default(1);
            $table->boolean('wsp')->default(1);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('management');
    }
};