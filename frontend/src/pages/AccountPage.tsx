import { useState, useEffect } from 'react';
import PostCard from '@/components/PostCard';
import Sidebar from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { Mail, MapPin } from 'lucide-react';
import { useUserStore } from '@/store/userStore';
import { usePostStore } from '@/store/postStore';

export default function AccountPage() {
  const { currentUser, fetchCurrentUser, loading: userLoading, updateCurrentUser } = useUserStore();
  const { userPosts, fetchUserPosts, loading: postsLoading } = usePostStore();
  const [activeTab, setActiveTab] = useState<'posts' | 'info'>('posts');
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    bio: '',
    location: '',
    currentPassword: '',
    newPassword: ''
  });
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  useEffect(() => {
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (currentUser?.username) {
      fetchUserPosts(currentUser.username, 0);
    }
  }, [currentUser?.username]);

  // Инициализировать форму редактирования при загрузке профиля
  useEffect(() => {
    if (currentUser) {
      setEditForm({
        name: currentUser.name || '',
        email: currentUser.email || currentUser.mail || '',
        bio: currentUser.bio || '',
        location: currentUser.location || '',
        currentPassword: '',
        newPassword: ''
      });
    }
  }, [currentUser?.id]);

  const handleSaveProfile = async () => {
    setIsSavingProfile(true);
    try {
      await updateCurrentUser({
        email: editForm.email,
        currentPassword: editForm.currentPassword || undefined,
        newPassword: editForm.newPassword || undefined
      });
      setIsEditingProfile(false);
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setIsSavingProfile(false);
    }
  };

  if (userLoading || !currentUser) {
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
                src={currentUser.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=User'}
                alt={currentUser.name}
                className="w-24 h-24 rounded-full object-cover border-2 border-primary"
              />

              {/* Profile Info */}
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-foreground mb-2">{currentUser.name}</h1>

                <p className="text-muted-foreground mb-4 max-w-md">{currentUser.bio || 'No bio'}</p>

                {/* Stats */}
                <div className="flex flex-wrap gap-4 mb-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-foreground">{userPosts.length}</p>
                    <p className="text-sm text-muted-foreground">постов</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-foreground">{currentUser.followersCount || 0}</p>
                    <p className="text-sm text-muted-foreground">подписчиков</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-foreground">{currentUser.followingCount || 0}</p>
                    <p className="text-sm text-muted-foreground">подписок</p>
                  </div>
                </div>

                {/* Buttons */}
                <div className="flex gap-2">
                  <Button
                    variant="default"
                    onClick={() => setIsEditingProfile(!isEditingProfile)}
                  >
                    {isEditingProfile ? 'Отменить' : 'Редактировать профиль'}
                  </Button>
                  <Button variant="outline">Поделиться</Button>
                </div>
              </div>
            </div>
          </div>

          {/* Edit Profile Form */}
          {isEditingProfile && (
            <div className="bg-card rounded-lg border border-border p-6 mb-6 space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Редактировать профиль</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Имя (только просмотр)</label>
                  <input
                    type="text"
                    value={editForm.name}
                    disabled
                    className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-muted text-muted-foreground cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground">Email</label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-background text-foreground"
                    placeholder="example@mail.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-foreground">Текущий пароль</label>
                  <input
                    type="password"
                    value={editForm.currentPassword}
                    onChange={(e) => setEditForm({ ...editForm, currentPassword: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-background text-foreground"
                    placeholder="Введите текущий пароль"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground">Новый пароль</label>
                  <input
                    type="password"
                    value={editForm.newPassword}
                    onChange={(e) => setEditForm({ ...editForm, newPassword: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-lg border border-border bg-background text-foreground"
                    placeholder="Минимум 8 символов"
                  />
                </div>
              </div>

              <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg text-xs text-blue-500">
                Примечание: На данный момент бекенд поддерживает обновление только Email и Пароля.
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleSaveProfile}
                  disabled={isSavingProfile}
                  variant="default"
                >
                  {isSavingProfile ? 'Сохранение...' : 'Сохранить изменения'}
                </Button>
                <Button
                  onClick={() => setIsEditingProfile(false)}
                  variant="outline"
                >
                  Отменить
                </Button>
              </div>
            </div>
          )}

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
              Посты ({userPosts.length})
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
              {postsLoading && <LoadingSpinner />}

              {!postsLoading && userPosts.length > 0 ? (
                userPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    isCurrentUserPost={true}
                  />
                ))
              ) : (
                !postsLoading && (
                  <div className="text-center py-12">
                    <p className="text-muted-foreground text-lg">Нет постов</p>
                  </div>
                )
              )}
            </div>
          ) : (
            // Info Tab
            <div className="bg-card rounded-lg border border-border p-6 space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-2">О себе</h3>
                <p className="text-foreground">{currentUser.bio || 'No bio'}</p>
              </div>

              <Separator />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <MapPin size={16} className="text-muted-foreground" />
                    <h3 className="text-sm font-semibold text-muted-foreground">Местоположение</h3>
                  </div>
                  <p className="text-foreground">{currentUser.location || 'Not specified'}</p>
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Mail size={16} className="text-muted-foreground" />
                    <h3 className="text-sm font-semibold text-muted-foreground">Контакт</h3>
                  </div>
                  <p className="text-foreground">{currentUser.email || currentUser.mail}</p>
                </div>
              </div>

              {currentUser.skills && currentUser.skills.length > 0 && (
                <>
                  <Separator />

                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground mb-3">Навыки</h3>
                    <div className="flex flex-wrap gap-2">
                      {currentUser.skills.map((skill) => (
                        <Badge key={skill} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <Separator />

              <div>
                <h3 className="text-sm font-semibold text-muted-foreground mb-2">Присоединился</h3>
                <p className="text-foreground">
                  {currentUser.joinedAt
                    ? new Date(currentUser.joinedAt).toLocaleDateString('ru-RU', {
                        year: 'numeric',
                        month: 'long'
                      })
                    : 'Unknown'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

