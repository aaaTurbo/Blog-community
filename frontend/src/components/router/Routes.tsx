import {createBrowserRouter} from "react-router-dom";
import {Button} from "@/components/ui/button.tsx";
import {ProtectedLayout} from "@/layout/ProtectedLayout.tsx";
import About from "@/pages/About.tsx";
import AuthorizationPage from "@/pages/AuthorizationPage.tsx";
import {SpinnerBadge} from "@/components/ui/SpinnerBadge.tsx";
import RegistrationPage from "@/pages/Registration.tsx";

export const createRouter = () => {
    return createBrowserRouter([
        {
            path: "/",
            element: <Button>Test Theme</Button>,
            loader: () => {
                return <SpinnerBadge/>
            }
        },
        {
            path: "/login",
            element: <AuthorizationPage/>,
            loader: () => {
                return <SpinnerBadge/>
            }
        },
        {
            path: "/register",
            element: <RegistrationPage/>,
            loader: () => {
                return <SpinnerBadge/>
            }
        },
        {
            Component: ProtectedLayout,
            children: [
                {
                    path: "/about",
                    element: <About></About>,
                    loader: () => {
                        return <SpinnerBadge/>
                    }
                }
            ]
        },

    ])
}