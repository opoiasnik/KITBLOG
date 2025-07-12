'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { fetchPosts } from '@/store/blogSlice';
import { BlogPost } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import Sidebar from '@/components/Sidebar';
import PostGrid from '@/components/PostGrid';
import PostForm from '@/components/PostForm';
import PostDetail from '@/components/PostDetail';
import AuthModal from '@/components/AuthModal';

export default function BlogPage() {
    const { id } = useParams<{ id?: string }>();
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useAppDispatch();
    const { posts, loading, error, filter } = useAppSelector(state => state.blog);
    const { user } = useAuth();
    const [searchTerm] = useState('');
    const [filterKey, setFilterKey] = useState(0);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    
    const getCurrentMode = () => {
        const path = location.pathname;
        if (path === '/blog/create') return 'create';
        if (path.startsWith('/blog/edit/')) return 'edit';
        if (path.startsWith('/blog/post/')) return 'detail';
        return 'list';
    };

    const currentMode = getCurrentMode();

    
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

    const handleEditPost = (post: BlogPost) => {
        if (!user) {
            setIsAuthModalOpen(true);
            return;
        }
        navigate(`/blog/edit/${post.id}`);
    };

    const handleViewPost = (post: BlogPost) => {
        navigate(`/blog/post/${post.id}`);
    };

    const handleFormCancel = () => {
        navigate('/blog');
    };

    const handleFormSuccess = () => {
        navigate('/blog');
    };

    const handleDetailClose = () => {
        navigate('/blog');
    };

    const handleFilterChange = () => {
        
    };

    
    const currentPost: BlogPost | undefined = id ? posts.find(post => post.id === id) : undefined;

    const renderContent = () => {
        switch (currentMode) {
            case 'create':
                return (
                    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-6 sm:py-8">
                        <PostForm
                            onCancel={handleFormCancel}
                            onSuccess={handleFormSuccess}
                        />
                    </div>
                );

            case 'edit':
                return currentPost ? (
                    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-6 sm:py-8">
                        <PostForm
                            post={currentPost}
                            onCancel={handleFormCancel}
                            onSuccess={handleFormSuccess}
                        />
                    </div>
                ) : (
                    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-6 sm:py-8">
                        <div className="text-center text-white">
                            <h2 className="text-2xl font-bold mb-4">Post not found</h2>
                            <button
                                onClick={() => navigate('/blog')}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                            >
                                Back to Blog
                            </button>
                        </div>
                    </div>
                );

            case 'detail':
                return currentPost ? (
                    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-6 sm:py-8">
                        <PostDetail
                            post={currentPost}
                            onEdit={handleEditPost}
                            onClose={handleDetailClose}
                            onPostUpdate={() => dispatch(fetchPosts())}
                        />
                    </div>
                ) : (
                    <div className="max-w-4xl mx-auto px-4 sm:px-8 py-6 sm:py-8">
                        <div className="text-center text-white">
                            <h2 className="text-2xl font-bold mb-4">Post not found</h2>
                            <button
                                onClick={() => navigate('/blog')}
                                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                            >
                                Back to Blog
                            </button>
                        </div>
                    </div>
                );

            default:
                return (
                    <div className="flex min-h-screen">
                        <Sidebar
                            onFilterChange={handleFilterChange}
                            onClick={() => { }}
                            isOpen={true}
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
    };

    return (
        <>
            {renderContent()}
            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
            />
        </>
    );
}
