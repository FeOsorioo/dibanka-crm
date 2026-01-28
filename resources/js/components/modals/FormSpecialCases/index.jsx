import React from "react";
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    TextField,
    Button,
    Drawer,
    DialogTitle,
    DialogContent,
    FormHelperText,
} from "@mui/material";
import { IoMdSearch } from "react-icons/io";
import SearchContact from "@components/modals/SearchContact";

export default function FormSpecialCases({
    isOpen,
    setIsOpen,
    selectedPayroll,
    selectedContact,
    formData,
    setFormData,
    validationErrors,
    handleSubmit,
    clearFieldError,
    openSearchContact,
    setOpenSearchContact,
    onSelectContact,
    contactSearch = [],
    currentPageContact = 1,
    totalPagesContact = 1,
    perPageContact = 10,
    totalItemsContact = 0,
    loadingContact = false,

    fetchPageContact,
    filtersContact,
    addFilterContact,
    removeFilterContact,
    clearFiltersContact,
}) {
    return (
        <>
            <Drawer
                open={isOpen}
                onClose={() => setIsOpen(false)}
                anchor="right"
                // 🔥 FIX: Agregar hideBackdrop cuando el SearchContact está abierto
                hideBackdrop={openSearchContact}
                sx={{
                    "& .MuiDrawer-paper": {
                        position: "fixed",
                        right: 0,
                        top: 0,
                        height: "100vh",
                        maxHeight: "100vh",
                        width: "36%",
                        maxWidth: "none",
                        margin: 0,
                        borderRadius: "12px 0 0 12px",
                        // 🔥 FIX: Bajar z-index cuando SearchContact está abierto
                        zIndex: openSearchContact ? 1200 : 1300,
                    },
                }}
            >
                <div className="flex flex-col items-right justify-center p-10 w-full text-secondary-dark">
                    <DialogTitle className="flex justify-between items-center">
                        <p className="text-2xl font-semibold">
                            Agregar caso especial
                        </p>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-xl font-bold p-2 hover:bg-gray-200 rounded-full"
                        >
                            X
                        </button>
                    </DialogTitle>

                    <DialogContent dividers className="space-y-6">
                        <div className="grid grid-cols-1 gap-6">
                            {/* CLIENTE */}
                            <div className="flex items-stretch rounded-lg overflow-hidden border border-gray-300 hover:border-blue-400 transition-all duration-200 bg-white shadow-sm">
                                <TextField
                                    label="Cliente"
                                    value={
                                        selectedContact
                                            ? `${selectedContact.identification_number} | ${selectedContact.name}`
                                            : ""
                                    }
                                    fullWidth
                                    disabled
                                    error={!!validationErrors?.contact_id}
                                    helperText={
                                        validationErrors?.contact_id
                                            ? validationErrors.contact_id[0]
                                            : ""
                                    }
                                />
                                <button
                                    onClick={() => {
                                        setOpenSearchContact(true);
                                    }}
                                    className="px-5 bg-blue-50 hover:bg-blue-100 border-l border-gray-300 transition-all duration-200 group"
                                >
                                    <IoMdSearch className="text-blue-600 w-6 h-6 group-hover:scale-110 transition-transform" />
                                </button>
                            </div>

                            {/* GESTIÓN DE MESSI */}
                            <FormControl
                                fullWidth
                                error={!!validationErrors?.management_messi}
                            >
                                <InputLabel>Gestión de Messi</InputLabel>
                                <Select
                                    value={formData?.management_messi || ""}
                                    onChange={(e) => {
                                        clearFieldError("management_messi");
                                        setFormData((prev) => ({
                                            ...prev,
                                            management_messi: e.target.value,
                                        }));
                                    }}
                                    label="Gestión de Messi"
                                >
                                    <MenuItem value="">Seleccione</MenuItem>
                                    <MenuItem value="Nota creada">
                                        Nota creada
                                    </MenuItem>
                                    <MenuItem value="Ticket creado">
                                        Ticket creado
                                    </MenuItem>
                                </Select>
                                {validationErrors?.management_messi && (
                                    <FormHelperText>
                                        {validationErrors.management_messi[0]}
                                    </FormHelperText>
                                )}
                            </FormControl>

                            {/* ID LLAMADA */}
                            <TextField
                                label="ID de la llamada"
                                value={formData?.id_call || ""}
                                onChange={(e) => {
                                    clearFieldError("id_call");
                                    setFormData((prev) => ({
                                        ...prev,
                                        id_call: e.target.value,
                                    }));
                                }}
                                error={!!validationErrors?.id_call}
                                helperText={
                                    validationErrors?.id_call
                                        ? validationErrors.id_call[0]
                                        : ""
                                }
                                fullWidth
                            />

                            {/* ID MESSI */}
                            <TextField
                                label="ID Messi"
                                value={formData?.id_messi || ""}
                                onChange={(e) => {
                                    clearFieldError("id_messi");
                                    setFormData((prev) => ({
                                        ...prev,
                                        id_messi: e.target.value,
                                    }));
                                }}
                                error={!!validationErrors?.id_messi}
                                helperText={
                                    validationErrors?.id_messi
                                        ? validationErrors.id_messi[0]
                                        : ""
                                }
                                fullWidth
                            />

                            {/* OBSERVACIONES */}
                            <TextField
                                label="Observaciones"
                                multiline
                                rows={4}
                                value={formData?.observations || ""}
                                onChange={(e) => {
                                    clearFieldError("observations");
                                    setFormData((prev) => ({
                                        ...prev,
                                        observations: e.target.value,
                                    }));
                                }}
                                error={!!validationErrors?.observations}
                                helperText={
                                    validationErrors?.observations
                                        ? validationErrors.observations[0]
                                        : ""
                                }
                                fullWidth
                            />
                        </div>

                        {/* BOTONES */}
                        <div className="flex justify-end gap-4 mt-6">
                            <Button
                                variant="outlined"
                                onClick={() => setIsOpen(false)}
                            >
                                Cancelar
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSubmit}
                            >
                                Guardar caso especial
                            </Button>
                        </div>
                    </DialogContent>
                </div>
            </Drawer>

            {/* 🔥 FIX: SearchContact ahora tiene mejor z-index */}
            {openSearchContact && (
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
                    fetchPageContact={fetchPageContact}
                    filtersContact={filtersContact}
                    addFilterContact={addFilterContact}
                    removeFilterContact={removeFilterContact}
                    clearFiltersContact={clearFiltersContact}
                />
            )}
        </>
    );
}
