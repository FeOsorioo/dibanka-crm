<?php

namespace App\Http\Controllers\Afiliados;

use App\Http\Controllers\Controller;
use App\Http\Requests\Afiliados\ManagementRequest;
use App\Http\Requests\UpdateMonitoringRequest;
use App\Models\Afiliados\Management;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Http\Resources\Afiliados\ManagementResource;
use Illuminate\Support\Facades\Validator;

class ManagementController extends Controller
{
    /**
     * Obtener todas las gestiones con información relacionada (paginado).
     */
    public function index(Request $request)
    {
        $query = Management::with([
            'user',
            'consultation',
            'contact',
            'specific',
            'monitoring',
            'type_management',
            'contact.payroll',
            'contact.campaign'
        ]);

        /*
        |--------------------------------------------------------------------------
        | 1. Filtros Dinámicos (compatibles con MultiFilter)
        |--------------------------------------------------------------------------
        */
        $possibleFilters = [
            'id' => 'id',
            'wolkvox_id' => 'wolkvox_id',
            'solution_date' => 'solution_date',
            'created_at' => 'created_at',
        ];

        foreach ($possibleFilters as $param => $column) {
            if ($request->filled($param)) {
                $query->where($column, 'LIKE', "%{$request->$param}%");
            }
        }

        // Filtros por nombre de usuario (agente)
        if ($request->filled('user')) {
            $query->whereHas('user', function ($q) use ($request) {
                $q->where('name', 'LIKE', "%{$request->user}%");
            });
        }

        // Filtros de contacto
        if ($request->filled('identification_number')) {
            $query->whereHas('contact', function ($q) use ($request) {
                $q->where('identification_number', 'LIKE', "%{$request->identification_number}%");
            });
        }

        if ($request->filled('name')) {
            $query->whereHas('contact', function ($q) use ($request) {
                $q->where('name', 'LIKE', "%{$request->name}%");
            });
        }

        if ($request->filled('email')) {
            $query->whereHas('contact', function ($q) use ($request) {
                $q->where('email', 'LIKE', "%{$request->email}%");
            });
        }

        if ($request->filled('phone')) {
            $query->whereHas('contact', function ($q) use ($request) {
                $q->where(function($sub) use ($request) {
                    $sub->where('phone', 'LIKE', "%{$request->phone}%")
                        ->orWhere('update_phone', 'LIKE', "%{$request->phone}%");
                });
            });
        }

        // Filtro por pagaduría
        if ($request->filled('payroll')) {
            $query->whereHas('contact.payroll', function ($q) use ($request) {
                $q->where('name', 'LIKE', "%{$request->payroll}%");
            });
        }

        // Filtro por campaña
        if ($request->filled('campaign_filter')) {
            $query->whereHas('contact.campaign', function ($q) use ($request) {
                $q->where('name', 'LIKE', "%{$request->campaign_filter}%");
            });
        }

        // Filtro por consulta
        if ($request->filled('consultation')) {
            $query->whereHas('consultation', function ($q) use ($request) {
                $q->where('name', 'LIKE', "%{$request->consultation}%");
            });
        }

        // Filtro por consulta específica
        if ($request->filled('specific')) {
            $query->whereHas('specific', function ($q) use ($request) {
                $q->where('name', 'LIKE', "%{$request->specific}%");
            });
        }

        // Filtro por tipo de gestión
        if ($request->filled('type_management')) {
            $query->whereHas('type_management', function ($q) use ($request) {
                $q->where('name', 'LIKE', "%{$request->type_management}%");
            });
        }

        // Filtro por seguimiento
        if ($request->filled('monitoring')) {
            $query->whereHas('monitoring', function ($q) use ($request) {
                $q->where('name', 'LIKE', "%{$request->monitoring}%");
            });
        }

        /*
        |--------------------------------------------------------------------------
        | 2. Compatibilidad con formato antiguo (Legacy Search)
        |--------------------------------------------------------------------------
        */
        if ($request->filled('searchValue') && $request->filled('filterColumn')) {
            $value = $request->searchValue;
            $column = $request->filterColumn;

            switch ($column) {
                case 'id': $query->where('id', 'LIKE', "%{$value}%"); break;
                case 'wolkvox_id': $query->where('wolkvox_id', 'LIKE', "%{$value}%"); break;
                case 'user': $query->whereHas('user', function ($q) use ($value) { $q->where('name', 'LIKE', "%{$value}%"); }); break;
                case 'solution_date': $query->where('solution_date', 'LIKE', "%{$value}%"); break;
                case 'created_at': $query->where('created_at', 'LIKE', "%{$value}%"); break;
                case 'identification_number': $query->whereHas('contact', function ($q) use ($value) { $q->where('identification_number', 'LIKE', "%{$value}%"); }); break;
                case 'name': $query->whereHas('contact', function ($q) use ($value) { $q->where('name', 'LIKE', "%{$value}%"); }); break;
                case 'email': $query->whereHas('contact', function ($q) use ($value) { $q->where('email', 'LIKE', "%{$value}%"); }); break;
                case 'phone': $query->whereHas('contact', function ($q) use ($value) { $q->where('phone', 'LIKE', "%{$value}%")->orWhere('update_phone', 'LIKE', "%{$value}%"); }); break;
                case 'payroll': $query->whereHas('contact.payroll', function ($q) use ($value) { $q->where('name', 'LIKE', "%{$value}%"); }); break;
                case 'specific': $query->whereHas('specific', function ($q) use ($value) { $q->where('name', 'LIKE', "%{$value}%"); }); break;
                case 'consultation': $query->whereHas('consultation', function ($q) use ($value) { $q->where('name', 'LIKE', "%{$value}%"); }); break;
                case 'type_management': $query->whereHas('type_management', function ($q) use ($value) { $q->where('name', 'LIKE', "%{$value}%"); }); break;
                case 'monitoring': $query->whereHas('monitoring', function ($q) use ($value) { $q->where('name', 'LIKE', "%{$value}%"); }); break;
            }
        }

        /*
        |--------------------------------------------------------------------------
        | 2. Filtro directo por identificación (si viene)
        |--------------------------------------------------------------------------
        */
        if ($request->filled('identification_number')) {
            $query->whereHas('contact', function ($q) use ($request) {
                $q->where('identification_number', $request->identification_number);
            });
        }

        /*
        |--------------------------------------------------------------------------
        | 3. Búsqueda general (sin columna especificada)
        |--------------------------------------------------------------------------
        */
        if ($request->filled('search') && !$request->filled('filterColumn')) {

            $searchTerm = $request->search;

            $query->where(function ($q) use ($searchTerm) {

                // Campos directos
                $q->where('id', 'LIKE', "%{$searchTerm}%")
                ->orWhere('wolkvox_id', 'LIKE', "%{$searchTerm}%")
                ->orWhere('solution_date', 'LIKE', "%{$searchTerm}%")
                ->orWhere('sms', 'LIKE', "%{$searchTerm}%")
                ->orWhere('wsp', 'LIKE', "%{$searchTerm}%");

                // Relaciones múltiples
                $relations = [
                    'user' => ['id', 'name', 'email'],
                    'monitoring' => ['name'],
                    'consultation' => ['name'],
                    'specific' => ['name'],
                    'type_management' => ['name'],
                    'contact' => [
                        'name',
                        'phone',
                        'update_phone',
                        'email',
                        'identification_type',
                        'identification_number'
                    ]
                ];

                foreach ($relations as $relation => $fields) {
                    $q->orWhereHas($relation, function ($sub) use ($searchTerm, $fields) {
                        $sub->where(function ($inner) use ($searchTerm, $fields) {
                            foreach ($fields as $field) {
                                $inner->orWhere($field, 'LIKE', "%{$searchTerm}%");
                            }
                        });
                    });
                }

                // payroll y campaign
                $q->orWhereHas('contact.payroll', function ($sub) use ($searchTerm) {
                    $sub->where('name', 'LIKE', "%{$searchTerm}%");
                });

                $q->orWhereHas('contact.campaign', function ($sub) use ($searchTerm) {
                    $sub->where('name', 'LIKE', "%{$searchTerm}%");
                });

            });
        }

        /*
        |--------------------------------------------------------------------------
        | 4. Paginación
        |--------------------------------------------------------------------------
        */
        $management = $query->orderBy('id', 'desc')->paginate(10);

        return response()->json([
            'message'     => 'Gestiones obtenidas con éxito',
            'managements' => ManagementResource::collection($management),
            'count'       => $management->count(),
            'pagination'  => [
                'current_page' => $management->currentPage(),
                'total_pages'  => $management->lastPage(),
                'per_page'     => $management->perPage(),
                'total_items'  => $management->total(),
            ]
        ]);
    }

