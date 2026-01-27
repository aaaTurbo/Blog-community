import { Loader2 } from 'lucide-react';

export function LoadingSpinner() {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="flex flex-col items-center gap-4">
        <Loader2 size={64} className="animate-spin text-primary" />
        <p className="text-foreground font-semibold text-lg">Загрузка...</p>
      </div>
    </div>
  );
}

