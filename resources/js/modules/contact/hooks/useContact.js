import { useState, useEffect, useContext, useCallback } from "react";
import Swal from "sweetalert2";
import { AuthContext } from "@context/AuthContext";
import { useMultiFilter } from "@hooks/useMultiFilter";
import {
    getContacts,
    createContact,
    updateContact,
    deleteContact,
    getPayrolls,
    getHistoryChanges,
} from "@modules/contact/services/contactService";
import { getManagements } from "@modules/management/services/managementService";

export const useContact = () => {
    const { token } = useContext(AuthContext);

    // ====================== Estados principales ======================
    const [contact, setContact] = useState([]);
    const [payroll, setPayroll] = useState([]);
    const [management, setManagement] = useState([]);
    const [managements, setManagements] = useState(false);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [validationErrors, setValidationErrors] = useState({});

    // === Nuevo Sistema de Filtros ===
    const { filters, addFilter, removeFilter, clearFilters } = useMultiFilter();

    const [isOpenADD, setIsOpenADD] = useState(false);

    const [selectedContact, setSelectedContact] = useState(null);
    const [selectedManagement, setSelectedManagement] = useState(null);

    // ====================== Paginación Contactos ======================
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [perPage, setPerPage] = useState(1);
    const [totalItems, setTotalItems] = useState(1);

    // ====================== Paginación Gestiones ======================
    const [currentPageM, setCurrentPageM] = useState(1);
    const [totalPagesM, setTotalPagesM] = useState(1);
    const [perPageM, setPerPageM] = useState(1);
    const [totalItemsM, setTotalItemsM] = useState(1);

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
        campaign_id: "",
        payroll_id: "",
        name: "",
        identification_type: "",
        phone: "",
        identification_number: "",
        update_phone: "",
        email: "",
        entity_id: "",
        entity_name: "",
    });

    // ====================== Fetch Contactos ======================
    const fetchContact = useCallback(
        async (page = 1, currentFilters = filters) => {
            setLoading(true);
            try {
                const data = await getContacts(page, currentFilters);
                setContact(data.contacts);
                setTotalPages(data.pagination.total_pages);
                setCurrentPage(data.pagination.current_page);
                setPerPage(data.pagination.per_page);
                setTotalItems(data.pagination.total_contacts);
            } catch (err) {
                console.error(err);
                setError("Error al obtener los contactos.");
            } finally {
                setLoading(false);
            }
        },
        [filters],
    );

    useEffect(() => {
        fetchContact(1);
    }, [fetchContact]);

    const fetchPage = useCallback(
        (page) => fetchContact(page, filters),
        [fetchContact, filters],
    );

    // Reaccionar a cambios en filtros para recargar desde pag 1
    useEffect(() => {
        fetchContact(1, filters);
    }, [filters]);

    // ================= Fetch historial de cambios =======================
    const fetchHistoryChanges = useCallback(async (contactId, page = 1) => {
        setLoadingHistory(true);
        try {
            const response = await getHistoryChanges(contactId, page);

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

    // Función para abrir el historial de un contacto
    const handleOpenHistory = useCallback(
        (contact) => {
            setSelectedContact(contact);
            setOpenHistory(true);
            setCurrentPageH(1);
            fetchHistoryChanges(contact.id, 1);
        },
        [fetchHistoryChanges],
    );

    // Función para cambiar de página en el historial
    const fetchHistoryPage = useCallback(
        (page) => {
            if (selectedContact) {
                fetchHistoryChanges(selectedContact.id, page);
            }
        },
        [selectedContact, fetchHistoryChanges],
    );

    // ====================== Crear / Editar ======================
    const handleEdit = (item) => {
        setFormData({
            id: item.id,
            campaign_id: item?.campaign?.id,
            payroll_id: item.payroll.id,
            name: item.name,
            email: item.email,
            phone: item.phone,
            update_phone: item.update_phone,
            identification_type: item.identification_type,
            identification_number: item.identification_number,
            entity_id: item.entity?.id || "",
            entity_name: item.entity?.name || "",
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

            Object.keys(payload).forEach((key) => {
                if (payload[key] === "true") payload[key] = true;
                if (payload[key] === "false") payload[key] = false;
            });

            if (formData.id) {
                await updateContact(formData.id, payload);
                Swal.fire({
                    title: "Contacto actualizado",
                    text: "Los cambios han sido guardados correctamente.",
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: false,
                });
            } else {
                await createContact(payload);
                Swal.fire({
                    title: "Contacto creado",
                    text: "El contacto ha sido registrado correctamente.",
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: false,
                });
            }

            setIsOpenADD(false);

            fetchContact(currentPage, filters);
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
    };

    const handleCloseHistory = () => {
        setOpenHistory(false);
        setSelectedContact(null);
        setHistory([]);
    };

    // ====================== Eliminar / Desactivar ======================
    const handleDelete = async (id, status) => {
        const actionText = !status ? "activar" : "desactivar";

        Swal.fire({
            position: "top-end",
            title: `¿Quieres ${actionText} este contacto?`,
            text: `El contacto será marcado como ${
                !status ? "Activo" : "Inactivo"
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
                    await deleteContact(id);
                    Swal.fire({
                        position: "top-end",
                        title: "Estado actualizado",
                        text: `El contacto ahora está ${
                            !status ? "Activo" : "Inactivo"
                        }.`,
                        icon: "success",
                        timer: 1500,
                        showConfirmButton: false,
                    });
                    fetchContact(currentPage, filters);
                } catch (error) {
                    Swal.fire({
                        title: "Error",
                        text:
                            error.response?.data?.message ||
                            "No se pudo actualizar el contacto.",
                        icon: "error",
                        width: "350px",
                        padding: "0.8em",
                    });
                }
            }
        });
    };

    // ====================== Pagadurías ======================
    const fetchPayroll = useCallback(async () => {
        try {
            const data = await getPayrolls();
            setPayroll(data);
        } catch (err) {
            console.error(err);
            setError("Error al obtener las pagadurías.");
        }
    }, []);

    useEffect(() => {
        fetchPayroll();
    }, [fetchPayroll]);

    // ====================== Gestiones ======================
    const fetchManagement = async (identification_number, page = 1) => {
        setLoading(true);
        try {
            const { managements, pagination } = await getManagements(page, {
                identification_number,
            });

            setManagement(managements);
            setTotalPagesM(pagination.last_page);
            setCurrentPageM(pagination.current_page);
            setPerPageM(pagination.per_page);
            setTotalItemsM(pagination.total);
        } catch (err) {
            console.error("Error al obtener gestiones:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenManagements = (contact) => {
        setManagement([]);
        setSelectedContact(contact);
        setManagements(true);
    };

    // ====================== Return ======================
    return {
        // Datos principales
        contact,
        payroll,
        management,
        managements,
        selectedContact,
        selectedManagement,

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
        totalItemsM,
        perPageM,
        currentPageM,
        totalPagesM,

        // Acciones
        fetchContact,
        fetchPage,

        handleEdit,
        handleSubmit,
        handleCloseModal,
        handleDelete,
        fetchPayroll,
        fetchManagement,
        handleOpenManagements,
        setSelectedContact,
        setManagements,

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
