import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import Swal from "sweetalert2";
import {
    getManagements,
    saveManagement,
    getContacts,
} from "@modules/management/services/managementService";
import { useManagementStaticData } from "@modules/management/context/ManagementStaticDataContext";
import { useMultiFilter } from "@hooks/useMultiFilter";

export const useAddManagement = (selectedPayroll = null) => {
    // Usar datos estáticos del contexto compartido
    const {
        payroll,
        typeManagement,
        loading: staticDataLoading,
    } = useManagementStaticData();

    const [management, setManagement] = useState([]);
    const [contact, setContact] = useState([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [validationErrors, setValidationErrors] = useState({});

    // Paginación general
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");

    // Contactos (Estado local para el buscador)
    const [currentPageContact, setCurrentPageContact] = useState(1);
    const [totalPagesContact, setTotalPagesContact] = useState(1);
    const [perPageContact, setPerPageContact] = useState(10);
    const [totalItemsContact, setTotalItemsContact] = useState(0);

    // === Nuevo Sistema de Filtros para Contactos ===
    const {
        filters: filtersContact,
        addFilter: addFilterContact,
        removeFilter: removeFilterContact,
        clearFilters: clearFiltersContact,
    } = useMultiFilter();

    // Modales
    const [IsOpenADD, setIsOpenADD] = useState(false);
    const [view, setView] = useState(false);
    const [modal, setModal] = useState(false);

    // Refs para evitar loops
    const isFetchingContacts = useRef(false);

    /* ===========================================================
     *  FETCH GESTIONES
     * =========================================================== */
    const fetchManagement = useCallback(async (page = 1, search = "") => {
        try {
            const data = await getManagements(page, search);
            setManagement(data.managements);
            setTotalPages(data.pagination.last_page);
            setCurrentPage(data.pagination.current_page);
        } catch (err) {
            console.error(err);
            setError("Error al obtener las gestiones.");
        }
    }, []);

    /* ===========================================================
     *  FETCH CONTACTOS
     * =========================================================== */
    const fetchContacts = useCallback(
        async (page = 1, filters = filtersContact) => {
            if (isFetchingContacts.current) return;

            isFetchingContacts.current = true;
            try {
                const contactData = await getContacts(page, filters);
                setContact(contactData.contacts || []);
                setCurrentPageContact(
                    contactData.pagination?.current_page || 1,
                );
                setTotalPagesContact(
                    contactData.pagination?.total_pages ||
                        contactData.pagination?.last_page ||
                        1,
                );
                setPerPageContact(contactData.pagination?.per_page || 10);
                setTotalItemsContact(
                    contactData.pagination?.total_contacts || 0,
                );
            } catch (err) {
                console.error("Error al obtener contactos:", err);
            } finally {
                isFetchingContacts.current = false;
            }
        },
        [filtersContact],
    );

    // Cargar contactos
    useEffect(() => {
        fetchContacts(1, filtersContact);
    }, [filtersContact, fetchContacts]);

    /* ===========================================================
     *  CREAR / ACTUALIZAR GESTIÓN
     * =========================================================== */
    const handleSubmit = useCallback(
        async (payload) => {
            setLoading(true);
            setValidationErrors({});
            try {
                // Ya no pasamos campaña, usamos el endpoint unificado
                await saveManagement(payload);

                Swal.fire({
                    title: "Gestión guardada",
                    text: "La gestión ha sido creada correctamente.",
                    icon: "success",
                    timer: 1500,
                    showConfirmButton: false,
                });

                setIsOpenADD(false);
                fetchManagement(currentPage, searchTerm);
                return true;
            } catch (error) {
                if (error.response?.status === 422) {
                    setValidationErrors(error.response.data.errors);
                } else {
                    console.error("Error al guardar gestión:", error);
                    Swal.fire({
                        title: "Error",
                        text: "Ocurrió un error al guardar la gestión.",
                        icon: "error",
                        timer: 2000,
                        showConfirmButton: false,
                    });
                }
                return false;
            } finally {
                setLoading(false);
            }
        },
        [currentPage, searchTerm, fetchManagement],
    );

    /* ===========================================================
     *  BÚSQUEDAS Y PAGINACIÓN
     * =========================================================== */
    const fetchPage = useCallback(
        (page) => {
            fetchManagement(page, searchTerm);
        },
        [searchTerm, fetchManagement],
    );

    const handleSearch = useCallback((value) => {
        setSearchTerm(value);
        setCurrentPage(1);
    }, []);

    const fetchPageContact = useCallback(
        (page) => {
            fetchContacts(page, filtersContact);
        },
        [fetchContacts, filtersContact],
    );

    const clearValidationError = useCallback((field) => {
        setValidationErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors[field];
            return newErrors;
        });
    }, []);

    /* ===========================================================
     *  VALORES MEMOIZADOS
     * =========================================================== */
    const values = useMemo(
        () => ({
            management,
            payroll,
            typeManagement,
            contact,
            loading: loading || staticDataLoading,
            error,
            view,
            modal,
            IsOpenADD,
            validationErrors,
            totalPages,
            currentPage,
            // Acciones
            setView,
            setModal,
            setIsOpenADD,
            setCurrentPage,
            setValidationErrors,
            fetchPage,
            fetchManagement,
            handleSearch,
            handleSubmit,
            clearValidationError,
            // Contactos
            currentPageContact,
            totalPagesContact,
            perPageContact,
            totalItemsContact,
            fetchPageContact,
            filtersContact,
            addFilterContact,
            removeFilterContact,
            clearFiltersContact,
        }),
        [
            management,
            payroll,
            typeManagement,
            contact,
            loading,
            staticDataLoading,
            error,
            view,
            modal,
            IsOpenADD,
            validationErrors,
            totalPages,
            currentPage,
            currentPageContact,
            totalPagesContact,
            perPageContact,
            totalItemsContact,
            fetchPage,
            fetchManagement,
            handleSearch,
            handleSubmit,
            clearValidationError,
            fetchPageContact,
            filtersContact,
            addFilterContact,
            removeFilterContact,
            clearFiltersContact,
        ],
    );

    return values;
};
