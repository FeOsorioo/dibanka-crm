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
                'email'      => 'campaign_manager@example.com',
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
        // 4) ENTIDADES
        // -----------------------------

        $entity = DB::table('entity')->first();
        $entityId = $entity ? $entity->id : DB::table('entity')->insertGetId([
            'name'       => 'Entidad operadora',
            'phone'      => '3123456789',
            'email'      => 'entidad@example.com',
            'nit'        => '123456789',
            'description'=> 'Entidad operadora',
            'is_active'  => true,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // -----------------------------
        // 5) PAGADURIAS (payrolls)
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
        // 6) CONSULTAS
        // -----------------------------
        $existing = DB::table('consultations')->first();
        if ($existing) {
            $consultationId = $existing->id;
        } else {
            $consultationId = DB::table('consultations')->insertGetId([
                'name'       => 'Consulta 1',
                'is_active'  => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // -----------------------------
        // 7) SPECIFICS |
        // -----------------------------
        $specific = DB::table('specifics')->where('name', 'Consulta Especifica 1')->first();
        if ($specific) {
            $specificId = $specific->id;
        } else {
            $specificId = DB::table('specifics')->insertGetId([
                'name'            => 'Consulta Especifica 1',
                'consultation_id' => $consultationId,
                'is_active'       => 1,
                'created_at'      => now(),
                'updated_at'      => now(),
            ]);
        }
        // -----------------------------
        // 8) CONTACTOS
        // -----------------------------
        $existingContactAliados = DB::table('contacts')->where('identification_number', '12345678')->first();
        if ($existingContactAliados) {
            $contactIdAliados = $existingContactAliados->id;
        } else {
            $contactIdAliados = DB::table('contacts')->insertGetId([
                'campaign_id'           => $aliadosId,
                'payroll_id'            => $payrollIds[1] ?? null,
                'entity_id'             => $entityId,
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

        $existingContactAfiliados = DB::table('contacts')->where('identification_number', '5948984')->first();
        if ($existingContactAfiliados) {
            $contactIdAfiliados = $existingContactAfiliados->id;
        } else {
            $contactIdAfiliados = DB::table('contacts')->insertGetId([
                'campaign_id'           => $afiliadosId,
                'payroll_id'            => $payrollIds[1] ?? null,
                'entity_id'             => $entityId,
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
        // 9) TYPE MANAGEMENT (ya estaba correcto pero lo dejamos seguro)
        // -----------------------------
        $typeManagement = DB::table('type_management')->first();
        $typeManagementId = $typeManagement ? $typeManagement->id : DB::table('type_management')->insertGetId([
            'name'       => 'LLAMADA ENTRANTE',
            'is_active'  => 1,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // -----------------------------
        // 10) PIVOTE type_management_payroll
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
        // 11) SPECIAL CASES
        // -----------------------------
        $existsSpecial = DB::table('special_cases')->where('id_messi', 'CTR-881585')->first();
        if (! $existsSpecial) {
            DB::table('special_cases')->insert(
            [
                [
                    'user_id'          => $userIds[0] ?? 1,
                    'contact_id'       => $contactIdAliados,
                    'management_messi' => 'Nota Creada',
                    'observations'     => 'Observaciones',
                    'id_call'          => '68b871ae742f0866f0010a1d',
                    'id_messi'         => 'CTR-881585',
                    'created_at'       => now(),
                    'updated_at'       => now(),
                ],
                [
                    'user_id'          => $userIds[0] ?? 1,
                    'contact_id'       => $contactIdAfiliados,
                    'management_messi' => 'Nota Creada',
                    'observations'     => 'Observaciones',
                    'id_call'          => '68b871ae742f0866f0010a1d',
                    'id_messi'         => 'CTR-881585',
                    'created_at'       => now(),
                    'updated_at'       => now(),
                ]
            ]);
        }

        // -----------------------------
        // 12) MONITORING (seguimiento)
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
        // 13) MANAGEMENTS 
        // -----------------------------
        // Usa los IDs correctos para 'specific' y 'type_management'
        // Nota: $specificIAFILId y $specificIALIId contienen los IDs finales
        DB::table('management')->insert([
            [
                'wolkvox_id'         => '68d44d8b6f25ca6591073f43a33',
                'user_id'            => $userIds[0] ?? 1,
                'contact_id'         => $contactIdAfiliados,
                'payroll_id'       =>  null,
                'solution'           => 1,
                'consultation_id'    => $consultationId,
                'specific_id'        => $specificId,
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
                'payroll_id'       => $payrollIds[1] ?? null,
                'solution'           => 1,
                'consultation_id'    => $consultationId,
                'specific_id'        => $specificId,
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
        // 14) PIVOTES 
        // -----------------------------
        $existsPA1 = DB::table('consultations_payroll')
            ->where('consultation_id', $consultationId)
            ->where('payroll_id', $payrollIds[0] ?? 0)
            ->first();

        if (! $existsPA1) {
            DB::table('consultations_payroll')->insert([
                [
                    'consultation_id' => $consultationId,
                    'payroll_id'      => $payrollIds[0] ?? null,
                    'created_at'      => now(),
                    'updated_at'      => now(),
                ],
                [
                    'consultation_id' => $consultationId,
                    'payroll_id'      => $payrollIds[1] ?? null,
                    'created_at'      => now(),
                    'updated_at'      => now(),
                ],
            ]);
        }

        // -----------------------------
        // 15) PIVOTES - CONSULTAS Y CAMPAÑA
        // -----------------------------
        $existsCC1 = DB::table('consultations_campaign')
            ->where('consultation_id', $consultationId)
            ->where('campaign_id', $afiliadosId)
            ->first();

        if (! $existsCC1) {
            DB::table('consultations_campaign')->insert([
                [
                    'consultation_id' => $consultationId,
                    'campaign_id'      => $afiliadosId,
                    'created_at'      => now(),
                    'updated_at'      => now(),
                ],
                [
                    'consultation_id' => $consultationId,
                    'campaign_id'      => $aliadosId,
                    'created_at'      => now(),
                    'updated_at'      => now(),
                ],
            ]);
        }
    }
}
