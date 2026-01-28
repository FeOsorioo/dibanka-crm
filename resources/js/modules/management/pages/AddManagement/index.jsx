import { useMemo } from "react";
import { useCan } from "@hooks/useCan";
import {
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Autocomplete,
    TextField,
    Button,
    Switch,
    FormHelperText,
    Alert,
    Snackbar,
    CircularProgress,
} from "@mui/material";
import { TiContacts, TiInfoLarge } from "react-icons/ti";
import { MdOutlineFolderSpecial } from "react-icons/md";
import { FiUserPlus } from "react-icons/fi";
import SpeedDialButton from "@components/ui/SpeedDialButton";
import seleccione_imagen from "@assets/seleccione_imagen.png";
import { useAddManagementForm } from "@modules/management/hooks/useAddManagementForm";
import { useSpecialCasesForm } from "@modules/management/hooks/useSpecialCasesForm";
import InfoField from "@modules/management/components/InfoField";
import FormSpecialCases from "@components/modals/FormSpecialCases";
import SearchContact from "@components/modals/SearchContact";
import { IoMdSearch } from "react-icons/io";
import Agent from "@modules/management/components/agent";
import { fields as contactFields } from "@modules/contact/pages/Contact/constants";
import { FiX, FiSave, FiEdit2, FiUserX } from "react-icons/fi";
import { LuUserPen } from "react-icons/lu";