    /**
     * Obtener una gestión específica con toda su información relacionada.
     */
    public function show(Request $request, $id)
    {
        $management = Management::with([
            'user', 
            'consultation', 
            'contact', 
            'specific', 
            'monitoring', 
            'type_management'
        ])->find($id);

        if (!$management) {
            return response()->json([
                'message' => 'Gestión no encontrada'
            ], Response::HTTP_NOT_FOUND);
        }

        log_activity('ver_detalle', 'Gestiones', [
            'mensaje' => "El usuario {$request->user()->name} visualizó el detalle de la gestión ID {$management->id}.",
            'management_id' => $management->id
        ], $request);

        return response()->json([
            'message' => 'Gestión encontrada',
            'management' => new ManagementResource($management)
        ], Response::HTTP_OK);
    }

    /**
     * Guardar una nueva gestión en la base de datos.
     */
    public function store(ManagementRequest $request)
    {
        $management = Management::create($request->all());

        // Carga relaciones para devolverlas en el resource
        $management->load(['user', 'consultation', 'contact', 'specific', 'monitoring']);

        log_activity('crear', 'Gestiones', [
            'mensaje' => "El usuario {$request->user()->name} creó una nueva gestión.",

            'management_id' => $management->id
        ], $request);

        return response()->json([
            'message' => 'Gestión creada correctamente',
            'management' => new ManagementResource($management)
        ], Response::HTTP_CREATED);
    }

