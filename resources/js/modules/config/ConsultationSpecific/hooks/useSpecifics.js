import { useState, useEffect, useCallback } from "react";
import Swal from "sweetalert2";
import {
    getSpecifics,
    saveSpecific,
    updateSpecific,
    deleteSpecific,
    getConsultationsForSelect,
    getActivePayrolls,
} from "@modules/config/ConsultationSpecific/services/specificService";

export const useSpecifics = () => {
    const [specifics, setSpecifics] = useState([]);
    const [payroll, setPayroll] = useState([]);
    const [consultations, setConsultations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [validationErrors, setValidationErrors] = useState({});
    const [searchTerm, setSearchTerm] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [perPage, setPerPage] = useState(10);
    const [totalItems, setTotalItems] = useState(0);
    const [isOpenADD, setIsOpenADD] = useState(false);
    const [countActives, setCountActives] = useState(0);
    const [countInactives, setCountInactives] = useState(0);
    const [formData, setFormData] = useState({
        id: null,
        name: "",
        consultation_id: null,
    });

    const fetchSpecifics = useCallback(async (page = 1, search = "") => {
        setLoading(true);
        try {
            const data = await getSpecifics(page, search);
            setSpecifics(data.specifics);
            setTotalPages(data.pagination.total_pages);
            setCurrentPage(data.pagination.current_page);
            setPerPage(data.pagination.per_page);
            setTotalItems(data.pagination.total_consultations);
            setCountActives(data.pagination.count_actives);
            setCountInactives(data.pagination.count_inactives);
        } catch (err) {
            console.error(err);
            setError("Error al obtener las consultas específicas.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSpecifics(1);
    }, [fetchSpecifics]);

    const fetchPage = useCallback(
        (page) => fetchSpecifics(page, searchTerm),
        [fetchSpecifics, searchTerm],
    );

    const handleSearch = useCallback(
        (value) => {
            setSearchTerm(value);
            setCurrentPage(1);
            fetchSpecifics(1, value);
        },
        [fetchSpecifics],
    );

    const fetchConsultationsData = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getConsultationsForSelect();
            setConsultations(data);
        } catch (err) {
            console.error("Error al obtener las consultas generales:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchConsultationsData();
    }, [fetchConsultationsData]);

    const fetchPayroll = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getActivePayrolls();
            setPayroll(data);
        } catch (err) {
            console.error("Error al obtener pagadurías:", err);
            setError("Error al obtener las pagadurías.");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchPayroll();
    }, [fetchPayroll]);

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        setValidationErrors({});

        try {
            if (formData.id) {
                await updateSpecific(formData.id, formData);
                Swal.fire(
                    "Consulta específica actualizada",
                    "Los cambios se guardaron correctamente.",
                    "success",
                );
            } else {
                await saveSpecific(formData);
                Swal.fire(
                    "Consulta específica creada",
                    "Se ha registrado correctamente.",
                    "success",
                );
            }

            setIsOpenADD(false);
            fetchSpecifics(currentPage);
        } catch (error) {
            if (error.response?.status === 422) {
                setValidationErrors(error.response.data.errors);
            } else {
                Swal.fire(
                    "Error",
                    "Hubo un problema al guardar la consulta específica.",
                    "error",
                );
            }
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (item) => {
        setFormData({
            id: item.id,
            name: item.name,
            consultation_id: item.consultation_id,
        });
        setValidationErrors({});
        setIsOpenADD(true);
    };

    const handleDelete = async (id, status) => {
        const actionText = !status ? "activar" : "desactivar";

        Swal.fire({
            position: "top-end",
            title: `¿Quieres ${actionText} esta consulta específica?`,
            text: `Será marcada como ${!status ? "Activa" : "Inactiva"}.`,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: !status ? "#28a745" : "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: `Sí, ${actionText}`,
            cancelButtonText: "Cancelar",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    await deleteSpecific(id);
                    Swal.fire(
                        "Estado actualizado",
                        "La consulta específica se actualizó correctamente.",
                        "success",
                    );
                    fetchSpecifics(currentPage);
                } catch {
                    Swal.fire(
                        "Error",
                        "No se pudo actualizar la consulta específica.",
                        "error",
                    );
                }
            }
        });
    };

    const handleOpenForm = () => {
        setValidationErrors({});
        setFormData({ id: null, name: "", consultation_id: null });
        setIsOpenADD(true);
    };

    const handleCloseModal = () => {
        setIsOpenADD(false);
        setValidationErrors({});
    };

    return {
        specifics,
        payroll,
        consultations,
        loading,
        error,
        isOpenADD,
        setIsOpenADD,
        formData,
        setFormData,
        validationErrors,
        handleSave,
        perPage,
        totalItems,
        countActives,
        countInactives,
        currentPage,
        totalPages,
        handleEdit,
        handleDelete,
        fetchPage,
        handleSearch,
        handleOpenForm,
        handleCloseModal,
    };
};
