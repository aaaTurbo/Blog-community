import type { Post } from '@/types/PostTypes';
import { useState } from 'react';
import { Heart, MessageCircle, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import CommentSection from './CommentSection';

interface PostCardProps {
  post: Post;
  onLike?: (postId: string, reactionType: string) => void;
}

const reactionEmojis = {
  like: '👍',
  love: '❤️',
  haha: '😂',
  wow: '😮',
  sad: '😢',
  angry: '😠'
};

export default function PostCard({ post, onLike }: PostCardProps) {
  const [showComments, setShowComments] = useState(false);
  const [expandedReactions, setExpandedReactions] = useState(false);

  const likeReaction = post.reactions.find(r => r.type === 'like');
  const totalReactions = post.reactions.reduce((sum, r) => sum + r.count, 0);

  const handleReact = (reactionType: string) => {
    if (onLike) {
      onLike(post.id, reactionType);
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="p-4">
        <div className="flex items-center gap-3">
          <img
            src={post.author.avatar}
            alt={post.author.name}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="flex-1">
            <p className="font-semibold text-foreground">{post.author.name}</p>
            <p className="text-xs text-muted-foreground">
              {new Date(post.createdAt).toLocaleDateString('ru-RU')}
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-2">
        <p className="text-foreground leading-relaxed">{post.content}</p>
      </div>

      {/* Image */}
      {post.image && (
        <img
          src={post.image}
          alt="Post content"
          className="w-full max-h-96 object-cover"
        />
      )}

      {/* Reactions Summary */}
      {totalReactions > 0 && (
        <div className="px-4 py-2 text-sm text-muted-foreground">
          <div className="flex items-center justify-between">
            <div
              className="flex items-center gap-1 cursor-pointer hover:underline"
              onClick={() => setExpandedReactions(!expandedReactions)}
            >
              {post.reactions
                .filter(r => r.count > 0)
                .slice(0, 3)
                .map(r => (
                  <span key={r.type}>{reactionEmojis[r.type as keyof typeof reactionEmojis]}</span>
                ))}
              <span>{totalReactions}</span>
            </div>
            <div className="text-xs">
              {post.commentCount} {post.commentCount === 1 ? 'комментарий' : 'комментариев'}
            </div>
          </div>
        </div>
      )}

      <Separator />

      {/* Actions */}
      <div className="flex items-center divide-x divide-border">
        <Button
          variant="ghost"
          size="sm"
          className="flex-1 justify-center gap-2 rounded-none hover:bg-muted"
          onClick={() => handleReact('like')}
        >
          <Heart
            size={18}
            fill={likeReaction?.userReacted ? 'currentColor' : 'none'}
            className={likeReaction?.userReacted ? 'text-red-500' : ''}
          />
          <span className="text-sm">Like</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="flex-1 justify-center gap-2 rounded-none hover:bg-muted"
          onClick={() => setShowComments(!showComments)}
        >
          <MessageCircle size={18} />
          <span className="text-sm">Comment</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          className="flex-1 justify-center gap-2 rounded-none hover:bg-muted"
        >
          <Share2 size={18} />
          <span className="text-sm">Share</span>
        </Button>
      </div>

      {/* Comments Section */}
      {showComments && (
        <>
          <Separator />
          <CommentSection comments={post.comments} postId={post.id} />
        </>
      )}
    </div>
  );
}

