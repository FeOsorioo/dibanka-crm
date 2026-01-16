<?php

namespace App\Http\Controllers;

use App\Models\Contact;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Validator;
use App\Http\Resources\ContactResource;
use App\Http\Requests\ContactRequest;

class ContactController extends Controller
{

    // Listar todos los contactos con paginación y filtros específicos
    public function index(Request $request)
    {
        $query = Contact::query();

        // 🔎 Filtro por id
        if ($request->filled('id')) {
            $query->where('id', 'LIKE', '%' . $request->id . '%');
        }

        // 🔎 Filtro por número de identificación
        if ($request->filled('identification_number')) {
            $query->where('identification_number', 'LIKE', '%' . $request->identification_number . '%');
        }

        // 🔎 Filtro por nombre
        if ($request->filled('name')) {
            $query->where('name', 'LIKE', '%' . $request->name . '%');
        }

        // 🔎 Filtro por email
        if ($request->filled('email')) {
            $query->where('email', 'LIKE', '%' . $request->email . '%');
        }

        // 🔎 Filtro por teléfono
        if ($request->filled('phone')) {
            $query->where(function ($q) use ($request) {
                $q->where('phone', 'LIKE', '%' . $request->phone . '%')
                    ->orWhere('update_phone', 'LIKE', '%' . $request->phone . '%');
            });
        }

        // 🔎 Filtro por payroll.name (pagaduría)
        if ($request->filled('payroll')) {
            $query->whereHas('payroll', function ($q) use ($request) {
                $q->where('name', 'LIKE', '%' . $request->payroll . '%');
            });
        }

        // 🔎 Filtro por campaign.name
        if ($request->filled('campaign')) {
            $query->whereHas('campaign', function ($q) use ($request) {
                $q->where('name', 'LIKE', '%' . $request->campaign . '%');
            });
        }

        // 🔎 Búsqueda general si no hay filtros específicos
        if (
            $request->filled('search') &&
            !$request->filled('id') &&
            !$request->filled('identification_number') &&
            !$request->filled('name') &&
            !$request->filled('email') &&
            !$request->filled('phone') &&
            !$request->filled('payroll') &&
            !$request->filled('campaign')
        ) {
            $query->search($request->search);
        }

        // Cargar relaciones y paginar
        $contacts = $query->with('payroll', 'campaign')->orderBy('id', 'desc')->paginate(10);

        // Construcción criterios para logs
        $searchCriteria = [];
        foreach ([
            'search' => 'búsqueda_general',
            'identification_number' => 'número_identificación',
            'name' => 'nombre',
            'email' => 'email',
            'phone' => 'teléfono',
            'payroll' => 'pagaduría',
            'campaign' => 'campaña'
        ] as $field => $label) {
            if ($request->filled($field)) {
                $searchCriteria[$label] = $request->$field;
            }
        }

        log_activity('ver_listado', 'Contactos', [
            'mensaje' => "El usuario {$request->user()->name} consultó el listado de contactos.",
            'criterios' => empty($searchCriteria) ? 'Sin filtro aplicado' : $searchCriteria
        ], $request);

        return response()->json([
            'message' => 'Consultas obtenidas con éxito',
            'contacts' => ContactResource::collection($contacts),
            'pagination' => [
                'current_page' => $contacts->currentPage(),
                'total_pages' => $contacts->lastPage(),
                'per_page' => $contacts->perPage(),
                'total_contacts' => $contacts->total(),
            ]
        ], Response::HTTP_OK);
    }

