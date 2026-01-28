import { useEffect } from "react";
import { useCan } from "@hooks/useCan";
import Table from "@components/tables/Table";
import ButtonAdd from "@components/ui/ButtonAdd";
import FormAdd from "@components/forms/FormAdd";
import MultiFilter from "@components/ui/MultiFilter";
import HistoryChanges from "@components/ui/HistoryChanges";
import { useEntity } from "@modules/entity/hooks/useEntity";
import { fields, userSchema, columns, filterOptions } from "./constants";
import TableSkeleton from "@components/tables/TableSkeleton";

const Entity = () => {
    const { can } = useCan();

    const {
        fetchPage,
        entities,
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
        history,
        loadingHistory,
        currentPageH,
        totalPagesH,
        perPageH,
        totalItemsH,
        handleOpenHistory,
        handleCloseHistory,
        fetchHistoryPage,
        selectedEntity,
        // Nuevo Filtro
        filters,
        addFilter,
        removeFilter,
        clearFilters,
    } = useEntity();

    return (
        <>

            <h1 className="text-2xl font-bold text-center mb-4 text-purple-mid">
                Lista de Entidades (Operadores)
            </h1>

            <ButtonAdd
                onClickButtonAdd={() => setIsOpenADD(true)}
                disabled={!can("contact.create")}
                text="Agregar entidad"
            />

            <div className="flex justify-end px-12 -mt-10 gap-2 pb-10">
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
                title="Entidades"
                formData={formData}
                setFormData={setFormData}
                handleSubmit={handleSubmit}
                loading={loading}
                validationErrors={validationErrors}
                fields={fields}
                schema={userSchema}
            />

            {loading ? (
                <TableSkeleton row="9" />
            ) : (
                <Table
                    columns={columns}
                    data={entities}
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
                />
            )}

            <HistoryChanges
                isOpen={openHistory}
                onClose={handleCloseHistory}
                contact={selectedEntity}
                history={history}
                loading={loadingHistory}
                currentPage={currentPageH}
                totalPages={totalPagesH}
                totalItems={totalItemsH}
                perPage={perPageH}
                onPageChange={fetchHistoryPage}
            />
        </>
    );
};

export default Entity;
