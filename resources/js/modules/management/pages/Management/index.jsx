import { useNavigate } from "react-router-dom";
import Drawer from "@mui/material/Drawer";
import { TextField, FormControl, Autocomplete, Box } from "@mui/material";
import { useManagement } from "@modules/management/hooks/useManagement.js";
import { useCan } from "@hooks/useCan";
import TableSkeleton from "@components/tables/TableSkeleton";
import Table from "@components/tables/Table";
import ButtonAdd from "@components/ui/ButtonAdd";
import Button from "@components/ui/Button";
import MultiFilter from "@components/ui/MultiFilter";
import HistoryChanges from "@components/ui/HistoryChanges";

const columns = [
    { header: "ID", key: "id" },
    { header: "Campaña", key: "contact.campaign.name" },
    { header: "Agente", key: "user.name" },
    { header: "Pagaduría", key: "contact.payroll.name" },
    { header: "Nombre de cliente", key: "contact.name" },
    { header: "Identificación", key: "contact.identification_number" },
    { header: "Celular", key: "contact.phone" },
    { header: "Consulta", key: "consultation.name" },
    { header: "Consulta Especifica", key: "specific.name" },
    { header: "Tipo de gestión", key: "type_management.name" },
    { header: "Fecha de creación", key: "created_at" },
];

// Opciones de filtro para Management
const filterOptions = [
    { value: "identification_number", label: "Número de identificación" },
    { value: "name", label: "Nombre de cliente" },
    { value: "phone", label: "Celular" },
    { value: "payroll", label: "Pagaduría" },
    { value: "consultation", label: "Consulta" },
    { value: "user", label: "Agente" },
    { value: "wolkvox_id", label: "Wolkvox_id" },
    { value: "specific", label: "Consulta Especifica" },
    { value: "type_management", label: "Tipo de gestión" },
    { value: "solution_date", label: "Fecha de solución" },
    { value: "created_at", label: "Fecha de creación" },
];

const P = ({ text1, text2 }) => {
    let displayValue = text2;

    if (typeof text2 === "object" && text2 !== null) {
        displayValue = text2.name || JSON.stringify(text2);
    }

    return (
        <p className="text-gray-600 leading-relaxed">
            <strong className="text-gray-700">{text1}</strong>
            <span className="text-gray-900 ml-1">{displayValue}</span>
        </p>
    );
};

