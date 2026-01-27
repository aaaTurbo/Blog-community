import axios from 'axios'
import { useAuthStore } from '@/store/authStore'

export const api = axios.create({
    baseURL: 'http://localhost:80',
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
    async (error) => {
        if (error.response?.status === 401) {
            try {
                const state = useAuthStore.getState();
                if (state.refreshToken) {
                    // Получить новый accessToken через backend
                    const response = await axios.post('http://localhost:80/auth/v0/refresh', {
                        refreshToken: state.refreshToken
                    });

                    const { token, refreshToken: newRefreshToken } = response.data;

                    // Обновить tokens в store
                    state.refresh(token, newRefreshToken);

                    // Повторить исходный запрос с новым токеном
                    error.config.headers.Authorization = `Bearer ${token}`;
                    return api(error.config);
                }
            } catch (refreshError) {
                // Если refresh не удался, логаут
                useAuthStore.getState().logout();
                window.location.href = '/login';
            }
        }
        throw error
    }
)
