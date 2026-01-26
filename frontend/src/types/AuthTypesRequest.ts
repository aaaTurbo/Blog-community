
type LoginRequest = {
    email: string
    password: string
}

type RefreshTokenRequest = {
    refreshToken: string
}

type RegisterRequest = {
    email: string
    username: string
    password: string
}

type UpdateUserRequest = {
    email?: string
    currentPassword?: string
    newPassword?: string
}