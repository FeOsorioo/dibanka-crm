<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\OperatorEntity;
use App\Http\Resources\OperatorEntityResource;
use App\Http\Requests\OperatorEntityRequest;

class OperatorEntityController extends Controller
{
    public function index(Request $request)
    {
        $operator_entity = OperatorEntity::paginate(10);

        // Log
        log_activity('ver_listado', 'Operadores - entidades', [
            'mensaje' => "El usuario {$request->user()->name} visualizó el listado de operadores - entidades",
        ], $request);

        return response()->json([
            'message'       => 'Operadores - entidades obtenidos con éxito',
            'operator_entity'  => OperatorEntityResource::collection($operator_entity),
            'pagination'    => [
                'current_page'          => $operator_entity->currentPage(),
                'total_pages'           => $operator_entity->lastPage(),
                'per_page'              => $operator_entity->perPage(),
                'total_operator_entity'   => $operator_entity->total(),
            ]
        ], Response::HTTP_OK);
    }

    public function show(OperatorEntity $id)
    {
        // Log
        log_activity('ver', 'Operadores - entidades', [
            'mensaje' => "El usuario {$request->user()->name} visualizó un operador - entidad",
        ], $request);

        return response()->json([
            'message'       => 'Operador - entidad obtenido con éxito',
            'operator_entity'  => new OperatorEntityResource($id),
        ], Response::HTTP_OK);
    }

    public function store(OperatorEntityRequest $request)
    {
        $operator_entity = OperatorEntity::create($request->validated());

        // Log
        log_activity('crear', 'Operadores - entidades', [
            'mensaje' => "El usuario {$request->user()->name} creó un operador - entidad",
        ], $request);

        return response()->json([
            'message'       => 'Operador - entidad creado con éxito',
            'operator_entity'  => new OperatorEntityResource($operator_entity),
        ], Response::HTTP_OK);
    }


}
