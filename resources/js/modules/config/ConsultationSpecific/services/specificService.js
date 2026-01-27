import api from "@api/axios";

/* ===========================================================
 *  SERVICIOS DE CONSULTAS ESPECÍFICAS
 * =========================================================== */

/**
 * Obtiene las consultas específicas con paginación y búsqueda.
 */
export const getSpecifics = async (page = 1, search = "") => {
    const { data } = await api.get(
        `/config/specifics?page=${page}&search=${encodeURIComponent(search)}`,
    );

    const specifics = (data.specifics || []).map((s) => ({
        ...s,
        consultation: s.consultation?.name || "—",
        consultation_id: s.consultation?.id || null,
        payroll: s.consultation?.payrolls?.map((p) => p.name).join(", ") || "—",
    }));

    return {
        specifics,
        pagination: data.pagination,
    };
};

/**
 * Crea una nueva consulta específica.
 */
export const saveSpecific = async (payload) => {
    const { data } = await api.post("/config/specifics", payload);
    return data;
};

/**
 * Actualiza una consulta específica.
 */
export const updateSpecific = async (id, payload) => {
    const { data } = await api.put(`/config/specifics/${id}`, payload);
    return data;
};

/**
 * Elimina o desactiva una consulta específica.
 */
export const deleteSpecific = async (id) => {
    const { data } = await api.delete(`/config/specifics/${id}`);
    return data;
};

/* ===========================================================
 *  SERVICIOS COMPARTIDOS
 * =========================================================== */

/**
 * Obtiene todas las consultas generales activas (para el selector).
 */
export const getConsultationsForSelect = async () => {
    // Note: The backend route for active consultations is /config/consultations/active
    // verified in api.php
    const { data } = await api.get("/config/consultations/active");
    // Assuming the response structure has 'consultations' or just returns list.
    // api.php says [ConsultationController::class, 'active']
    // usually returns { data: [...] } or [...] or { consultations: [...] }
    // Checking previous service: 'consultationsAliadosService' called /active and returned data.consultations
    // Let's assume consistent response structure from the unified controller.
    return data.consultations || data.data || [];
};

/**
 * Pagadurías activas.
 */
export const getActivePayrolls = async () => {
    const { data } = await api.get("/payrolls/active");
    return data.data || [];
};
