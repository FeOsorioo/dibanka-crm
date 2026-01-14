<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\{
    ActivityLogController,
    AuthController,
    ContactController,
    PayrollController,
    UserController,
    TypeManagementController,
    SpecialCasesController,
    MonitoringController,
    RoleController,
    PasswordResetController,
    SendToWolkvoxController,
    CampaignController,
    ChangeHistoryController,
};

use App\Http\Controllers\Aliados\ConsultationController as AliadosConsultationController;
use App\Http\Controllers\Afiliados\ConsultationController as AfiliadosConsultationController;

use App\Http\Controllers\Aliados\SpecificController as AliadosSpecificController;
use App\Http\Controllers\Afiliados\SpecificController as AfiliadosSpecificController;

use App\Http\Controllers\Aliados\ManagementController as AliadosManagementController;
use App\Http\Controllers\Afiliados\ManagementController as AfiliadosManagementController;


// ==========================================================
//  RUTAS PÚBLICAS
// ==========================================================
Route::post('/login', [AuthController::class, 'login']);
Route::post('/forgot-password', [PasswordResetController::class, 'sendResetLink'])->middleware('web')->name('password.request');
Route::post('/reset-password', [PasswordResetController::class, 'resetPassword']);

// ==========================================================
//  RUTAS PROTEGIDAS (auth:sanctum)
// ==========================================================
Route::middleware(['auth:sanctum'])->group(function () {

    // ==========================================================
    //  CONFIGURACIÓN DEL SISTEMA (config.*)
    // ==========================================================
    Route::prefix('config')->group(function () {
            
        // ------------------- Usuarios -------------------
        Route::prefix('users')->group(function () {
            Route::get('/', [UserController::class, 'index'])->middleware('permission:config.user.view');
            Route::post('/', [UserController::class, 'store'])->middleware('permission:config.user.create');
            Route::get('{id}', [UserController::class, 'show'])->middleware('permission:config.user.view');
            Route::put('{id}', [UserController::class, 'update'])->middleware('permission:config.user.edit');
            Route::delete('{id}', [UserController::class, 'destroy'])->middleware('permission:config.user.delete');
        });

        // ------------------- Pagadurías -------------------
        Route::prefix('payrolls')->group(function () {
            Route::get('/', [PayrollController::class, 'index'])->middleware('permission:payroll.view');
            Route::get('/active', [PayrollController::class, 'active'])->middleware('permission:payroll.view');
            Route::get('/{payroll}', [PayrollController::class, 'show'])->middleware('permission:payroll.view');
            Route::post('/', [PayrollController::class, 'store'])->middleware('permission:config.payroll.create');
            Route::put('{payroll}', [PayrollController::class, 'update'])->middleware('permission:config.payroll.edit');
            Route::delete('{payroll}', [PayrollController::class, 'destroy'])->middleware('permission:config.payroll.delete');
        });

        // ------------------- Consultas Afiliados -------------------
        Route::prefix('consultations-afiliados')->group(function () {
            Route::get('/', [AfiliadosConsultationController::class, 'index'])->middleware('permission:consultation.view');
            Route::get('/active', [AfiliadosConsultationController::class, 'active'])->middleware('permission:consultation.view');
            Route::get('/{id}', [AfiliadosConsultationController::class, 'show'])->middleware('permission:consultation.view');
            Route::post('/', [AfiliadosConsultationController::class, 'store'])->middleware('permission:config.consultation.create');
            Route::put('{consultation}', [AfiliadosConsultationController::class, 'update'])->middleware('permission:config.consultation.edit');
            Route::delete('{consultation}', [AfiliadosConsultationController::class, 'destroy'])->middleware('permission:config.consultation.delete');
        });

        // ------------------- Consultas Aliados -------------------
        Route::prefix('consultations-aliados')->group(function () {
            Route::get('/', [AliadosConsultationController::class, 'index'])->middleware('permission:consultation.view');
            Route::get('/active', [AliadosConsultationController::class, 'active'])->middleware('permission:consultation.view'); // <-- MOVER PRIMERO
            Route::get('/{id}', [AliadosConsultationController::class, 'show'])->middleware('permission:consultation.view'); // <-- DESPUÉS
            Route::post('/', [AliadosConsultationController::class, 'store'])->middleware('permission:config.consultation.create');
            Route::put('{consultation}', [AliadosConsultationController::class, 'update'])->middleware('permission:config.consultation.edit');
            Route::delete('{consultation}', [AliadosConsultationController::class, 'destroy'])->middleware('permission:config.consultation.delete');
        });

        // ------------------- Consultas Específicas Afiliados -------------------
        Route::prefix('consultationspecifics-afiliados')->group(function () {
            Route::get('/', [AfiliadosSpecificController::class, 'index'])->middleware('permission:specific.view');
            Route::get('/active', [AfiliadosSpecificController::class, 'active'])->middleware('permission:specific.view');
            Route::get('/{id}', [AfiliadosSpecificController::class, 'show'])->middleware('permission:specific.view');
            Route::post('/', [AfiliadosSpecificController::class, 'store'])->middleware('permission:config.specific.create');
            Route::put('{consultationspecific}', [AfiliadosSpecificController::class, 'update'])->middleware('permission:config.specific.edit');
            Route::delete('{consultationspecific}', [AfiliadosSpecificController::class, 'destroy'])->middleware('permission:config.specific.delete');
        });

        // ------------------- Consultas Específicas Aliados -------------------
        Route::prefix('consultationspecifics-aliados')->group(function () {
            Route::get('/', [AliadosSpecificController::class, 'index'])->middleware('permission:specific.view');
            Route::get('/active', [AliadosSpecificController::class, 'active'])->middleware('permission:specific.view');
            Route::get('/{id}', [AliadosSpecificController::class, 'show'])->middleware('permission:specific.view');
            Route::post('/', [AliadosSpecificController::class, 'store'])->middleware('permission:config.specific.create');
            Route::put('{consultationspecific}', [AliadosSpecificController::class, 'update'])->middleware('permission:config.specific.edit');
            Route::delete('{consultationspecific}', [AliadosSpecificController::class, 'destroy'])->middleware('permission:config.specific.delete');
        });

        // ------------------- Tipos de Gestiones -------------------
        Route::prefix('typemanagements')->group(function () {
            Route::get('/', [TypeManagementController::class, 'index'])->middleware('permission:typeManagement.view');
            Route::get('/count', [TypeManagementController::class, 'count'])->middleware('permission:typeManagement.view');
            Route::get('/active', [TypeManagementController::class, 'active'])->middleware('permission:typeManagement.view');
            Route::get('/{id}', [TypeManagementController::class, 'show'])->middleware('permission:typeManagement.view');
            Route::post('/', [TypeManagementController::class, 'store'])->middleware('permission:config.typeManagement.create');
            Route::put('{typemanagement}', [TypeManagementController::class, 'update'])->middleware('permission:config.typeManagement.edit');
            Route::delete('{typemanagement}', [TypeManagementController::class, 'destroy'])->middleware('permission:config.typeManagement.delete');
        });

        // ------------------- Seguimientos -------------------
        Route::prefix('monitorings')->group(function () {
            Route::get('/', [MonitoringController::class, 'index'])->middleware('permission:monitoring.view');
            Route::get('/{id}', [MonitoringController::class, 'show'])->middleware('permission:monitoring.view');
            Route::post('/', [MonitoringController::class, 'store'])->middleware('permission:config.monitoring.create');
            Route::put('{id}', [MonitoringController::class, 'update'])->middleware('permission:config.monitoring.edit');
            Route::delete('{id}', [MonitoringController::class, 'destroy'])->middleware('permission:config.monitoring.delete');
        });

        // ------------------- Roles y Permisos -------------------
        Route::prefix('roles')->group(function () {
            Route::get('/', [RoleController::class, 'index'])->middleware('permission:config.role.view');
            Route::get('{id}', [RoleController::class, 'show'])->middleware('permission:config.role.view');
            Route::post('/', [RoleController::class, 'store'])->middleware('permission:config.role.create');
            Route::put('{role}', [RoleController::class, 'update'])->middleware('permission:config.role.edit');
            Route::delete('{role}', [RoleController::class, 'destroy'])->middleware('permission:config.role.delete');
        });

        // ------------------- Actividad y logs -------------------
        Route::get('/activity-logs', [ActivityLogController::class, 'index'])->middleware('permission:config.role.view');

        // ------------------- Lista de permisos -------------------
        Route::get('/permissions', [RoleController::class, 'getPermissions'])
            ->middleware('permission:config.role.view');
    });

    
    // ------------------- Conteos -------------------
    Route::get('/specialcases/count', [SpecialCasesController::class, 'count'])->middleware('permission:special_cases.view');
    Route::get('/contacts/count', [ContactController::class, 'count'])->middleware('permission:contact.view');
    Route::get('/payrolls/count', [PayrollController::class, 'count'])->middleware('permission:payroll.view');
    Route::get('/management-afiliados/count', [AfiliadosManagementController::class, 'count'])->middleware('permission:management.view');
    Route::get('/management-aliados/count', [AliadosManagementController::class, 'count'])->middleware('permission:management.view');


    // ==========================================================
    //  MÓDULOS OPERATIVOS
    // ==========================================================

    // ------------------- Contactos -------------------
    Route::get('/contacts', [ContactController::class, 'index'])->middleware('permission:contact.view');
    Route::get('/contacts/active', [ContactController::class, 'active'])->middleware('permission:contact.view');
    Route::get('/contacts/{id}', [ContactController::class, 'show'])->middleware('permission:contact.view');
    Route::post('/contacts', [ContactController::class, 'store'])->middleware('permission:contact.create');
    Route::put('/contacts/{contact}', [ContactController::class, 'update'])->middleware('permission:contact.edit');
    Route::delete('/contacts/{contact}', [ContactController::class, 'destroy'])->middleware('permission:contact.delete');

    // ------------------- Pagadurías -------------------
    Route::get('/payrolls', [PayrollController::class, 'index'])->middleware('permission:payroll.view');
    Route::get('/payrolls/active', [PayrollController::class, 'active'])->middleware('permission:payroll.view');

    // ------------------- Seguimientos -------------------
    Route::get('/monitorings/active', [MonitoringController::class, 'active'])->middleware('permission:monitoring.view');
    Route::get('/monitorings', [MonitoringController::class, 'index'])->middleware('permission:monitoring.view');
    Route::get('/monitorings/{id}', [MonitoringController::class, 'show'])->middleware('permission:monitoring.view');

    // ------------------- Gestiones - AFILIADOS -------------------
    Route::get('/management-afiliados', [AfiliadosManagementController::class, 'index'])->middleware('permission:management.view');
    Route::get('/management-afiliados/{id}', [AfiliadosManagementController::class, 'show'])->middleware('permission:management.view');
    Route::post('/management-afiliados', [AfiliadosManagementController::class, 'store'])->middleware('permission:management.create');
    Route::put('/management-afiliados/{id}', [AfiliadosManagementController::class, 'update'])->middleware('permission:management.edit');
    Route::put('/managementmonitoring-afiliados/{id}', [AfiliadosManagementController::class, 'updateMonitoring'])->middleware('permission:management.edit');
    Route::delete('/management-afiliados/{id}', [AfiliadosManagementController::class, 'destroy'])->middleware('permission:management.delete');
    
    // ------------------- Gestiones -ALIADOS -------------------
    Route::get('/management-aliados', [AliadosManagementController::class, 'index'])->middleware('permission:management.view');
    Route::get('/management-aliados/{id}', [AliadosManagementController::class, 'show'])->middleware('permission:management.view');
    Route::post('/management-aliados', [AliadosManagementController::class, 'store'])->middleware('permission:management.create');
    Route::put('/managementmonitoring-aliados/{id}', [AliadosManagementController::class, 'updateMonitoring'])->middleware('permission:management.edit');
    Route::delete('/management-aliados/{id}', [AliadosManagementController::class, 'destroy'])->middleware('permission:management.delete');
    
    // -------------- Enviar a camapaña de wolkvox ----------------------
    Route::post('/send-sms', [SendToWolkvoxController::class, 'sendSMS'])->middleware('permission:management.create');
    Route::post('/send-wsp', [SendToWolkvoxController::class, 'sendWhatsApp'])->middleware('permission:management.create');

    // ------------------- Casos Especiales -------------------
    Route::get('/specialcases', [SpecialCasesController::class, 'index'])->middleware('permission:special_cases.view');
    Route::get('/specialcases/{id}', [SpecialCasesController::class, 'show'])->middleware('permission:special_cases.view');
    Route::post('/specialcases', [SpecialCasesController::class, 'store'])->middleware('permission:special_cases.create');
    Route::put('/specialcases/{id}', [SpecialCasesController::class, 'update'])->middleware('permission:special_cases.edit');
    Route::delete('/specialcases/{id}', [SpecialCasesController::class, 'destroy'])->middleware('permission:special_cases.delete');

    // ------------------- Campañas -------------------
    Route::prefix('campaign')->group(function () {
        Route::get('/', [CampaignController::class, 'index']);
    });

    // ------------------- Operadores Entidades -------------------
    Route::prefix('operator-entities')->group(function () {
        Route::get('/', [OperatorEntityController::class, 'index']);
        Route::post('/', [OperatorEntityController::class, 'store']);
        Route::get('/{id}', [OperatorEntityController::class, 'show']);
        Route::put('/{id}', [OperatorEntityController::class, 'update']);
        Route::delete('/{id}', [OperatorEntityController::class, 'destroy']);
    });

    // ------------------- Historial de Cambios -------------------
    Route::prefix('change-histories')->group(function () {
        Route::get('/', [ChangeHistoryController::class, 'index']);
        Route::get('/entity/{entityType}', [ChangeHistoryController::class, 'getEntityTypeHistory']);
        Route::get('/entity/{entityType}/{id}', [ChangeHistoryController::class, 'getEntityHistory']);
    });

    // ------------------- Sesión / Perfil -------------------
    Route::get('/me', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::post('/refresh-token', [AuthController::class, 'refreshToken']);
});
