import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { usePostStore } from '@/store/postStore';

interface CreatePostModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function CreatePostModal({ isOpen, onClose }: CreatePostModalProps) {
    const [content, setContent] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const { createPost, loading } = usePostStore();

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImage(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!content.trim()) return;

        try {
            await createPost(content, image || undefined);
            setContent('');
            setImage(null);
            setPreviewUrl(null);
            onClose();
        } catch (error) {
            console.error('Failed to create post:', error);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-card rounded-lg border border-border p-6 w-full max-w-2xl mx-4">
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-foreground">Создать пост</h2>
                    <button
                        onClick={onClose}
                        className="text-muted-foreground hover:text-foreground"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Content Textarea */}
                    <textarea
                        placeholder="Что у вас на уме?"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        disabled={loading}
                        className="w-full p-3 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                        rows={4}
                    />

                    {/* Image Preview */}
                    {previewUrl && (
                        <div className="relative">
                            <img
                                src={previewUrl}
                                alt="Preview"
                                className="w-full max-h-64 object-cover rounded-lg"
                            />
                            <button
                                type="button"
                                onClick={() => {
                                    setImage(null);
                                    setPreviewUrl(null);
                                }}
                                className="absolute top-2 right-2 bg-destructive text-white p-1 rounded-full hover:bg-destructive/90"
                            >
                                <X size={16} />
                            </button>
                        </div>
                    )}

                    {/* Image Upload */}
                    <div>
                        <label className="flex items-center justify-center w-full px-4 py-2 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary transition-colors">
                            <span className="text-sm text-muted-foreground">
                                {image ? 'Изображение выбрано' : 'Выберите изображение'}
                            </span>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                disabled={loading}
                                className="hidden"
                            />
                        </label>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2 justify-end">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={loading}
                        >
                            Отменить
                        </Button>
                        <Button
                            type="submit"
                            disabled={!content.trim() || loading}
                        >
                            {loading ? 'Создание...' : 'Создать'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

