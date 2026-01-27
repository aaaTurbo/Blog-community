
export type UserResponse = {
    username: string
    email: string
}

export type TokenResponse = {
    token: string
    refreshToken: string
    tokenType: string
    expiresAt: number
}

export type AuthResponse = {
    user: UserResponse
    tokens: TokenResponse
}

export type ErrorResponse = {
    timestamp: string
    status: number
    error: string
    path: string
}