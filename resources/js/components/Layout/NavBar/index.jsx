import { useState, useContext } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import {
    Tooltip,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    IconButton,
} from "@mui/material";
import { FaUserCircle } from "react-icons/fa";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoIosLogOut } from "react-icons/io";
import { PiCityDuotone } from "react-icons/pi";
import { IoHomeOutline } from "react-icons/io5";
import {
    HiOutlineRectangleGroup,
    HiOutlineIdentification,
} from "react-icons/hi2";
import { MdOutlineFolderSpecial } from "react-icons/md";
import { VscTools } from "react-icons/vsc";
import { HiOutlineQuestionMarkCircle } from "react-icons/hi2";
import logo from "@assets/logo.png";

import { AuthContext } from "@context/AuthContext";
import { useCan } from "@hooks/useCan";
import { useTour } from "@context/TourContext";

const NavBar = ({
    id_contact,
    id_management,
    id_special_cases,
    id_config,
    id_entity,
}) => {
    const { user, handleLogout } = useContext(AuthContext);
    const { startTour } = useTour();
    const { can } = useCan();

    const navigate = useNavigate();
    const location = useLocation();
    const [isOpenMenu, setIsOpenMenu] = useState(false);

    // 🔹 MENÚ PRINCIPAL — módulos operativos
    const MENU_ITEMS = [
        {
            id: "dashboard",
            label: "Inicio",
            path: "/home",
            icon: <IoHomeOutline className="text-white w-6 h-auto" />,
            permission: "any",
        },
        {
            id: id_contact,
            label: "Contactos",
            path: "/contactos",
            icon: <HiOutlineIdentification className="text-white w-6 h-auto" />,
            permission: "contact.view",
        },
        {
            id: id_management,
            label: "Gestiones",
            path: "/gestiones",
            icon: <HiOutlineRectangleGroup className="text-white w-6 h-auto" />,
            permission: "management.view",
        },
        {
            id: id_special_cases,
            label: "Casos especiales",
            path: "/casos_especiales",
            icon: <MdOutlineFolderSpecial className="text-white w-6 h-auto" />,
            permission: "special_cases.view",
        },
        {
            id: id_entity,
            label: "Entidades",
            path: "/entidades",
            icon: <PiCityDuotone className="text-white w-6 h-auto" />,
            permission: "contact.view",
        },
    ];

    // ⚙️ MÓDULOS DE CONFIGURACIÓN (permite granularidad)
    const CONFIG_MODULES = [
        { label: "Usuarios", permission: "config.user.edit" },
        { label: "Pagadurías", permission: "config.payroll.edit" },
        { label: "Consultas", permission: "config.consultation.edit" },
        { label: "Consultas Específicas", permission: "config.specific.edit" },
        {
            label: "Tipos de Gestiones",
            permission: "config.typeManagement.edit",
        },
        { label: "Seguimientos", permission: "config.monitoring.edit" },
        { label: "Perfiles y Roles", permission: "config.role.edit" },
    ];

    const hasConfigAccess = CONFIG_MODULES.some((mod) => can(mod.permission));

    //  Filtrado de menús por permisos
    const accessibleItems = MENU_ITEMS.filter((item) => can(item.permission));

    return (
        <div className="flex w-full h-full">
            {/*
          MENÚ LATERAL — se mantiene el diseño actual
      */}
            <motion.div
                initial={{ width: "2.5rem" }}
                animate={{ width: isOpenMenu ? "16rem" : "3.5rem" }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="h-screen fixed flex flex-col left-0 top-0  
          bg-gradient-secondary text-white z-50 shadow-custom"
                onMouseEnter={() => setIsOpenMenu(true)}
                onMouseLeave={() => setIsOpenMenu(false)}
            >
                {/* Botón menú hamburguesa */}
                <button
                    className="mb-7 mt-2 px-4 flex items-center"
                    onClick={() => setIsOpenMenu((prev) => !prev)}
                >
                    <RxHamburgerMenu className="w-6 h-auto" />
                </button>

                {/* Lista de módulos principales */}
                <List className="flex flex-col justify-between h-full">
                    <div>
                        {/* 🔸 Módulos operativos */}
                        {accessibleItems.map((item) => (
                            <ListItem
                                disablePadding
                                key={item.path}
                                id={item.id}
                            >
                                <ListItemButton
                                    onClick={() => navigate(item.path)}
                                    selected={location.pathname === item.path}
                                >
                                    <Tooltip
                                        title={item.label}
                                        placement="right"
                                    >
                                        <ListItemIcon>{item.icon}</ListItemIcon>
                                    </Tooltip>
                                    {isOpenMenu && (
                                        <ListItemText primary={item.label} />
                                    )}
                                </ListItemButton>
                            </ListItem>
                        ))}
                    </div>

                    {/* 🔧 Configuración (si el usuario tiene algún permiso config.*) */}
                    {hasConfigAccess && (
                        <ListItem disablePadding>
                            <ListItemButton
                                id={id_config}
                                onClick={() => navigate("/configuraciones")}
                                selected={
                                    location.pathname === "/configuraciones"
                                }
                            >
                                <Tooltip
                                    title="Configuración"
                                    placement="right"
                                >
                                    <ListItemIcon>
                                        <VscTools className="text-white w-6 h-auto" />
                                    </ListItemIcon>
                                </Tooltip>
                                {isOpenMenu && (
                                    <ListItemText primary="Configuración" />
                                )}
                            </ListItemButton>
                        </ListItem>
                    )}
                </List>
            </motion.div>

            {/*
          HEADER SUPERIOR
      */}
            <header
                className="bg-gradient-primary m-6 h-[3.5rem] w-full
          rounded-[4vw] flex justify-between ml-20
          items-center px-6 text-white pl-10 pr-10"
            >
                <button onClick={() => navigate("/home")}>
                    <img className="w-24" src={logo} alt="Logo" />
                </button>

                <div className="flex items-center space-x-6">
                    {/* Botón de Inicio Guiado */}
                    <Tooltip title="Iniciar Tour Guiado">
                        <IconButton
                            onClick={() => {
                                startTour();
                            }}
                            size="small"
                            className="hover:bg-white/10 transition-colors"
                            sx={{
                                color: "white",
                                "&:hover": {
                                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                                },
                            }}
                        >
                            <HiOutlineQuestionMarkCircle className="w-6 h-6" />
                        </IconButton>
                    </Tooltip>

                    <button className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                        <FaUserCircle className="w-6 h-6 text-white" />
                        <h2 className="text-lg font-semibold">
                            {user?.name ?? "Usuario indefinido"}
                        </h2>
                    </button>

                    <div className="flex items-center w-8 h-8">
                        <Tooltip title="Cerrar Sesión">
                            <IconButton
                                onClick={() => {
                                    handleLogout();
                                    navigate("/");
                                }}
                                size="small"
                                className="hover:bg-white/10 transition-colors"
                                sx={{
                                    color: "white",
                                    "&:hover": {
                                        backgroundColor:
                                            "rgba(255, 255, 255, 0.1)",
                                    },
                                }}
                            >
                                <IoIosLogOut className="w-7 h-7" />
                            </IconButton>
                        </Tooltip>
                    </div>
                </div>
            </header>
        </div>
    );
};

export default NavBar;
