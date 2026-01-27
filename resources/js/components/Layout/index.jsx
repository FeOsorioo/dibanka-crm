import NavBar from "./NavBar";
import { useContext } from "react";
import { AuthContext } from "@context/AuthContext";

const Layout = ({
    children,
    id_contact,
    id_management,
    id_special_cases,
    id_config,
    id_entity,
}) => {
    const { user } = useContext(AuthContext);

    return (
        <div className="flex flex-col min-h-screen">
            <NavBar
                userName={user?.name || "Usuario"}
                id_contact={id_contact}
                id_management={id_management}
                id_special_cases={id_special_cases}
                id_config={id_config}
                id_entity={id_entity}
            />
            <main className="flex-grow container mx-auto p-6">{children}</main>
        </div>
    );
};

export default Layout;
