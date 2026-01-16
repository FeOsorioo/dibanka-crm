<?php

namespace App\Http\Controllers;

use App\Http\Requests\SpecialCasesRequest;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Models\SpecialCases;
use App\Http\Resources\SpecialCasesResource;

class SpecialCasesController extends Controller
{
    // Obtener todos los casos especiales
    public function index(Request $request)
    {
        $query = SpecialCases::with(['user', 'contact', 'contact.payroll']);


        /*
        |--------------------------------------------------------------------------
        | 1. Filtro específico por columna
        |--------------------------------------------------------------------------
        */
        if ($request->filled('searchValue') && $request->filled('filterColumn')) {
            $value = $request->searchValue;
            $column = $request->filterColumn;

            switch ($column) {
                // Campos directos
                case 'id':
                    $query->where('id', 'LIKE', "%{$value}%");
                    break;
                case 'management_messi':
                    $query->where('management_messi', 'LIKE', "%{$value}%");
                    break;
                case 'id_call':
                    $query->where('id_call', 'LIKE', "%{$value}%");
                    break;
                case 'id_messi':
                    $query->where('id_messi', 'LIKE', "%{$value}%");
                    break;
                case 'observations':
                    $query->where('observations', 'LIKE', "%{$value}%");
                    break;

                // Relaciones
                case 'user':
                    $query->whereHas('user', function ($q) use ($value) {
                        $q->where('name', 'LIKE', "%{$value}%");
                    });
                    break;
                case 'contact':
                    $query->whereHas('contact', function ($q) use ($value) {
                        $q->where('name', 'LIKE', "%{$value}%");
                    });
                    break;
                case 'identification_number':
                    $query->whereHas('contact', function ($q) use ($value) {
                        $q->where('identification_number', 'LIKE', "%{$value}%");
                    });
                    break;
                case 'payroll':
                    $query->whereHas('contact.payroll', function ($q) use ($value) {
                        $q->where('name', 'LIKE', "%{$value}%");
                    });
                    break;
                case 'campaign':
                    $query->whereHas('contact.campaign', function ($q) use ($value) {
                        $q->where('name', 'LIKE', "%{$value}%");
                    });
                    break;
            }
        }
        /*
        |--------------------------------------------------------------------------
        | 2. Búsqueda general
        |--------------------------------------------------------------------------
        */
        else if ($request->filled('search')) {
            $searchTerm = $request->search;

            $query->where(function ($q) use ($searchTerm) {

                // Búsqueda en campos propios del modelo
                $q->where('id', 'LIKE', "%{$searchTerm}%")
                    ->orWhere('management_messi', 'LIKE', "%{$searchTerm}%")
                    ->orWhere('id_call', 'LIKE', "%{$searchTerm}%")
                    ->orWhere('observations', 'LIKE', "%{$searchTerm}%")
                    ->orWhere('id_messi', 'LIKE', "%{$searchTerm}%");

                // Relaciones estructuradas en arrays para evitar repetir código
                $relations = [
                    'user' => ['id', 'name', 'email'],
                    'contact' => [
                        'id',
                        'campaign',
                        'name',
                        'identification_type',
                        'identification_number',
                        'phone',
                        'update_phone',
                        'email',
                    ],
                ];

                // Busqueda por payroll.name usando un whereHas directo
                $q->orWhereHas('contact.payroll', function ($payrollQuery) use ($searchTerm) {
                    $payrollQuery->where('name', 'LIKE', "%{$searchTerm}%");
                });

                // Iteración genérica de relaciones
                foreach ($relations as $relation => $fields) {
                    $q->orWhereHas($relation, function ($subQuery) use ($searchTerm, $fields) {
                        $subQuery->where(function ($innerQuery) use ($searchTerm, $fields) {
                            foreach ($fields as $field) {
                                $innerQuery->orWhere($field, 'LIKE', "%{$searchTerm}%");
                            }
                        });
                    });
                }
            });
        }


        $specialcases = $query->orderBy('id', 'desc')->paginate(10);

        // Log
        log_activity('ver_listado', 'Casos Especiales', [
            'mensaje' => "El usuario {$request->user()->name} visualizó el listado de casos especiales" .
                ($request->filled('search') ? " aplicando el filtro: '{$request->search}'" : ""),
            'criterios' => [
                'búsqueda' => $request->search ?? null,
            ],
        ], $request);

        return response()->json([
            'message'       => 'Casos especiales obtenidos con éxito',
            'specialcases'  => SpecialCasesResource::collection($specialcases),
            'pagination'    => [
                'current_page'          => $specialcases->currentPage(),
                'total_pages'           => $specialcases->lastPage(),
                'per_page'              => $specialcases->perPage(),
                'total_special_cases'   => $specialcases->total(),
            ]
        ], Response::HTTP_OK);
    }

    // Obtener un caso especial en especifico
    public function show(Request $request, $id)
    {
        $specialCase = SpecialCases::with(['user', 'contact'])->findOrFail($id);
        log_activity('ver_detalle', 'Casos Especiales', [
            'mensaje' => "El usuario {$request->user()->name} consultó el detalle del caso especial ID {$specialCase->id}.",
            'id' => $specialCase->id,
        ], $request);

        return response()->json([
            'mensaje' => 'Caso especial encontrado',
            'caso_especial' => new SpecialCasesResource($specialCase)
        ], Response::HTTP_OK);
    }
    // Crear nuevo caso especial
    public function store(SpecialCasesRequest $request)
    {
        $specialcases = SpecialCases::create($request->all());
        log_activity('crear', 'Casos Especiales', [
            'mensaje' => "El usuario {$request->user()->name} creó un nuevo caso especial.",
            'id_caso_especial' => $specialcases->id,

        ], $request);

        return response()->json([
            'message' => 'Caso especial creado correctamente',
            'special_case' => new SpecialCasesResource($specialcases)
        ], Response::HTTP_CREATED);
    }

    // Actualizar caso especial
    public function update(Request $request, $id)
    {
        $specialcase = SpecialCases::findOrFail($id);
        $specialcase->update($request->all());

        $dataBefore = $specialcase->toArray();

        log_activity('actualizar', 'Casos Especiales', [
            'mensaje' => "El usuario {$request->user()->name} actualizó el caso especial ID {$id}.",
            'cambios' => [
                'antes' => $dataBefore,
                'despues' => $specialcase->toArray()
            ]
        ], $request);

        return response()->json([
            'succes' => true,
            'message' => 'Caso especial actualizado con exito',
            'special_case' => new SpecialCasesResource($specialcase)
        ], Response::HTTP_OK);
    }

    // Activar o desactivar un caso especial
    public function destroy(Request $request, $id)
    {
        $specialcase = SpecialCases::findOrFail($id);
        $specialcase->update(['is_active' => !$specialcase->is_active]);
        log_activity(
            $specialcase->is_active ? 'activar' : 'desactivar',
            'Casos Especiales',
            [
                'mensaje' => "El usuario {$request->user()->name} " .
                    ($specialcase->is_active ? 'activó' : 'desactivó') .
                    " el caso especial ID {$id}.",
                'caso_especial_id' => $id,
            ],
            $request
        );

        return response()->json([
            'message' => $specialcase->is_active
                ? 'Caso especial activado correctamente'
                : 'Caso especial desactivado correctamente',
            'special_case' => new SpecialCasesResource($specialcase)
        ], Response::HTTP_OK);
    }
    
    // Contar casos especiales
    public function count()
    {
        // Contar todo
        $total = SpecialCases::count();

        // Retornar respuesta JSON
        return response()->json([
            'count' => $total
        ], Response::HTTP_OK);
    }

}
