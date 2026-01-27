import {ThemeProvider} from "@/components/ThemeProvider"
import {NuqsAdapter} from 'nuqs/adapters/react-router/v7'
import {RouterProvider} from "react-router-dom";
import {useEffect} from "react";
import {useAuthStore} from "@/store/authStore.ts";
import {createRouter} from "@/components/router/Routes.tsx";

function App() {
    useEffect(() => {
        const state = useAuthStore.getState();
        if (state.accessToken && state.refreshToken) {
            state.refresh(state.accessToken, state.refreshToken);
        }
    }, [])

    return (
        <NuqsAdapter>
            <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
                <RouterProvider router={createRouter()}/>
            </ThemeProvider>
        </NuqsAdapter>
    )
}

export default App