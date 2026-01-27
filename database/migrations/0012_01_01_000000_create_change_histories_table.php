<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('change_histories', function (Blueprint $table) {
            $table->id();

            // Relación polimórfica
            $table->string('entity_type');
            $table->unsignedBigInteger('entity_id');

            // Acción controlada
            $table->enum('action', ['created', 'updated', 'deleted']);

            // Cambios
            $table->json('old_values')->nullable();
            $table->json('new_values')->nullable();

            // Usuario
            $table->foreignId('user_id')
                ->nullable()
                ->constrained()
                ->nullOnDelete();

            // Metadata
            $table->ipAddress('ip_address')->nullable();
            $table->text('user_agent')->nullable();

            $table->timestamps();

            // Índices para performance
            $table->index(['entity_type', 'entity_id']);
            
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('change_histories');
    }
};
