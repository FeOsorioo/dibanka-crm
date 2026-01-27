import * as yup from "yup";

export const fields = [
    {
        name: "campaign_id",
        label: "Campaña",
        type: "select",
        options: [
            { value: 1, label: "Aliados" },
            { value: 2, label: "Afiliados" },
        ],
    },
    { name: "payroll_id", label: "Pagaduría", type: "select", options: [] },
    { name: "entity_id", label: "Entidad", type: "select", options: [] },
    { name: "name", label: "Nombre", type: "text" },
    { name: "email", label: "Correo", type: "text" },
    { name: "phone", label: "Teléfono", type: "text" },
    { name: "update_phone", label: "Celular actualizado", type: "text" },
    {
        name: "identification_type",
        label: "Tipo de identificación",
        type: "select",
        options: [
            { value: "CEDULA DE CIUDADANIA", label: "CÉDULA DE CIUDADANÍA" },
            { value: "NIT", label: "NIT" },
            { value: "PASAPORTE", label: "PASAPORTE" },
            { value: "CEDULA DE EXTRANJERIA", label: "CÉDULA DE EXTRANJERÍA" },
        ],
    },
    {
        name: "identification_number",
        label: "Número de identificación",
        type: "text",
    },
];

export const userSchema = yup.object().shape({
    campaign_id: yup.string().required("La campaña es obligatorio"),
    payroll_id: yup.string().required("La pagaduría es obligatorio"),
    entity_id: yup.string().required("La entidad es obligatoria"),
    name: yup
        .string()
        .required("El nombre es obligatorio"),
    phone: yup.string().required("El teléfono es obligatorio"),
    email: yup.string().required("El correo electrónico es obligatorio"),
    update_phone: yup
        .string()
        .required("El celular actualizado es obligatorio"),
    identification_type: yup.string().required("El tipo es obligatorio"),
    identification_number: yup
        .string()
        .required("El número de identificación es obligatorio"),
});

export const columns = [
    { header: "ID", key: "id" },
    { header: "Campaña", key: "campaign.name" },
    { header: "Pagaduría", key: "payroll.name" },
    { header: "Entidad", key: "entity.name" },
    { header: "Nombre", key: "name" },
    { header: "Correo", key: "email" },
    { header: "Teléfono", key: "phone" },
    { header: "Celular actualizado", key: "update_phone" },
    { header: "Tipo de identificación", key: "identification_type" },
    { header: "Número de identificación", key: "identification_number" },
];

// Opciones de filtro para el componente FilterSearch
export const filterOptions = [
    { value: "identification_number", label: "Número de identificación" },
    { value: "name", label: "Nombre" },
    { value: "email", label: "Correo" },
    { value: "phone", label: "Teléfono" },
    { value: "payroll", label: "Pagaduría" },
    { value: "campaign", label: "Campaña" },
];