    /**
     * Actualizar una gestión existente.
     */
    public function update(Request $request, $id)
    {
        $management = Management::find($id);
        $dataBefore = $management->toArray();

        if (!$management) {
            return response()->json(['message' => 'Gestión no encontrada'], Response::HTTP_NOT_FOUND);
        }

        $management->update($request->all());

        // Recargar relaciones para devolver la info actualizada
        $management->load(['user', 'consultation', 'specific', 'contact', 'monitoring']);
        
        log_activity('actualizar', 'Gestiones', [
            'mensaje' => "El usuario {$request->user()->name} actualizó una gestión.",
            'cambios' => [
                'anterior' => $dataBefore,
                'despues' => $management->toArray(),
            ]
        ], $request);

        return response()->json([
            'message' => 'Gestión actualizada correctamente',
            'management' => new ManagementResource($management)
        ], Response::HTTP_OK);
    }

    // Actualiza unicamente estos dos campos
    public function updateMonitoring(Request $request, $id)
    {
        $management = Management::findOrFail($id);
        $dataBefore = $management->toArray();
        $management->update($request->only(['solution_date', 'monitoring_id']));

        log_activity('actualizar', 'Gestiones', [
            'mensaje' => "El usuario {$request->user()->name} actualizó una gestión.",
            'detalles' => [
                'antes' => $dataBefore,
                'despues' => $management->toArray()
            ]
        ], $request);


        return response()->json([
            'message' => 'Gestión actualizada correctamente',
            'management' => new ManagementResource($management)
        ], Response::HTTP_OK);
    }

    /**
     * Eliminar una gestión.
     */
    public function destroy(Request $request,$id)
    {
        $management = Management::find($id);

        if (!$management) {
            return response()->json(['message' => 'Gestión no encontrada'], Response::HTTP_NOT_FOUND);
        }

        $management->delete();

       log_activity(
            $management->is_active ? 'activar consulta' : 'desactivar gestion',
            'Gestiones',
            [
                "message" => "Se ha" . $management->is_active ? 'activado' : 'desactivado' . " una gestion",
            ],
            $request
        );
        return response()->json(['message' => 'Gestión eliminada correctamente'], Response::HTTP_OK);
    }

    /**
     * Contador total de gestiones.
     */
    public function count()
    {
        $count = Management::count();

        return response()->json(['count' => $count], Response::HTTP_OK);
    }
}
