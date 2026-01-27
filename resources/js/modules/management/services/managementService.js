import api from "@api/axios";

/* ===========================================================
 *  GESTIONES
 * =========================================================== */

/**
 * Obtiene la lista de gestiones con paginación, búsqueda y filtro por columna.
 * @param {number} page
 * @param {object} filters - Filtros dinámicos
 */
export const getManagements = async (page = 1, filters = {}) => {
    const endpoint = "/management";
    const params = new URLSearchParams({ page });

    // Agregar filtros dinámicos a la URL
    if (typeof filters === "string") {
        if (filters) params.append("search", filters);
    } else {
        Object.entries(filters).forEach(([key, value]) => {
            if (value) params.append(key, value);
        });
    }

    const { data } = await api.get(`${endpoint}?${params.toString()}`);

    return {
        managements: data.managements || [],
        count: data.count || 0,
        pagination: {
            current_page: data.pagination?.current_page ?? 1,
            last_page:
                data.pagination?.last_page ?? data.pagination?.total_pages ?? 1,
            per_page: data.pagination?.per_page ?? 0,
            total:
                data.pagination?.total_management ??
                data.pagination?.total_items ??
                0,
        },
    };
};

/**
 * Crea o actualiza una gestión.
 * @param {Object} payload - Datos de la gestión
 */
export const saveManagement = async (payload) => {
    const { id } = payload;

    if (id) {
        // Actualizar
        const { data } = await api.put(`/management/${id}`, payload);
        return data;
    }

    // Crear
    const { data } = await api.post("/management", payload);
    return data;
};

/**
 * Tipos de gestión activos.
 */
export const getActiveTypeManagements = async () => {
    const { data } = await api.get("/config/typemanagements/active");
    return data.typeManagement || [];
};

/**
 * Actualiza los campos solution_date y monitoring_id de una gestión.
 * @param {number} id
 * @param {Object} payload
 */
export const updateManagementMonitoring = async (id, payload) => {
    const endpoint = `/managementmonitoring/${id}`;
    const { data } = await api.put(endpoint, payload);
    return data;
};

/* ===========================================================
 *  CONSULTAS
 * =========================================================== */

/**
 * Consultas activas.
 * @param {number} payrollId - ID de la pagaduría (opcional)
 */
export const getActiveConsultations = async (payrollId = null) => {
    let endpoint = "/config/consultations/active";

    if (payrollId) {
        endpoint += `?payroll_id=${payrollId}`;
    }

    try {
        const { data } = await api.get(endpoint);
        return data.consultations || [];
    } catch (error) {
        console.error("Error al obtener consultas:", error);
        return [];
    }
};

/**
 * Consultas específicas activas.
 * @param {number} consultationId - ID de la consulta (opcional)
 */
export const getActiveSpecificConsultations = async (consultationId = null) => {
    let endpoint = "/config/specifics/active";

    if (consultationId) {
        endpoint += `?consultation_id=${consultationId}`;
    }

    try {
        const { data } = await api.get(endpoint);
        return data.consultationspecific || [];
    } catch (error) {
        console.error("Error al obtener consultas específicas:", error);
        return [];
    }
};

/* ===========================================================
 *  SEGUIMIENTOS
 * =========================================================== */

/**
 * Obtiene todos los seguimientos activos.
 */
export const getActiveMonitorings = async () => {
    const { data } = await api.get("/monitorings/active");
    return data.monitorings || [];
};

/* ===========================================================
 *  CONTEO DE GESTIONES
 * =========================================================== */

/**
 * Obtiene el conteo total de gestiones.
 */
export const getCountManagements = async () => {
    const { data } = await api.get("/management/count");
    return data.count || 0;
};

/* ===========================================================
 *  LISTAS PARA FORMULARIO
 * =========================================================== */

/**
 * Pagadurías activas.
 */
export const getActivePayrolls = async () => {
    const { data } = await api.get("/payrolls/active");
    return data.data || [];
};

/**
 * Contactos con filtro por columna.
 */
export const getContacts = async (page = 1, search = "", filterColumn = "") => {
    let url = `/contacts/active?page=${page}`;

    if (filterColumn && search) {
        url += `&searchValue=${encodeURIComponent(
            search,
        )}&filterColumn=${filterColumn}`;
    } else if (search) {
        url += `&search=${encodeURIComponent(search)}`;
    }

    const { data } = await api.get(url);
    return data || [];
};

/**
 * Enviar sms.
 */
export const sendSms = async (payload) => {
    const { data } = await api.post("/send-sms", payload);
    return data;
};

/**
 * Enviar WhatsApp.
 */
export const sendWhatsApp = async (payload) => {
    const { data } = await api.post("/send-wsp", payload);
    return data;
};

/**
 * Obtiene el historial de cambios de una gestión.
 * @param {number} managementId - ID de la gestión
 * @param {number} page - Número de página
 */
export const getHistoryChanges = async (managementId, page = 1) => {
    const { data } = await api.get(
        `/change-histories/entity/management/${managementId}?page=${page}`,
    );
    return data;
};
