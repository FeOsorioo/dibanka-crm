<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Http\Response;
use App\Http\Resources\EntityResource;
use App\Models\Entity;
use App\Http\Requests\EntityRequest;

class EntityController extends Controller
{
    // Obtener todos las entidades
    public function index(Request $request)
    {
        $query = Entity::query();

        // 🔹 Si hay término de búsqueda, aplicar filtro
        if ($request->has('search') && !empty($request->search)) {
            $searchTerm = $request->search;

            $query->where(function ($q) use ($searchTerm) {
                $q->where('name', 'LIKE', "%{$searchTerm}%")
                ->orWhere('phone', 'LIKE', "%{$searchTerm}%")
                ->orWhere('email', 'LIKE', "%{$searchTerm}%")
                ->orWhere('nit', 'LIKE', "%{$searchTerm}%")
                ->orWhere('description', 'LIKE', "%{$searchTerm}%");
            });
        }

        $entities = $query->orderBy('id', 'desc')->paginate(10);
        
        // Contar todos los registros activos e inactivos (no solo de la página actual)
        $countActives = Entity::where('is_active', true)->count();
        $countInactives = Entity::where('is_active', false)->count();

        // 🔹 Registrar actividad
        log_activity('ver_listado', 'Entidades', [
            'mensaje' => "El usuario {$request->user()->name} visualizó el listado de entidades" .
                ($request->filled('search') ? " aplicando el filtro: '{$request->search}'" : ""),
            'criterios' => [
                'búsqueda' => $request->search ?? null,
                'entityId' => $request->entity->id ?? null,
            ],
        ], $request);

        // Contar todos los registros activos e inactivos (no solo de la página actual)
        $countActives = Entity::where('is_active', true)->count();
        $countInactives = Entity::where('is_active', false)->count();

        return response()->json([
            'message' => 'Entidades obtenidas con éxito',
            'data' => EntityResource::collection($entities),
            'pagination' => [
                'current_page' => $entities->currentPage(),
                'total_pages' => $entities->lastPage(),
                'per_page' => $entities->perPage(),
                'total_entities' => $entities->total(),
                'count_inactives' => $countInactives,
                'count_actives' => $countActives,
            ]
        ], Response::HTTP_OK);
    }

    // Trae solo entidades activas
    public function active(Request $request)
    {
        $entities = Entity::active()->get();

        log_activity('ver_activas', 'Entidades', [
            'mensaje' => "El usuario {$request->user()->name} consultó las entidades activas.",
        ], $request);

        return response()->json([
            'message' => 'Entidades activas obtenidas con éxito',
            'data' => EntityResource::collection($entities),
        ], Response::HTTP_OK);
    }

    // Obtener una entidad específica
    public function show(Request $request, Entity $entity)
    {
        log_activity('ver_detalle', 'Entidades', [
            'mensaje' => "El usuario {$request->user()->name} visualizó el detalle de la entidad ID {$entity->id}.",
            'datos' => $entity->toArray()
        ], $request);
        return response()->json([
            'message' => 'Entidad encontrada',
            'data' => new EntityResource($entity)
        ], Response::HTTP_OK);
    }

    // Crear nueva entidad
    public function store(EntityRequest $request)
    {
        $entity = Entity::create($request->all());
        log_activity('crear', 'Entidades', [
            'mensaje' => "El usuario {$request->user()->name} creó una nueva entidad.",
            'id_entidad' => $entity->id,
        ], $request);

        return response()->json([
            'message' => 'Entidad creada correctamente',
            'entity' => new EntityResource($entity)
        ], Response::HTTP_CREATED);
    }

    // Actualizar entidad
    public function update(Request $request, $id)
    {
        $entity = Entity::findOrFail($id);
        $entity->update($request->all());

        $dataBefore = $entity->toArray();

        log_activity('actualizar', 'Entidades', [
            'mensaje' => "El usuario {$request->user()->name} actualizó la entidad ID {$id}.",
            'cambios' => [
                'antes' => $dataBefore,
                'despues' => $entity->toArray()
            ]
        ], $request);

        return response()->json([
            'succes' => true,
            'message' => 'Entidad actualizada con exito',
            'entity' => new EntityResource($entity)
        ], Response::HTTP_OK);
    }

    // Activar o desactivar una entidad
    public function destroy(Request $request, $id)
    {
        $entity = Entity::findOrFail($id);
        $entity->update(['is_active' => !$entity->is_active]);
        log_activity(
            $entity->is_active ? 'activar' : 'desactivar',
            'Entidades',
            [
                'mensaje' => "El usuario {$request->user()->name} " .
                    ($entity->is_active ? 'activó' : 'desactivó') .
                    " la entidad ID {$id}.",
                'entidad_id' => $id,
            ],
            $request
        );

        return response()->json([
            'message' => $entity->is_active
                ? 'Entidad activada correctamente'
                : 'Entidad desactivada correctamente',
            'entity' => new EntityResource($entity)
        ], Response::HTTP_OK);
    }
}
