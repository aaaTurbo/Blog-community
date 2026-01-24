import {Outlet} from "react-router-dom";

function LoginPage() {
    return <div>
        <h1>Login Page</h1>
    </div>
}

export const ProtectedLayout = () => {
    const isAuthenticated = false;
    if (isAuthenticated) {
        return <Outlet />;
    }
    return <LoginPage/>
}