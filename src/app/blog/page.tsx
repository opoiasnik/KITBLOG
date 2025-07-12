'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { fetchPosts } from '@/store/blogSlice';
import { BlogPost } from '@/types';
import Sidebar from '@/components/Sidebar';
import PostGrid from '@/components/PostGrid';
import { useSidebar } from '@/components/LayoutContent';

export default function BlogPage() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { posts, loading, error, filter } = useAppSelector(state => state.blog);
    const { isSidebarOpen, onSidebarToggle } = useSidebar();
    const [searchTerm] = useState('');
    const [filterKey, setFilterKey] = useState(0);

    
    useEffect(() => {
        dispatch(fetchPosts());
    }, [dispatch]);

    
    const filteredPosts = useMemo(() => {
        let filtered = posts;

        
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

    
    useEffect(() => {
        setFilterKey(prev => prev + 1);
    }, [filter, searchTerm]);

    const handleViewPost = (post: BlogPost) => {
        if (post.id) {
            router.push(`/blog/post/${post.id}` as string);
        }
    };

    const handleFilterChange = () => {
        
    };

    return (
        <div className="flex min-h-screen overflow-x-hidden">
            <Sidebar
                onClick={onSidebarToggle}
                onFilterChange={handleFilterChange}
                isOpen={isSidebarOpen}
            />
            <PostGrid
                key={filterKey}
                posts={filteredPosts}
                onPostSelect={handleViewPost}
                loading={loading}
                error={error || undefined}
            />
        </div>
    );
}