    // Listar solo contactos ACTIVOS con paginación
    public function active(Request $request)
    {
        $query = Contact::query()
            ->where('is_active', 1); // 🔥 Filtrar solo activos

        // 🔎 Filtrar por pagaduría (nombre)
        if ($request->filled('payroll')) {
            $query->whereHas('payroll', function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->payroll . '%');
            });
        }

        // 🔎 Filtrar por campaña (nombre)
        if ($request->filled('campaign')) {
            $query->whereHas('campaign', function ($q) use ($request) {
                $q->where('name', 'like', '%' . $request->campaign . '%');
            });
        }

        // 🔎 Buscar directamente por identificación
        if ($request->filled('identification_number')) {
            $query->where('identification_number', $request->identification_number);
        }

        // 🔎 Búsqueda general
        if ($request->filled('search')) {
            $query->search($request->search);
        }

        // Cargar relaciones + paginar
        $contacts = $query->with('payroll', 'campaign')->paginate(10);

        // Registro de actividad
        log_activity('ver_listado', 'Contactos Activos', [
            'mensaje' => "El usuario {$request->user()->name} consultó el listado de contactos activos.",
            'criterios' => [
                'búsqueda' => $request->search ?? 'Sin filtro aplicado',
                'número_identificación' => $request->identification_number ?? 'No especificado',
                'pagaduría' => $request->payroll ?? 'No especificado'
            ]
        ], $request);

        return response()->json([
            'message' => 'Contactos activos obtenidos con éxito',
            'contacts' => ContactResource::collection($contacts),
            'pagination' => [
                'current_page' => $contacts->currentPage(),
                'total_pages' => $contacts->lastPage(),
                'per_page' => $contacts->perPage(),
                'total_contacts' => $contacts->total(),
            ]
        ], Response::HTTP_OK);
    }

    // Crear contact
    public function store(ContactRequest $request)
    {
        $contacts = Contact::create($request->all());
        $contacts->load(['payroll', 'campaign']);

        log_activity('crear', 'Contactos', [
            'mensaje' => "El usuario {$request->user()->name} creó un nuevo contacto.",

            'contact_id' => $contacts->id
        ], $request);

        return response()->json([
            'message' => 'Consulta creada con éxito',
            'contact' => new ContactResource($contacts)
        ], Response::HTTP_CREATED);
    }

    // Mostrar contacto especifico
    public function show(Request $request, $id)
    {
        $contacts = Contact::find($id);

        if (!$contacts) {
            return response()->json([
                'message' => 'Contacto no encontrado'
            ], Response::HTTP_NOT_FOUND);
        }
        log_activity('ver_detalle', 'Contactos', [
            'mensaje' => "El usuario {$request->user()->name} consultó el detalle de un contacto.",
            'contacto_id' => $id,
        ], $request);

        return response()->json([
            'message' => 'Consulta encontrada',
            'contact' => new ContactResource($contacts)
        ], Response::HTTP_OK);
    }

    //Actualizar contacto
    public function update(ContactRequest $request, $contact)
    {
        $contacts = Contact::findOrFail($contact);
        $dataBefore = $contacts->toArray();

        $contacts->update($request->only(
            'campaign_id',
            'payroll_id',
            'name',
            'identification_type',
            'phone',
            'identification_number',
            'update_phone',
            'email',
            'is_active'
        ));

        $changes = [];
        $detailedChanges = [];
        foreach ($contacts->getChanges() as $field => $newValue) {
            if ($field === 'updated_at')
                continue;

            $oldValue = $dataBefore[$field] ?? 'null';
            $changes[] = [
                'columna' => $field,
                'valor_anterior' => $oldValue,
                'valor_nuevo' => $newValue,
            ];
            $detailedChanges[] = "{$field} ({$oldValue} -> {$newValue})";
        }

        $mensaje = "El usuario {$request->user()->name} actualizó la información de un contacto.";
        if (!empty($detailedChanges)) {
            $mensaje .= " Cambios: " . implode(', ', $detailedChanges);
        }

        $contacts->load(['payroll']);

        // Log principal en activity_logs
        log_activity('actualizar', 'Contactos', [
            'mensaje' => $mensaje,
            'contacto_id' => $contacts->id,
            'cambios' => $changes,
        ], $request);


        return response()->json([
            'success' => true,
            'message' => 'Contacto actualizada con éxito',
            'data' => $contacts
        ], Response::HTTP_OK);
    }

    //Eliminar contacto
    public function destroy(Request $request, $id)
    {
        $contacts = Contact::findOrFail($id);
        $state = $contacts->is_active;
        $contacts->update(['is_active' => $contacts->is_active ? false : true]);
        log_activity(
            $contacts->is_active ? 'activar' : 'desactivar',
            'Contactos',
            [
                'mensaje' => "El usuario {$request->user()->name} " .
                    ($contacts->is_active ? 'activo' : 'desactivo') .
                    " un contacto.",
                'contacto_id' => $contacts->id,

            ],
            $request
        );

        return response()->json(['message' => 'Contacto desactivado correctamente'], Response::HTTP_OK);
    }

    public function count()
    {
        $count = Contact::where('is_active', 1)->count();

        return response()->json([
            'count' => $count
        ], Response::HTTP_OK);
    }
}
