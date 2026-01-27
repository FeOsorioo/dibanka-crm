import { useState, useEffect, useCallback } from "react";
import Swal from "sweetalert2";
import { useMultiFilter } from "@hooks/useMultiFilter";
import {
    getEntities,
    createEntity,
    updateEntity,
    deleteEntity,
    getHistoryChanges,
} from "@modules/entity/services/entityService";

export const useEntity = () => {
    // ====================== Estados principales ======================
    const [entities, setEntities] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [validationErrors, setValidationErrors] = useState({});

    // === Nuevo Sistema de Filtros ===
    const { filters, addFilter, removeFilter, clearFilters } = useMultiFilter();

    const [isOpenADD, setIsOpenADD] = useState(false);

    const [selectedEntity, setSelectedEntity] = useState(null);

    // ====================== Paginación Entidades ======================
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [perPage, setPerPage] = useState(1);
    const [totalItems, setTotalItems] = useState(1);

    // ====================== Historial de Cambios ======================
    const [openHistory, setOpenHistory] = useState(false);
    const [history, setHistory] = useState([]);
    const [loadingHistory, setLoadingHistory] = useState(false);
    const [currentPageH, setCurrentPageH] = useState(1);
    const [totalPagesH, setTotalPagesH] = useState(1);
    const [perPageH, setPerPageH] = useState(1);
    const [totalItemsH, setTotalItemsH] = useState(1);

    // ====================== Formulario ======================
    const [formData, setFormData] = useState({
        id: null,
        name: "",
        phone: "",
        email: "",
        nit: "",
        description: "",
    });

    // ====================== Fetch Entidades ======================
    const fetchEntities = useCallback(
        async (page = 1, currentFilters = filters) => {
            setLoading(true);
            try {
                const data = await getEntities(page, currentFilters);
                setEntities(data.data); // data.data porque es un recurso colección
                setTotalPages(data.pagination.total_pages);
                setCurrentPage(data.pagination.current_page);
                setPerPage(data.pagination.per_page);
                setTotalItems(data.pagination.total_entities);
            } catch (err) {
                console.error(err);
                setError("Error al obtener las entidades.");
            } finally {
                setLoading(false);
            }
        },
        [filters],
    );

    useEffect(() => {
        fetchEntities(1);
    }, [fetchEntities]);

    const fetchPage = useCallback(
        (page) => fetchEntities(page, filters),
        [fetchEntities, filters],
    );

    // Reaccionar a cambios en filtros para recargar desde pag 1
    useEffect(() => {
        fetchEntities(1, filters);
    }, [filters]);

    // ================= Fetch historial de cambios =======================
    const fetchHistoryChanges = useCallback(async (entityId, page = 1) => {
        setLoadingHistory(true);
        try {
            const response = await getHistoryChanges(entityId, page);

            setHistory(response.data || []);
            setCurrentPageH(response.pagination?.current_page || 1);
            setTotalPagesH(response.pagination?.last_page || 1);
            setPerPageH(response.pagination?.per_page || 15);
            setTotalItemsH(response.pagination?.total || 0);
        } catch (err) {
            console.error(err);
            setError("Error al obtener el historial.");
            setHistory([]);
        } finally {
            setLoadingHistory(false);
        }
    }, []);

    // Función para abrir el historial de una entidad
    const handleOpenHistory = useCallback(
        (entity) => {
            setSelectedEntity(entity);
            setOpenHistory(true);
            setCurrentPageH(1);
            fetchHistoryChanges(entity.id, 1);
        },
        [fetchHistoryChanges],
    );

    // Función para cambiar de página en el historial
    const fetchHistoryPage = useCallback(
        (page) => {
            if (selectedEntity) {
                fetchHistoryChanges(selectedEntity.id, page);
            }
        },
        [selectedEntity, fetchHistoryChanges],
    );

    // ====================== Crear / Editar ======================
    const handleEdit = (item) => {
        setFormData({
            id: item.id,
            name: item.name,
            phone: item.phone,
            email: item.email,
            nit: item.nit,
            description: item.description,
        });
        setValidationErrors({});
        setIsOpenADD(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setValidationErrors({});

        try {
            const payload = { ...formData };

            if (formData.id) {
                await updateEntity(formData.id, payload);
                Swal.fire({
                    title: "Entidad actualizada",
                    text: "Los cambios han sido guardados correctamente.",
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: false,
                });
            } else {
                await createEntity(payload);
                Swal.fire({
                    title: "Entidad creada",
                    text: "La entidad ha sido registrada correctamente.",
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: false,
                });
            }

            setIsOpenADD(false);

            fetchEntities(currentPage, filters);
        } catch (error) {
            if (error.response?.status === 422) {
                setValidationErrors(error.response.data.errors);
            }
        } finally {
            setLoading(false);
        }
    };

    // ====================== Cerrar Modal ======================
    const handleCloseModal = () => {
        setIsOpenADD(false);
        setValidationErrors({});
        setFormData({
            id: null,
            name: "",
            phone: "",
            email: "",
            nit: "",
            description: "",
        });
    };

    const handleCloseHistory = () => {
        setOpenHistory(false);
        setSelectedEntity(null);
        setHistory([]);
    };

    // ====================== Eliminar / Desactivar ======================
    const handleDelete = async (id, status) => {
        const actionText = !status ? "activar" : "desactivar";

        Swal.fire({
            position: "top-end",
            title: `¿Quieres ${actionText} esta entidad?`,
            text: `La entidad será marcada como ${
                !status ? "Activa" : "Inactiva"
            }.`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: !status ? "#28a745" : "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: `Sí, ${actionText}`,
            cancelButtonText: "Cancelar",
            width: "350px",
            padding: "0.8em",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await deleteEntity(id);
                    Swal.fire({
                        position: "top-end",
                        title: "Estado actualizado",
                        text: `La entidad ahora está ${
                            !status ? "Activa" : "Inactiva"
                        }.`,
                        icon: "success",
                        timer: 1500,
                        showConfirmButton: false,
                    });
                    fetchEntities(currentPage, filters);
                } catch (error) {
                    Swal.fire({
                        title: "Error",
                        text:
                            error.response?.data?.message ||
                            "No se pudo actualizar la entidad.",
                        icon: "error",
                        width: "350px",
                        padding: "0.8em",
                    });
                }
            }
        });
    };

    // ====================== Return ======================
    return {
        // Datos principales
        entities,
        selectedEntity,

        // Estado general
        loading,
        error,
        isOpenADD,
        validationErrors,

        // Paginación
        totalItems,
        perPage,
        currentPage,
        totalPages,

        // Acciones
        fetchEntities,
        fetchPage,

        handleEdit,
        handleSubmit,
        handleCloseModal,
        handleDelete,
        setSelectedEntity,

        // Formulario
        formData,
        setFormData,
        setIsOpenADD,

        // Estado de búsqueda (Nuevo Sistema)
        filters,
        addFilter,
        removeFilter,
        clearFilters,

        // Historial de Cambios
        openHistory,
        setOpenHistory,
        history,
        loadingHistory,
        currentPageH,
        totalPagesH,
        perPageH,
        totalItemsH,
        handleOpenHistory,
        handleCloseHistory,
        fetchHistoryPage,
    };
};
