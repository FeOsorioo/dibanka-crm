import { useState, useEffect, useCallback, useRef } from "react";
import { useMultiFilter } from "@hooks/useMultiFilter";
import Swal from "sweetalert2";
import {
    getSpecialCases,
    saveSpecialCase,
    getActivePayrolls,
    getContacts,
    getUsers,
    getHistoryChanges,
} from "@modules/specialCases/services/specialCasesService";

export const useSpecialCases = () => {
    const [specialCases, setSpecialCases] = useState([]);
    const [payroll, setPayroll] = useState([]);
    const [users, setUsers] = useState([]);
    const [contact, setContact] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [validationErrors, setValidationErrors] = useState({});

    // === Nuevo Sistema de Filtros (Lista Principal) ===
    const { filters, addFilter, removeFilter, clearFilters } = useMultiFilter();

    // Paginación
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(1);
    const [totalItems, setTotalItems] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // UI
    const [isOpenADD, setIsOpenADD] = useState(false);
    const [formData, setFormData] = useState({});
    const [selectedPayroll, setSelectedPayroll] = useState(null);
    const [selectedContact, setSelectedContact] = useState(null);
    const [openSearchContact, setOpenSearchContact] = useState(false);

    // === Nuevo Sistema de Filtros (Búsqueda de Contactos) ===
    const {
        filters: filtersContact,
        addFilter: addFilterContact,
        removeFilter: removeFilterContact,
        clearFilters: clearFiltersContact,
    } = useMultiFilter();

    // Contact Search Pagination
    const [contactSearch, setContactSearch] = useState([]);
    const [currentPageContact, setCurrentPageContact] = useState(1);
    const [totalPagesContact, setTotalPagesContact] = useState(1);
    const [perPageContact, setPerPageContact] = useState(10);
    const [totalItemsContact, setTotalItemsContact] = useState(0);
    const [loadingContact, setLoadingContact] = useState(false);

    const isFetchingContacts = useRef(false);

    // ====================== Historial de Cambios ======================
    const [openHistory, setOpenHistory] = useState(false);
    const [history, setHistory] = useState([]);
    const [loadingHistory, setLoadingHistory] = useState(false);
    const [currentPageH, setCurrentPageH] = useState(1);
    const [totalPagesH, setTotalPagesH] = useState(1);
    const [perPageH, setPerPageH] = useState(1);
    const [totalItemsH, setTotalItemsH] = useState(1);

    /* ===========================================================
     *  Fetch principal
     * =========================================================== */
    /* ===========================================================
     *  Fetch principal
     * =========================================================== */
    const fetchSpecialCases = useCallback(
        async (page = 1, currentFilters = filters) => {
            setLoading(true);
            try {
                const data = await getSpecialCases(page, currentFilters);
                setSpecialCases(data.specialCases);
                setTotalPages(data.pagination.total_pages);
                setCurrentPage(data.pagination.current_page);
                setPerPage(data.pagination.per_page);
                setTotalItems(data.pagination.total);
            } catch (err) {
                console.error(err);
                setError("Error al obtener los casos especiales.");
            } finally {
                setLoading(false);
            }
        },
        [filters],
    );

    // 🔥 NUEVO: useEffect para buscar cuando cambie el searchTerm
    // Recargar cuando cambian los filtros
    useEffect(() => {
        fetchSpecialCases(1, filters);
    }, [filters]);

    const fetchPage = useCallback(
        (page) => {
            fetchSpecialCases(page, filters);
        },
        [filters, fetchSpecialCases],
    );

    /* ===========================================================
     *  Crear o actualizar
     * =========================================================== */
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
            await saveSpecialCase(payload);

            Swal.fire({
                title: "Caso especial creado",
                text: "Los cambios han sido guardados correctamente.",
                icon: "success",
                timer: 1500,
                showConfirmButton: false,
            });

            setIsOpenADD(false);
            setIsOpenADD(false);
            fetchSpecialCases(currentPage, filters);
        } catch (error) {
            if (error.response?.status === 422) {
                setValidationErrors(error.response.data.errors);
            } else {
                console.error("Error al guardar el caso especial:", error);
            }
        } finally {
            setLoading(false);
        }
    };

    /* ===========================================================
     *  Eliminar o desactivar
     * =========================================================== */

    /* ===========================================================
     *  Fetch de selectores
     * =========================================================== */
    const fetchPayroll = useCallback(async () => {
        try {
            const data = await getActivePayrolls();
            setPayroll(data);
        } catch (err) {
            console.error(err);
            setError("Error al obtener las pagadurías.");
        }
    }, []);

    const fetchContact = useCallback(async () => {
        try {
            const data = await getContacts();
            setContact(data);
        } catch (err) {
            console.error(err);
            setError("Error al obtener los contactos.");
        }
    }, []);

    // Fetch contacts for search modal with pagination
    // Fetch contacts for search modal with pagination
    const fetchContactsSearch = useCallback(
        async (page = 1, currentFilters = filtersContact) => {
            if (isFetchingContacts.current) return;
            isFetchingContacts.current = true;
            setLoadingContact(true);
            try {
                // Agregar pagaduría seleccionada a los filtros si existe
                const queryFilters = { ...currentFilters };
                if (selectedPayroll?.name) {
                    queryFilters.payroll = selectedPayroll.name;
                }

                const contactData = await getContacts(page, queryFilters);

                setContactSearch(contactData.contacts || []);
                setCurrentPageContact(
                    contactData.pagination?.current_page || 1,
                );
                setTotalPagesContact(contactData.pagination?.total_pages || 1);
                setPerPageContact(contactData.pagination?.per_page || 10);
                setTotalItemsContact(contactData.pagination?.total_contacts);
            } catch (err) {
                console.error("Error al obtener contactos:", err);
            } finally {
                setLoadingContact(false);
                isFetchingContacts.current = false;
            }
        },
        [selectedPayroll, filtersContact],
    );

    const fetchPageContact = useCallback(
        (page) => {
            fetchContactsSearch(page, filtersContact);
        },
        [fetchContactsSearch, filtersContact],
    );

    const fetchUser = useCallback(async (page = 1) => {
        try {
            const data = await getUsers(page);
            setUsers(data.users);
            setTotalPages(data.pagination.total_pages);
            setCurrentPage(data.pagination.current_page);
        } catch (err) {
            console.error(err);
            setError("Error al obtener los usuarios.");
        }
    }, []);

    useEffect(() => {
        fetchPayroll();
        fetchContact();
        fetchUser();
    }, [fetchPayroll, fetchContact, fetchUser]);

    // useEffect para buscar contactos cuando cambie la pagaduría seleccionada
    // useEffect para buscar CONTACTOS cuando cambie la pagaduría seleccionada
    useEffect(() => {
        if (openSearchContact) {
            fetchContactsSearch(1, filtersContact);
        }
    }, [selectedPayroll, openSearchContact, filtersContact]);

    /* ===========================================================
     *  Auxiliares
     * =========================================================== */
    const clearFieldError = (fieldName) => {
        setValidationErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors[fieldName];
            return newErrors;
        });
    };

    const onSelectContact = (contact) => {
        setSelectedContact(contact);
        setFormData((prev) => ({
            ...prev,
            contact_id: contact.id,
        }));
        setOpenSearchContact(false);
        clearFieldError("contact_id");
    };

    // 🔥 Manejar el cambio de pagaduría
    const handlePayrollChange = (payroll) => {
        setSelectedPayroll(payroll);
        setFormData((prev) => ({
            ...prev,
            payroll_id: payroll?.id || "",
        }));

        // Limpiar contacto seleccionado cuando cambie la pagaduría
        setSelectedContact(null);
        setFormData((prev) => ({
            ...prev,
            contact_id: "",
        }));

        clearFieldError("payroll_id");
        clearFieldError("contact_id");

        // Resetear búsqueda de contactos
        clearFiltersContact();
        setCurrentPageContact(1);
    };

    const handleCloseModal = () => {
        setIsOpenADD(false);
        setValidationErrors({});
        setFormData({});
        setSelectedPayroll(null);
        setSelectedContact(null);
        clearFiltersContact();
        setCurrentPageContact(1);
    };

    // ================= Fetch historial de cambios =======================
    const fetchHistoryChanges = useCallback(async (specialcaseId, page = 1) => {
        setLoadingHistory(true);
        try {
            const response = await getHistoryChanges(specialcaseId, page);

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

    /* ===========================================================
     *  Return del hook
     * =========================================================== */
    return {
        // Datos principales
        specialCases,
        payroll,
        users,
        contact,
        filters,
        addFilter,
        removeFilter,
        clearFilters,

        // Estado general
        loading,
        error,
        validationErrors,
        isOpenADD,
        formData,
        currentPage,
        totalPages,
        perPage,
        totalItems,
        selectedPayroll,
        selectedContact,
        openSearchContact,

        // Contact Search
        contactSearch,
        currentPageContact,
        totalPagesContact,
        filtersContact,
        addFilterContact,
        removeFilterContact,
        clearFiltersContact,
        perPageContact,
        totalItemsContact,
        loadingContact,

        // Acciones
        setFormData,
        setIsOpenADD,
        setSelectedPayroll,
        setSelectedContact,
        setOpenSearchContact,
        fetchSpecialCases,
        fetchPage,
        fetchPageContact,
        handlePayrollChange,

        //historial
        openHistory,
        setOpenHistory,
        history,
        currentPageH,
        totalPagesH,
        perPageH,
        totalItemsH,
        loadingHistory,
        fetchHistoryChanges,
        handleOpenHistory,
        fetchHistoryPage,

        // Funciones auxiliares
        onSelectContact,
        clearFieldError,
    };
};
