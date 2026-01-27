
export type LoginRequest = {
    email: string
    password: string
}

export type RefreshTokenRequest = {
    refreshToken: string
}

export type RegisterRequest = {
    email: string
    username: string
    password: string
}

export type UpdateUserRequest = {
    email?: string
    currentPassword?: string
    newPassword?: string
}