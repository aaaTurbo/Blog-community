import { useState, useEffect } from 'react';
import { Heart, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { fetchComments, createComment, deleteComment } from '@/api/requests';
import { useUserStore } from '@/store/userStore';
import type { Comment } from '@/store/postStore';

interface CommentSectionProps {
    postId: string;
}

export default function CommentSection({ postId }: CommentSectionProps) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { currentUser } = useUserStore();

    useEffect(() => {
        const loadComments = async () => {
            setLoading(true);
            try {
                const response = await fetchComments(postId, 0, 20);
                setComments(response.data.content || []);
            } catch (error) {
                console.error('Failed to load comments:', error);
            } finally {
                setLoading(false);
            }
        };

        loadComments();
    }, [postId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim() || isSubmitting) return;

        setIsSubmitting(true);
        try {
            const response = await createComment(postId, newComment);
            setComments([response.data, ...comments]);
            setNewComment('');
        } catch (error) {
            console.error('Failed to create comment:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteComment = async (commentId: string) => {
        if (!window.confirm('Удалить комментарий?')) return;

        try {
            await deleteComment(commentId);
            setComments(comments.filter(c => c.id !== commentId));
        } catch (error) {
            console.error('Failed to delete comment:', error);
        }
    };

    return (
        <div className="p-4 space-y-4">
            {/* Add Comment Form */}
            <form onSubmit={handleSubmit} className="flex gap-2">
                <img
                    src={currentUser?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=User'}
                    alt="Your avatar"
                    className="w-8 h-8 rounded-full object-cover"
                />
                <div className="flex-1 flex gap-2">
                    <Input
                        placeholder="Напишите комментарий..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="text-sm h-8"
                        disabled={isSubmitting}
                    />
                    <Button
                        type="submit"
                        size="sm"
                        className="px-3"
                        disabled={!newComment.trim() || isSubmitting}
                    >
                        {isSubmitting ? 'Отправка...' : 'Post'}
                    </Button>
                </div>
            </form>

            {/* Comments List */}
            <div className="space-y-3">
                {loading && (
                    <p className="text-center text-sm text-muted-foreground py-4">Загрузка комментариев...</p>
                )}

                {!loading && comments.map((comment) => {
                    const isAuthor = currentUser?.id === comment.author.id;

                    return (
                        <div key={comment.id} className="bg-muted/30 rounded p-3 space-y-2">
                            <div className="flex items-center gap-2 justify-between">
                                <div className="flex items-center gap-2 flex-1">
                                    <img
                                        src={comment.author.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=User'}
                                        alt={comment.author.name}
                                        className="w-6 h-6 rounded-full object-cover"
                                    />
                                    <div className="flex-1">
                                        <p className="text-sm font-semibold text-foreground">{comment.author.name}</p>
                                        <p className="text-xs text-muted-foreground">
                                            {new Date(comment.createdAt).toLocaleDateString('ru-RU')}
                                        </p>
                                    </div>
                                </div>
                                {isAuthor && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        className="h-auto p-0 text-xs hover:bg-transparent text-destructive"
                                        onClick={() => handleDeleteComment(comment.id)}
                                    >
                                        <Trash2 size={14} />
                                    </Button>
                                )}
                            </div>

                            <p className="text-sm text-foreground">{comment.content}</p>

                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                {comment.reactions && comment.reactions.length > 0 && (
                                    <div className="text-xs">
                                        👍 {comment.reactions.reduce((sum, r) => sum + r.count, 0)}
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {!loading && comments.length === 0 && (
                <p className="text-center text-sm text-muted-foreground py-4">Нет комментариев</p>
            )}
        </div>
    );
}

