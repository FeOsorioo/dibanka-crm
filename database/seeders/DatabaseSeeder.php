<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // -----------------------------
        // 1) ROLES
        // -----------------------------
        $adminRole  = Role::firstOrCreate(['name' => 'Administrador']);
        $liderRole  = Role::firstOrCreate(['name' => 'Lider de Campaña']);
        $agenteRole = Role::firstOrCreate(['name' => 'Agente']);

        // -----------------------------
        // 2) USERS
        // -----------------------------
        $users = [
            [
                'name'       => 'Administrador',
                'email'      => 'administrator@example.com',
                'password'   => Hash::make('password'),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name'       => 'Lider de campaña',
                'email'      => 'campaing_manager@example.com',
                'password'   => Hash::make('password'),
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name'       => 'Agente',
                'email'      => 'agent@example.com',
                'password'   => Hash::make('password'),
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        $userIds = [];
        foreach ($users as $userData) {
            // Evita duplicados por email
            $user = User::where('email', $userData['email'])->first();
            if (! $user) {
                $user = User::create($userData);
            }
            $userIds[] = $user->id;
        }

        // Asignar roles (uso de assignRole con nombre de rol para evitar problemas con ids)
        if (! empty($userIds[0])) User::find($userIds[0])->assignRole($adminRole->name);
        if (! empty($userIds[1])) User::find($userIds[1])->assignRole($liderRole->name);
        if (! empty($userIds[2])) User::find($userIds[2])->assignRole($agenteRole->name);

        // -----------------------------
        // 3) CAMPAÑAS (campaign)
        // -----------------------------
        // Nota: en tu código original la tabla se llama 'campaign' (singular). Lo mantuve.

        $aliados = DB::table('campaign')->where('name', 'Aliados')->first();
        $aliadosId = $aliados ? $aliados->id : DB::table('campaign')->insertGetId([
            'name'       => 'Aliados',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $afiliados = DB::table('campaign')->where('name', 'Afiliados')->first();
        $afiliadosId = $afiliados ? $afiliados->id : DB::table('campaign')->insertGetId([
            'name'       => 'Afiliados',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        
        // -----------------------------
        // 4) PAGADURIAS (payrolls)
        // -----------------------------
        $payrollsSeed = [
            [
                'name'          => 'Casur',
                'description'   => 'Le recuerdo que puede encontrar nuestro botón de asesoría en la página web del portal DiBanka.

                Recuerde que habló con {{agente}}. Muchas gracias por comunicarse con nosotros.',
                'img_payroll'   => "img_payroll/2pjJGXikp63zLer865aZAuyzg06wass3OnUp8yrm.jpg",
                'i_title'       => 'Título de Casur',
                'i_description' => 'Descripción de Casur',
                'i_email'       => 'casur@example.com',
                'i_phone'       => '3123456789',
                'created_at'    => now(),
                'updated_at'    => now(),
            ],
            [
                'name'          => 'Educame',
                'description'   => 'Le recuerdo que puede encontrar nuestro botón de asesoría en la página web del portal DiBanka.

                Recuerde que habló con {{agente}}. Muchas gracias por comunicarse con nosotros.',
                'img_payroll'   => "img_payroll/jL73PRRwJmiIVBLErgNmhAKGpxo0EAWis4SLvUZl.png",
                'i_title'       => 'Título de Casur',
                'i_description' => 'Descripción de Casur',
                'i_email'       => 'casur@example.com',
                'i_phone'       => '3123456789',
                'created_at'    => now(),
                'updated_at'    => now(),
            ],
        ];

        $payrollIds = [];
        foreach ($payrollsSeed as $p) {
            $existing = DB::table('payrolls')->where('name', $p['name'])->first();
            if ($existing) {
                $payrollIds[] = $existing->id;
            } else {
                $payrollIds[] = DB::table('payrolls')->insertGetId($p);
            }
        }

        // -----------------------------
        // 5) CONSULTAS AFILIADOS y ALIADOS
        // -----------------------------
        $existingAfil = DB::table('consultations_afiliados')->first();
        if ($existingAfil) {
            $consultationIdAFIL = $existingAfil->id;
        } else {
            $consultationIdAFIL = DB::table('consultations_afiliados')->insertGetId([
                'name'       => 'Consulta afiliados 1',
                'is_active'  => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        $existingAli = DB::table('consultations_aliados')->first();
        if ($existingAli) {
            $consultationIdALI = $existingAli->id;
        } else {
            $consultationIdALI = DB::table('consultations_aliados')->insertGetId([
                'name'       => 'Consulta aliados 1',
                'is_active'  => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // -----------------------------
        // 6) SPECIFICS -> USAR insertGetId() (corrección importante)
        // -----------------------------
        // Antes usabas insert() que devuelve true/false; aquí necesitas el ID para relacionarlo con managements.
        $specificIAFIL = DB::table('specifics_afiliados')->where('name', 'Consulta Especifica afiliados 1')->first();
        if ($specificIAFIL) {
            $specificIAFILId = $specificIAFIL->id;
        } else {
            $specificIAFILId = DB::table('specifics_afiliados')->insertGetId([
                'name'            => 'Consulta Especifica afiliados 1',
                'consultation_id' => $consultationIdAFIL,
                'is_active'       => 1,
                'created_at'      => now(),
                'updated_at'      => now(),
            ]);
        }

        $specificIALI = DB::table('specifics_aliados')->where('name', 'Consulta Especifica aliados 1')->first();
        if ($specificIALI) {
            $specificIALIId = $specificIALI->id;
        } else {
            $specificIALIId = DB::table('specifics_aliados')->insertGetId([
                'name'            => 'Consulta Especifica aliados 1',
                'consultation_id' => $consultationIdALI,
                'is_active'       => 1,
                'created_at'      => now(),
                'updated_at'      => now(),
            ]);
        }

        // -----------------------------
        // 7) CONTACT ALIADOS Y AFILIADOS(crear o tomar)
        // -----------------------------
        $existingContactAliados = DB::table('contacts_aliados')->where('identification_number', '12345678')->first();
        if ($existingContactAliados) {
            $contactIdAliados = $existingContactAliados->id;
        } else {
            $contactIdAliados = DB::table('contacts_aliados')->insertGetId([
                'campaign_id'           => $aliadosId,
                'payroll_id'            => $payrollIds[1] ?? null,
                'name'                  => 'Juan Pérez',
                'identification_type'   => 'Cédula',
                'phone'                 => '3123456789',
                'identification_number' => '12345678',
                'update_phone'          => '3123456789',
                'email'                 => 'juan@example.com',
                'created_at'            => now(),
                'updated_at'            => now(),
            ]);
        }

        $existingContactAfiliados = DB::table('contacts_afiliados')->where('identification_number', '5948984')->first();
        if ($existingContactAfiliados) {
            $contactIdAfiliados = $existingContactAfiliados->id;
        } else {
            $contactIdAfiliados = DB::table('contacts_afiliados')->insertGetId([
                'campaign_id'           => $afiliadosId,
                'payroll_id'            => $payrollIds[1] ?? null,
                'name'                  => 'Julio Perez',
                'identification_type'   => 'Cédula',
                'phone'                 => '3123456789',
                'identification_number' => '5948984',
                'update_phone'          => '3123456789',
                'email'                 => 'julio@example.com',
                'created_at'            => now(),
                'updated_at'            => now(),
            ]);
        }

        // -----------------------------
        // 8) TYPE MANAGEMENT (ya estaba correcto pero lo dejamos seguro)
        // -----------------------------
        $typeManagement = DB::table('type_management')->first();
        $typeManagementId = $typeManagement ? $typeManagement->id : DB::table('type_management')->insertGetId([
            'name'       => 'LLAMADA ENTRANTE',
            'is_active'  => 1,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // -----------------------------
        // 9) PIVOTE type_management_payroll
        // -----------------------------
        // Evita duplicar la relación
        $existsPivot = DB::table('type_management_payroll')
            ->where('type_management_id', $typeManagementId)
            ->where('payroll_id', $payrollIds[1] ?? 0)
            ->first();

        if (! $existsPivot) {
            DB::table('type_management_payroll')->insert([
                'type_management_id' => $typeManagementId,
                'payroll_id'         => $payrollIds[1] ?? null,
                'created_at'         => now(),
                'updated_at'         => now(),
            ]);
        }

        // -----------------------------
        // 10) SPECIAL CASES
        // -----------------------------
        $existsSpecial = DB::table('special_cases')->where('id_messi', 'CTR-881585')->first();
        if (! $existsSpecial) {
            DB::table('special_cases')->insert([
                'user_id'          => $userIds[0] ?? 1,
                'contact_id'       => $contactIdAliados,
                'management_messi' => 'Nota Creada',
                'id_call'          => '68b871ae742f0866f0010a1d',
                'id_messi'         => 'CTR-881585',
                'observations'     => 'Observaciones',
                'created_at'       => now(),
                'updated_at'       => now(),
            ]);
        }

        // -----------------------------
        // 11) MONITORING (seguimiento)
        // -----------------------------
        $existsMonitoring = DB::table('monitoring')->where('name', 'Solucion sin contacto')->first();
        if (! $existsMonitoring) {
            DB::table('monitoring')->insert([
                'name'       => 'Solucion sin contacto',
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // -----------------------------
        // 12) MANAGEMENTS -> AFILIADOS y ALIADOS (ejemplos)
        // -----------------------------
        // Usa los IDs correctos para 'specific' y 'type_management'
        // Nota: $specificIAFILId y $specificIALIId contienen los IDs finales
        DB::table('management_afiliados')->insert([
            [
                'user_id'            => $userIds[0] ?? 1,
                'wolkvox_id'         => '68d44d8b6f25ca6591073f43a33',
                'contact_id'         => $contactIdAfiliados,
                'solution'           => 2,
                'consultation_id'    => $consultationIdAFIL,
                'specific_id'        => $specificIAFILId,
                'type_management_id' => $typeManagementId,
                'comments'           => 'Afiliado se comunica para conocer por qué aún su crédito se encuentra en estado de en revisión, esperando una autorización de Dibanka, se validan datos y se informa que es la entidad Financiera ',
                'sms'                => 1,
                'wsp'                => 1,
                'solution_date'      => '2025-09-23',
                'monitoring_id'      => 1,
                'created_at'         => now(),
                'updated_at'         => now(),
            ],
            [
                'user_id'            => $userIds[1] ?? 2,
                'wolkvox_id'         => '68d44d8b6f25ca6591073f43as',
                'contact_id'         => $contactIdAfiliados,
                'solution'           => 1,
                'consultation_id'    => $consultationIdAFIL,
                'specific_id'        => $specificIAFILId,
                'type_management_id' => $typeManagementId,
                'comments'           => 'Aliado se comunica informa que necesita firmar la libranza pero no le llega el codigo otp, se validan datos se le indica que no tiene numero actualizado pero que valide todas las bandejas de entrada confirma que no hay nada se le solicita esperar un lapso de tiempo por si es un error de conexión',
                'sms'                => 1,
                'wsp'                => 1,
                'solution_date'      => '2026-09-23',
                'monitoring_id'      => 1,
                'created_at'         => now(),
                'updated_at'         => now(),
            ],
        ]);

        DB::table('management_aliados')->insert([
            [
                'user_id'            => $userIds[0] ?? 1,
                'wolkvox_id'         => '68d44d8b6f25ca6591073f43a33',
                'contact_id'         => $contactIdAliados,
                'solution'           => 2,
                'consultation_id'    => $consultationIdALI,
                'specific_id'        => $specificIALIId,
                'type_management_id' => $typeManagementId,
                'comments'           => 'Afiliado se comunica para conocer por qué aún su crédito se encuentra en estado de en revisión, esperando una autorización de Dibanka, se validan datos y se informa que es la entidad Financiera ',
                'sms'                => 1,
                'wsp'                => 1,
                'solution_date'      => '2025-09-23',
                'monitoring_id'      => 1,
                'created_at'         => now(),
                'updated_at'         => now(),
            ],
            [
                'user_id'            => $userIds[1] ?? 2,
                'wolkvox_id'         => '68d44d8b6f25ca6591073f43as',
                'contact_id'         => $contactIdAliados,
                'solution'           => 1,
                'consultation_id'    => $consultationIdALI,
                'specific_id'        => $specificIALIId,
                'type_management_id' => $typeManagementId,
                'comments'           => 'Aliado se comunica informa que necesita firmar la libranza pero no le llega el codigo otp, se validan datos se le indica que no tiene numero actualizado pero que valide todas las bandejas de entrada confirma que no hay nada se le solicita esperar un lapso de tiempo por si es un error de conexión',
                'sms'                => 1,
                'wsp'                => 1,
                'solution_date'      => '2026-09-23',
                'monitoring_id'      => 1,
                'created_at'         => now(),
                'updated_at'         => now(),
            ],
        ]);

        // -----------------------------
        // 13) PIVOTES payroll_consultations_afiliados y _aliados
        // -----------------------------
        // Evitar duplicados al insertar
        $existsPA1 = DB::table('payroll_consultations_afiliados')
            ->where('consultation_id', $consultationIdAFIL)
            ->where('payroll_id', $payrollIds[0] ?? 0)
            ->first();

        if (! $existsPA1) {
            DB::table('payroll_consultations_afiliados')->insert([
                [
                    'consultation_id' => $consultationIdAFIL,
                    'payroll_id'      => $payrollIds[0] ?? null,
                    'created_at'      => now(),
                    'updated_at'      => now(),
                ],
                [
                    'consultation_id' => $consultationIdAFIL,
                    'payroll_id'      => $payrollIds[1] ?? null,
                    'created_at'      => now(),
                    'updated_at'      => now(),
                ],
            ]);
        }

        $existsPB1 = DB::table('payroll_consultations_aliados')
            ->where('consultation_id', $consultationIdALI)
            ->where('payroll_id', $payrollIds[0] ?? 0)
            ->first();

        if (! $existsPB1) {
            DB::table('payroll_consultations_aliados')->insert([
                [
                    'consultation_id' => $consultationIdALI,
                    'payroll_id'      => $payrollIds[0] ?? null,
                    'created_at'      => now(),
                    'updated_at'      => now(),
                ],
                [
                    'consultation_id' => $consultationIdALI,
                    'payroll_id'      => $payrollIds[1] ?? null,
                    'created_at'      => now(),
                    'updated_at'      => now(),
                ],
            ]);
        } 
        
        // -----------------------------
        // 14) OPERADORES - ENTIDADES
        // -----------------------------
        DB::table('operator_entity')->insert([
                [
                    'name'            => 'SUCREDI SAS',
                    'description'     => 'SUCREDI SAS',
                    'created_at'      => now(),
                    'updated_at'      => now(),
                ],
                [
                    'name'            => 'JARDINES DEL RENACER S.A.S',
                    'description'     => 'JARDINES DEL RENACER S.A.S',
                    'created_at'      => now(),
                    'updated_at'      => now(),
                ],
            ]);
    }
}
