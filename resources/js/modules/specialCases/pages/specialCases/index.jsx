import { useContext, useEffect } from "react";
import { useCan } from "@hooks/useCan";
import { useSpecialCases } from "@modules/specialCases/hooks/useSpecialCases";
import TableSkeleton from "@components/tables/TableSkeleton";

import Table from "@components/tables/Table";
import ButtonAdd from "@components/ui/ButtonAdd";
import FormSpecialCases from "@components/modals/FormSpecialCases";
import SearchContact from "@components/modals/SearchContact";
import MultiFilter from "@components/ui/MultiFilter";
import HistoryChanges from "@components/ui/HistoryChanges";
import { Box } from "@mui/material";

import { AuthContext } from "@context/AuthContext";

const SpecialCases = ({ idAddSpecialCase }) => {
    const { user } = useContext(AuthContext);
    const {
        fetchPage,
        filters,
        addFilter,
        removeFilter,
        clearFilters,
        specialCases,
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
        selectedContact,
        openSearchContact,
        setOpenSearchContact,
        clearFieldError,
        onSelectContact,
        contactSearch,
        currentPageContact,
        totalPagesContact,
        perPageContact,
        totalItemsContact,
        loadingContact,
        filtersContact,
        addFilterContact,
        removeFilterContact,
        clearFiltersContact,
        openHistory,
        setOpenHistory,
        history,
        currentPageH,
        totalPagesH,
        perPageH,
        totalItemsH,
        loadingHistory,
        fetchHistoryPage,
    } = useSpecialCases();
    const { can, canAny } = useCan();

    const filterOptions = [
        { value: "id", label: "ID" },
        { value: "user", label: "Agente" },
        { value: "campaign", label: "Campaña" },
        { value: "payroll", label: "Pagaduría" },
        { value: "identification_number", label: "Identificación" },
        { value: "management_messi", label: "Gestión Messi" },
        { value: "contact", label: "Cliente" },
        { value: "id_call", label: "ID llamada" },
        { value: "id_messi", label: "ID Messi" },
        { value: "observations", label: "Observaciones" },
    ];

    // Cuando se abre el modal, asigna el user actual como predeterminado
    useEffect(() => {
        if (isOpenADD && user) {
            setFormData((prev) => ({
                ...prev,
                user_id: user.id,
            }));
        }
    }, [isOpenADD, user, setFormData]);

    const columns = [
        { header: "ID", key: "id" },
        { header: "Agente", key: "user.name" },
        { header: "Campaña", key: "contact.campaign.name" },
        { header: "Pagaduria", key: "contact.payroll" },
        { header: "Identificación", key: "contact.identification_number" },
        { header: "Gestión Messi", key: "management_messi" },
        { header: "Cliente", key: "contact.name" },
        { header: "ID llamada", key: "id_call" },
        { header: "ID Messi", key: "id_messi" },
        { header: "Fecha creación", key: "created_at" },
        { header: "Observaciones", key: "observations" },
    ];

    return (
        <>
            <Box sx={{ width: "100%", mb: 4, margin: "auto", px: 10, marginLeft: "10px" }}>
            <h1 className="text-2xl font-bold text-center mb-4 text-purple-mid">
                Lista de casos especiales
            </h1>

            <div className="flex justify-between mb-4 ">
                <ButtonAdd
                    className="lg:ml-[0%]"
                    id={idAddSpecialCase}
                    disabled={!can("special_cases.create")}
                    onClickButtonAdd={() => setIsOpenADD(true)}
                    text="Agregar caso especial"
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

            <FormSpecialCases
                isOpen={isOpenADD}
                setIsOpen={setIsOpenADD}
                selectedContact={selectedContact}
                formData={formData}
                setFormData={setFormData}
                validationErrors={validationErrors}
                handleSubmit={handleSubmit}
                clearFieldError={clearFieldError}
                openSearchContact={openSearchContact}
                setOpenSearchContact={setOpenSearchContact}
                onSelectContact={onSelectContact}
                contactSearch={contactSearch}
                currentPageContact={currentPageContact}
                totalPagesContact={totalPagesContact}
                perPageContact={perPageContact}
                totalItemsContact={totalItemsContact}
                loadingContact={loadingContact}
                filtersContact={filtersContact}
                addFilterContact={addFilterContact}
                removeFilterContact={removeFilterContact}
                clearFiltersContact={clearFiltersContact}
            />

            <SearchContact
                isOpen={openSearchContact}
                setIsOpen={setOpenSearchContact}
                onSelectContact={onSelectContact}
                contactSearch={contactSearch}
                currentPageContact={currentPageContact}
                totalPagesContact={totalPagesContact}
                perPageContact={perPageContact}
                totalItemsContact={totalItemsContact}
                loadingContact={loadingContact}
                filtersContact={filtersContact}
                addFilterContact={addFilterContact}
                removeFilterContact={removeFilterContact}
                clearFiltersContact={clearFiltersContact}
            />

            {loading ? (
                <TableSkeleton rows={11} />
            ) : (
                <Table
                    width="100%"
                    columns={columns}
                    data={specialCases}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    rowsPerPage={perPage}
                    totalItems={totalItems}
                    fetchPage={(page) => fetchPage(page)}
                    onSelectContact={onSelectContact}
                />
            )}
            <HistoryChanges
                isOpen={openHistory}
                onClose={() => setOpenHistory(false)}
                contact={selectedContact}
                history={history}
                loading={loadingHistory}
                currentPage={currentPageH}
                totalPages={totalPagesH}
                totalItems={totalItemsH}
                perPage={perPageH}
                onPageChange={fetchHistoryPage}
            />
            </Box>
        </>
    );
};

export default SpecialCases;
