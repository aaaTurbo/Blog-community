import { create } from 'zustand'
import { persist } from "zustand/middleware";

export type AuthState = {
    accessToken: string | null
    refreshToken: string | null
    isAuthenticated: boolean
    user: any | null

    setTokens: (accessToken: string, refreshToken: string, user?: any) => void
    logout: () => void
    refresh: (accessToken: string, refreshToken: string) => void
    initializeAuth: () => void
}

export const useAuthStore = create<AuthState>()(persist(
    (set) => ({
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        user: null,

        setTokens: (accessToken: string, refreshToken: string, user?: any) => set({
            accessToken,
            refreshToken,
            isAuthenticated: true,
            user: user || null
        }),

        logout: () => set({
            accessToken: null,
            refreshToken: null,
            isAuthenticated: false,
            user: null
        }),

        refresh: (accessToken: string, refreshToken: string) => set({
            accessToken,
            refreshToken,
            isAuthenticated: true
        }),

        initializeAuth: () => {
            // Инициализируется автоматически при загрузке из localStorage
        }
    }),
    {
        name: "auth-storage",
        partialize: (state) => ({
            accessToken: state.accessToken,
            refreshToken: state.refreshToken,
            isAuthenticated: state.isAuthenticated,
            user: state.user
        })
    }
))
