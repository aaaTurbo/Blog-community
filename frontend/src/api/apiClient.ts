import axios from 'axios'
import { useAuthStore } from '@/store/authStore'

export const api = axios.create({
    baseURL: 'http://localhost:8080/api',
    withCredentials: true,
})

api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().accessToken

    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }

    return config
})

api.interceptors.response.use(
    (res) => res,
    (error) => {
        if (error.response?.status === 401) {
            try {
                useAuthStore.getState().refresh()
                return api(error.config)
            } catch {
                useAuthStore.getState().logout()
            }
        }
        throw error
    }
)
