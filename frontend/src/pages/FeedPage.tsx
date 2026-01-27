import { useEffect } from 'react';
import PostCard from '@/components/PostCard';
import Sidebar from '@/components/Sidebar';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { usePostStore } from '@/store/postStore';
import { Button } from '@/components/ui/button';

export default function FeedPage() {
  const { feedPosts, loading, error, fetchFeedPosts, nextPage, hasMore } = usePostStore();

  useEffect(() => {
    fetchFeedPosts(0);
  }, []);

  const handleLoadMore = async () => {
    await nextPage();
  };

  if (loading && feedPosts.length === 0) {
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

          {error && (
            <div className="p-4 bg-destructive/10 text-destructive border border-destructive rounded-md">
              {error}
            </div>
          )}

          {feedPosts.length > 0 ? (
            <>
              <div className="space-y-6">
                {feedPosts.map((post) => (
                  <PostCard key={post.id} post={post} />
                ))}
              </div>

              {hasMore && (
                <div className="flex justify-center py-8">
                  <Button
                    onClick={handleLoadMore}
                    disabled={loading}
                    variant="outline"
                  >
                    {loading ? 'Загрузка...' : 'Загрузить ещё'}
                  </Button>
                </div>
              )}
            </>
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

