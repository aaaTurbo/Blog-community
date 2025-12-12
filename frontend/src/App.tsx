import { ThemeProvider } from "@/components/ThemeProvider"
import {ModeToggle} from "@/components/ModeToggle.tsx";
import { Button } from "./components/ui/button";

function App() {
    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            <ModeToggle></ModeToggle>
            <Button>Test Theme</Button>
        </ThemeProvider>
    )
}

export default App