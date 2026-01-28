import React, { useEffect, useState } from "react";
import { Dialog, IconButton } from "@mui/material";
import { motion } from "framer-motion";
import { IoClose } from "react-icons/io5";
import MultiFilter from "@components/ui/MultiFilter";
import Table from "@components/tables/Table";
import TableSkeleton from "@components/tables/TableSkeleton";
import { useEntity } from "@modules/entity/hooks/useEntity";

const filterOptions = [
    { value: "name", label: "Nombre" },
    { value: "nit", label: "NIT" },
    { value: "email", label: "Correo" },
    { value: "phone", label: "Teléfono" },
];

export default function SearchEntity({ isOpen, setIsOpen, onSelectEntity }) {
    const {
        entities,
        loading,
        fetchEntities,
        currentPage,
        totalPages,
        perPage,
        totalItems,
        fetchPage,
        filters,
        addFilter,
        removeFilter,
        clearFilters,
    } = useEntity();

    // Columns for the table
    const columns = [
        { header: "ID", key: "id" },
        { header: "Nombre", key: "name" },
        { header: "NIT", key: "nit" },
        { header: "Correo", key: "email" },
        { header: "Teléfono", key: "phone" },
    ];

    const handleSelectRecord = (recordId) => {
        const selected = entities.find((item) => item.id === recordId);
        if (selected) {
            onSelectEntity(selected);
            setIsOpen(false);
        }
    };

    // Ensure we fetch data when modal opens
    useEffect(() => {
        if (isOpen) {
            fetchEntities(1);
        }
    }, [isOpen, fetchEntities]);

    return (
        <Dialog
            onClose={() => setIsOpen(false)}
            open={isOpen}
            fullWidth
            maxWidth="lg"
            sx={{
                "& .MuiDialog-root": {
                    zIndex: 1400,
                },
                "& .MuiBackdrop-root": {
                    zIndex: 1400,
                },
            }}
            PaperProps={{
                sx: {
                    borderRadius: 1,
                    boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
                    background: "#f7fafc",
                    overflow: "hidden",
                    zIndex: 1400,
                },
            }}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.96, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="p-8"
            >
                {/* Header */}
                <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-3">
                    <h2 className="text-2xl text-primary-strong font-semibold">
                        Buscar entidad
                    </h2>

                    <IconButton
                        onClick={() => setIsOpen(false)}
                        size="large"
                        sx={{
                            color: "#6b7280",
                            "&:hover": {
                                color: "#2563eb",
                                transform: "rotate(90deg)",
                            },
                            transition: "all 0.3s ease",
                        }}
                    >
                        <IoClose size={26} />
                    </IconButton>
                </div>

                {/* Search */}
                <div className="flex justify-center mb-6">
                    <div className="w-full flex justify-end gap-2">
                        <MultiFilter
                            onAddFilter={addFilter}
                            onRemoveFilter={removeFilter}
                            onClearFilters={clearFilters}
                            filters={filters}
                            options={filterOptions}
                            className="w-full"
                        />
                    </div>
                </div>

                {/* TABLE / SKELETON */}
                <div className="min-h-[420px]">
                    {loading ? (
                        <TableSkeleton rows={8} />
                    ) : (
                        <Table
                            width="100%"
                            columns={columns}
                            data={entities}
                            paginationSection={true}
                            actions={true}
                            currentPage={currentPage}
                            totalPages={totalPages}
                            rowsPerPage={perPage}
                            totalItems={totalItems}
                            fetchPage={fetchPage}
                            onActiveOrInactive={false}
                            selectRecord={true}
                            onSelectRecord={handleSelectRecord}
                        />
                    )}
                </div>

                {/* Footer */}
                <div className="mt-6 text-center text-sm text-gray-400">
                    Selecciona una entidad para continuar 💬
                </div>
            </motion.div>
        </Dialog>
    );
}