const Management = ({
    idView,
    idMonitoring,
    idSearchManagement,
    idAddManagement,
}) => {
    const {
        handleSubmit,
        monitoring,
        onMonitoring,
        setOnMonitoring,
        management,
        view,
        setView,
        formData,
        loading,
        setFormData,
        currentPage,
        totalPages,
        perPage,
        totalItems,
        fetchPage,
        managementCount, // Total global

        // Filtros
        filters,
        addFilter,
        removeFilter,
        clearFilters,

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
    } = useManagement();

    const { can } = useCan();
    const navigate = useNavigate();

    // Data activa
    const activeData = management || [];

    const handleView = (item) => {
        setFormData(item);
        setView(true);
    };

    const handleMonitoring = (item) => {
        setFormData({
            ...item,
            solution_date: item.solution_date || "",
            monitoring_id: item.monitoring?.id || "",
        });
        setOnMonitoring(true);
    };

    return (
        <>
            <Box sx={{ width: "100%", mb: 4, margin: "auto", px: 2 }}>
                {/* Header y Botón Agregar */}
                <div className="flex justify-between items-center mt-6 mb-4">
                    <h1 className="text-2xl font-bold text-purple-mid">
                        Gestiones ({totalItems})
                    </h1>
                    {can("management.create") && (
                        <ButtonAdd
                            id={idAddManagement}
                            onClickButtonAdd={() => {
                                navigate(
                                    `/gestiones/añadir?identification_number=${
                                        filters.identification_number || ""
                                    }`,
                                );
                            }}
                            text="Agregar Gestión"
                        />
                    )}
                </div>

                {/* Filtros */}
                <div className="flex justify-end mb-4 gap-2">
                    <MultiFilter
                        onAddFilter={addFilter}
                        onRemoveFilter={removeFilter}
                        onClearFilters={clearFilters}
                        filters={filters}
                        options={filterOptions}
                        className="w-full max-w-2xl"
                    />
                </div>

                {/* Tabla Unificada */}
                {loading ? (
                    <TableSkeleton rows={11} />
                ) : (
                    <Table
                        width="100%"
                        columns={columns}
                        data={activeData}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        rowsPerPage={perPage}
                        totalItems={totalItems}
                        fetchPage={fetchPage}
                        actions={true}
                        history={true}
                        onHistory={(item) => handleOpenHistory(item)}
                        view={true}
                        onView={(item) => handleView(item)}
                        edit={false}
                        monitoring={true}
                        onMonitoring={(item) => handleMonitoring(item)}
                        onActiveOrInactive={false}
                        idView={idView}
                        idMonitoring={idMonitoring}
                    />
                )}

                {/* Historial */}
                <HistoryChanges
                    isOpen={openHistory}
                    onClose={() => setOpenHistory(false)}
                    contact={selectedManagement}
                    history={history}
                    loading={loadingHistory}
                    currentPage={currentPageHistory}
                    totalPages={totalPagesHistory}
                    totalItems={totalItemsHistory}
                    perPage={perPageHistory}
                    onPageChange={fetchHistoryPage}
                />
            </Box>

            {/* Drawer de Vista */}
            <Drawer
                open={view}
                onClose={() => setView(false)}
                anchor="right"
                PaperProps={{
                    sx: {
                        backgroundColor: "#f3f3f3",
                        width: 500,
                        padding: 3,
                    },
                }}
            >
                <div className="flex flex-col gap-4">
                    <button
                        onClick={() => setView(false)}
                        className="self-end text-gray-500 hover:text-gray-800 font-semibold"
                    >
                        ✕ Cerrar
                    </button>

                    <div className="bg-white shadow-md rounded-lg p-5 flex flex-col gap-3">
                        <P
                            text1="Agente: "
                            text2={formData.user?.name ?? "Usuario sin nombre"}
                        />
                    </div>

                    <div className="bg-white shadow-md rounded-lg p-5 flex flex-col gap-3">
                        <P
                            text1="Pagaduría: "
                            text2={
                                formData.contact?.payroll?.name ??
                                "Sin pagaduría"
                            }
                        />
                        <P
                            text1="Campaña del contacto: "
                            text2={formData.contact?.campaign ?? "Sin campaña"}
                        />
                    </div>

                    <div className="bg-white shadow-md rounded-lg p-5 flex flex-col gap-3">
                        <P
                            text1="Nombre del cliente: "
                            text2={formData.contact?.name ?? "Sin Nombre"}
                        />
                        <P
                            text1="Teléfono: "
                            text2={
                                formData.contact?.phone ?? "No tiene teléfono"
                            }
                        />
                        <P
                            text1="Tipo de identificación: "
                            text2={
                                formData.contact?.identification_type ??
                                "Sin tipo de identificación"
                            }
                        />
                        <P
                            text1="Número de identificación: "
                            text2={
                                formData.contact?.identification_number ??
                                "Sin número de identificación"
                            }
                        />
                        <P
                            text1="Celular actualizado: "
                            text2={
                                formData.contact?.update_phone ??
                                "No tiene celular actualizado"
                            }
                        />
                        <P
                            text1="Correo: "
                            text2={
                                formData.contact?.email ??
                                "No tiene correo electronico"
                            }
                        />
                    </div>

                    <div className="bg-white shadow-md rounded-lg p-5 flex flex-col gap-3">
                        <P
                            text1="Consulta: "
                            text2={
                                formData.consultation?.name ?? "Sin consulta"
                            }
                        />
                        <P
                            text1="Consulta específica: "
                            text2={
                                formData.specific?.name ??
                                "Sin consulta especifica"
                            }
                        />
                        <P
                            text1="Wolkvox_id: "
                            text2={formData.wolkvox_id ?? "Sin wolkvox_id"}
                        />
                    </div>

                    <div className="bg-white shadow-md rounded-lg p-5 flex flex-col gap-3">
                        <P
                            text1="Solución en primer contacto: "
                            text2={formData.solution ? "Sí" : "No"}
                        />
                        <P
                            text1="Observaciones: "
                            text2={formData.comments ?? "Sin observaciones"}
                        />
                        <P
                            text1="Fecha de solución: "
                            text2={
                                formData.solution_date ??
                                "Sin fecha de solución"
                            }
                        />
                        <P
                            text1="Seguimiento: "
                            text2={
                                formData.monitoring?.name ?? "Sin seguimiento"
                            }
                        />
                    </div>

                    <div className="bg-white shadow-md rounded-lg p-5 flex flex-col gap-3">
                        <P
                            text1="Fecha de creación: "
                            text2={formData.created_at ?? "No registra fecha"}
                        />
                    </div>
                </div>
            </Drawer>

            {/* Drawer de Seguimiento */}
            <Drawer
                open={onMonitoring}
                onClose={() => setOnMonitoring(false)}
                anchor="right"
                PaperProps={{
                    sx: {
                        width: 500,
                        padding: 3,
                        borderRadius: "12px 0 0 12px",
                    },
                }}
            >
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <button
                        onClick={() => setOnMonitoring(false)}
                        className="self-end text-gray-500 hover:text-gray-800 font-semibold"
                    >
                        ✕
                    </button>

                    <h2 className="text-xl font-bold text-gray-800 ml-5">
                        Agregar Seguimiento
                    </h2>

                    <div className="p-5 flex flex-col gap-4">
                        <TextField
                            label="Fecha de seguimiento"
                            type="date"
                            InputLabelProps={{ shrink: true }}
                            fullWidth
                            value={formData.solution_date || ""}
                            onChange={(e) =>
                                setFormData({
                                    ...formData,
                                    solution_date: e.target.value,
                                })
                            }
                        />

                        <FormControl fullWidth>
                            <Autocomplete
                                id="monitoring-select"
                                options={monitoring || []}
                                getOptionLabel={(option) => option.name}
                                value={
                                    monitoring?.find(
                                        (m) => m.id === formData.monitoring_id,
                                    ) || null
                                }
                                onChange={(event, newValue) => {
                                    setFormData({
                                        ...formData,
                                        monitoring_id: newValue
                                            ? newValue.id
                                            : "",
                                    });
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Seguimiento"
                                    />
                                )}
                            />
                        </FormControl>

                        <div>
                            <Button type="submit" text="Guardar" />
                        </div>
                    </div>
                </form>
            </Drawer>
        </>
    );
};

export default Management;