const AddManagement = () => {
    const { can } = useCan();
    const {
        sms,
        wsp,
        selectedPayroll,
        selectedTypeManagement,
        selectedContact,
        selectedSolution,
        selectedConsultation,
        selectedSpecificConsultation,
        wolkvox_id,
        comments,
        modal,
        validationErrors,
        loadingConsultations,
        payroll,
        // Setters
        setSms,
        setWsp,
        setSelectedPayroll,
        setSelectedTypeManagement,
        setSelectedContact,
        setSelectedSolution,
        setSelectedConsultation,
        setSelectedSpecificConsultation,
        setWolkvox_id,
        setObservations,
        setModal,
        clearValidationError,
        onSave,
        handleClear,
        filteredTypeManagement,
        filteredSpecific,
        filteredContact,
        openSections,
        setOpenSections,
        filteredConsultation,

        // Editing contact
        isEditingContact,
        contactFormData,
        setContactFormData,
        handleEditContact,
        handleCreateContact,
        handleCancelEdit,
        handleSaveContactEdit,
        handleClearConact,
        isAliados,
    } = useAddManagementForm();

    const formContactFields = useMemo(() => {
        return contactFields.map((field) => {
            if (field.name === "payroll_id") {
                return {
                    ...field,
                    options: (payroll || []).map((p) => ({
                        value: p.id,
                        label: p.name,
                    })),
                };
            }
            return field;
        });
    }, [payroll]);

    // Callback para cuando se seleccione un contacto en el modal
    const handleContactSelectedFromModal = (contact) => {
        setSelectedContact(contact);
    };

    const {
        user,
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
        selectedContactSpecial,
        setSelectedContactSpecial,
        validationErrorsSpecial,
        handleSubmit: handleSubmitSpecialCases,
        openSpecialCases,
        setOpenSpecialCases,
        openSearchContact,
        setOpenSearchContact,
        formData: formDataSpecialCases,
        setFormData: setFormDataSpecialCases,
        clearFieldError: clearFieldErrorSpecialCases,
    } = useSpecialCasesForm(handleContactSelectedFromModal);

    const parsedDescription = selectedContact?.payroll?.description?.replace(
        /{{agente}}/g,
        user?.name || "",
    );

    const handleOpenInfoPopup = () => {
        const payrollId = selectedPayroll?.id || "";

        window.open(
            `/informacion?payroll_id=${encodeURIComponent(payrollId)}`,
            "_blank",
            "width=1000,height=700,scrollbars=yes,resizable=yes",
        );
    };

    const actions = [
        {
            icon: <MdOutlineFolderSpecial className="w-6 h-auto" />,
            name: "Caso especial",
            click: () => setOpenSpecialCases(true),
        },
        {
            icon: <TiInfoLarge className="w-7 h-auto" />,
            name: "Información",
            click: handleOpenInfoPopup,
        },
    ];

    return (
        <div className="flex flex-col gap-4 text-secondary-dark lg:px-[8%] md:px-[5%] sm:px-[5%] pb-40 ">
            {/* Título */}
            <div className="flex justify-between items-center">
                <h1 className="flex justify-center items-center gap-3 text-2xl font-semibold">
                    <TiContacts className="w-9 h-auto" /> Agregar Gestión
                </h1>
                <button
                    onClick={handleClear}
                    className=" text-gray-500 hover:text-gray-800 font-semibold"
                >
                    Limpiar formulario
                </button>
            </div>
            <div className="h-0.5 bg-gray-300 rounded"></div>

            {/* Bloque de elegir cliente y mostrar imagen */}
            <div className="w-full flex gap-6 ">
                {/* Información del Cliente */}
                <div className="flex-1 bg-white shadow-lg rounded-xl p-6 border border-gray-100">
                    {/* Header */}
                    <div className="mb-6 pb-4 border-b border-gray-200">
                        <h2 className="text-2xl font-bold text-gray-800">
                            Información del cliente
                        </h2>
                    </div>

                    {/* Autocomplete de buscar cliente*/}
                    <div className="mb-6">
                        <label className="block text-sm font-medium text-gray-500">
                            Buscar Cliente
                        </label>
                        <Autocomplete
                            disabled
                            options={filteredContact}
                            getOptionLabel={(option) =>
                                `${option?.identification_number || ""} | ${
                                    option?.name || ""
                                }`
                            }
                            value={selectedContact}
                            onChange={(event, value) => {
                                setSelectedContact(value);
                                clearValidationError("contact_id");
                            }}
                            renderInput={(params) => (
                                <div className="flex items-stretch rounded-lg overflow-hidden border border-gray-300 hover:border-blue-400 transition-all duration-200 bg-white shadow-sm">
                                    <TextField
                                        {...params}
                                        error={!!validationErrors.contact_id}
                                        helperText={
                                            validationErrors.contact_id
                                                ? validationErrors.contact_id[0]
                                                : ""
                                        }
                                        className="flex-1"
                                    />
                                    <button
                                        onClick={() =>
                                            setOpenSearchContact(true)
                                        }
                                        className="px-5 bg-blue-50 hover:bg-blue-100 border-l border-gray-300 transition-all duration-200 group"
                                    >
                                        <IoMdSearch className="text-blue-600 w-6 h-6 group-hover:scale-110 transition-transform" />
                                    </button>

                                    <button
                                        onClick={handleCreateContact}
                                        disabled={selectedContact}
                                        title="Crear nuevo contacto"
                                        className="px-5 bg-blue-50 hover:bg-blue-100 border-l border-gray-300 transition-all duration-200 group disabled:opacity-50"
                                    >
                                        <FiUserPlus className="text-blue-600 w-6 h-6 group-hover:scale-110 transition-transform" />
                                    </button>
                                    <button
                                        onClick={handleEditContact}
                                        disabled={!selectedContact}
                                        title="Editar información del cliente"
                                        className="px-5 bg-blue-50 hover:bg-blue-100 border-l border-gray-300 transition-all duration-200 group disabled:opacity-50"
                                    >
                                        <LuUserPen className="text-blue-600 w-6 h-6 group-hover:scale-110 transition-transform" />
                                    </button>
                                    {selectedContact && (
                                        <button
                                            onClick={handleClearConact}
                                            title="Limpiar información del cliente"
                                            className="px-5 bg-red-50 hover:bg-red-100 border-l border-gray-300 transition-all duration-200 group"
                                        >
                                            <FiUserX className="text-red-600 w-6 h-6 group-hover:scale-110 transition-transform" />
                                        </button>
                                    )}
                                </div>
                            )}
                        />
                    </div>

                    {/* Grid de Información / Formulario Editable */}
                    {!isEditingContact ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 transition-all duration-300 ease-in-out">
                            <InfoField
                                label="Campaña"
                                value={selectedContact?.campaign?.name ?? "—"}
                                fieldName="campaign"
                            />
                            <InfoField
                                label="Pagaduría"
                                value={selectedContact?.payroll?.name ?? "—"}
                                fieldName="payroll"
                            />
                            <InfoField
                                label="Nombre"
                                value={selectedContact?.name ?? "—"}
                                fieldName="name"
                            />
                            <InfoField
                                label="Correo electrónico"
                                value={selectedContact?.email ?? "—"}
                                fieldName="email"
                            />
                            <InfoField
                                label="Teléfono"
                                value={selectedContact?.phone ?? "—"}
                                fieldName="phone"
                            />
                            <InfoField
                                label="Celular actualizado"
                                value={selectedContact?.update_phone ?? "—"}
                                fieldName="update_phone"
                            />
                            <InfoField
                                label="Tipo de identificación"
                                value={
                                    selectedContact?.identification_type ?? "—"
                                }
                                fieldName="identification_type"
                            />
                            <InfoField
                                label="Número de identificación"
                                value={
                                    selectedContact?.identification_number ??
                                    "—"
                                }
                                fieldName="identification_number"
                            />
                        </div>
                    ) : (
                        <div className="bg-gray-50 rounded-xl p-6 border-2 border-dashed border-blue-200 transition-all duration-300 ease-in-out animate-pulse-subtle">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-bold text-blue-800">
                                    Editando Información
                                </h3>
                                <div className="flex gap-2">
                                    <button
                                        onClick={handleCancelEdit}
                                        className="flex items-center gap-1 px-3 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-sm transition-colors"
                                    >
                                        <FiX /> Cancelar
                                    </button>
                                    <button
                                        onClick={handleSaveContactEdit}
                                        className="flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
                                    >
                                        <FiSave /> Guardar cambios
                                    </button>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {formContactFields.map((field) => (
                                    <div key={field.name}>
                                        {field.type === "select" ? (
                                            <FormControl
                                                fullWidth
                                                size="small"
                                                error={
                                                    !!validationErrors[
                                                        field.name
                                                    ]
                                                }
                                            >
                                                <InputLabel
                                                    id={`label-${field.name}`}
                                                >
                                                    {field.label}
                                                </InputLabel>
                                                <Select
                                                    labelId={`label-${field.name}`}
                                                    value={
                                                        contactFormData[
                                                            field.name
                                                        ] || ""
                                                    }
                                                    label={field.label}
                                                    onChange={(e) => {
                                                        setContactFormData({
                                                            ...contactFormData,
                                                            [field.name]:
                                                                e.target.value,
                                                        });
                                                        clearValidationError(
                                                            field.name,
                                                        );
                                                    }}
                                                >
                                                    {field.options?.map(
                                                        (opt) => (
                                                            <MenuItem
                                                                key={opt.value}
                                                                value={
                                                                    opt.value
                                                                }
                                                            >
                                                                {opt.label}
                                                            </MenuItem>
                                                        ),
                                                    )}
                                                </Select>
                                                {validationErrors[
                                                    field.name
                                                ] && (
                                                    <FormHelperText>
                                                        {
                                                            validationErrors[
                                                                field.name
                                                            ][0]
                                                        }
                                                    </FormHelperText>
                                                )}
                                            </FormControl>
                                        ) : (
                                            <TextField
                                                fullWidth
                                                size="small"
                                                label={field.label}
                                                value={
                                                    contactFormData[
                                                        field.name
                                                    ] || ""
                                                }
                                                error={
                                                    !!validationErrors[
                                                        field.name
                                                    ]
                                                }
                                                helperText={
                                                    validationErrors[field.name]
                                                        ? validationErrors[
                                                              field.name
                                                          ][0]
                                                        : ""
                                                }
                                                onChange={(e) => {
                                                    setContactFormData({
                                                        ...contactFormData,
                                                        [field.name]:
                                                            e.target.value,
                                                    });
                                                    clearValidationError(
                                                        field.name,
                                                    );
                                                }}
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {loadingConsultations && (
                        <div className="col-span-2 flex items-center justify-center gap-3 py-4 bg-blue-50 rounded-lg mt-4">
                            <CircularProgress
                                size={20}
                                className="text-blue-600"
                            />
                            <span className="text-sm font-medium text-blue-700">
                                Cargando consultas...
                            </span>
                        </div>
                    )}
                </div>

                {/* Imagen con información */}
                <div className="relative">
                    <div className="w-[320px] h-full bg-white shadow-xl rounded-2xl p-8">
                        {selectedContact?.payroll?.img_payroll ? (
                            <>
                                <img
                                    src={selectedContact?.payroll?.img_payroll}
                                    alt={selectedContact?.payroll?.name}
                                    className="w-full h-64 object-contain"
                                />
                                <div className="mt-6 text-center">
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        {parsedDescription}
                                    </p>
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="w-full h-64 flex items-center justify-center">
                                    <img
                                        src={seleccione_imagen}
                                        alt="Sin imagen"
                                        className="opacity-60"
                                    />
                                </div>
                                <div className="mt-6 text-center">
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        Selecciona un contacto para ver la
                                        imagen y la descripción.
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div
                className={`grid ${isAliados ? "grid-cols-3" : "grid-cols-2"} gap-4`}
            >
                {/* Autocompletado de Tipo de gestión */}
                <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-100 flex flex-col gap-3">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Tipo de gestión
                    </h2>
                    <Autocomplete
                        disabled={!selectedContact}
                        options={filteredTypeManagement}
                        getOptionLabel={(option) => option?.name || ""}
                        value={selectedTypeManagement}
                        onChange={(event, value) => {
                            setSelectedTypeManagement(value);
                            clearValidationError("type_management_id");
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Tipo de gestion"
                                error={!!validationErrors.type_management_id}
                                helperText={
                                    !selectedContact
                                        ? "Selecciona un contacto primero"
                                        : validationErrors.type_management_id
                                          ? validationErrors
                                                .type_management_id[0]
                                          : ""
                                }
                            />
                        )}
                    />
                </div>

                {/* Selector de Pagaduría (Condicional para Aliados) */}
                {isAliados && (
                    <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-100 flex flex-col gap-3">
                        <h2 className="text-2xl font-bold text-gray-800">
                            Pagaduría de la gestión
                        </h2>
                        <Autocomplete
                            options={payroll}
                            getOptionLabel={(option) => option?.name || ""}
                            value={selectedPayroll}
                            onChange={(event, value) => {
                                setSelectedPayroll(value);
                                clearValidationError("payroll_id");
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    label="Seleccione pagaduría"
                                    error={!!validationErrors.payroll_id}
                                    helperText={
                                        validationErrors.payroll_id
                                            ? validationErrors.payroll_id[0]
                                            : ""
                                    }
                                />
                            )}
                        />
                    </div>
                )}

                {/* Selector de solución en primer contacto */}
                <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-100 flex flex-col gap-3">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Solución primer contacto
                    </h2>
                    <FormControl fullWidth error={!!validationErrors.solution}>
                        <InputLabel id="solucion-label">Solución</InputLabel>
                        <Select
                            disabled={!selectedContact}
                            labelId="solucion-label"
                            id="solucion"
                            value={selectedSolution}
                            label="Solución"
                            onChange={(event) => {
                                setSelectedSolution(event.target.value);
                                clearValidationError("solution");
                            }}
                        >
                            <MenuItem value={true}>Sí</MenuItem>
                            <MenuItem value={false}>No</MenuItem>
                        </Select>
                        {validationErrors.solution && (
                            <FormHelperText>
                                {validationErrors.solution[0]}
                            </FormHelperText>
                        )}
                        <FormHelperText>
                            {!selectedContact
                                ? "Selecciona un contacto primero"
                                : validationErrors.solution
                                  ? validationErrors.solution[0]
                                  : ""}
                        </FormHelperText>
                    </FormControl>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {/* Autocompletado de motivo de consulta */}
                <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-100 flex flex-col gap-3">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Motivo de consulta
                    </h2>
                    <Autocomplete
                        options={filteredConsultation}
                        getOptionLabel={(option) =>
                            `${option?.id || ""} | ${option?.name || ""}`
                        }
                        value={selectedConsultation}
                        onChange={(event, value) => {
                            setSelectedConsultation(value);
                            clearValidationError("consultation_id");
                            setSelectedSpecificConsultation(null);
                        }}
                        disabled={!selectedContact || loadingConsultations}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Consulta"
                                error={!!validationErrors.consultation_id}
                                helperText={
                                    !selectedContact
                                        ? "Selecciona un contacto primero"
                                        : validationErrors.consultation_id
                                          ? validationErrors.consultation_id[0]
                                          : ""
                                }
                                InputProps={{
                                    ...params.InputProps,
                                    endAdornment: (
                                        <>
                                            {loadingConsultations ? (
                                                <CircularProgress size={20} />
                                            ) : null}
                                            {params.InputProps.endAdornment}
                                        </>
                                    ),
                                }}
                            />
                        )}
                    />
                </div>

                {/* Autocompletado de motivo de consulta específica */}
                <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-100 flex flex-col gap-3">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Motivo específico de consulta
                    </h2>
                    <Autocomplete
                        options={filteredSpecific}
                        getOptionLabel={(option, index) => {
                            const pos = filteredSpecific.findIndex(
                                (o) => o.id === option.id,
                            );
                            const numero = pos + 1;
                            return `${
                                option?.consultation?.id || ""
                            }.${numero} | ${option?.name || ""}`;
                        }}
                        value={selectedSpecificConsultation}
                        onChange={(event, value) => {
                            setSelectedSpecificConsultation(value);
                            clearValidationError("specific_id");
                        }}
                        disabled={!selectedContact || loadingConsultations}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Consulta específica"
                                error={!!validationErrors.specific_id}
                                helperText={
                                    !selectedContact
                                        ? "Selecciona un contacto primero"
                                        : validationErrors.consultation_id
                                          ? validationErrors.consultation_id[0]
                                          : ""
                                }
                                InputProps={{
                                    ...params.InputProps,
                                    endAdornment: (
                                        <>
                                            {loadingConsultations ? (
                                                <CircularProgress size={20} />
                                            ) : null}
                                            {params.InputProps.endAdornment}
                                        </>
                                    ),
                                }}
                            />
                        )}
                    />
                </div>
            </div>

            {/* Swichs para enviar sms y wsp */}
            <div className="grid grid-cols-3 gap-4">
                {/* SMS */}
                <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-100 flex flex-col gap-3">
                    <h2 className="text-xl font-bold text-gray-800">
                        Enviar SMS de canal de WhatsApp
                    </h2>
                    <Switch
                        disabled={!selectedContact}
                        checked={sms}
                        onChange={(e) => setSms(e.target.checked)}
                        inputProps={{ "aria-label": "Checkbox demo" }}
                    />
                </div>

                {/* Wolkvox id de la gestión */}
                <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-100 flex flex-col gap-3">
                    <p className="text-xl font-bold text-gray-800">
                        Wolkvox_id de la gestión:
                    </p>
                    <TextField
                        fullWidth
                        id="wolkvox_id"
                        label="Wolkvox ID"
                        value={wolkvox_id}
                        onChange={(e) => {
                            setWolkvox_id(e.target.value);
                            clearValidationError("wolkvox_id");
                        }}
                        multiline
                        error={!!validationErrors.wolkvox_id}
                        helperText={
                            validationErrors.wolkvox_id
                                ? validationErrors.wolkvox_id[0]
                                : ""
                        }
                        disabled={!selectedContact}
                    />
                </div>

                {/* WHATSAPP */}
                <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-100 flex flex-col gap-3">
                    <h2 className="text-xl font-bold text-gray-800">
                        Enviar WhatsApp de recuperar contraseña
                    </h2>
                    <Switch
                        disabled={!selectedContact}
                        checked={wsp}
                        onChange={(e) => setWsp(e.target.checked)}
                        inputProps={{ "aria-label": "Checkbox demo" }}
                    />
                </div>
            </div>

            {/* Observaciones */}
            <div className="bg-white shadow-lg rounded-xl p-6 border border-gray-100 flex flex-col gap-3">
                <h2 className="text-2xl font-bold text-gray-800">
                    Observaciones
                </h2>
                <TextField
                    id="standard-multiline-static"
                    label="Escriba aquí"
                    value={comments}
                    onChange={(e) => setObservations(e.target.value)}
                    multiline
                    rows={4}
                    disabled={!selectedContact}
                />
            </div>

            {/* Botón Guardar */}
            <div className="flex items-center justify-center mt-10">
                <Button
                    variant="contained"
                    onClick={onSave}
                    disabled={!selectedContact || !can("management.create")}
                >
                    Guardar
                </Button>
            </div>

            {/* Boton flotante */}
            <div className="fixed bottom-20 right-10 z-50">
                <SpeedDialButton actions={actions} />
            </div>

            <Agent />

            {/* POPUP DE CASOS ESPECIALES */}
            <FormSpecialCases
                isOpen={openSpecialCases}
                setIsOpen={setOpenSpecialCases}
                selectedContact={selectedContactSpecial}
                formData={formDataSpecialCases}
                setFormData={setFormDataSpecialCases}
                validationErrors={validationErrorsSpecial}
                handleSubmit={handleSubmitSpecialCases}
                clearFieldError={clearFieldErrorSpecialCases}
                openSearchContact={openSearchContact}
                setOpenSearchContact={setOpenSearchContact}
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

            {/* POPUP DE BUSCADOR CONTACT */}
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

            {/* Snackbar para alertar al agente que hay errores en el formulario */}
            <Snackbar
                open={Object.keys(validationErrors).length > 0}
                autoHideDuration={9000}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
                <Alert severity="error" variant="filled">
                    Corrige los errores del formulario
                </Alert>
            </Snackbar>
        </div>
    );
};

export default AddManagement;
