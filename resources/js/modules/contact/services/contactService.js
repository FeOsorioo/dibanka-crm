import api from "@api/axios";

/* ===========================================================
 *  CONTACTOS
 * =========================================================== */

/**
 * Obtiene la lista de contactos con paginación y búsqueda.
 * @param {number} page - Número de página
 * @param {Object} filters - Filtros dinámicos
 */
export const getContacts = async (page = 1, filters = {}) => {
    const params = new URLSearchParams({ page });

    // Agregar filtros dinámicos a la URL
    Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
    });

    const { data } = await api.get(`/contacts?${params.toString()}`);
    return data;
};

/**
 * Crea un nuevo contacto.
 */
export const createContact = async (contactData) => {
    const { data } = await api.post("/contacts", contactData);
    return data;
};

/**
 * Actualiza un contacto existente.
 */
export const updateContact = async (id, contactData) => {
    const { data } = await api.put(`/contacts/${id}`, contactData);
    return data;
};

/**
 * Activa o desactiva un contacto.
 */
export const deleteContact = async (id) => {
    const { data } = await api.delete(`/contacts/${id}`);
    return data;
};

/**
 * Obtiene el historial de cambios de un contacto específico.
 * @param {number} id - ID del contacto
 * @param {number} page - Número de página
 */
export const getHistoryChanges = async (contactId, page = 1) => {
    const { data } = await api.get(
        `/change-histories/entity/contact/${contactId}?page=${page}`
    );
    return data;
};

/* ===========================================================
 *  PAGADURÍAS
 * =========================================================== */

/**
 * Obtiene todas las pagadurías.
 */
export const getPayrolls = async () => {
    const { data } = await api.get("/payrolls/active");
    return data.data;
};

/**
 * Consultas activas.
 */
export const getActivePayrolls = async () => {
    const { data } = await api.get("/payrolls/active");
    return data.payrolls || [];
};

/* ===========================================================
 *  ENTIDADES
 * =========================================================== */

/**
 * Obtiene todas las entidades.
 */
export const getEntities = async () => {
    const { data } = await api.get("/entities/active");
    return data.data;
};
