import { create } from 'zustand'
import { fetchComments, createComment, deleteComment } from '@/api/requests'
import type { Comment } from '@/store/postStore'

interface CommentState {
    comments: Map<string, Comment[]> // postId -> comments
    loading: boolean
    error: string | null

    fetchComments: (postId: string, page?: number) => Promise<void>
    addComment: (postId: string, comment: Comment) => void
    removeComment: (commentId: string) => Promise<void>
    setError: (error: string | null) => void
}

export const useCommentStore = create<CommentState>((set, get) => ({
    comments: new Map(),
    loading: false,
    error: null,

    fetchComments: async (postId: string, page = 0) => {
        set({ loading: true, error: null })
        try {
            const response = await fetchComments(postId, page, 20)
            const comments = response.data.content || []

            set((state) => {
                const newComments = new Map(state.comments)
                newComments.set(postId, comments)
                return { comments: newComments, loading: false }
            })
        } catch (error: any) {
            const errorMsg = error.response?.data?.message || error.message || 'Failed to fetch comments'
            set({
                error: errorMsg,
                loading: false
            })
            console.error('Error fetching comments:', error)
        }
    },

    addComment: (postId: string, comment: Comment) => {
        set((state) => {
            const newComments = new Map(state.comments)
            const postComments = newComments.get(postId) || []
            newComments.set(postId, [comment, ...postComments])
            return { comments: newComments }
        })
    },

    removeComment: async (commentId: string) => {
        set({ loading: true, error: null })
        try {
            await deleteComment(commentId)

            set((state) => {
                const newComments = new Map(state.comments)
                // Удалить комментарий из всех постов
                newComments.forEach((comments, postId) => {
                    newComments.set(
                        postId,
                        comments.filter((c) => c.id !== commentId)
                    )
                })
                return { comments: newComments, loading: false }
            })
        } catch (error: any) {
            const errorMsg = error.response?.data?.message || error.message || 'Failed to delete comment'
            set({
                error: errorMsg,
                loading: false
            })
            console.error('Error deleting comment:', error)
        }
    },

    setError: (error: string | null) => {
        set({ error })
    }
}))

