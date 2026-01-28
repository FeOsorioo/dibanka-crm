import {
    X,
    Clock,
    User,
    Calendar,
    ChevronLeft,
    ChevronRight,
} from "lucide-react";
import { useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

const HistoryModal = ({
    isOpen,
    onClose,
    contact,
    history,
    loading,
    currentPage,
    totalPages,
    totalItems,
    perPage,
    onPageChange,
}) => {
    // Cerrar con ESC
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === "Escape") onClose();
        };
        if (isOpen) {
            document.addEventListener("keydown", handleEsc);
            document.body.style.overflow = "hidden";
        }
        return () => {
            document.removeEventListener("keydown", handleEsc);
            document.body.style.overflow = "unset";
        };
    }, [isOpen, onClose]);

    const getActionColor = (action) => {
        switch (action) {
            case "created":
                return "bg-green-100 text-green-700 border-green-300";
            case "updated":
                return "bg-blue-100 text-blue-700 border-blue-300";
            case "deleted":
                return "bg-red-100 text-red-700 border-red-300";
            default:
                return "bg-gray-100 text-gray-700 border-gray-300";
        }
    };

    const getActionLabel = (action) => {
        const labels = {
            created: "Creado",
            updated: "Actualizado",
            deleted: "Eliminado",
        };
        return labels[action] || action;
    };

    const formatFieldName = (field) => {
        const fieldNames = {
            name: "Nombre",
            email: "Correo",
            phone: "Teléfono",
            update_phone: "Teléfono actualizado",
            identification_type: "Tipo de identificación",
            identification_number: "Número de identificación",
            payroll_id: "Pagaduría",
            status: "Estado",
            is_active: "Estado",
            user_id: "Usuario",
            type_management_id: "Tipo de gestión",
            contact_id: "Contacto",
            solution: "Solución",
            consultation_id: "Consulta",
            campaign_id: "Campaña",
            entity_id: "Entidad",
            created_at: "Fecha de creación",
            updated_at: "Fecha de actualización",
            specific_id: "Consulta específica",
            comments: "Comentarios",
            solution_date: "Fecha de solución",
            monitoring_id: "Seguimiento",
        };
        return (
            fieldNames[field] ||
            field.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
        );
    };

    const formatDisplayValue = (field, value) => {
        if (
            value &&
            typeof value === "string" &&
            value !== "1" &&
            value !== "0"
        ) {
            return value;
        }

        if (value === null || value === undefined) {
            return "N/A";
        }

        return String(value);
    };

    // --- Variantes de Animación ---

    const panelVariants = {
        hidden: {
            x: "100%",
            transition: { type: "tween", duration: 0.3, ease: "easeInOut" },
        },
        visible: {
            x: 0,
            transition: { type: "spring", damping: 25, stiffness: 200 },
        },
        exit: {
            x: "100%",
            transition: { type: "tween", duration: 0.2, ease: "easeIn" },
        },
    };

    const overlayVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 0.5 },
        exit: { opacity: 0 },
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08,
                delayChildren: 0.1,
            },
        },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "backOut" } },
    };

    const fadeVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 },
        exit: { opacity: 0 },
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-80 flex justify-end">
                    {/* Overlay */}
                    <motion.div
                        variants={overlayVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="absolute inset-0 bg-black z-40"
                        onClick={onClose}
                    />

                    {/* Panel lateral */}
                    <motion.div
                        variants={panelVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="relative h-full w-full md:w-[600px] lg:w-[45%] rounded-l-3xl rounded-lt-3xl bg-gradient-to-br from-blue-50 to-cyan-50 shadow-2xl z-50 flex flex-col"
                    >
                        {/* Header */}
                        <div className="bg-gradient-primary p-5 shadow-lg flex-shrink-0 rounded-tl-3xl">
                            <div className="flex items-center justify-between">
                                <div className="flex-1">
                                    <h2 className="text-2xl font-bold text-white mb-2">
                                        Historial de Cambios
                                    </h2>
                                    {contact && (
                                        <div className="text-white/90 text-sm flex gap-2">
                                            <p className="font-semibold">
                                                {contact.name}
                                            </p>
                                            <p className="text-white/80">
                                                ID: {contact.id}
                                            </p>
                                        </div>
                                    )}
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={onClose}
                                    className="ml-4 p-2 hover:bg-white/20 rounded-full transition-colors duration-200"
                                >
                                    <X className="w-6 h-6 text-white" />
                                </motion.button>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
                            <AnimatePresence mode="wait">
                                {loading ? (
                                    <motion.div
                                        key="loading"
                                        variants={fadeVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                        className="flex items-center justify-center h-full"
                                    >
                                        <div className="text-center">
                                            <motion.div
                                                animate={{ rotate: 360 }}
                                                transition={{
                                                    repeat: Infinity,
                                                    duration: 1,
                                                    ease: "linear",
                                                }}
                                                className="rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"
                                            />
                                            <p className="text-gray-600">
                                                Cargando historial...
                                            </p>
                                        </div>
                                    </motion.div>
                                ) : history.length === 0 ? (
                                    <motion.div
                                        key="empty"
                                        variants={fadeVariants}
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                        className="flex items-center justify-center h-full"
                                    >
                                        <div className="text-center">
                                            <Clock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                            <p className="text-gray-600 text-lg">
                                                No hay cambios registrados
                                            </p>
                                        </div>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="history-list"
                                        variants={containerVariants}
                                        initial="hidden"
                                        animate="visible"
                                        className="space-y-4"
                                    >
                                        <div className="relative">
                                            {history.map((item, index) => (
                                                <motion.div
                                                    key={item.id}
                                                    variants={itemVariants}
                                                    className="relative pb-8"
                                                >
                                                    {/* Línea vertical */}
                                                    {index !==
                                                        history.length - 1 && (
                                                        <motion.div
                                                            initial={{scaleY: 0}}
                                                            animate={{scaleY: 1}}
                                                            transition={{
                                                                delay:
                                                                    0.2 +
                                                                    index *
                                                                        0.08,
                                                                duration: 0.5,
                                                            }}
                                                            className="absolute left-[21px] top-[40px] bottom-0 w-0.5 bg-gradient-to-b from-purple-300 to-cyan-300 origin-top"
                                                        />
                                                    )}

                                                    {/* Punto en timeline */}
                                                    <motion.div
                                                        whileHover={{
                                                            scale: 1.3,
                                                        }}
                                                        className="absolute left-[13px] top-[8px] w-[18px] h-[18px] rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 border-4 border-white shadow-lg z-10"
                                                    />

                                                    {/* Card de cambio */}
                                                    <div className="ml-14 bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-200">
                                                        {/* Header del card */}
                                                        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-3 border-b border-gray-200">
                                                            <div className="flex items-center justify-between">
                                                                <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getActionColor(item.action)}`}>
                                                                    {getActionLabel(item.action)}
                                                                </span>
                                                                <div className="flex items-center gap-3 text-xs text-gray-600">
                                                                    <div className="flex items-center gap-1">
                                                                        <Calendar className="w-3 h-3" />
                                                                        <span>{item.created_at_human}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Body del card */}
                                                        <div className="p-4">
                                                            {/* Usuario */}
                                                            {item.user && (
                                                                <div className="flex items-center gap-2 mb-3 pb-3 border-b border-gray-100">
                                                                    <User className="w-4 h-4 text-purple-600" />
                                                                    <span className="text-sm font-medium text-gray-700">
                                                                        {item.user.name}
                                                                    </span>
                                                                    <span className="text-xs text-gray-500">
                                                                        ({item.user.email})
                                                                    </span>
                                                                </div>
                                                            )}

                                                            {/* Cambios */}
                                                            {item.changes && item.changes.length > 0 && (
                                                                    <div className="space-y-3">
                                                                        {item.changes.map((change, idx) => (
                                                                                <div key={idx} className="bg-gray-50 rounded-lg p-3 border border-transparent hover:border-purple-200 transition-colors">
                                                                                    <p className="text-xs font-semibold text-purple-700 mb-2">
                                                                                        {formatFieldName(change.field)}
                                                                                    </p>

                                                                                    {item.action === "updated" ? (
                                                                                        <div className="grid grid-cols-2 gap-3">
                                                                                            <div>
                                                                                                <p className="text-xs text-gray-500 mb-1">
                                                                                                    Anterior:
                                                                                                </p>
                                                                                                <p
                                                                                                    className="text-sm text-red-600 line-through truncate"
                                                                                                    title={formatDisplayValue(change.field, change.display_old )}
                                                                                                >
                                                                                                    {formatDisplayValue(change.field, change.display_old )}
                                                                                                </p>
                                                                                            </div>
                                                                                            <div>
                                                                                                <p className="text-xs text-gray-500 mb-1"> Nuevo: </p>
                                                                                                <p className="text-sm text-green-600 font-medium truncate" 
                                                                                                    title={formatDisplayValue(change.field, change.display_new)} > 
                                                                                                    {formatDisplayValue(change.field, change.display_new)} 
                                                                                                </p>
                                                                                            </div>
                                                                                        </div>
                                                                                    ) : (
                                                                                        <p className="text-sm text-gray-700"> {formatDisplayValue(change.field, change.display_value || change.display_old || change.display_new)} </p>
                                                                                    )}
                                                                                </div>
                                                                            )
                                                                        )}
                                                                        <div className="mt-3 pt-3 border-t border-gray-200 flex flex-wrap items-center gap-4 text-xs text-gray-500">
                                                                            <div className="flex items-center gap-1">
                                                                                <Calendar className="w-3.5 h-3.5 text-purple-500" />
                                                                                <span> {item.created_at} </span>
                                                                            </div>

                                                                            <div className="flex items-center gap-1">
                                                                                <span className="font-medium text-gray-600"> IP </span>
                                                                                <span> {item.ip_address} 
                                                                                </span>
                                                                            </div>

                                                                            <div className="flex items-center gap-1 truncate max-w-full">
                                                                                <span className="font-medium text-gray-600"> Dispositivo </span>
                                                                                <span className="truncate" title={item.user_agent} > {item.user_agent} </span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Footer con paginación */}
                        {!loading && history.length > 0 && totalPages > 1 && (
                            <div className="bg-white border-t border-gray-200 px-6 py-4 shadow-lg flex-shrink-0">
                                <div className="flex items-center justify-between">
                                    <p className="text-sm text-gray-600">
                                        Mostrando{" "}
                                        {(currentPage - 1) * perPage + 1} -{" "}
                                        {Math.min(
                                            currentPage * perPage,
                                            totalItems
                                        )}{" "}
                                        de {totalItems}
                                    </p>
                                    <div className="flex items-center gap-2">
                                        <motion.button
                                            whileHover={{ x: -3 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() =>
                                                onPageChange(currentPage - 1)
                                            }
                                            disabled={currentPage === 1}
                                            className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-cyan-500 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all duration-200"
                                        >
                                            <ChevronLeft className="w-5 h-5" />
                                        </motion.button>
                                        <span className="text-sm font-medium text-gray-700 min-w-[100px] text-center">
                                            Página {currentPage} de {totalPages}
                                        </span>
                                        <motion.button
                                            whileHover={{ x: 3 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() =>
                                                onPageChange(currentPage + 1)
                                            }
                                            disabled={
                                                currentPage === totalPages
                                            }
                                            className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-cyan-500 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all duration-200"
                                        >
                                            <ChevronRight className="w-5 h-5" />
                                        </motion.button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default HistoryModal;
