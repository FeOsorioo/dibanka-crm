import * as Yup from "yup";

export const filterOptions = [
    { label: "Nombre", value: "name" },
    { label: "Teléfono", value: "phone" },
    { label: "Email", value: "email" },
    { label: "NIT", value: "nit" },
];

export const columns = [
    { header: "Nombre", key: "name" },
    { header: "Teléfono", key: "phone" },
    { header: "Email", key: "email" },
    { header: "NIT", key: "nit" },
    { header: "Descripción", key: "description" },
];

export const fields = [
    {
        name: "name",
        label: "Nombre",
        type: "text",
        placeholder: "Nombre de la entidad",
    },
    {
        name: "phone",
        label: "Teléfono",
        type: "text",
        placeholder: "Teléfono de contacto",
    },
    {
        name: "email",
        label: "Email",
        type: "email",
        placeholder: "Correo electrónico",
    },
    {
        name: "nit",
        label: "NIT",
        type: "text",
        placeholder: "NIT de la entidad",
    },
    {
        name: "description",
        label: "Descripción",
        type: "textarea",
        placeholder: "Descripción opcional",
    },
];

export const userSchema = Yup.object().shape({
    name: Yup.string().required("El nombre es requerido"),
    phone: Yup.string().required("El teléfono es requerido"),
    email: Yup.string()
        .email("Email inválido")
        .required("El email es requerido"),
    nit: Yup.string().required("El NIT es requerido"),
    description: Yup.string().nullable(),
});
