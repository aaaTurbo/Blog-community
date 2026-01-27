import Sidebar from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Github, Mail, Globe } from 'lucide-react';

export default function About() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />

      <div className="flex justify-center pt-20 pb-8">
        <div className="w-full max-w-2xl px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Blog<span className="text-primary">Community</span>
            </h1>
            <p className="text-xl text-muted-foreground">Социальная сеть для разработчиков и дизайнеров</p>
          </div>

          {/* Main Content */}
          <div className="bg-card rounded-lg border border-border p-8 space-y-8">
            {/* Description */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">О приложении</h2>
              <p className="text-foreground leading-relaxed mb-4">
                BlogCommunity — это современная социальная сеть, созданная специально для IT-специалистов, разработчиков и дизайнеров. Здесь вы можете делиться своими проектами, идеями и опытом с единомышленниками.
              </p>
              <p className="text-foreground leading-relaxed">
                Наша платформа поддерживает обмен опытом через посты, комментарии и реакции, что создает благоприятное сообщество для профессионального роста и развития.
              </p>
            </section>

            <Separator />

            {/* Features */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">Возможности</h2>
              <ul className="space-y-3">
                {[
                  'Создание и публикация постов с изображениями',
                  'Система реакций (лайки, сердца и другие эмодзи)',
                  'Интерактивный раздел комментариев',
                  'Система подписок и подписчиков',
                  'Персональный профиль с портфолио',
                  'Тёмная и светлая тема',
                  'Адаптивный дизайн для мобильных устройств',
                  'Быстрая загрузка контента'
                ].map((feature, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-primary font-bold mt-1">✓</span>
                    <span className="text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </section>

            <Separator />

            {/* Technology Stack */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">Стек технологий</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Frontend</h3>
                  <ul className="text-muted-foreground space-y-1">
                    <li>• React 18+</li>
                    <li>• TypeScript</li>
                    <li>• Tailwind CSS</li>
                    <li>• Vite</li>
                    <li>• React Router</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Tools & Libraries</h3>
                  <ul className="text-muted-foreground space-y-1">
                    <li>• Zustand (State Management)</li>
                    <li>• React Hook Form</li>
                    <li>• Zod (Validation)</li>
                    <li>• Radix UI</li>
                    <li>• Lucide Icons</li>
                  </ul>
                </div>
              </div>
            </section>

            <Separator />

            {/* Contact */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-4">Свяжитесь с нами</h2>
              <p className="text-foreground mb-6">
                У вас есть вопросы или предложения? Мы рады услышать ваше мнение!
              </p>
              <div className="flex flex-wrap gap-3">
                <Button className="gap-2">
                  <Mail size={18} />
                  Email
                </Button>
                <Button variant="outline" className="gap-2">
                  <Github size={18} />
                  GitHub
                </Button>
                <Button variant="outline" className="gap-2">
                  <Globe size={18} />
                  Website
                </Button>
              </div>
            </section>

            <Separator />

            {/* Footer Info */}
            <section className="text-center">
              <p className="text-sm text-muted-foreground">
                © 2026 BlogCommunity. Все права защищены.
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Версия 1.0.0
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

