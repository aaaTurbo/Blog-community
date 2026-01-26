import {Outlet} from "react-router-dom";
import AuthorizationPage from "@/pages/AuthorizationPage.tsx";


export const ProtectedLayout = () => {
    const isAuthenticated = false;
    if (isAuthenticated) {
        return <Outlet />;
    }
    return <AuthorizationPage/>
}