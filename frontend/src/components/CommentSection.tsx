import type {Comment} from '@/types/PostTypes';
import {useState} from 'react';
import {Heart} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';

interface CommentSectionProps {
    comments: Comment[];
    postId: string;
    onAddComment?: (postId: string, content: string) => void;
    onReactToComment?: (postId: string, commentId: string, reactionType: string) => void;
}

const reactionEmojis = {
    like: '👍',
    love: '❤️',
    haha: '😂',
    wow: '😮',
    sad: '😢',
    angry: '😠'
};

export default function CommentSection({
                                           comments,
                                           postId,
                                           onAddComment,
                                           onReactToComment
                                       }: CommentSectionProps) {
    const [newComment, setNewComment] = useState('');
    const [expandedCommentReactions, setExpandedCommentReactions] = useState<Record<string, boolean>>({});

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (newComment.trim() && onAddComment) {
            onAddComment(postId, newComment);
            setNewComment('');
        }
    };

    const handleCommentReact = (commentId: string, reactionType: string) => {
        if (onReactToComment) {
            onReactToComment(postId, commentId, reactionType);
        }
    };

    return (
        <div className="p-4 space-y-4">
            {/* Add Comment Form */}
            <form onSubmit={handleSubmit} className="flex gap-2">
                <img
                    src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                    alt="Your avatar"
                    className="w-8 h-8 rounded-full object-cover"
                />
                <div className="flex-1 flex gap-2">
                    <Input
                        placeholder="Напишите комментарий..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="text-sm h-8"
                    />
                    <Button
                        type="submit"
                        size="sm"
                        className="px-3"
                        disabled={!newComment.trim()}
                    >
                        Post
                    </Button>
                </div>
            </form>

            {/* Comments List */}
            <div className="space-y-3">
                {comments.map((comment) => {
                    const totalReactions = comment.reactions.reduce((sum, r) => sum + r.count, 0);
                    const likeReaction = comment.reactions.find(r => r.type === 'like');

                    return (
                        <div key={comment.id} className="bg-muted/30 rounded p-3 space-y-2">
                            <div className="flex items-center gap-2">
                                <img
                                    src={comment.author.avatar}
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

                            <p className="text-sm text-foreground">{comment.content}</p>

                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                {totalReactions > 0 && (
                                    <div
                                        className="flex items-center gap-1 cursor-pointer hover:underline"
                                        onClick={() =>
                                            setExpandedCommentReactions({
                                                ...expandedCommentReactions,
                                                [comment.id]: !expandedCommentReactions[comment.id]
                                            })
                                        }
                                    >
                                        {comment.reactions
                                            .filter(r => r.count > 0)
                                            .slice(0, 2)
                                            .map(r => (
                                                <span key={r.type}>
                          {reactionEmojis[r.type as keyof typeof reactionEmojis]}
                        </span>
                                            ))}
                                        <span>{totalReactions}</span>
                                    </div>
                                )}

                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-auto p-0 text-xs hover:bg-transparent"
                                    onClick={() => handleCommentReact(comment.id, 'like')}
                                >
                                    <Heart
                                        size={14}
                                        fill={likeReaction?.userReacted ? 'currentColor' : 'none'}
                                        className={likeReaction?.userReacted ? 'text-red-500' : ''}
                                    />
                                </Button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {comments.length === 0 && (
                <p className="text-center text-sm text-muted-foreground py-4">Нет комментариев</p>
            )}
        </div>
    );
}

