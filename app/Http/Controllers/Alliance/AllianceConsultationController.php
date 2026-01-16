<?php

namespace App\Http\Controllers\Alliance;

use App\Http\Controllers\Controller;
use App\Models\Alliance\AllianceConsultation;
use App\Models\Alliance\AllianceSpecific;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use App\Http\Resources\Alliance\AllianceConsultationResource;
use App\Http\Requests\Alliance\AllianceConsultationRequest;

class AllianceConsultationController extends Controller
{
    /**
     * Listar todas las consultas con paginación
     */
    public function index(Request $request)
    {
        $query = AllianceConsultation::with(['payrolls']);

        if ($request->has('search') && !empty($request->search)) {
            $searchTerm = $request->search;

            $query->where(function ($q) use ($searchTerm) {
                $q->where('name', 'LIKE', "%{$searchTerm}%");

                // Para buscar en relaciones
                $q->orWhereHas('payrolls', function ($payrolQuery) use ($searchTerm) {
                    $payrolQuery->where('name', 'LIKE', "%{$searchTerm}%");
                });
            });
        }

        $consultations = $query->orderBy('id', 'desc')->paginate(10);
        
        // Contar todos los registros activos e inactivos (no solo de la página actual)
        $countActives = AllianceConsultation::where('is_active', true)->count();
        $countInactives = AllianceConsultation::where('is_active', false)->count();
        
        log_activity('ver_listado', 'Consultas', [
            'mensaje' => "El usuario {$request->user()->name} consultó el listado de consultas.",
            'criterios' => [
                'búsqueda' => $request->search ?? 'Sin filtro aplicado'
            ]
        ], $request);


        return response()->json([
            'message'       => 'Consultas obtenidas con éxito',
            'consultations' => ConsultationResource::collection($consultations),
            'pagination'    => [
                'current_page'          => $consultations->currentPage(),
                'total_pages'           => $consultations->lastPage(),
                'per_page'              => $consultations->perPage(),
                'total_consultations'   => $consultations->total(),
                'count_inactives'       => $countInactives,
                'count_actives'         => $countActives,
            ],
        ], Response::HTTP_OK);
    }

    // Trae solo consultas activas con paginación y búsqueda
    public function active(Request $request)
    {
        $query = AllianceConsultation::active()->with(['payrolls']);

        // Filtrar por pagaduría si se proporciona payroll_id
        if ($request->has('payroll_id') && !empty($request->payroll_id)) {
            $payrollId = $request->payroll_id;
            $query->whereHas('payrolls', function ($payrollQuery) use ($payrollId) {
                $payrollQuery->where('payrolls.id', $payrollId);
            });
        }

        // Búsqueda por nombre de consulta
        if ($request->has('search') && !empty($request->search)) {
            $searchTerm = $request->search;

            $query->where(function ($q) use ($searchTerm) {
                $q->where('name', 'LIKE', "%{$searchTerm}%");

                // Buscar también en relaciones de pagaduría
                $q->orWhereHas('payrolls', function ($payrollQuery) use ($searchTerm) {
                    $payrollQuery->where('name', 'LIKE', "%{$searchTerm}%");
                });
            });
        }

        $consultations = $query->get();

        log_activity('ver_activas', 'Consultas', [
            'mensaje' => "El usuario {$request->user()->name} consultó el listado de consultas activas.",
            'criterios' => [
                'búsqueda' => $request->search ?? 'Sin filtro aplicado',
                'payroll_id' => $request->payroll_id ?? 'Sin filtro de pagaduría'
            ]
        ], $request);

        return response()->json([
            'message'       => 'Consultas activas obtenidas con éxito',
            'consultations' => AllianceConsultationResource::collection($consultations)
        ], Response::HTTP_OK);
    }


