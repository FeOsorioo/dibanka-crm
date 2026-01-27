import React, { useContext, useCallback } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "@components/Layout";
import { AuthContext } from "@context/AuthContext";
import { TourProvider, useTour } from "@context/TourContext";
import AuthPage from "@modules/auth/pages/AuthPage";
import RecoverPage from "@modules/auth/pages/RecoverPage";
import Dashboard from "@modules/dashboard/pages/Dashboard";
import Loader from "@components/ui/Loader";
import Contact from "@modules/contact/pages/Contact";
import Entity from "@modules/entity/pages/Entity";
import Management from "@modules/management/pages/Management";
import AddManagement from "@modules/management/pages/AddManagement";
import SpecialCases from "@modules/specialCases/pages/SpecialCases";
import Config from "@modules/config/pages/Config";
import PopupInfoPayroll from "./modules/management/components/PopupInfoPayroll";
import Logs from "@modules/config/logs/pages/Logs";
import { ManagementStaticDataProvider } from "@modules/management/context/ManagementStaticDataContext";
import ProtectedRoute from "@hooks/ProtectedRoute";
import steps from "@tour/steps";
import Joyride from "@tour/joyride";

// Componente interno que usa el tour
const AppContent = () => {
    const { user, loading } = useContext(AuthContext);

    // Return condicional DESPUÉS de todos los hooks
    if (loading) return <Loader />;

    return (
        <>
            <Joyride steps={steps} />

            <Routes>
                {/* Rutas públicas */}
                <Route path="/" element={<AuthPage />} />
                <Route path="/recuperar-contraseña" element={<RecoverPage />} />

                {/* Rutas privadas con Layout */}
                {user ? (
                    <>
                        {/* Dashboard general */}
                        <Route
                            path="/home"
                            element={
                                <Layout id_contact="primer-paso">
                                    <Dashboard />
                                </Layout>
                            }
                        />

                        {/* Contactos */}
                        <Route
                            path="/contactos"
                            element={
                                <ProtectedRoute permission="contact.view">
                                    <Layout id_management="septimo-paso">
                                        <Contact
                                            addContact="segundo-paso"
                                            searchContact="tercer-paso"
                                            viewManagementContact="cuarto-paso"
                                            editContact="quinto-paso"
                                            activeOrDesactiveContact="sexto-paso"
                                        />
                                    </Layout>
                                </ProtectedRoute>
                            }
                        />
                        
                        {/* Entidades */}
                        <Route
                            path="/entidades"
                            element={
                                <ProtectedRoute permission="contact.view">
                                    <Layout id_management="septimo-paso">
                                        <Entity
                                            addEntity="segundo-paso"
                                            searchEntity="tercer-paso"
                                            viewManagementEntity="cuarto-paso"
                                            editEntity="quinto-paso"
                                            activeOrDesactiveEntity="sexto-paso"
                                        />
                                    </Layout>
                                </ProtectedRoute>
                            }
                        />

                        {/* Gestiones - Envuelto con provider para datos estáticos compartidos */}
                        <Route
                            path="/gestiones"
                            element={
                                <ProtectedRoute permission="management.view">
                                    <ManagementStaticDataProvider>
                                        <Layout id_special_cases="doceavo-paso">
                                            <Management
                                                idView="octavo-paso"
                                                idMonitoring="noveno-paso"
                                                idSearchManagement="decimo-paso"
                                                idAddManagement="onceavo-paso"
                                            />
                                        </Layout>
                                    </ManagementStaticDataProvider>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/informacion"
                            element={
                                <ProtectedRoute permission="management.view">
                                    <ManagementStaticDataProvider>
                                        <Layout>
                                            <PopupInfoPayroll />
                                        </Layout>
                                    </ManagementStaticDataProvider>
                                </ProtectedRoute>
                            }
                        />

                        {/* Añadir gestión */}
                        <Route
                            path="/gestiones/añadir"
                            element={
                                <ProtectedRoute permission="management.create">
                                    <ManagementStaticDataProvider>
                                        <Layout>
                                            <AddManagement />
                                        </Layout>
                                    </ManagementStaticDataProvider>
                                </ProtectedRoute>
                            }
                        />

                        {/* Casos especiales */}
                        <Route
                            path="/casos_especiales"
                            element={
                                <ProtectedRoute permission="special_cases.view">
                                    <Layout id_config="quinceavo-paso">
                                        <SpecialCases
                                            idAddSpecialCase="treceavo-paso"
                                            idSearchSpecialCase="catorceavo-paso"
                                        />
                                    </Layout>
                                </ProtectedRoute>
                            }
                        />

                        {/* Configuración */}
                        <Route
                            path="/configuraciones"
                            element={
                                <ProtectedRoute
                                    permission={[
                                        "config.user.edit",
                                        "config.role.edit",
                                        "config.payroll.edit",
                                        "config.consultation.edit",
                                        "config.specific.edit",
                                        "config.typeManagement.edit",
                                        "config.monitoring.edit",
                                    ]}
                                >
                                    <Layout>
                                        <Config idConfigMenu="dieciseisavo-paso" />
                                    </Layout>
                                </ProtectedRoute>
                            }
                        />

                        {/* Logs */}
                        <Route
                            path="/logs"
                            element={
                                <ProtectedRoute
                                    permission={[
                                        "config.user.edit",
                                        "config.role.edit",
                                        "config.payroll.edit",
                                        "config.consultation.edit",
                                        "config.specific.edit",
                                        "config.typeManagement.edit",
                                        "config.monitoring.edit",
                                    ]}
                                >
                                    <Layout>
                                        <Logs />
                                    </Layout>
                                </ProtectedRoute>
                            }
                        />
                    </>
                ) : (
                    // 🔒 Si no está autenticado
                    <Route path="*" element={<Navigate to="/" replace />} />
                )}
            </Routes>
        </>
    );
};

// Componente principal que envuelve con providers
const App = () => {
    return (
        <TourProvider>
            <AppContent />
        </TourProvider>
    );
};

export default App;
