'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { fetchPosts } from '@/store/blogSlice';
import { BlogPost } from '@/types';
import Sidebar from '@/components/Sidebar';
import PostGrid from '@/components/PostGrid';
import AuthModal from '@/components/AuthModal';

export default function BlogPage() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { posts, loading, error, filter } = useAppSelector(state => state.blog);
    const [searchTerm] = useState('');
    const [filterKey, setFilterKey] = useState(0);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    // Загружаем все посты при загрузке компонента
    useEffect(() => {
        dispatch(fetchPosts());
    }, [dispatch]);

    // Фильтруем посты на клиенте
    const filteredPosts = useMemo(() => {
        let filtered = posts;

        // Применяем фильтры из Redux store
        if (filter.isPublished !== undefined) {
            filtered = filtered.filter(post => post.isPublished === filter.isPublished);
        }

        if (filter.author) {
            filtered = filtered.filter(post => post.author === filter.author);
        }

        if (filter.tags && filter.tags.length > 0) {
            filtered = filtered.filter(post =>
                filter.tags!.some(tag => post.tags.includes(tag))
            );
        }

        // Применяем поиск
        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            filtered = filtered.filter(post =>
                post.title.toLowerCase().includes(searchLower) ||
                post.content.toLowerCase().includes(searchLower) ||
                post.excerpt.toLowerCase().includes(searchLower) ||
                post.tags.some(tag => tag.toLowerCase().includes(searchLower))
            );
        }

        return filtered;
    }, [posts, filter, searchTerm]);

    // Сбрасываем пагинацию при изменении фильтров или поиска
    useEffect(() => {
        setFilterKey(prev => prev + 1);
    }, [filter, searchTerm]);

    const handleViewPost = (post: BlogPost) => {
        if (post.id) {
            router.push(`/blog/post/${post.id}` as string);
        }
    };

    const handleFilterChange = () => {
        // Callback для изменений фильтров
    };

    return (
        <>
            <div className="flex min-h-screen">
                <Sidebar onFilterChange={handleFilterChange} />
                <PostGrid
                    key={filterKey}
                    posts={filteredPosts}
                    onPostSelect={handleViewPost}
                    loading={loading}
                    error={error}
                />
            </div>
            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
            />
        </>
    );
} 