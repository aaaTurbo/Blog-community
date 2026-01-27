import { create } from 'zustand'
import { getCurrentUser, getUserByUsername, updateProfile } from '@/api/requests'
import { api } from '@/api/apiClient'

export interface UserProfile {
    id: string
    username: string
    mail: string
    name: string
    avatar?: string
    bio?: string
    location?: string
    email?: string
    skills?: string[]
    postsCount?: number
    followersCount?: number
    followingCount?: number
    joinedAt?: string
    isFollowing?: boolean
}

type UserState = {
    currentUser: UserProfile | null
    selectedUser: UserProfile | null
    loading: boolean
    error: string | null

    fetchCurrentUser: () => Promise<void>
    fetchUserByUsername: (username: string) => Promise<void>
    updateCurrentUser: (data: any) => Promise<void>
    resetSelectedUser: () => void
    setError: (error: string | null) => void
}

const mapUser = (u: any): UserProfile => ({
    id: u.username || u.id,
    username: u.username,
    name: u.username, // Бекенд не возвращает name, используем username
    email: u.email || u.mail,
    mail: u.email || u.mail,
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${u.username}`,
    bio: '',
    location: '',
    followersCount: u.followersCount || 0,
    followingCount: u.followingCount || 0,
    postsCount: 0,
    isFollowing: u.isFollowing || false
})

export const useUserStore = create<UserState>((set) => ({
    currentUser: null,
    selectedUser: null,
    loading: false,
    error: null,

    fetchCurrentUser: async () => {
        set({ loading: true, error: null })
        try {
            const response = await getCurrentUser()
            // Пытаемся также получить email из auth-server
            let userData = { ...response.data }
            try {
                const authMe = await api.get('/auth/v0/me')
                userData = { ...userData, ...authMe.data }
            } catch (e) {
                console.warn('Could not fetch auth info', e)
            }

            set({
                currentUser: mapUser(userData),
                loading: false
            })
        } catch (error: any) {
            const errorMsg = error.response?.data?.message || error.message || 'Failed to fetch current user'
            set({
                error: errorMsg,
                loading: false
            })
            console.error('Error fetching current user:', error)
        }
    },

    fetchUserByUsername: async (username: string) => {
        set({ loading: true, error: null })
        try {
            const response = await getUserByUsername(username)
            set({
                selectedUser: mapUser(response.data),
                loading: false
            })
        } catch (error: any) {
            const errorMsg = error.response?.data?.message || error.message || 'Failed to fetch user'
            set({
                error: errorMsg,
                loading: false
            })
            console.error('Error fetching user:', error)
        }
    },

    updateCurrentUser: async (data: any) => {
        set({ loading: true, error: null })
        try {
            const response = await updateProfile(data)
            // После обновления в auth-server, обновляем данные в сторе
            set((state) => ({
                currentUser: state.currentUser ? { ...state.currentUser, email: response.data.email, mail: response.data.email } : mapUser(response.data),
                loading: false
            }))
        } catch (error: any) {
            const errorMsg = error.response?.data?.message || error.message || 'Failed to update profile'
            set({
                error: errorMsg,
                loading: false
            })
            console.error('Error updating profile:', error)
        }
    },

    resetSelectedUser: () => {
        set({ selectedUser: null })
    },

    setError: (error: string | null) => {
        set({ error })
    }
}))

