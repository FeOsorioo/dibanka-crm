<?php

namespace App\Http\Controllers;

use App\Models\Payroll;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Http\Resources\PayrollResource;
use App\Http\Requests\PayrollRequest;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;

class PayrollController extends Controller
{
    // Obtener todas las pagadurías con paginación y búsqueda
    public function index(Request $request)
    {
        $query = Payroll::query();

        // 🔹 Si viene un payrollId, filtramos por él directamente
        if ($request->has('payroll_id') && !empty($request->payrollId)) {
            $query->where('id', $request->payrollId);
        }

        // 🔹 Si hay término de búsqueda, aplicar filtro
        elseif ($request->has('search') && !empty($request->search)) {
            $searchTerm = $request->search;

            $query->where(function ($q) use ($searchTerm) {
                $q->where('name', 'LIKE', "%{$searchTerm}%")
                ->orWhere('description', 'LIKE', "%{$searchTerm}%");
            });
        }

        $payrolls = $query->orderBy('id', 'desc')->paginate(10);
        
        // Contar todos los registros activos e inactivos (no solo de la página actual)
        $countActives = Payroll::where('is_active', true)->count();
        $countInactives = Payroll::where('is_active', false)->count();

        // 🔹 Registrar actividad
        log_activity('ver_listado', 'Pagadurías', [
            'mensaje' => "El usuario {$request->user()->name} visualizó el listado de pagadurías" .
                ($request->filled('search') ? " aplicando el filtro: '{$request->search}'" : "") .
                ($request->filled('payrollId') ? " filtrando por ID: '{$request->payrollId}'" : ""),
            'criterios' => [
                'búsqueda' => $request->search ?? null,
                'payrollId' => $request->payrollId ?? null,
            ],
        ], $request);

        // Contar todos los registros activos e inactivos (no solo de la página actual)
        $countActives = Payroll::where('is_active', true)->count();
        $countInactives = Payroll::where('is_active', false)->count();

        return response()->json([
            'message' => 'Pagadurías obtenidas con éxito',
            'data' => PayrollResource::collection($payrolls),
            'pagination' => [
                'current_page' => $payrolls->currentPage(),
                'total_pages' => $payrolls->lastPage(),
                'per_page' => $payrolls->perPage(),
                'total_payrolls' => $payrolls->total(),
                'count_inactives' => $countInactives,
                'count_actives' => $countActives,
            ]
        ], Response::HTTP_OK);
    }

    // Trae solo pagadurias activas
    public function active(Request $request)
    {
        $payrolls = Payroll::active()->get();

        log_activity('ver_activas', 'Pagadurías', [
            'mensaje' => "El usuario {$request->user()->name} consultó las pagadurías activas.",
        ], $request);

        return response()->json([
            'message' => 'Pagadurias activas obtenidas con éxito',
            'data' => PayrollResource::collection($payrolls),
        ], Response::HTTP_OK);
    }

    // Crear una nueva pagaduría
    public function store(PayrollRequest $request)
    {
        // Guardar los datos básicos
        $payroll = Payroll::create($request->all());

        if ($request->hasFile('img_payroll')) {
            $path = $request->file('img_payroll')->store('img_payroll', 'public');

            // Guardar la ruta en la BD (asegúrate de que tu tabla tenga una columna img_payroll)
            $payroll->img_payroll = $path;
            $payroll->save();
        }
        log_activity('crear', 'Pagadurías', [
            'mensaje' => "El usuario {$request->user()->name} creó una nueva pagaduría.",
            'pagaduria_id' => $payroll->id
        ], $request);

        return response()->json([
            'message' => 'Pagaduría creada con éxito',
            'data' => new PayrollResource($payroll)
        ], Response::HTTP_CREATED);
    }

    // Obtener una pagaduría específica
    public function show(Request $request, Payroll $payroll)
    {
        log_activity('ver_detalle', 'Pagadurías', [
            'mensaje' => "El usuario {$request->user()->name} visualizó el detalle de la pagaduría ID {$payroll->id}.",
            'datos' => $payroll->toArray()
        ], $request);
        return response()->json([
            'message' => 'Pagaduría encontrada',
            'data' => new PayrollResource($payroll)
        ], Response::HTTP_OK);
    }

    // Actualizar una pagaduría
    public function update(Request $request, $id)
    {
        $payroll = Payroll::findOrFail($id);
        $dataBefore = $payroll->toArray();

        $payroll->name = $request->name;
        $payroll->description = $request->description;

        // 🔹 Campos informativos opcionales
        $payroll->i_title = $request->i_title;
        $payroll->i_description = $request->i_description;
        $payroll->i_phone = $request->i_phone;
        $payroll->i_email = $request->i_email;

        // 🔹 Si viene un archivo nuevo, lo guardamos
        if ($request->hasFile('img_payroll')) {
            // Borrar imagen anterior si existe
            if ($payroll->img_payroll && \Storage::disk('public')->exists($payroll->img_payroll)) {
                \Storage::disk('public')->delete($payroll->img_payroll);
            }

            $path = $request->file('img_payroll')->store('img_payroll', 'public');
            $payroll->img_payroll = $path;
        }

        $payroll->save();

        log_activity('actualizar', 'Pagadurías', [
            'mensaje' => "El usuario {$request->user()->name} actualizó una pagaduría.",
            'cambios' => [
                'antes' => $dataBefore,
                'despues' => $payroll->toArray()
            ]
        ], $request);

        return response()->json([
            'message' => 'Pagaduría actualizada correctamente',
            'payroll' => $payroll,
        ], Response::HTTP_OK);
    }

    // Activar/Desactivar una pagaduría
    public function destroy(Request $request, $id)
    {
        try {
            DB::beginTransaction();
            
            $payroll = Payroll::findOrFail($id);
            $state = $payroll->is_active;
            
            // Si se está desactivando, eliminar las relaciones
            if ($state) { // Si estaba activa (true) y se va a desactivar
                DB::table('payroll_consultations_aliados')
                    ->where('payroll_id', $id)
                    ->delete();
                
                DB::table('affiliate_consultations_payroll')
                    ->where('payroll_id', $id)
                    ->delete();
            }
            
            $payroll->update(['is_active' => !$payroll->is_active]);
            
            log_activity(
                $payroll->is_active ? 'activar' : 'desactivar',
                'Pagadurías',
                [
                    'mensaje' => "El usuario {$request->user()->name} " .
                        ($payroll->is_active ? 'activó' : 'desactivó') .
                        " la pagaduría ID {$id}." .
                        (!$payroll->is_active ? ' Se eliminaron las relaciones asociadas.' : ''),
                    'pagaduria_id' => $id,
                ],
                $request
            );
            
            DB::commit();
            
            return response()->json([
                'message' => $payroll->is_active
                    ? 'Pagaduría activada correctamente'
                    : 'Pagaduría desactivada correctamente. Relaciones eliminadas.',
                'payroll' => new PayrollResource($payroll)
            ], Response::HTTP_OK);
            
        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'message' => 'Error al procesar la operación',
                'error' => $e->getMessage()
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    // Contar pagadurías
    public function count()
    {
        // Contar solo las pagadurías activas
        $total = Payroll::where('is_active', 1)->count();


        // Retornar respuesta JSON
        return response()->json([
            'count' => $total
        ], Response::HTTP_OK);
    }
}
