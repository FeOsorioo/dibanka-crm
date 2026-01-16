<?php

namespace App\Http\Controllers\Aliados;

use App\Http\Controllers\Controller;
use App\Models\Aliados\Specific;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use App\Http\Resources\Aliados\SpecificResource;
use App\Http\Requests\Aliados\SpecificRequest;

class SpecificController extends Controller
{
    /**
     * Listar todas las consultas específicas con paginación
     */
    public function index(Request $request)
    {
        $query = Specific::with(['consultation.payrolls']);

        if ($request->has('search') && !empty($request->search)) {
            $searchTerm = $request->search;

            $query->where(function ($q) use ($searchTerm) {
                $q->where('name', 'LIKE', "%{$searchTerm}%");

                // Para buscar en relaciones
                $q->orWhereHas('consultation', function ($consultationQuery) use ($searchTerm) {
                    $consultationQuery->where('name', 'LIKE', "%{$searchTerm}%");
                });
            });
        }

        $specifics = $query->paginate(10);

        log_activity('ver_listado', 'Consultas  Espefica', [
            'mensaje' => "El usuario {$request->user()->name} consultó el listado de consultas especifica.",
            'criterios' => [
                'búsqueda' => $request->search ?? 'Sin filtro aplicado'
            ]
        ], $request);
        
        // Contar todos los registros activos e inactivos (no solo de la página actual)
        $countActives = Specific::where('is_active', true)->count();
        $countInactives = Specific::where('is_active', false)->count();

        return response()->json([
            'message'       => 'Consultas específicas obtenidas con éxito',
            'specifics' => SpecificResource::collection($specifics),
            'pagination'    => [
                'current_page'        => $specifics->currentPage(),
                'total_pages'         => $specifics->lastPage(),
                'per_page'            => $specifics->perPage(),
                'total_consultations' => $specifics->total(),
                'count_inactives' => $countInactives,
                'count_actives' => $countActives,
            ],
        ], Response::HTTP_OK);
    }

    // Trae solo consultas específicas activas con paginación y búsqueda
    public function active(Request $request)
    {
        $query = Specific::with(['consultation.payrolls'])
            ->where('is_active', 1);

        // Filtrar por consulta si se proporciona consultation_id
        if ($request->has('consultation_id') && !empty($request->consultation_id)) {
            $query->where('consultation_id', $request->consultation_id);
        }

        // Filtro de búsqueda
        if ($request->has('search') && !empty($request->search)) {
            $searchTerm = $request->search;

            $query->where(function ($q) use ($searchTerm) {
                $q->where('name', 'LIKE', "%{$searchTerm}%");

                // Buscar dentro de la relación consultation
                $q->orWhereHas('consultation', function ($consultationQuery) use ($searchTerm) {
                    $consultationQuery->where('name', 'LIKE', "%{$searchTerm}%");
                });
            });
        }

        // Obtener todos los resultados sin paginación
        $consultations = $query->orderBy('id', 'desc')->get();

        log_activity('ver_activas', 'Consultas Especificas', [
            'mensaje' => "El usuario {$request->user()->name} consultó el listado de consultas específicas activas.",
            'criterios' => [
                'búsqueda' => $request->search ?? 'Sin filtro aplicado',
                'payroll_id' => $request->payroll_id ?? 'Sin filtro de pagaduría'
            ]
        ], $request);

        return response()->json([
            'message'       => 'Consultas específicas activas obtenidas con éxito',
            'consultationspecific' => SpecificResource::collection($consultations)
        ], Response::HTTP_OK);
    }


    /**
     * Crear una nueva consulta específica
     */
    public function store(SpecificRequest $request)
    {

        $specific = Specific::create($request->all());

        log_activity('crear', 'Consultas Especificas', [
            'mensaje' => "El usuario {$request->user()->name} creó una nueva consulta especifica.",
   
            
            'consulta_id' => $specific->id
        ], $request);

        return response()->json([
            'message' => 'Consulta especifica creada correctamente',
            'specific' => new SpecificResource($specific)
        ], Response::HTTP_CREATED);
    }

    /**
     * Mostrar una consulta específica
     */
    public function show(Request $request, string $id)
    {
        $specific = Specific::find($id);

        if (! $specific) {
            return response()->json(['message' => 'Consulta específica no encontrada'], Response::HTTP_NOT_FOUND);
        }
        log_activity('ver_detalle', 'Consultas especificas', [
            'mensaje' => "El usuario {$request->user()->name} consultó el detalle de una consulta.",
            'consulta_id' => $id,
        ], $request);

        return response()->json([
            'message' => 'Consulta específica encontrada',
            'specific' => new SpecificResource($specific)
        ], Response::HTTP_OK);
    }

    /**
     * Actualizar una consulta específica
     */
    public function update(SpecificRequest $request, $id)
    {
        $specific = Specific::findOrFail($id);
        $dataBefore = $specific->toArray();

        $specific->update($request->all());

        log_activity('actualizar', 'Consultas especificas', [
            'mensaje' => "El usuario {$request->user()->name} actualizó una consulta.",
            'cambios' => [
                'antes' => $dataBefore,
                'despues' => $specific->toArray(),
            ],
            'consulta_id' => $specific->id,
        ], $request);
        return response()->json([
            'succes' => true,
            'message' => 'Consults especifica actualizada con exito',
            'specific' => new SpecificResource($specific)
        ], Response::HTTP_OK);
    }

    /**
     * Activar/Desactivar (toggle) una consulta específica
     */
    public function destroy(Request $request, string $id)
    {
        $specific = Specific::find($id);

        if (! $specific) {
            return response()->json(['message' => 'Consulta específica no encontrada'], Response::HTTP_NOT_FOUND);
        }

        $specific->update(['is_active' => $specific->is_active ? 0 : 1]);


        log_activity(
            $specific->is_active ? 'activar consulta' : 'desactivar consulta',
            'Consultas',
            [
                "message" => "Se ha" . $specific->is_active ? 'activado' : 'desactivado' . " una consulta",
            ],
            $request
        );
        return response()->json(['message' => 'Consulta específica actualizada correctamente'], Response::HTTP_OK);
    }

    /**
     * Contar todas las consultas específicas
     */
    public function count()
    {
        $count = Specific::where('is_active', 1)->count();

        return response()->json(['estadisticas' => $count], Response::HTTP_OK);
    }
}
