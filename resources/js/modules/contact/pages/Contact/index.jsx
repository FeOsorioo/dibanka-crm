import { useEffect, useMemo, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCan } from "@hooks/useCan";
import Table from "@components/tables/Table";
import ButtonAdd from "@components/ui/ButtonAdd";
import FormAdd from "@components/forms/FormAdd";
import MultiFilter from "@components/ui/MultiFilter";
import HistoryChanges from "@components/ui/HistoryChanges";
import { useContact } from "@modules/contact/hooks/useContact";
import { fields, userSchema, columns, filterOptions } from "./constants";
import TableSkeleton from "@components/tables/TableSkeleton";
import SearchEntity from "@components/modals/SearchEntity";
import { useState } from "react";
import { Box } from "@mui/material";

const Contact = ({
    addContact,
    searchContact,
    viewManagementContact,
    editContact,
    activeOrDesactiveContact,
}) => {
    const { can } = useCan();
    const navigate = useNavigate();
    const location = useLocation();
    const {
        fetchPage,
        payroll,
        contact,
        loading,
        isOpenADD,
        setIsOpenADD,
        formData,
        setFormData,
        validationErrors,
        handleSubmit,
        currentPage,
        totalPages,
        totalItems,
        perPage,
        handleDelete,
        handleEdit,
        handleCloseModal,
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
        selectedContact,
        // Nuevo Filtro
        filters,
        addFilter,
        removeFilter,
        clearFilters,
    } = useContact();

    const [isOpenSearchEntity, setIsOpenSearchEntity] = useState(false);

    const handleSelectEntity = (entity) => {
        setFormData((prev) => ({
            ...prev,
            entity_id: entity.id,
            entity_name: entity.name,
        }));
        setIsOpenSearchEntity(false);
    };

    // Efecto para leer parámetros de la URL y filtrar automáticamente
    useEffect(() => {
        const params = new URLSearchParams(location.search);

        // Cargar filtros iniciales desde URL si no hay filtros activos
        params.forEach((value, key) => {
            if (value && !filters[key]) {
                addFilter(key, value);
            }
        });
    }, [location.search]);

    // Efecto para cambiar automáticamente el tipo de identificación
    useEffect(() => {
        if (Number(formData.campaign_id) === 1) {
            // Aliados
            setFormData((prev) => ({
                ...prev,
                identification_type: "NIT",
            }));
        } else if (Number(formData.campaign_id) === 2) {
            // Afiliados
            setFormData((prev) => ({
                ...prev,
                identification_type: "CEDULA DE CIUDADANIA",
            }));
        }
    }, [formData.campaign_id, setFormData]);

    const formFields = useMemo(() => {
        return fields
            .filter((field) => {
                if (field.name === "entity_id") {
                    return Number(formData.campaign_id) === 1;
                }
                return true;
            })
            .map((field) => {
                if (field.name === "payroll_id") {
                    return {
                        ...field,
                        options: payroll.map((p) => ({
                            value: p.id,
                            label: p.name,
                        })),
                    };
                }
                if (field.name === "entity_id") {
                    return {
                        ...field,
                        type: "search-input",
                        displayField: "entity_name",
                        onSearch: () => setIsOpenSearchEntity(true),
                    };
                }
                return field;
            });
    }, [payroll, formData.campaign_id]);

    const handleNavigateManagement = useCallback(
        (row) => {
            const campaignName =
                row.campaign?.name ||
                (row.campaign_id === 1 ? "Aliados" : "Afiliados");
            navigate(
                `/gestiones?search=${encodeURIComponent(
                    row.identification_number,
                )}&campaign=${campaignName}`,
            );
        },
        [navigate],
    );

    return (
        <>
            <Box sx={{ width: "100%", mb: 4, margin: "auto", px: 10, marginLeft: "10px" }}>
            
            <h1 className="text-2xl font-bold text-center mb-4 text-purple-mid">
                Lista de Contactos
            </h1>
            
            <div className="flex justify-between mb-4 ">
                <ButtonAdd
                    className="lg:ml-[0%]"
                    id={addContact}
                    disabled={!can("contact.create")}
                    onClickButtonAdd={() => setIsOpenADD(true)}
                    text="Agregar contacto"
                />

                <MultiFilter
                    onAddFilter={addFilter}
                    onRemoveFilter={removeFilter}
                    onClearFilters={clearFilters}
                    filters={filters}
                    options={filterOptions}
                    className="w-full max-w-2xl"
                />
            </div>

            <FormAdd
                isOpen={isOpenADD}
                setIsOpen={handleCloseModal}
                title="Contactos"
                formData={formData}
                setFormData={setFormData}
                handleSubmit={handleSubmit}
                loading={loading}
                validationErrors={validationErrors}
                fields={formFields}
                schema={userSchema}
            />
            {loading ? (
                <TableSkeleton row="9" />
            ) : (
                <Table
                    width="100%"
                    columns={columns}
                    data={contact}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    rowsPerPage={perPage}
                    totalItems={totalItems}
                    fetchPage={(page) => fetchPage(page)}
                    onDelete={handleDelete}
                    onHistory={handleOpenHistory}
                    history={true}
                    actions={true}
                    onEdit={handleEdit}
                    management={true}
                    onManagement={handleNavigateManagement}
                    //IDS
                    idManagement={viewManagementContact}
                    idEdit={editContact}
                    idOnActiveOrInactive={activeOrDesactiveContact}
                    idOnHistory={handleOpenHistory}
                />
            )}

            <HistoryChanges
                isOpen={openHistory}
                onClose={handleCloseHistory}
                contact={selectedContact}
                history={history}
                loading={loadingHistory}
                currentPage={currentPageH}
                totalPages={totalPagesH}
                totalItems={totalItemsH}
                perPage={perPageH}
                onPageChange={fetchHistoryPage}
            />

            <SearchEntity
                isOpen={isOpenSearchEntity}
                setIsOpen={setIsOpenSearchEntity}
                onSelectEntity={handleSelectEntity}
            />
            </Box>
        </>
    );
};

export default Contact;
