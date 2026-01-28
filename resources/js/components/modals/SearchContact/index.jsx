import React from "react";
import { Dialog, IconButton } from "@mui/material";
import { motion } from "framer-motion";
import { IoClose } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import MultiFilter from "@components/ui/MultiFilter";
import Table from "@components/tables/Table";
import TableSkeleton from "@components/tables/TableSkeleton";

const filterOptions = [
    { value: "identification_number", label: "Número de identificación" },
    { value: "name", label: "Nombre" },
    { value: "email", label: "Correo" },
    { value: "phone", label: "Teléfono" },
    { value: "payroll", label: "Pagaduría" },
    { value: "campaign", label: "Campaña" },
];

export default function SearchContact({
    isOpen,
    setIsOpen,
    onSelectContact,
    contactSearch,
    currentPageContact,
    totalPagesContact,
    perPageContact,
    totalItemsContact,
    loadingContact,

    fetchPageContact,
    filtersContact,
    addFilterContact,
    removeFilterContact,
    clearFiltersContact,
}) {
    const navigate = useNavigate();

    const columns = [
        { header: "ID", key: "id" },
        { header: "Campaña", key: "campaign.name" },
        { header: "Pagaduría", key: "payroll.name" },
        { header: "Nombre", key: "name" },
        { header: "Correo", key: "email" },
        { header: "Celular", key: "update_phone" },
        { header: "Identificación", key: "identification_number" },
    ];

    const handleSelectRecord = (recordId) => {
        const selected = contactSearch.find((item) => item.id === recordId);
        if (selected) {
            onSelectContact(selected);
            // El modal se cierra desde el hook después de seleccionar
        } else {
            console.log("❌ Contacto no encontrado en la lista");
        }
    };

    const handleEdit = (record) => {
        navigate(
            `/contactos?search=${encodeURIComponent(
                record.identification_number,
            )}&column=identification_number`,
        );
    };

    const handleClearSearch = () => {
        clearFiltersContact();
    };

    return (
        <Dialog
            onClose={() => {
                setIsOpen(false);
            }}
            open={isOpen}
            fullWidth
            maxWidth="lg"
            // 🔥 FIX: Asegurar que esté por encima del Drawer
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
                        Buscar contacto o cliente
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
                            onAddFilter={addFilterContact}
                            onRemoveFilter={removeFilterContact}
                            onClearFilters={clearFiltersContact}
                            filters={filtersContact}
                            options={filterOptions}
                            className="w-full"
                        />
                    </div>
                </div>

                {/* TABLE / SKELETON */}
                <div className="min-h-[420px]">
                    {loadingContact ? (
                        <TableSkeleton rows={8} />
                    ) : (
                        <Table
                            width="100%"
                            columns={columns}
                            data={contactSearch}
                            paginationSection={true}
                            actions={true}
                            edit={false}
                            currentPage={currentPageContact}
                            totalPages={totalPagesContact}
                            rowsPerPage={perPageContact}
                            totalItems={totalItemsContact}
                            fetchPage={fetchPageContact}
                            onActiveOrInactive={false}
                            selectRecord={true}
                            onSelectRecord={handleSelectRecord}
                        />
                    )}
                </div>

                {/* Footer */}
                <div className="mt-6 text-center text-sm text-gray-400">
                    Selecciona un contacto para continuar 💬
                </div>
            </motion.div>
        </Dialog>
    );
}
