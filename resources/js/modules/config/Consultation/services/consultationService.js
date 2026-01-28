import api from "@api/axios";

/* ===========================================================
 *  SERVICIOS DE CONSULTAS (GENERAL)
 * =========================================================== */

/**
 * Obtiene las consultas con paginación y búsqueda.
 */
export const getConsultations = async (page = 1, search = "") => {
    const { data } = await api.get(
        `/config/consultations?page=${page}&search=${encodeURIComponent(
            search,
        )}`,
    );
    return data;
};

/**
 * Busca consultas.
 */
export const searchConsultations = async (search = "") => {
    return await getConsultations(1, search);
};

/**
 * Crea una nueva consulta.
 */
export const createConsultation = async (payload) => {
    const { data } = await api.post("/config/consultations", payload);
    return data;
};

/**
 * Actualiza una consulta existente.
 */
export const updateConsultation = async (id, payload) => {
    const { data } = await api.put(`/config/consultations/${id}`, payload);
    return data;
};

/**
 * Elimina o desactiva una consulta.
 */
export const deleteConsultation = async (id) => {
    const { data } = await api.delete(`/config/consultations/${id}`);
    return data;
};

/* ===========================================================
 *  SERVICIO DE PAGADURÍAS (para selector)
 * =========================================================== */

/**
 * Obtiene todas las pagadurías activas.
 */
export const getActivePayrolls = async () => {
    const { data } = await api.get("/payrolls/active");
    return data.data || [];
};

/* ===========================================================
 *  SERVICIO DE CAMPAÑAS (para selector)
 * =========================================================== */

/**
 * Obtiene todas las campañas.
 */
export const getCampaigns = async () => {
    const { data } = await api.get("/campaign");
    return data || [];
};
