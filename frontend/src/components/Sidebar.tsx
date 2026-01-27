import { Menu, Home, User, LogOut, Info, Moon, Sun, Plus } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useTheme } from '@/components/ThemeProvider';
import { useState } from 'react';
import CreatePostModal from '@/components/CreatePostModal';

export default function Sidebar() {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const { theme, setTheme } = useTheme();
  const [isCreatePostOpen, setIsCreatePostOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  return (
    <>
      <CreatePostModal
        isOpen={isCreatePostOpen}
        onClose={() => setIsCreatePostOpen(false)}
      />

      <Sheet>
        <SheetTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="fixed top-4 left-4 z-40"
          >
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>

        <SheetContent side="left" className="w-64 p-0 flex flex-col">
          {/* Header */}
          <div className="p-6 bg-primary/10">
            <h2 className="text-2xl font-bold">
              Blog<span className="text-primary">Community</span>
            </h2>
          </div>

          {/* Create Post Button */}
          <div className="p-4">
            <Button
              onClick={() => setIsCreatePostOpen(true)}
              className="w-full gap-2"
            >
              <Plus size={20} />
              <span>Создать пост</span>
            </Button>
          </div>

          <Separator />

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            <Link to="/" className="block">
              <Button
                variant="ghost"
                className="w-full justify-start gap-3"
              >
                <Home size={20} />
                <span>Лента</span>
              </Button>
            </Link>

            <Link to="/account" className="block">
              <Button
                variant="ghost"
                className="w-full justify-start gap-3"
              >
                <User size={20} />
                <span>Мой профиль</span>
              </Button>
            </Link>

            <Link to="/about" className="block">
              <Button
                variant="ghost"
                className="w-full justify-start gap-3"
              >
                <Info size={20} />
                <span>О приложении</span>
              </Button>
            </Link>
          </nav>

          <Separator />

          {/* Settings */}
          <div className="p-4 space-y-2">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3"
              onClick={toggleTheme}
            >
              {theme === 'dark' ? (
                <>
                  <Sun size={20} />
                  <span>Светлая тема</span>
                </>
              ) : (
                <>
                  <Moon size={20} />
                  <span>Тёмная тема</span>
                </>
              )}
            </Button>

            <Button
              variant="destructive"
              className="w-full justify-start gap-3"
              onClick={handleLogout}
            >
              <LogOut size={20} />
              <span>Выход</span>
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}

