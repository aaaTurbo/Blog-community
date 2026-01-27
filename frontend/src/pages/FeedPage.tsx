import { useState, useEffect } from 'react';
import type { Post } from '@/types/PostTypes';
import PostCard from '@/components/PostCard';
import Sidebar from '@/components/Sidebar';
import { LoadingSpinner } from '@/components/LoadingSpinner';

// Mock data for demonstration
const mockPosts: Post[] = [
  {
    id: '1',
    author: {
      id: 'user1',
      name: 'John Developer',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John'
    },
    content: 'Только что завершил крупный проект на React! Очень доволен результатом и готов поделиться опытом с сообществом. 🚀',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=300&fit=crop',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    reactions: [
      { id: '1', type: 'like', count: 12, userReacted: true },
      { id: '2', type: 'love', count: 5, userReacted: false },
      { id: '3', type: 'haha', count: 2, userReacted: false }
    ],
    comments: [
      {
        id: 'c1',
        author: {
          id: 'user2',
          name: 'Jane Designer',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane'
        },
        content: 'Впечатляющая работа! Какие технологии использовались?',
        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        reactions: [
          { id: '1', type: 'like', count: 3, userReacted: false }
        ]
      },
      {
        id: 'c2',
        author: {
          id: 'user3',
          name: 'Bob Backend',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob'
        },
        content: 'Отлично выглядит! Можешь поделиться исходным кодом?',
        createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        reactions: [
          { id: '1', type: 'like', count: 1, userReacted: true }
        ]
      }
    ],
    commentCount: 2
  },
  {
    id: '2',
    author: {
      id: 'user2',
      name: 'Jane Designer',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane'
    },
    content: 'Новый дизайн нашего мобильного приложения готов! Что вы думаете? Любые отзывы приветствуются 🎨✨',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=300&fit=crop',
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    reactions: [
      { id: '1', type: 'like', count: 8, userReacted: false },
      { id: '2', type: 'love', count: 10, userReacted: true },
      { id: '3', type: 'wow', count: 3, userReacted: false }
    ],
    comments: [
      {
        id: 'c3',
        author: {
          id: 'user4',
          name: 'Alice UX',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice'
        },
        content: 'Просто красиво! Очень нравится цветовая схема',
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        reactions: [
          { id: '1', type: 'like', count: 2, userReacted: false },
          { id: '2', type: 'love', count: 1, userReacted: true }
        ]
      }
    ],
    commentCount: 1
  },
  {
    id: '3',
    author: {
      id: 'user3',
      name: 'Bob Backend',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob'
    },
    content: 'Советы по оптимизации базы данных PostgreSQL для высоконагруженных систем. Интересуетесь?',
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    reactions: [
      { id: '1', type: 'like', count: 15, userReacted: false },
      { id: '2', type: 'wow', count: 5, userReacted: false }
    ],
    comments: [],
    commentCount: 0
  }
];

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>(mockPosts);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Simulate API call
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleLike = (postId: string, reactionType: string) => {
    setPosts(
      posts.map((post) => {
        if (post.id === postId) {
          const existingReaction = post.reactions.find(r => r.type === reactionType);
          if (existingReaction) {
            return {
              ...post,
              reactions: post.reactions.map((r) =>
                r.type === reactionType
                  ? { ...r, userReacted: !r.userReacted, count: r.userReacted ? r.count - 1 : r.count + 1 }
                  : r
              )
            };
          }
        }
        return post;
      })
    );
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />

      <div className="flex justify-center pt-20 pb-8">
        <div className="w-full max-w-2xl px-4 space-y-6">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground">Лента</h1>
            <p className="text-muted-foreground mt-2">Посты от людей, на которых вы подписаны</p>
          </div>

          {posts.length > 0 ? (
            posts.map((post) => (
              <PostCard key={post.id} post={post} onLike={handleLike} />
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">Нет постов для отображения</p>
              <p className="text-sm text-muted-foreground mt-2">Подпишитесь на людей, чтобы видеть их посты</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

