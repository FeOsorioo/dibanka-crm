import React, { useState, forwardRef, useEffect, useContext } from "react";
import { useCan } from "@hooks/useCan";

import { AuthContext } from "@context/AuthContext";
import Button from "@components/ui/Button";
import PrettyFileInput from "@components/forms/PrettyFileInput";
import { Dialog, Slide } from "@mui/material";
import {
    Autocomplete,
    TextField,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Snackbar,
    Alert,
    Typography,
    Box,
    IconButton,
} from "@mui/material";
import { IoSearch } from "react-icons/io5";

const Transition = forwardRef(function Transition(props, ref) {
    return <Slide direction="left" ref={ref} {...props} />;
});

const FormAdd = ({
    isOpen,
    setIsOpen,
    title,
    formData,
    setFormData,
    handleSubmit,
    loading,
    validationErrors,
    fields,
    schema,
    admin,
}) => {
    const [errors, setErrors] = useState({});
    const { user } = useContext(AuthContext);
    const { can, canAny } = useCan();

    // Crear estado inicial basado en la estructura de formData
    const getInitialFormData = () => {
        const initialState = {};
        Object.keys(formData).forEach((key) => {
            // Determinar el valor inicial según el tipo de dato
            if (Array.isArray(formData[key])) {
                initialState[key] = [];
            } else if (typeof formData[key] === "boolean") {
                initialState[key] = false;
            } else {
                initialState[key] = "";
            }
        });
        return initialState;
    };

    const [initialFormState] = useState(getInitialFormData());

    // ✅ Validación dinámica usando el esquema recibido
    const validateField = async (field, value) => {
        if (!schema) return;
        try {
            await schema.validateAt(field, { [field]: value });
            setErrors((prevErrors) => ({ ...prevErrors, [field]: "" }));
        } catch (error) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                [field]: error.message,
            }));
        }
    };

    const handleCloseModal = () => {
        setIsOpen(false);
        setErrors({});
        // Resetear a los valores iniciales correctos
        setFormData({ ...initialFormState });
    };

    // Efecto para resetear el formulario cuando se abre/cierra el modal
    useEffect(() => {
        if (!isOpen) {
            // Limpiar errores cuando se cierra el modal
            setErrors({});
        }
    }, [isOpen]);

    return (
        <Dialog
            open={isOpen}
            TransitionComponent={Transition}
            onClose={handleCloseModal}
            sx={{
                "& .MuiDialog-paper": {
                    position: "fixed",
                    right: 0,
                    top: 0,
                    height: "100vh",
                    maxHeight: "100vh",
                    width: "45%",
                    maxWidth: "none",
                    margin: 0,
                    borderRadius: "12px 0 0 12px",
                },
            }}
        >
            <div className="flex flex-col items-right justify-center p-10 w-full text-secondary-dark">
                <button
                    className="absolute right-14 top-10"
                    onClick={handleCloseModal}
                >
                    <h1 className="w-8 h-8 font-semibold">X</h1>
                </button>

                <h2 className="text-2xl font-bold mb-4">
                    {formData?.id ? "Editar" : "Agregar"} {title}
                </h2>

                <form onSubmit={handleSubmit}>
                    {fields.map((field) => {
                        // Ocultar campo si está en edición y el campo tiene hideOnEdit
                        if (formData?.id && field.hideOnEdit) return null;

                        if (formData?.id && field.name === "is_active")
                            return null;

                        return (
                            <div key={field.name} className="mb-4 ">
                                <h2 className="text-lg mb-2">{field.label}</h2>

                                {/* Render dinámico según tipo */}
                                {field.type === "checkbox" ? (
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            checked={!!formData[field.name]}
                                            onChange={(e) => {
                                                const value = e.target.checked;
                                                setFormData({
                                                    ...formData,
                                                    [field.name]: value,
                                                });
                                                validateField(
                                                    field.name,
                                                    value,
                                                );
                                            }}
                                            disabled={loading}
                                        />
                                        <span>{field.label}</span>
                                    </label>
                                ) : field.type === "boolean-select" ? (
                                    <select
                                        className="border rounded p-2 w-full"
                                        value={
                                            formData[field.name]
                                                ? "true"
                                                : "false"
                                        }
                                        onChange={(e) => {
                                            const value =
                                                e.target.value === "true";
                                            setFormData({
                                                ...formData,
                                                [field.name]: value,
                                            });
                                            validateField(field.name, value);
                                        }}
                                        disabled={loading}
                                    >
                                        <option value="true">Activo</option>
                                        <option value="false">Inactivo</option>
                                    </select>
                                ) : field.type === "autocomplete" ? (
                                    <Autocomplete
                                        id={`autocomplete-${field.name}`}
                                        options={field.options || []}
                                        value={
                                            field.options?.find(
                                                (opt) =>
                                                    String(opt.value) ===
                                                    String(
                                                        formData[field.name],
                                                    ),
                                            ) || null
                                        }
                                        getOptionLabel={(option) =>
                                            option.label || ""
                                        }
                                        isOptionEqualToValue={(option, value) =>
                                            String(option.value) ===
                                            String(value.value)
                                        }
                                        onChange={(_, newValue) => {
                                            // Guardamos solo el 'value' seleccionado o null si no hay selección
                                            setFormData({
                                                ...formData,
                                                [field.name]: newValue
                                                    ? newValue.value
                                                    : null,
                                            });
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                variant="outlined"
                                                label="Seleccione aquí"
                                                placeholder="Seleccione..."
                                            />
                                        )}
                                    />
                                ) : field.type === "multiselect" ? (
                                    <Autocomplete
                                        multiple
                                        id={`multiselect-${field.name}`}
                                        options={field.options || []}
                                        value={(formData[field.name] || [])
                                            .map((id) =>
                                                field.options?.find(
                                                    (opt) => opt.value === id,
                                                ),
                                            )
                                            .filter(Boolean)}
                                        getOptionLabel={(option) =>
                                            option.label || ""
                                        }
                                        isOptionEqualToValue={(option, value) =>
                                            option.value === value.value
                                        }
                                        onChange={(_, newValue) => {
                                            // Guardamos un array de IDs
                                            const selectedIds = newValue.map(
                                                (item) => item.value,
                                            );
                                            setFormData({
                                                ...formData,
                                                [field.name]: selectedIds,
                                            });
                                            validateField(
                                                field.name,
                                                selectedIds,
                                            );
                                        }}
                                        renderInput={(params) => (
                                            <TextField
                                                {...params}
                                                variant="outlined"
                                                label={field.label}
                                                placeholder="Seleccione una o más opciones..."
                                            />
                                        )}
                                        disabled={loading || admin}
                                    />
                                ) : field.type === "select" ? (
                                    <>
                                        <FormControl
                                            fullWidth
                                            disabled={field.disabled || false}
                                        >
                                            <InputLabel id="demo-simple-select-standard-label">
                                                {field.label}
                                            </InputLabel>
                                            <Select
                                                labelId="demo-simple-select-standard-label"
                                                id="demo-simple-select-standard"
                                                value={
                                                    formData[field.name] ?? ""
                                                }
                                                onChange={(e) => {
                                                    setFormData({
                                                        ...formData,
                                                        [field.name]:
                                                            e.target.value,
                                                    });
                                                    validateField(
                                                        field.name,
                                                        e.target.value,
                                                    );
                                                }}
                                                label={field.name}
                                                disabled={loading || admin}
                                            >
                                                {(field.options || []).map(
                                                    (option) => (
                                                        <MenuItem
                                                            key={option.value}
                                                            value={option.value}
                                                        >
                                                            {option.label}
                                                        </MenuItem>
                                                    ),
                                                )}
                                            </Select>
                                        </FormControl>
                                    </>
                                ) : field.type === "file" ? (
                                    <PrettyFileInput
                                        name={field.name}
                                        label={field.label}
                                        accept="image/*"
                                        onChange={(file) => {
                                            setFormData({
                                                ...formData,
                                                [field.name]: file,
                                            });
                                        }}
                                    />
                                ) : field.type === "additional" ? (
                                    <Box
                                        sx={{
                                            backgroundColor: "#f5f5f5",
                                            borderLeft: "4px solid #1976d2",
                                            padding: 2,
                                            borderRadius: 1,
                                            mb: 2,
                                        }}
                                    >
                                        <Typography
                                            variant="subtitle1"
                                            color="text.primary"
                                            fontWeight="500"
                                        >
                                            {field.text}
                                        </Typography>
                                    </Box>
                                ) : field.type === "search-input" ? (
                                    <div className="flex gap-2">
                                        <TextField
                                            fullWidth
                                            id={`input-${field.name}`}
                                            variant="outlined"
                                            label={field.label}
                                            value={
                                                formData[field.displayField] ||
                                                ""
                                            }
                                            InputProps={{
                                                readOnly: true,
                                            }}
                                            disabled={loading || admin}
                                        />
                                        <IconButton
                                            onClick={field.onSearch}
                                            disabled={loading || admin}
                                            sx={{
                                                backgroundColor: "#eff6ff",
                                                borderRadius: "8px",
                                                border: "1px solid #bfdbfe",
                                                "&:hover": {
                                                    backgroundColor: "#dbeafe",
                                                },
                                            }}
                                        >
                                            <IoSearch className="text-blue-600 w-6 h-6" />
                                        </IconButton>
                                    </div>
                                ) : (
                                    <TextField
                                        fullWidth
                                        id={`input-${field.name}`}
                                        variant="outlined"
                                        type={field.type}
                                        {...((field.withLabel ?? true)
                                            ? { label: field.label }
                                            : {})}
                                        {...(field.type === "longtext"
                                            ? { multiline: true, rows: 7 }
                                            : {})}
                                        value={formData[field.name] ?? ""}
                                        onChange={(e) => {
                                            setFormData({
                                                ...formData,
                                                [field.name]: e.target.value,
                                            });
                                            validateField(
                                                field.name,
                                                e.target.value,
                                            );
                                        }}
                                        disabled={loading || admin}
                                    />
                                )}

                                {/* Errores */}
                                {errors[field.name] && (
                                    <Alert severity="error" className="mt-2">
                                        {errors[field.name]}
                                    </Alert>
                                )}
                                {validationErrors[field.name] && (
                                    <Alert severity="error" className="mt-2">
                                        {Array.isArray(
                                            validationErrors[field.name],
                                        )
                                            ? validationErrors[field.name].map(
                                                  (error, index) => (
                                                      <div key={index}>
                                                          {error}
                                                      </div>
                                                  ),
                                              )
                                            : validationErrors[field.name]}
                                    </Alert>
                                )}
                            </div>
                        );
                    })}

                    <Button
                        type="submit"
                        text="Guardar"
                        disabled={loading || admin}
                    />

                    {formData.role == 1 &&
                        !user.roles?.includes("Administrador") && (
                            <Snackbar
                                open={formData.role == 1}
                                autoHideDuration={5000}
                                anchorOrigin={{
                                    vertical: "button",
                                    horizontal: "left",
                                }}
                            >
                                <Alert severity="error" variant="filled">
                                    Este registro no se puede editar porque es
                                    del administrador
                                </Alert>
                            </Snackbar>
                        )}
                </form>
            </div>
        </Dialog>
    );
};

export default FormAdd;
