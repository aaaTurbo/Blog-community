import { api } from "@/api/apiClient.ts";

// ============== AUTH ==============

export async function register(username: string, email: string, password: string) {
    return await api.post("/auth/v0/register", {
        username,
        email,
        password
    });
}

export async function login(email: string, password: string) {
    return await api.post("/auth/v0/login", {
        email,
        password
    });
}

export async function refreshToken(refreshToken: string) {
    return await api.post("/auth/v0/refresh", {
        refreshToken
    });
}

export async function logout(refreshToken: string) {
    return await api.post("/auth/v0/logout", {
        refreshToken
    });
}

export async function getCurrentUser() {
    return await api.get("/app/v0/users/me");
}

export async function updateProfile(data: {
    name?: string;
    bio?: string;
    location?: string;
    email?: string;
    currentPassword?: string;
    newPassword?: string;
}) {
    return await api.put("/auth/v0/me", data);
}

export async function getUserByUsername(username: string) {
    return await api.get(`/app/v0/users/${username}`);
}

// ============== POSTS ==============

export async function fetchFeedPosts(page: number = 0, size: number = 10) {
    return await api.get("/app/v0/posts/feed", {
        params: { page, size }
    });
}

export async function fetchUserPosts(
    username: string,
    page: number = 0,
    size: number = 10
) {
    return await api.get(`/app/v0/posts/user/${username}`, {
        params: { page, size }
    });
}

export async function createPost(content: string, image?: File) {
    const formData = new FormData();
    formData.append("text", content);
    if (image) {
        formData.append("image", image);
    }

    return await api.post("/app/v0/posts", formData, {
        headers: {
            "Content-Type": "multipart/form-data"
        }
    });
}

export async function deletePost(postId: string) {
    return await api.delete(`/app/v0/posts/${postId}`);
}

// ============== COMMENTS ==============

export async function fetchComments(postId: string, page: number = 0, size: number = 20) {
    return await api.get(`/app/v0/comments/${postId}`, {
        params: { page, size }
    });
}

export async function createComment(postId: string, content: string) {
    return await api.post(`/app/v0/comments/${postId}`, {
        text: content
    });
}

export async function deleteComment(commentId: string) {
    return await api.delete(`/app/v0/comments/${commentId}`);
}

// ============== REACTIONS ==============

export async function togglePostReaction(postId: string) {
    return await api.post(`/app/v0/reactions/${postId}`);
}

export async function checkPostReaction(postId: string) {
    return await api.get(`/app/v0/reactions/${postId}/check`);
}

// ============== FOLLOW ==============

export async function followUser(username: string) {
    return await api.post(`/app/v0/follow/${username}`);
}

export async function unfollowUser(username: string) {
    return await api.delete(`/app/v0/follow/${username}`);
}

export async function checkFollowing(username: string) {
    return await api.get(`/app/v0/follow/${username}/check`);
}