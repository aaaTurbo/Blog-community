
type UserResponse = {
    username: string
    email: string
}

type TokenResponse = {
    token: string
    refreshToken: string
    tokenType: string
    expiresAt: number
}

type AuthRespons = {
    user: UserResponse
    tokens: TokenResponse
}

type ErrorReponse = {
    timestamp: string
    status: number
    error: string
    path: string
}