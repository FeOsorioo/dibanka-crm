import { useState } from "react";
import Table from "@components/tables/Table";
import Box from "@mui/material/Box";
import ButtonAdd from "@components/ui/ButtonAdd";
import FormAdd from "@components/forms/FormAdd";
import TableSkeleton from "@components/tables/TableSkeleton";
import Search from "@components/forms/Search";
import StatCard from "@components/ui/StatCard";
import { useSpecifics } from "@modules/config/ConsultationSpecific/hooks/useSpecifics";
import * as yup from "yup";

/* ===========================================================
 *  CAMPOS DEL FORMULARIO
 * =========================================================== */
const fields = [
    {
        name: "consultation_id",
        label: "Motivo consulta",
        type: "autocomplete",
        options: [],
    },
    { name: "name", label: "Motivo específico", type: "text" },
];

/* ===========================================================
 *  VALIDACIÓN
 * =========================================================== */
const schema = yup.object().shape({
    name: yup.string().required("El motivo específico es obligatorio"),
    consultation_id: yup
        .number()
        .required("El motivo general es obligatorio")
        .typeError("Debes seleccionar un motivo general"),
});

/* ===========================================================
 *  COLUMNAS DE TABLA
 * =========================================================== */
const columns = [
    { header: "ID", key: "id" },
    { header: "Campaña", key: "campaign" },
    { header: "Pagaduría", key: "payroll" },
    { header: "Motivo General", key: "consultation" },
    { header: "Motivo Específico", key: "name" },
];

/* ===========================================================
 *  COMPONENTE PRINCIPAL
 * =========================================================== */
const ConsultationSpecific = () => {
    // Hook unificado para Consultas Específicas
    const {
        specifics,
        loading,
        consultations, // Para el selector
        formData,
        setFormData,
        validationErrors,
        isOpenADD,
        handleOpenForm,
        handleCloseModal,
        handleSave,
        handleDelete,
        handleEdit,
        handleSearch,
        fetchPage,
        currentPage,
        totalPages,
        perPage,
        totalItems,
        countActives,
        countInactives,
    } = useSpecifics();

    const formattedSpecifics = specifics.map(specific => ({
        ...specific,
        // Convertir array de campañas a string separado por comas
        campaign: specific.consultation?.campaign?.length > 0
            ? specific.consultation.campaign.map(c => c.name).join(', ')
            : 'Sin campaña',
        // Convertir array de pagadurías a string
        payroll: specific.consultation?.payrolls?.length > 0
            ? specific.consultation.payrolls.map(p => p.name).join(', ')
            : 'Sin pagaduría',
        // Mantener el nombre de la consulta
        consultation: specific.consultation?.name || 'N/A'
    }));

    const statsCards = [
        { title: "Consultas Totales", value: totalItems },
        { title: "Consultas Activas", value: countActives },
        { title: "Consultas Inactivas", value: countInactives },
    ];

    return (
        <>
            {/* Cards */}
            <div className="flex justify-center gap-6 mb-4">
                {statsCards.map((stat, index) => (
                    <StatCard key={index} stat={stat} loading={loading} />
                ))}
            </div>

            <Box
                sx={{
                    width: "90%",
                    mb: 4,
                    textAlign: "center",
                    margin: "auto",
                }}
            >
                <ButtonAdd
                    onClickButtonAdd={handleOpenForm}
                    text="Agregar Consulta Específica"
                />

                <div className="flex justify-end px-12 -mt-10">
                    <Search
                        onSearch={handleSearch}
                        placeholder="Buscar consulta específica..."
                    />
                </div>

                <FormAdd
                    isOpen={isOpenADD}
                    setIsOpen={handleCloseModal}
                    title="Consultas Específicas"
                    formData={formData}
                    setFormData={setFormData}
                    handleSubmit={handleSave}
                    loading={loading}
                    validationErrors={validationErrors}
                    fields={fields.map((f) => {
                        if (f.name === "consultation_id") {
                            const uniqueOptions = (consultations || []).map(
                                (c) => ({
                                    value: c.id,
                                    label: c.name,
                                }),
                            );

                            return { ...f, options: uniqueOptions };
                        }
                        return f;
                    })}
                    schema={schema}
                />

                {loading ? (
                    <TableSkeleton rows={5} />
                ) : (
                    <Table
                        columns={columns}
                        data={formattedSpecifics}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        rowsPerPage={perPage}
                        totalItems={totalItems}
                        fetchPage={(page) => fetchPage(page)}
                        onDelete={handleDelete}
                        actions
                        onEdit={handleEdit}
                    />
                )}
            </Box>
        </>
    );
};

export default ConsultationSpecific;
