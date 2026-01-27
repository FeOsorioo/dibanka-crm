import { useState } from "react";
import Table from "@components/tables/Table";
import Box from "@mui/material/Box";
import ButtonAdd from "@components/ui/ButtonAdd";
import FormAdd from "@components/forms/FormAdd";
import TableSkeleton from "@components/tables/TableSkeleton";
import Search from "@components/forms/Search";
import StatCard from "@components/ui/StatCard";
import { useConsultations } from "@modules/config/Consultation/hooks/useConsultations";
import * as yup from "yup";

/* ===========================================================
 *  CAMPOS DEL FORMULARIO
 * =========================================================== */
const fields = [
    {
        name: "payroll_ids",
        label: "Pagadurías",
        type: "multiselect",
        options: [],
    },
    { name: "name", label: "Motivo de consulta", type: "text" },
];

/* ===========================================================
 *  VALIDACIÓN
 * =========================================================== */
const consultSchema = yup.object().shape({
    name: yup.string().required("El motivo de consulta es obligatorio"),
    payroll_ids: yup
        .array()
        .min(1, "Debe seleccionar al menos una pagaduría")
        .required("Las pagadurías son obligatorias"),
});

/* ===========================================================
 *  COLUMNAS DE LA TABLA
 * =========================================================== */
const columns = [
    { header: "ID", key: "id" },
    {
        header: "Pagadurías",
        key: "payrolls",
        render: (row) => {
            if (
                !row.payrolls ||
                (Array.isArray(row.payrolls) && row.payrolls.length === 0)
            )
                return "Sin relaciones";

            // Si es un array de pagadurías
            if (Array.isArray(row.payrolls)) {
                return row.payrolls.map((p) => p.name).join(", ");
            }

            // Si es un objeto único
            return row.payrolls.name || "—";
        },
    },
    { header: "Motivo de consulta", key: "name" },
];

/* ===========================================================
 *  COMPONENTE PRINCIPAL
 * =========================================================== */
const Consultation = () => {
    // Hook unificado para Consultas
    const {
        consultations,
        payroll,
        loading,
        isOpenADD,
        setIsOpenADD,
        formData,
        setFormData,
        validationErrors,
        handleSubmit,
        currentPage,
        totalPages,
        perPage,
        totalItems,
        handleDelete,
        handleEdit,
        handleSearch,
        fetchPage,
        handleCloseModal,
        active,
        inactive,
    } = useConsultations();

    const statsCards = [
        { title: "Consultas Totales", value: totalItems },
        { title: "Consultas Activas", value: active },
        { title: "Consultas Inactivas", value: inactive },
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
                {/* Botón + */}
                <ButtonAdd
                    onClickButtonAdd={() => {
                        setFormData({
                            id: null,
                            name: "",
                            payroll_ids: [],
                            is_active: true,
                        });
                        setIsOpenADD(true);
                    }}
                    text="Agregar consulta"
                />

                {/* Buscador */}
                <div className="flex justify-end px-12 -mt-10">
                    <Search
                        onSearch={handleSearch}
                        placeholder="Buscar consulta..."
                    />
                </div>

                {/* Modal */}
                <FormAdd
                    isOpen={isOpenADD}
                    setIsOpen={handleCloseModal}
                    title="Consultas"
                    formData={formData}
                    setFormData={setFormData}
                    handleSubmit={handleSubmit}
                    loading={loading}
                    validationErrors={validationErrors}
                    fields={fields.map((f) =>
                        f.name === "payroll_ids"
                            ? {
                                  ...f,
                                  options: payroll.map((p) => ({
                                      value: p.id,
                                      label: p.name,
                                  })),
                              }
                            : f,
                    )}
                    schema={consultSchema}
                />

                {/* Tabla */}
                {loading ? (
                    <TableSkeleton rows={4} />
                ) : (
                    <Table
                        columns={columns}
                        data={consultations}
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

export default Consultation;
