'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import PostForm from '@/components/PostForm';
import AuthModal from '@/components/AuthModal';
import { useEffect } from 'react';

export default function CreatePostPage() {
    const router = useRouter();
    const { user } = useAuth();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    useEffect(() => {
        if (!user) {
            setIsAuthModalOpen(true);
        }
    }, [user]);

    const handleFormCancel = () => {
        router.push('/blog');
    };

    const handleFormSuccess = () => {
        router.push('/blog');
    };

    if (!user) {
        return (
            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => router.push('/blog')}
            />
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-8 py-6 sm:py-8">
            <PostForm
                onCancel={handleFormCancel}
                onSuccess={handleFormSuccess}
            />
        </div>
    );
}
