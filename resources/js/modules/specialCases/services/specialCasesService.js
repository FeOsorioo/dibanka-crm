import api from "@api/axios";

/* ===========================================================
 *  CASOS ESPECIALES
 * =========================================================== */

/**
 * Obtiene todos los casos especiales con paginación y búsqueda.
 */
export const getSpecialCases = async (page = 1, filters = {}) => {
    const params = new URLSearchParams({ page });

    // Agregar filtros dinámicos a la URL
    Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
    });

    const { data } = await api.get(`/specialcases?${params.toString()}`);

    return {
        specialCases: data.specialcases || [],
        pagination: {
            total_pages: data.pagination?.total_pages ?? 1,
            current_page: data.pagination?.current_page ?? 1,
            per_page: data.pagination?.per_page ?? 0,
            total: data.pagination?.total_special_cases ?? 0,
        },
    };
};

/**
 * Crea un caso especial.
 */
export const saveSpecialCase = async (payload) => {
    const { data } = await api.post("/specialcases", payload);
    return data;
};

/* ===========================================================
 *  SELECTORES RELACIONADOS
 * =========================================================== */

/**
 * Pagadurías activas.
 */
export const getActivePayrolls = async () => {
    const { data } = await api.get("/payrolls/active");
    return data.data || [];
};

/**
 * Lista de contactos con paginación, búsqueda y filtro por pagaduría.
 */
export const getContacts = async (page = 1, filters = {}) => {
    const params = new URLSearchParams({ page });

    // Agregar filtros dinámicos a la URL
    Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
    });

    const { data } = await api.get(`/contacts/active?${params.toString()}`);

    return {
        contacts: data.contacts || [],
        pagination: {
            current_page: data.pagination.current_page || 1,
            total_pages: data.pagination.last_page || 1,
            per_page: data.pagination.per_page || 10,
            total_contacts: data.pagination.total_contacts || 0,
        },
    };
};

/**
 * Lista de agentes o usuarios.
 */
export const getUsers = async (page = 1) => {
    const { data } = await api.get(`/config/users?page=${page}`);
    return {
        users: data.users || [],
        pagination: {
            total_pages: data.pagination?.total_pages ?? 1,
            current_page: data.pagination?.current_page ?? 1,
        },
    };
};

/**
 * Obtiene el historial de cambios de un caso especial.
 * @param {number} id - ID de la gestión
 * @param {number} page - Número de página
 */
export const getHistoryChanges = async (specialcaseId, page = 1) => {
    const { data } = await api.get(
        `/change-histories/entity/specialcases/${specialcaseId}?page=${page}`,
    );
    return data;
};
