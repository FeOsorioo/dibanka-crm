import { useState, useEffect, useCallback, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
    getManagements,
    getActiveMonitorings,
    updateManagementMonitoring,
    getHistoryChanges,
    getCountManagements,
} from "@modules/management/services/managementService";
import { useMultiFilter } from "@hooks/useMultiFilter";

export const useManagement = () => {
    const [management, setManagement] = useState([]);
    const [monitoring, setMonitoring] = useState([]);
    const [managementCount, setManagementCount] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Gestión seleccionada para historial
    const [selectedManagement, setSelectedManagement] = useState(null);

    // Paginación
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [perPage, setPerPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);

    // ====================== Historial de Cambios ======================
    const [openHistory, setOpenHistory] = useState(false);
    const [history, setHistory] = useState([]);
    const [loadingHistory, setLoadingHistory] = useState(true);
    const [currentPageHistory, setCurrentPageHistory] = useState(1);
    const [totalPagesHistory, setTotalPagesHistory] = useState(1);
    const [perPageHistory, setPerPageHistory] = useState(15);
    const [totalItemsHistory, setTotalItemsHistory] = useState(0);

    // UI y filtros
    const { filters, addFilter, removeFilter, clearFilters } = useMultiFilter();
    const location = useLocation();

    const [IsOpenADD, setIsOpenADD] = useState(false);
    const [view, setView] = useState(false);
    const [onMonitoring, setOnMonitoring] = useState(false);

    // Refs para evitar loops y peticiones simultáneas
    const isFetching = useRef(false);

    // Validaciones y formulario
    const [validationErrors, setValidationErrors] = useState({});
    const [formData, setFormData] = useState({
        id: null,
        user_id: "",
        consultation_id: "",
        contact_id: "",
        solution_date: "",
        monitoring_id: "",
    });

    /* ===========================================================
     *  Fetch principal de gestiones
     * =========================================================== */
    const fetchManagement = useCallback(
        async (page = 1, currentFilters = filters) => {
            if (isFetching.current) return;

            isFetching.current = true;
            setLoading(true);
            try {
                const data = await getManagements(page, currentFilters);
                setManagement(data.managements || []);
                setCurrentPage(data.pagination?.current_page || 1);
                setTotalPages(data.pagination?.last_page || 1);
                setPerPage(data.pagination?.per_page || 1);
                setTotalItems(data.pagination?.total || 0);

                // Actualizar conteo total si no hay filtros (o según lógica deseada)
                // Si queremos el total global siempre:
                // const totalGlobal = await getCountManagements();
                // setManagementCount(totalGlobal);
                // Pero `data.pagination.total` es el total de la query actual.
                // Usaremos getCountManagements para el total absoluto si es necesario mostrarlo separadamente.
            } catch (err) {
                console.error("Error al obtener gestiones:", err);
                setError("Error al obtener las gestiones.");
            } finally {
                setLoading(false);
                isFetching.current = false;
            }
        },
        [],
    );

    // Cargar gestiones cuando cambie la página o filtros
    useEffect(() => {
        fetchManagement(currentPage, filters);
    }, [currentPage, filters, fetchManagement]);

    // Inicializar contador global
    useEffect(() => {
        const initializeCounts = async () => {
            try {
                const count = await getCountManagements();
                setManagementCount(count);
            } catch (err) {
                console.error("Error al obtener conteo global:", err);
            }
        };
        initializeCounts();
    }, []); // Solo al montar

    /* ===========================================================
     *  Paginación
     * =========================================================== */
    const fetchPage = useCallback(
        (page) => fetchManagement(page, filters),
        [fetchManagement, filters],
    );

    /* ===========================================================
     *  Actualizar management-monitoring
     * =========================================================== */
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setValidationErrors({});

        try {
            const payload = {
                solution_date: formData.solution_date,
                monitoring_id: formData.monitoring_id,
            };

            if (!payload.solution_date || !payload.monitoring_id) {
                Swal.fire({
                    title: "Campos requeridos",
                    text: "Por favor, complete todos los campos.",
                    icon: "warning",
                    timer: 2000,
                    showConfirmButton: false,
                });
                return;
            }

            await updateManagementMonitoring(formData.id, payload);

            Swal.fire({
                title: "Gestión actualizada",
                text: "Los cambios han sido guardados correctamente.",
                icon: "success",
                timer: 1500,
                showConfirmButton: false,
            });

            setFormData({
                id: null,
                user_id: "",
                consultation_id: "",
                contact_id: "",
                solution_date: "",
                monitoring_id: "",
            });

            setOnMonitoring(false);
            setIsOpenADD(false);
            fetchManagement(currentPage, filters);
        } catch (error) {
            if (error.response?.status === 422) {
                setValidationErrors(error.response.data.errors);
            } else {
                console.error("Error al actualizar gestión:", error);
                Swal.fire({
                    title: "Error",
                    text: "Ocurrió un error al actualizar la gestión.",
                    icon: "error",
                    timer: 2000,
                    showConfirmButton: false,
                });
            }
        } finally {
            setLoading(false);
        }
    };

    /* ===========================================================
     *  Fetch Monitorings
     * =========================================================== */
    const fetchMonitoring = useCallback(async () => {
        try {
            const data = await getActiveMonitorings();
            setMonitoring(data);
        } catch (err) {
            console.error("Error al obtener monitorings:", err);
            setError("Error al obtener los monitorings.");
        }
    }, []);

    useEffect(() => {
        fetchMonitoring();
    }, [fetchMonitoring]);

    /* ===========================================================
     *  Validar monitoring_id actual
     * =========================================================== */
    useEffect(() => {
        if (monitoring?.length && formData.monitoring_id != null) {
            const exists = monitoring.some(
                (opt) => Number(opt.id) === Number(formData.monitoring_id),
            );
            if (!exists) {
                setFormData((prev) => ({ ...prev, monitoring_id: "" }));
            }
        }
    }, [monitoring]);

    /* ===========================================================
     *  Sincronizar URL con filtros
     * =========================================================== */

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        // Cargar filtros iniciales desde URL si no hay filtros activos
        params.forEach((value, key) => {
            if (value && key !== "page" && !filters[key]) {
                addFilter(key, value);
            }
        });
    }, [location.search]);

    // ================= Fetch historial de cambios GLOBAL =======================
    const fetchHistoryChangesData = useCallback(
        async (managementId, page = 1) => {
            setLoadingHistory(true);
            try {
                const response = await getHistoryChanges(managementId, page);
                setHistory(response.data || []);
                setCurrentPageHistory(response.pagination?.current_page || 1);
                setTotalPagesHistory(response.pagination?.last_page || 1);
                setPerPageHistory(response.pagination?.per_page || 15);
                setTotalItemsHistory(response.pagination?.total || 0);
            } catch (err) {
                console.error(err);
                setError("Error al obtener el historial.");
                setHistory([]);
            } finally {
                setLoadingHistory(false);
            }
        },
        [],
    );

    const handleOpenHistory = useCallback(
        (managementItem) => {
            setSelectedManagement(managementItem);
            setOpenHistory(true);
            setCurrentPageHistory(1);
            fetchHistoryChangesData(managementItem.id, 1);
        },
        [fetchHistoryChangesData],
    );

    const fetchHistoryPage = useCallback(
        (page) => {
            if (selectedManagement) {
                fetchHistoryChangesData(selectedManagement.id, page);
            }
        },
        [selectedManagement, fetchHistoryChangesData],
    );

    return {
        // Datos
        management,
        monitoring,
        formData,
        validationErrors,
        filters,
        addFilter,
        removeFilter,
        clearFilters,
        managementCount,

        // Estados UI
        loading,
        error,
        IsOpenADD,
        view,
        onMonitoring,

        // Paginación
        currentPage,
        totalPages,
        totalItems,
        perPage,
        fetchPage,

        // Acciones
        fetchManagement,
        handleSubmit,
        setFormData,
        setIsOpenADD,
        setOnMonitoring,
        setView,
        setCurrentPage,

        // Historial
        openHistory,
        setOpenHistory,
        history,
        loadingHistory,
        currentPageHistory,
        totalPagesHistory,
        perPageHistory,
        totalItemsHistory,
        handleOpenHistory,
        fetchHistoryPage,
        selectedManagement,
    };
};
