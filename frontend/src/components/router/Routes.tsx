import {createBrowserRouter} from "react-router-dom";
import {ProtectedLayout} from "@/layout/ProtectedLayout.tsx";
import About from "@/pages/About.tsx";
import AuthorizationPage from "@/pages/AuthorizationPage.tsx";
import {LoadingSpinner} from "@/components/LoadingSpinner.tsx";
import RegistrationPage from "@/pages/Registration.tsx";
import FeedPage from "@/pages/FeedPage.tsx";
import AccountPage from "@/pages/AccountPage.tsx";

export const createRouter = () => {
    return createBrowserRouter([
        {
            path: "/login",
            element: <AuthorizationPage/>,
            loader: () => {
                return <LoadingSpinner/>
            }
        },
        {
            path: "/register",
            element: <RegistrationPage/>,
            loader: () => {
                return <LoadingSpinner/>
            }
        },
        {
            Component: ProtectedLayout,
            children: [
                {
                    path: "/",
                    element: <FeedPage/>,
                    loader: () => {
                        return <LoadingSpinner/>
                    }
                },
                {
                    path: "/account",
                    element: <AccountPage/>,
                    loader: () => {
                        return <LoadingSpinner/>
                    }
                },
                {
                    path: "/about",
                    element: <About/>,
                    loader: () => {
                        return <LoadingSpinner/>
                    }
                }
            ]
        },

    ])
}