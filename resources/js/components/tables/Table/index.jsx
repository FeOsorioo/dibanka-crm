import React, { useState, useContext } from "react";
import { AuthContext } from "@context/AuthContext";
import {
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    TableContainer,
    TablePagination,
    TableSortLabel,
    Paper,
    Tooltip,
} from "@mui/material";
import { CiBoxList } from "react-icons/ci";
import { FaToggleOff, FaToggleOn } from "react-icons/fa6";
import { GoEye } from "react-icons/go";
import { IoFootstepsOutline } from "react-icons/io5";
import { CiEdit } from "react-icons/ci";
import { MdPersonAddAlt1 } from "react-icons/md";
import { GoHistory } from "react-icons/go";

// 🔎 Función para obtener valores anidados
export const getNestedValue = (obj, path) =>
    path.split(".").reduce((acc, key) => acc?.[key], obj) ?? "—";

function descendingComparator(a, b, orderBy) {
    if (getNestedValue(b, orderBy) < getNestedValue(a, orderBy)) return -1;
    if (getNestedValue(b, orderBy) > getNestedValue(a, orderBy)) return 1;
    return 0;
}
function getComparator(order, orderBy) {
    return order === "desc"
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}
function stableSort(array, comparator) {
    const stabilized = array.map((el, index) => [el, index]);
    stabilized.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) return order;
        return a[1] - b[1];
    });
    return stabilized.map((el) => el[0]);
}

