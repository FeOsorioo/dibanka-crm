import { useState, useContext, useEffect } from "react";
import { AuthContext } from "@context/AuthContext";
import Swal from "sweetalert2";
import { useAddManagement } from "@modules/management/hooks/useAddManagement";
import api from "@api/axios";

export const useSpecialCasesForm = (onContactSelected) => {
    // 🔥 Nuevo parámetro
    const { user } = useContext(AuthContext);
    const location = window.location;
    const [openSpecialCases, setOpenSpecialCases] = useState(false);
    const [openSearchContact, setOpenSearchContact] = useState(false);

    const {
        payroll,
        contact,
        currentPageContact,
        totalPagesContact,
        perPageContact,
        totalItemsContact,
        fetchPageContact,
        filtersContact,
        addFilterContact,
        removeFilterContact,
        clearFiltersContact,
    } = useAddManagement();

    const [selectedPayrollSpecial, setSelectedPayrollSpecial] = useState(null);
    const [selectedContactSpecial, setSelectedContactSpecial] = useState(null);
    const [loadingContact, setLoadingContact] = useState(false);

    const [formData, setFormData] = useState({
        user_id: user?.id || "",
        payroll_id: "",
        contact_id: "",
        management_messi: "",
        id_call: "",
        id_messi: "",
        observations: "",
    });

    const [validationErrorsSpecial, setValidationErrorsSpecial] = useState({});
    const [autoFilled, setAutoFilled] = useState(false);

    // ===================================================
    // AUTO LLENADO POR PARÁMETROS DE LA URL
    // ===================================================
    useEffect(() => {
        if (!payroll?.length || !contact?.length || autoFilled) return;

        const params = new URLSearchParams(location.search);
        const payrollParam = params.get("payroll");
        const idNumberParam = params.get("identification_number");

        if (!payrollParam && !idNumberParam) return;

        const foundPayroll =
            payroll.find(
                (p) =>
                    p.name?.toLowerCase().trim() ===
                    payrollParam?.toLowerCase().trim(),
            ) || null;

        const foundContact =
            contact.find(
                (c) =>
                    c.identification_number?.toString().trim() ===
                    idNumberParam?.toString().trim(),
            ) || null;

        if (foundPayroll) setSelectedPayrollSpecial(foundPayroll);
        if (foundContact) {
            setSelectedContactSpecial(foundContact);
            // 🔥 También notificar al componente padre
            if (onContactSelected) {
                onContactSelected(foundContact);
            }
        }

        setAutoFilled(true);
    }, [location.search, payroll, contact, autoFilled, onContactSelected]);

    // ===================================================
    // ENVIAR FORMULARIO
    // ===================================================
    const handleSubmit = async () => {
        const payload = {
            user_id: user?.id,
            payroll_id: selectedPayrollSpecial?.id,
            contact_id: selectedContactSpecial?.id,
            management_messi: formData.management_messi,
            id_call: formData.id_call,
            id_messi: formData.id_messi,
            observations: formData.observations,
        };

        try {
            setLoadingContact(true);
            const { data } = await api.post("/specialcases", payload);

            Swal.fire({
                icon: "success",
                title: "Éxito",
                text: data.message || "Caso especial guardado correctamente",
                confirmButtonText: "Aceptar",
            });

            // Reiniciar estados
            setFormData({
                management_messi: "",
                id_call: "",
                id_messi: "",
                observations: "",
            });
            setSelectedPayrollSpecial(null);
            setSelectedContactSpecial(null);
            setValidationErrorsSpecial({});
            setOpenSpecialCases(false);
        } catch (error) {
            console.log("❌ Error del servidor:", error.response?.data);
            if (error.response?.status === 422) {
                setValidationErrorsSpecial(
                    error.response.data.errors ||
                        error.response.data.data ||
                        {},
                );
            } else {
                Swal.fire(
                    "❌ Error",
                    "No se pudo guardar el caso especial",
                    "error",
                );
            }
        } finally {
            setLoadingContact(false);
        }
    };

    const onClose = () => {
        setFormData({
            management_messi: "",
            id_call: "",
            id_messi: "",
            observations: "",
        });
        setSelectedPayrollSpecial(null);
        setSelectedContactSpecial(null);
        setValidationErrorsSpecial({});
        setOpenSpecialCases(false);
    };

    // 🔥 FIX: Notificar al componente padre cuando se selecciona un contacto
    const onSelectContact = (contact) => {
        setSelectedContactSpecial(contact);
        setFormData((prev) => ({
            ...prev,
            contact_id: contact?.id || "",
        }));
        clearFieldError("contact_id");
        setOpenSearchContact(false);

        // 🔥 NUEVO: Notificar al componente padre (AddManagement)
        if (onContactSelected) {
            onContactSelected(contact);
        }
    };

    const clearFieldError = (field) => {
        if (validationErrorsSpecial?.[field]) {
            setValidationErrorsSpecial((prev) => {
                const updated = { ...prev };
                delete updated[field];
                return updated;
            });
        }
    };

    return {
        openSearchContact,
        setOpenSearchContact,
        onClose,
        onSelectContact,
        clearFieldError,
        user,
        payrollSpecial: payroll,
        contactSearch: contact || [],
        selectedPayrollSpecial,
        setSelectedPayrollSpecial,
        selectedContactSpecial,
        setSelectedContactSpecial,
        formData,
        setFormData,
        validationErrorsSpecial,
        setValidationErrorsSpecial,
        handleSubmit,
        openSpecialCases,
        setOpenSpecialCases,
        currentPageContact,
        totalPagesContact,
        perPageContact,
        totalItemsContact,
        fetchPageContact,
        filtersContact,
        addFilterContact,
        removeFilterContact,
        clearFiltersContact,
        loadingContact,
    };
};
