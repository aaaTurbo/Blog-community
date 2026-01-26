import {create} from 'zustand'
import {persist} from "zustand/middleware";

type AuthState = {
    accessToken: string | null
    refreshToken: string | null
    isAuthenticated: boolean

    login: (accessToken: string, refreshToken: string) => void
    logout: () => void
    refresh: (accessToken: string, refreshToken: string) => void
}

export const useAuthStore = create<AuthState>()(persist(
        (set) => ({
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,

            login: (accessToken: string, refreshToken: string) => set({accessToken, refreshToken, isAuthenticated: true}),
            logout: () => set({
                accessToken: null,
                refreshToken: null,
                isAuthenticated: false
            }),
            refresh: async (accessToken: string, refreshToken: string) => {
                set({
                    accessToken,
                    refreshToken,
                    isAuthenticated: true
                })

            }
        }),
        {
            name: "auth-storage",
            partialize: (state) => ({
                accessToken: state.accessToken,
                refreshToken: state.refreshToken,
                isAuthenticated: state.isAuthenticated
            })
        }
    )
)
