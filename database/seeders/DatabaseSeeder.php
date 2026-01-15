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

        $aliance = DB::table('campaign')->where('name', 'Aliados')->first();
        $alianceId = $aliance ? $aliance->id : DB::table('campaign')->insertGetId([
            'name'       => 'Aliados',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $affiliate = DB::table('campaign')->where('name', 'Afiliados')->first();
        $affiliateId = $affiliate ? $affiliate->id : DB::table('campaign')->insertGetId([
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

        // -------------------------------------
        // 5) CONSULTAS AFILIADOS y ALIADOS
        // -------------------------------------
        $existingAffiliateConsultation = DB::table('affiliate_consultations')->first();
        if ($existingAffiliateConsultation) {
            $consultationIdAffiliate = $existingAffiliateConsultation->id;
        } else {
            $consultationIdAffiliate = DB::table('affiliate_consultations')->insertGetId([
                'name'       => 'Consulta afiliados 1',
                'is_active'  => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        $existingAlianceConsultation = DB::table('aliance_consultations')->first();
        if ($existingAlianceConsultation) {
            $consultationIdAliance = $existingAlianceConsultation->id;
        } else {
            $consultationIdAliance = DB::table('aliance_consultations')->insertGetId([
                'name'       => 'Consulta aliados 1',
                'is_active'  => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // -----------------------------------
        // 6) SPECIFICS AFILIADOS Y ALIADOS
        // -----------------------------------
        $specificAffiliate = DB::table('affiliate_specifics')->where('name', 'Consulta Especifica afiliados 1')->first();
        if ($specificAffiliate) {
            $specificAffiliateId = $specificAffiliate->id;
        } else {
            $specificAffiliateId = DB::table('affiliate_specifics')->insertGetId([
                'name'            => 'Consulta Especifica afiliados 1',
                'consultation_id' => $consultationIdAffiliate,
                'is_active'       => 1,
                'created_at'      => now(),
                'updated_at'      => now(),
            ]);
        }

        $specificAliance = DB::table('aliance_specifics')->where('name', 'Consulta Especifica aliados 1')->first();
        if ($specificAliance) {
            $specificAlianceId = $specificAliance->id;
        } else {
            $specificAlianceId = DB::table('aliance_specifics')->insertGetId([
                'name'            => 'Consulta Especifica aliados 1',
                'consultation_id' => $consultationIdAliance,
                'is_active'       => 1,
                'created_at'      => now(),
                'updated_at'      => now(),
            ]);
        }
        // --------------------------------
        // 7) ENTIDADES OPERADORES 
        // --------------------------------
        $operatorEntity = DB::table('operator_entities')->first();
        if ($operatorEntity) {
            $operatorEntityId = $operatorEntity->id;
        } else {
            $operatorEntityId = DB::table('operator_entities')->insertGetId([
                'name'       => 'Entidad de un operador',
                'description'=> 'Entidad de un operador',
                'is_active'  => 1,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // -----------------------------
        // 13) PIVOTES payroll_consultations_afiliados y _aliados
        // -----------------------------
        // Evitar duplicados al insertar
        $existsPA1 = DB::table('affiliate_consultations_payroll')
            ->where('consultation_id', $consultationIdAffiliate)
            ->where('payroll_id', $payrollIds[0] ?? 0)
            ->first();

        if (! $existsPA1) {
            DB::table('affiliate_consultations_payroll')->insert([
                [
                    'consultation_id' => $consultationIdAffiliate,
                    'payroll_id'      => $payrollIds[0] ?? null,
                    'created_at'      => now(),
                    'updated_at'      => now(),
                ],
                [
                    'consultation_id' => $consultationIdAffiliate,
                    'payroll_id'      => $payrollIds[1] ?? null,
                    'created_at'      => now(),
                    'updated_at'      => now(),
                ],
            ]);
        }

        $existsPB1 = DB::table('aliance_consultations_payroll')
            ->where('consultation_id', $consultationIdAliance)
            ->where('payroll_id', $payrollIds[0] ?? 0)
            ->first();

        if (! $existsPB1) {
            DB::table('aliance_consultations_payroll')->insert([
                [
                    'consultation_id' => $consultationIdAliance,
                    'payroll_id'      => $payrollIds[0] ?? null,
                    'created_at'      => now(),
                    'updated_at'      => now(),
                ],
                [
                    'consultation_id' => $consultationIdAliance,
                    'payroll_id'      => $payrollIds[1] ?? null,
                    'created_at'      => now(),
                    'updated_at'      => now(),
                ],
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

        // --------------------------------
        // 7) CONTACT ALIADOS Y AFILIADOS 
        // --------------------------------
        $existingContactAliance = DB::table('aliance_contacts')->where('identification_number', '12345678')->first();
        if ($existingContactAliance) {
            $contactIdAliance = $existingContactAliance->id;
        } else {
            $contactIdAliance = DB::table('aliance_contacts')->insertGetId([
                'campaign_id'           => $alianceId,
                'payroll_id'            => $payrollIds[1] ?? null,
                'operator_entities_id'    => $operatorEntityId,
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

        $existingContactAffiliate = DB::table('affiliate_contacts')->where('identification_number', '5948984')->first();
        if ($existingContactAffiliate) {
            $contactIdAffiliate = $existingContactAffiliate->id;
        } else {
            $contactIdAffiliate = DB::table('affiliate_contacts')->insertGetId([
                'campaign_id'           => $affiliateId,
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
        // 12) MANAGEMENTS -> AFILIADOS y ALIADOS 
        // -----------------------------
        DB::table('affiliate_management')->insert([
            [
                'user_id'            => $userIds[0] ?? 1,
                'wolkvox_id'         => '68d44d8b6f25ca6591073f43a33',
                'contact_id'         => $contactIdAffiliate,
                'solution'           => 2,
                'consultation_id'    => $consultationIdAffiliate,
                'specific_id'        => $specificAffiliateId,
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
                'contact_id'         => $contactIdAffiliate,
                'solution'           => 1,
                'consultation_id'    => $consultationIdAffiliate,
                'specific_id'        => $specificAffiliateId,
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

        DB::table('aliance_management')->insert([
            [
                'user_id'               => $userIds[0] ?? 1,
                'wolkvox_id'            => '68d44d8b6f25ca6591073f43a33',
                'contact_id'            => $contactIdAliance,
                'payroll_management_id' => $payrollIds[1] ?? null,
                'solution'              => 2,
                'consultation_id'       => $consultationIdAliance,
                'specific_id'           => $specificAlianceId,
                'type_management_id'    => $typeManagementId,
                'comments'              => 'Afiliado se comunica para conocer por qué aún su crédito se encuentra en estado de en revisión, esperando una autorización de Dibanka, se validan datos y se informa que es la entidad Financiera ',
                'sms'                   => 1,
                'wsp'                   => 1,
                'solution_date'         => '2025-09-23',
                'monitoring_id'         => 1,
                'created_at'            => now(),
                'updated_at'            => now(),
            ],
            [
                'user_id'               => $userIds[1] ?? 2,
                'wolkvox_id'            => '68d44d8b6f25ca6591073f43as',
                'contact_id'            => $contactIdAliance,
                'payroll_management_id' => $payrollIds[1] ?? null,
                'solution'              => 1,
                'consultation_id'       => $consultationIdAliance,
                'specific_id'           => $specificAlianceId,
                'type_management_id'    => $typeManagementId,
                'comments'              => 'Aliado se comunica informa que necesita firmar la libranza pero no le llega el codigo otp, se validan datos se le indica que no tiene numero actualizado pero que valide todas las bandejas de entrada confirma que no hay nada se le solicita esperar un lapso de tiempo por si es un error de conexión',
                'sms'                   => 1,
                'wsp'                   => 1,
                'solution_date'         => '2026-09-23',
                'monitoring_id'         => 1,
                'created_at'            => now(),
                'updated_at'            => now(),
            ],
        ]);

        // -----------------------------
        // 10) SPECIAL CASES
        // -----------------------------
        $existsAlianceSpecial = DB::table('aliance_special_cases')->where('id_messi', 'CTR-881585')->first();
        if (! $existsAlianceSpecial) {
            DB::table('aliance_special_cases')->insert([
                'user_id'          => $userIds[0] ?? 1,
                'contact_id'       => $contactIdAliance,
                'operator_entities_id' => $operatorEntityId,
                'management_messi' => 'Nota Creada',
                'id_call'          => '68b871ae742f0866f0010a1d',
                'id_messi'         => 'CTR-881585',
                'observations'     => 'Observaciones',
                'created_at'       => now(),
                'updated_at'       => now(),
            ]);
        }

        $existsAffiliateSpecial = DB::table('affiliate_special_cases')->where('id_messi', 'CTR-881585')->first();
        if (! $existsAffiliateSpecial) {
            DB::table('affiliate_special_cases')->insert([
                'user_id'          => $userIds[0] ?? 1,
                'contact_id'       => $contactIdAffiliate,
                'management_messi' => 'Nota Creada',
                'id_call'          => '68b871ae742f0866f0010a1d',
                'id_messi'         => 'CTR-881585',
                'observations'     => 'Observaciones',
                'created_at'       => now(),
                'updated_at'       => now(),
            ]);
        }
    }
}
