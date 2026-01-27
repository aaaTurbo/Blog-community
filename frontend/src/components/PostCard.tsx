import type { Post } from '@/types/PostTypes';
import { useState } from 'react';
import { Heart, MessageCircle, Share2, MoreVertical, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import CommentSection from './CommentSection';
import { usePostStore } from '@/store/postStore';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PostCardProps {
  post: Post;
  isCurrentUserPost?: boolean;
}

export default function PostCard({ post, isCurrentUserPost = false }: PostCardProps) {
  const [showComments, setShowComments] = useState(false);
  const { toggleReaction, deletePost, loading } = usePostStore();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleToggleLike = async () => {
    try {
      await toggleReaction(post.id);
    } catch (error) {
      console.error('Failed to toggle reaction:', error);
    }
  };

  const handleDeletePost = async () => {
    if (!window.confirm('Вы уверены, что хотите удалить этот пост?')) return;
    setIsDeleting(true);
    try {
      await deletePost(post.id);
    } catch (error) {
      console.error('Failed to delete post:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  const reactionCount = post.reactionCount || 0;

  return (
    <div className="bg-card rounded-lg border border-border overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="p-4">
        <div className="flex items-center gap-3 justify-between">
          <div className="flex items-center gap-3 flex-1">
            <img
              src={post.author?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=User'}
              alt={post.author?.name || 'User'}
              className="w-10 h-10 rounded-full object-cover"
            />
            <div className="flex-1">
              <p className="font-semibold text-foreground">{post.author?.name || 'Unknown User'}</p>
              <p className="text-xs text-muted-foreground">
                {post.createdAt ? new Date(post.createdAt).toLocaleDateString('ru-RU') : 'Unknown date'}
              </p>
            </div>
          </div>

          {isCurrentUserPost && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm">
                  <MoreVertical size={16} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={handleDeletePost}
                  disabled={isDeleting}
                  className="text-destructive cursor-pointer"
                >
                  <Trash2 size={14} className="mr-2" />
                  {isDeleting ? 'Удаление...' : 'Удалить'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 py-2">
        <p className="text-foreground leading-relaxed">{post.content || 'No content'}</p>
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
      {reactionCount > 0 && (
        <div className="px-4 py-2 text-sm text-muted-foreground">
          <div className="flex items-center justify-between">
            <div className="text-xs">
              👍 {reactionCount} {reactionCount === 1 ? 'лайк' : 'лайков'}
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
          onClick={handleToggleLike}
          disabled={loading}
        >
          <Heart
            size={18}
            fill={post.userReacted ? 'currentColor' : 'none'}
            className={post.userReacted ? 'text-red-500' : ''}
          />
          <span className="text-sm">{post.userReacted ? 'Liked' : 'Like'}</span>
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
          <CommentSection postId={post.id} />
        </>
      )}
    </div>
  );
}

