import {ThemeProvider} from "@/components/ThemeProvider"
import {ModeToggle} from "@/components/ModeToggle.tsx";
import {Button} from "./components/ui/button";
import {NuqsAdapter} from 'nuqs/adapters/react-router/v7'
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import About from "@/pages/About.tsx";

function App() {
    return (
        <NuqsAdapter>
            <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
                <RouterProvider router={
                    createBrowserRouter([
                        {
                            path: "/",
                            element: <Button>Test Theme</Button>,
                            loader: () => {
                                return "testData"
                            }
                        },
                        {
                            path: "/about",
                            element: <About></About>,
                            loader: () => {
                                return "testData"
                            }
                        }
                    ])
                }>
                </RouterProvider>
                <ModeToggle></ModeToggle>
            </ThemeProvider>
        </NuqsAdapter>
    )
}

export default App