    /**
     * Crear una nueva consulta
     */
    public function store(AllianceConsultationRequest $request)
    {
        $consultation = AllianceConsultation::create($request->validated());

        //Crear automaticamente los registros pivote
        if ($request->has('payroll_ids')) {
            $consultation->payrolls()->sync($request->payroll_ids);
        }

        $consultation->load('payrolls');

        log_activity('crear', 'Consultas', [
            'mensaje' => "El usuario {$request->user()->name} creó una nueva consulta.",
            'consulta_id' => $consultation->id
        ], $request);

        return response()->json([
            'message' => 'Consulta creada con éxito',
            'consultation' => new AllianceConsultationResource($consultation)
        ], Response::HTTP_CREATED);
    }

    /**
     * Mostrar una consulta específica
     */
    public function show(Request $request, string $id)
    {
        $query = AllianceConsultation::query();
        if (method_exists(new AllianceConsultation, 'specifics')) {
            $query->with('specifics');
        }

        $consultation = $query->find($id);

        if (! $consultation) {
            return response()->json(['message' => 'Consulta no encontrada'], Response::HTTP_NOT_FOUND);
        }
        log_activity('ver_detalle', 'Consultas', [
            'mensaje' => "El usuario {$request->user()->name} consultó el detalle de una consulta.",
            'consulta_id' => $id,
        ], $request);

        return response()->json([
            'message' => 'Consulta encontrada',
            'consultation' => new AllianceConsultationResource($consultation)
        ], Response::HTTP_OK);
    }

    /**
     * Actualizar una consulta
     * Permite actualizar y re-sincronizar la tabla pivote opcionalmente
     */
    public function update(AllianceConsultationRequest $request, $id)
    {
        $consultation = AllianceConsultation::findOrFail($id);
        $consultationBefore = $consultation->toArray();

        // Sincronizar pagadurías (si vienen)
        if ($request->has('payroll_ids')) {
            $consultation->payrolls()->sync($request->payroll_ids);
        }    
        
        // Obtener estado actualizado después del sync
        $after = $consultation->load('payrolls')->toArray();    

        $consultation->update($request->all());

        log_activity('actualizar', 'Consultas', [
            'mensaje' => "El usuario {$request->user()->name} actualizó una consulta.",
            'cambios' => [
                'antes' => $consultationBefore,
                'después' => $after,
            ],
            'consulta_id' => $consultation->id,
        ], $request);

        return response()->json([
            'message' => 'Consulta actualizada con exito',
            'consultation' => new AllianceConsultationResource($consultation)
        ], Response::HTTP_OK);
    }

    /**
     * Activar/Desactivar (toggle) una consulta
     */
    public function destroy(Request $request, $id)
    {
        $consultation = AllianceConsultation::findOrFail($id);

        // Nuevo estado (toggle)
        $newState = $consultation->is_active ? 0 : 1;

        // Actualizar consulta
        $consultation->update(['is_active' => $newState]);

        // Si se DESACTIVA → borrar relaciones y desactivar consultas específicas
        if ($newState === 0) {
            \DB::table('payroll_consultations_aliados')
                ->where('consultation_id', $consultation->id)
                ->delete();

            // Desactivar consultas específicas relacionadas
            AllianceSpecific::where('consultation_id', $consultation->id)
                ->update(['is_active' => 0]);
        }

        log_activity(
            $newState ? 'activar consulta' : 'desactivar consulta',
            'Consultas',
            [
                "mensaje" => "Se ha " . ($newState ? "activado" : "desactivado") . " una consulta",
                "consulta_id" => $consultation->id
            ],
            $request
        );

        return response()->json([
            'message' => $newState
                ? 'Consulta activada correctamente'
                : 'Consulta desactivada correctamente (relaciones eliminadas)',
            'consultation' => new AllianceConsultationResource($consultation)
        ], Response::HTTP_OK);
    }


    /**
     * Contar todas las consultas
     */
    public function count(Request $request)
    {
        $count = AllianceConsultation::where('is_active', 1)->count();

        return response()->json(['count' => $count], Response::HTTP_OK);
    }
}
