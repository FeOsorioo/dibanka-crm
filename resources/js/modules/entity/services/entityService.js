import api from "@api/axios";

/**
 * Obtiene la lista de entidades con paginación y búsqueda.
 * @param {number} page - Número de página
 * @param {Object} filters - Filtros dinámicos
 */
export const getEntities = async (page = 1, filters = {}) => {
    const params = new URLSearchParams({ page });

    // Agregar filtros dinámicos a la URL
    Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
    });

    const { data } = await api.get(`/entities?${params.toString()}`);
    return data;
};

/**
 * Crea una nueva entidad.
 */
export const createEntity = async (entityData) => {
    const { data } = await api.post("/entities", entityData);
    return data;
};

/**
 * Actualiza una entidad existente.
 */
export const updateEntity = async (id, entityData) => {
    const { data } = await api.put(`/entities/${id}`, entityData);
    return data;
};

/**
 * Activa o desactiva una entidad.
 */
export const deleteEntity = async (id) => {
    const { data } = await api.delete(`/entities/${id}`);
    return data;
};

/**
 * Obtiene el historial de cambios de una entidad específica.
 * @param {number} entityId - ID de la entidad
 * @param {number} page - Número de página
 */
export const getHistoryChanges = async (entityId, page = 1) => {
    const { data } = await api.get(
        `/change-histories/entity/entity/${entityId}?page=${page}`,
    );
    return data;
};
