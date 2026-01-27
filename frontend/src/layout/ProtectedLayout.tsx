import {Outlet} from "react-router-dom";
import AuthorizationPage from "@/pages/AuthorizationPage.tsx";
import {useAuthStore} from "@/store/authStore.ts";

export const ProtectedLayout = () => {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    if (isAuthenticated) {
        return <Outlet />;
    }
    return <AuthorizationPage/>
}