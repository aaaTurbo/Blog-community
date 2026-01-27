import { create } from 'zustand'
import {
    fetchFeedPosts,
    fetchUserPosts,
    createPost,
    deletePost as deletePostAPI,
    togglePostReaction,
    checkPostReaction
} from '@/api/requests'

export interface Author {
    id: string
    username: string
    name: string
    avatar?: string
}

export interface Reaction {
    id: string
    type: string
    count: number
    userReacted?: boolean
}

export interface Comment {
    id: string
    author: Author
    content: string
    createdAt: string
    reactions: Reaction[]
}

export interface Post {
    id: string
    author: Author
    content: string
    image?: string
    createdAt: string
    reactions: Reaction[]
    comments: Comment[]
    commentCount: number
    userReacted?: boolean
    reactionCount?: number
}

interface PageResponse<T> {
    content: T[]
    page: number
    size: number
    totalElements: number
    totalPages: number
    last: boolean
}

type PostState = {
    feedPosts: Post[]
    userPosts: Post[]
    loading: boolean
    error: string | null
    currentPage: number
    hasMore: boolean
    totalPages: number

    fetchFeedPosts: (page?: number) => Promise<void>
    fetchUserPosts: (username: string, page?: number) => Promise<void>
    createPost: (content: string, image?: File) => Promise<void>
    deletePost: (postId: string) => Promise<void>
    toggleReaction: (postId: string) => Promise<void>
    addPostToFeed: (post: Post) => void
    nextPage: () => Promise<void>
    resetFeed: () => void
    setError: (error: string | null) => void
}

const mapPost = (p: any): Post => ({
    id: p.id,
    author: {
        id: p.author,
        username: p.author,
        name: p.author,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${p.author}`
    },
    content: p.text || '',
    image: p.img ? (p.img.startsWith('http') ? p.img : `http://localhost:80/${p.img}`) : undefined,
    createdAt: p.date || new Date().toISOString(),
    reactions: [],
    comments: [],
    commentCount: p.comments || 0,
    userReacted: p.hasReacted || false,
    reactionCount: p.reactions || 0
})

export const usePostStore = create<PostState>((set, get) => ({
    feedPosts: [],
    userPosts: [],
    loading: false,
    error: null,
    currentPage: 0,
    hasMore: true,
    totalPages: 0,

    fetchFeedPosts: async (page = 0) => {
        set({ loading: true, error: null })
        try {
            const response = await fetchFeedPosts(page, 10)
            const data = response.data as any
            const mappedPosts = data.content.map(mapPost)
            set((state) => ({
                feedPosts: page === 0 ? mappedPosts : [...state.feedPosts, ...mappedPosts],
                currentPage: data.page,
                totalPages: data.totalPages,
                hasMore: !data.last,
                loading: false
            }))
        } catch (error: any) {
            const errorMsg = error.response?.data?.message || error.message || 'Failed to fetch feed'
            set({
                error: errorMsg,
                loading: false,
                feedPosts: page === 0 ? [] : get().feedPosts
            })
            console.error('Error fetching feed:', error)
        }
    },

    fetchUserPosts: async (username: string, page = 0) => {
        set({ loading: true, error: null })
        try {
            const response = await fetchUserPosts(username, page, 10)
            const data = response.data as any
            const mappedPosts = data.content.map(mapPost)
            set((state) => ({
                userPosts: page === 0 ? mappedPosts : [...state.userPosts, ...mappedPosts],
                currentPage: data.page,
                totalPages: data.totalPages,
                hasMore: !data.last,
                loading: false
            }))
        } catch (error: any) {
            const errorMsg = error.response?.data?.message || error.message || 'Failed to fetch user posts'
            set({
                error: errorMsg,
                loading: false,
                userPosts: page === 0 ? [] : get().userPosts
            })
            console.error('Error fetching user posts:', error)
        }
    },

    createPost: async (content: string, image?: File) => {
        set({ loading: true, error: null })
        try {
            const response = await createPost(content, image)
            const newPost = mapPost(response.data)
            set((state) => ({
                feedPosts: [newPost, ...state.feedPosts],
                userPosts: [newPost, ...state.userPosts],
                loading: false
            }))
        } catch (error: any) {
            const errorMsg = error.response?.data?.message || error.message || 'Failed to create post'
            set({
                error: errorMsg,
                loading: false
            })
            console.error('Error creating post:', error)
        }
    },

    deletePost: async (postId: string) => {
        set({ loading: true, error: null })
        try {
            await deletePostAPI(postId)
            set((state) => ({
                feedPosts: state.feedPosts.filter((p) => p.id !== postId),
                userPosts: state.userPosts.filter((p) => p.id !== postId),
                loading: false
            }))
        } catch (error: any) {
            const errorMsg = error.response?.data?.message || error.message || 'Failed to delete post'
            set({
                error: errorMsg,
                loading: false
            })
            console.error('Error deleting post:', error)
        }
    },

    toggleReaction: async (postId: string) => {
        set({ error: null })
        try {
            const response = await togglePostReaction(postId)
            const { reacted, count } = response.data

            set((state) => ({
                feedPosts: state.feedPosts.map((post) =>
                    post.id === postId
                        ? {
                            ...post,
                            userReacted: reacted,
                            reactionCount: count
                        }
                        : post
                ),
                userPosts: state.userPosts.map((post) =>
                    post.id === postId
                        ? {
                            ...post,
                            userReacted: reacted,
                            reactionCount: count
                        }
                        : post
                )
            }))
        } catch (error: any) {
            const errorMsg = error.response?.data?.message || error.message || 'Failed to toggle reaction'
            set({
                error: errorMsg
            })
            console.error('Error toggling reaction:', error)
        }
    },

    addPostToFeed: (post: Post) => {
        set((state) => ({
            feedPosts: [post, ...state.feedPosts]
        }))
    },

    nextPage: async () => {
        const state = get()
        if (!state.hasMore || state.loading) return
        await state.fetchFeedPosts(state.currentPage + 1)
    },

    resetFeed: () => {
        set({
            feedPosts: [],
            userPosts: [],
            currentPage: 0,
            hasMore: true,
            totalPages: 0
        })
    },

    setError: (error: string | null) => {
        set({ error })
    }
}))

