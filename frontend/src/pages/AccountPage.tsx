import { useState, useEffect } from 'react';
import type { UserProfile, Post } from '@/types/PostTypes';
import PostCard from '@/components/PostCard';
import Sidebar from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Mail, MapPin } from 'lucide-react';

// Mock user profile
const mockUserProfile: UserProfile = {
  id: 'current-user',
  name: 'John Developer',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
  bio: '💻 Full Stack Developer | React & Node.js | Coffee enthusiast ☕',
  followersCount: 324,
  followingCount: 156,
  postsCount: 24
};

// Mock user posts
const mockUserPosts: Post[] = [
  {
    id: '1',
    author: {
      id: 'current-user',
      name: 'John Developer',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John'
    },
    content: 'Только что завершил крупный проект на React! Очень доволен результатом и готов поделиться опытом с сообществом. 🚀',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=300&fit=crop',
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    reactions: [
      { id: '1', type: 'like', count: 32, userReacted: false },
      { id: '2', type: 'love', count: 12, userReacted: false },
      { id: '3', type: 'wow', count: 5, userReacted: false }
    ],
    comments: [
      {
        id: 'c1',
        author: {
          id: 'user2',
          name: 'Jane Designer',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane'
        },
        content: 'Впечатляющая работа!',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        reactions: [
          { id: '1', type: 'like', count: 5, userReacted: false }
        ]
      }
    ],
    commentCount: 8
  },
  {
    id: '2',
    author: {
      id: 'current-user',
      name: 'John Developer',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John'
    },
    content: 'Любимое изображение из отпуска на морском побережье. Не могу дождаться следующих каникул! 🏖️',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500&h=300&fit=crop',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    reactions: [
      { id: '1', type: 'like', count: 42, userReacted: true },
      { id: '2', type: 'love', count: 28, userReacted: false },
      { id: '3', type: 'wow', count: 8, userReacted: false }
    ],
    comments: [
      {
        id: 'c2',
        author: {
          id: 'user3',
          name: 'Bob Backend',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob'
        },
        content: 'Как красиво!',
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        reactions: [
          { id: '1', type: 'like', count: 3, userReacted: true }
        ]
      }
    ],
    commentCount: 12
  },
  {
    id: '3',
    author: {
      id: 'current-user',
      name: 'John Developer',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John'
    },
    content: 'Вот несколько советов для начинающих разработчиков, которые помогли мне в карьере 📚',
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    reactions: [
      { id: '1', type: 'like', count: 89, userReacted: false },
      { id: '2', type: 'love', count: 34, userReacted: false },
      { id: '3', type: 'wow', count: 15, userReacted: false }
    ],
    comments: [],
    commentCount: 25
  }
];

export default function AccountPage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'posts' | 'info'>('posts');

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setProfile(mockUserProfile);
      setPosts(mockUserPosts);
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

  if (loading || !profile) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />

      <div className="flex justify-center pt-20 pb-8">
        <div className="w-full max-w-2xl px-4">
          {/* Profile Header */}
          <div className="bg-card rounded-lg border border-border p-6 mb-6">
            <div className="flex flex-col sm:flex-row items-start gap-6">
              {/* Avatar */}
              <img
                src={profile.avatar}
                alt={profile.name}
                className="w-24 h-24 rounded-full object-cover border-2 border-primary"
              />

              {/* Profile Info */}
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-foreground mb-2">{profile.name}</h1>

                <p className="text-muted-foreground mb-4 max-w-md">{profile.bio}</p>

                {/* Stats */}
                <div className="flex flex-wrap gap-4 mb-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-foreground">{profile.postsCount}</p>
                    <p className="text-sm text-muted-foreground">постов</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-foreground">{profile.followersCount}</p>
                    <p className="text-sm text-muted-foreground">подписчиков</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-foreground">{profile.followingCount}</p>
                    <p className="text-sm text-muted-foreground">подписок</p>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-2">
                  <Button variant="default">Редактировать профиль</Button>
                  <Button variant="outline">Поделиться</Button>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-6 border-b border-border">
            <button
              onClick={() => setActiveTab('posts')}
              className={`px-4 py-2 font-semibold transition-colors ${
                activeTab === 'posts'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Посты ({posts.length})
            </button>
            <button
              onClick={() => setActiveTab('info')}
              className={`px-4 py-2 font-semibold transition-colors ${
                activeTab === 'info'
                  ? 'text-primary border-b-2 border-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              Информация
            </button>
          </div>

          {/* Content */}
          {activeTab === 'posts' ? (
            // Posts List
            <div className="space-y-6">
              {posts.length > 0 ? (
                posts.map((post) => (
                  <PostCard key={post.id} post={post} onLike={handleLike} />
                ))
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground text-lg">Нет постов</p>
                </div>
              )}
            </div>
          ) : (
            // Info Tab
            <div className="bg-card rounded-lg border border-border p-6 space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-2">О себе</h3>
                <p className="text-foreground">{profile.bio}</p>
              </div>

              <Separator />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin size={16} className="text-muted-foreground" />
                    <h3 className="text-sm font-semibold text-muted-foreground">Местоположение</h3>
                  </div>
                  <p className="text-foreground">San Francisco, USA</p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Mail size={16} className="text-muted-foreground" />
                    <h3 className="text-sm font-semibold text-muted-foreground">Контакт</h3>
                  </div>
                  <p className="text-foreground">john@example.com</p>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-3">Навыки</h3>
                <div className="flex flex-wrap gap-2">
                  {['React', 'TypeScript', 'Node.js', 'PostgreSQL', 'Docker', 'AWS'].map((skill) => (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-2">Присоединился</h3>
                <p className="text-foreground">January 2023</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