const MuiTable = ({
    columns,
    data,
    actions = false,
    onEdit,
    onDelete,
    onView,
    onManagement,
    onMonitoring,
    onSelectRecord,
    onHistory,
    history = false,
    edit = true,
    view = false,
    management = false,
    monitoring = false,
    onActiveOrInactive = true,
    totalItems,
    rowsPerPage,
    currentPage,
    fetchPage,
    paginationSection = true,
    selectRecord,
    width = "90%",

    //ID de los botones
    idSelectRecord,
    idOnActiveOrInactive,
    idMonitoring,
    idEdit,
    idView,
    idManagement,
    idHistory,
}) => {
    const { user } = useContext(AuthContext);

    const [order, setOrder] = useState("desc");
    const [orderBy, setOrderBy] = useState(columns[0].key);

    const handleRequestSort = (property) => {
        const isDesc = orderBy === property && order === "desc";
        setOrder(isDesc ? "asc" : "desc");
        setOrderBy(property);
    };

    const handleChangePage = (_, newPage) => {
        fetchPage(newPage + 1);
    };

    const sortedData = stableSort(data, getComparator(order, orderBy));

    const filteredData = !user.roles?.includes("Administrador")
        ? sortedData.filter((item) => item.roles !== 1)
        : sortedData;

    return (
        <Paper
            sx={{
                width,
                overflow: "hidden",
                borderRadius: 3,
                mx: "auto",
                marginRight: 6,
            }}
            className="mt-6"
        >
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow className="bg-gradient-primary">
                            {actions && (
                                <TableCell
                                    align="center"
                                    sx={{
                                        color: "white",
                                        fontWeight: "bold",
                                        fontSize: "1rem",
                                    }}
                                >
                                    Acciones
                                </TableCell>
                            )}
                            {columns.map((col) => (
                                <TableCell
                                    key={col.key}
                                    align="center"
                                    sx={{
                                        color: "white",
                                        fontWeight: "bold",
                                        fontSize: "1rem",
                                    }}
                                >
                                    <TableSortLabel
                                        active={orderBy === col.key}
                                        direction={
                                            orderBy === col.key ? order : "asc"
                                        }
                                        onClick={() =>
                                            handleRequestSort(col.key)
                                        }
                                        sx={{
                                            color: "white !important",
                                            "& .MuiTableSortLabel-icon": {
                                                color: "white !important",
                                            },
                                        }}
                                    >
                                        {col.header}
                                    </TableSortLabel>
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {filteredData.map((row, rowIndex) => (
                            <TableRow key={rowIndex} hover>
                                {actions && (
                                    <TableCell
                                        align="center"
                                        sx={{
                                            padding: "16px 12px",
                                            borderBottom: "1px solid #f1f5f9",
                                        }}
                                    >
                                        <div className="flex justify-center items-center gap-2">
                                            {selectRecord && (
                                                <Tooltip
                                                    title="Seleccionar registro"
                                                    arrow
                                                    placement="top"
                                                >
                                                    <button
                                                        id={idSelectRecord}
                                                        onClick={() =>
                                                            onSelectRecord(
                                                                row.id
                                                            )
                                                        }
                                                        className="p-2 rounded-lg bg-gradient-to-br from-cyan-50 to-cyan-100 text-cyan-600 hover:from-cyan-100 hover:to-cyan-200 hover:shadow-md transition-all duration-300 hover:scale-110"
                                                    >
                                                        <MdPersonAddAlt1
                                                            size={18}
                                                        />
                                                    </button>
                                                </Tooltip>
                                            )}
                                            {management && (
                                                <Tooltip
                                                    title="Ver gestión"
                                                    arrow
                                                    placement="top"
                                                >
                                                    <button
                                                        id={idManagement}
                                                        onClick={() =>
                                                            onManagement(row)
                                                        }
                                                        className="p-2 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 text-blue-600 hover:from-blue-100 hover:to-blue-200 hover:shadow-md transition-all duration-300 hover:scale-110"
                                                    >
                                                        <CiBoxList size={20} />
                                                    </button>
                                                </Tooltip>
                                            )}
                                            {edit && (
                                                <Tooltip
                                                    title="Editar"
                                                    arrow
                                                    placement="top"
                                                >
                                                    <button
                                                        id={idEdit}
                                                        onClick={() =>
                                                            onEdit(row)
                                                        }
                                                        className="p-2 rounded-lg bg-gradient-to-br from-indigo-50 to-indigo-100 text-indigo-600 hover:from-indigo-100 hover:to-indigo-200 hover:shadow-md transition-all duration-300 hover:scale-110"
                                                    >
                                                        <CiEdit size={20} />
                                                    </button>
                                                </Tooltip>
                                            )}
                                            {view && (
                                                <Tooltip
                                                    title="Ver"
                                                    arrow
                                                    placement="top"
                                                >
                                                    <button
                                                        id={idView}
                                                        onClick={() =>
                                                            onView(row)
                                                        }
                                                        className="p-2 rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 text-purple-600 hover:from-purple-100 hover:to-purple-200 hover:shadow-md transition-all duration-300 hover:scale-110"
                                                    >
                                                        <GoEye size={18} />
                                                    </button>
                                                </Tooltip>
                                            )}
                                            {monitoring && (
                                                <Tooltip
                                                    title="Seguimiento"
                                                    arrow
                                                    placement="top"
                                                >
                                                    <button
                                                        id={idMonitoring}
                                                        onClick={() =>
                                                            onMonitoring(row)
                                                        }
                                                        className="p-2 rounded-lg bg-gradient-to-br from-teal-50 to-teal-100 text-teal-600 hover:from-teal-100 hover:to-teal-200 hover:shadow-md transition-all duration-300 hover:scale-110"
                                                    >
                                                        <IoFootstepsOutline
                                                            size={18}
                                                        />
                                                    </button>
                                                </Tooltip>
                                            )}
                                            {history && (
                                                <Tooltip
                                                    title="Historial"
                                                    arrow
                                                    placement="top"
                                                >
                                                    <button
                                                        id={idHistory}
                                                        onClick={() =>
                                                            onHistory(row)
                                                        }
                                                        className="p-2 rounded-lg bg-gradient-to-br from-orange-50 to-orange-100 text-orange-600 hover:from-orange-100 hover:to-orange-200 hover:shadow-md transition-all duration-300 hover:scale-110"
                                                    >
                                                        <GoHistory size={18} />
                                                    </button>
                                                </Tooltip>
                                            )}
                                            {onActiveOrInactive && (
                                                <Tooltip
                                                    title={
                                                        row.is_active === 1
                                                            ? "Desactivar"
                                                            : "Activar"
                                                    }
                                                    arrow
                                                    placement="top"
                                                >
                                                    <button
                                                        id={
                                                            idOnActiveOrInactive
                                                        }
                                                        onClick={() =>
                                                            onDelete(
                                                                row.id,
                                                                row.is_active
                                                            )
                                                        }
                                                        className={`p-2 rounded-lg transition-all duration-300 hover:scale-110 hover:shadow-md ${
                                                            row.is_active === 1
                                                                ? "bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200"
                                                                : "bg-gradient-to-br from-red-50 to-red-100 hover:from-red-100 hover:to-red-200"
                                                        }`}
                                                    >
                                                        {row.is_active === 1 ? (
                                                            <FaToggleOn
                                                                size={20}
                                                                color="#10b981"
                                                            />
                                                        ) : (
                                                            <FaToggleOff
                                                                size={20}
                                                                color="#ef4444"
                                                            />
                                                        )}
                                                    </button>
                                                </Tooltip>
                                            )}
                                        </div>
                                    </TableCell>
                                )}
                                {columns.map((col) => (
                                    <TableCell key={col.key} align="center">
                                        {col.key === "img_payroll" ? (
                                            row.img_payroll ? (
                                                <img
                                                    src={row.img_payroll}
                                                    alt="Imagen"
                                                    className="h-12 w-12 object-contain rounded-md mx-auto"
                                                />
                                            ) : (
                                                "—"
                                            )
                                        ) : col.render ? (
                                            // Si la columna tiene una función render personalizada
                                            col.render(row)
                                        ) : (
                                            getNestedValue(row, col.key)
                                        )}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}

                        {sortedData.length === 0 && (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length + (actions ? 1 : 0)}
                                    align="center"
                                >
                                    No hay registros disponibles
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {paginationSection && (
                <TablePagination
                    rowsPerPageOptions={[]}
                    component="div"
                    // Fallback seguro si totalItems no está definido
                    count={typeof totalItems === "number" ? totalItems : data?.length ?? 0}
                    rowsPerPage={rowsPerPage}
                    // Aseguramos que la página empieza en 0 cuando no hay valor
                    page={Math.max((currentPage ?? 1) - 1, 0)}
                    onPageChange={handleChangePage}
                />
            )}
        </Paper>
    );
};

export default MuiTable;
