'use client';

import { useState, useEffect, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { fetchPosts } from '@/store/blogSlice';
import { BlogPost } from '@/types';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import Header from './Header';
import Sidebar from './Sidebar';
import PostGrid from './PostGrid';
import PostForm from './PostForm';
import PostDetail from './PostDetail';
import TagsPage from './TagsPage';
import ProjectsPage from './ProjectsPage';
import AboutPage from './AboutPage';
import Footer from './Footer';
import AuthModal from './AuthModal';
import MobileFilterModal from './MobileFilterModal';

type ViewMode = 'list' | 'create' | 'edit' | 'detail';
type PageView = 'blog' | 'tags' | 'projects' | 'about';

function BlogAppContent() {
    const dispatch = useAppDispatch();
    const { posts, loading, filter } = useAppSelector(state => state.blog);
    const { user } = useAuth();
    const [viewMode, setViewMode] = useState<ViewMode>('list');
    const [currentPost, setCurrentPost] = useState<BlogPost | undefined>(undefined);
    const [currentPage, setCurrentPage] = useState<PageView>('blog');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterKey, setFilterKey] = useState(0); // Для сброса пагинации при изменении фильтров
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

    // Загружаем ВСЕ посты при загрузке компонента (без фильтров)
    useEffect(() => {
        dispatch(fetchPosts()); // Загружаем все посты
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

    const handleSignInClick = () => {
        setIsAuthModalOpen(true);
    };

    const handleEditPost = (post: BlogPost) => {
        if (!user) {
            setIsAuthModalOpen(true);
            return;
        }
        setCurrentPost(post);
        setViewMode('edit');
    };

    const handleViewPost = (post: BlogPost) => {
        setCurrentPost(post);
        setViewMode('detail');
    };

    const handleFormSuccess = () => {
        setViewMode('list');
        setCurrentPost(undefined);
        // Перезагружаем все посты после создания/обновления
        dispatch(fetchPosts());
    };

    const handleFormCancel = () => {
        setViewMode('list');
        setCurrentPost(undefined);
    };

    const handleDetailClose = () => {
        setViewMode('list');
        setCurrentPost(undefined);
    };

    const handleFilterChange = () => {
        // Фильтры уже установлены в Redux через dispatch(setFilter) в Sidebar
        // Фильтрация происходит через useMemo выше
    };

    const handlePageChange = (page: string) => {
        setCurrentPage(page as PageView);
        setViewMode('list');
        setCurrentPost(undefined);
    };

    const renderContent = () => {
        if (currentPage !== 'blog') {
            switch (currentPage) {
                case 'tags':
                    return <TagsPage />;
                case 'projects':
                    return <ProjectsPage />;
                case 'about':
                    return <AboutPage />;
                default:
                    return <TagsPage />;
            }
        }

        switch (viewMode) {
            case 'list':
                return (
                    <div className="flex flex-col md:flex-row min-h-screen relative">
                        {/* Sidebar для md+ */}
                        <Sidebar onFilterChange={handleFilterChange} className="hidden md:block" />

                        {/* Mobile Filters Modal */}
                        <MobileFilterModal
                            isOpen={isMobileFilterOpen}
                            onClose={() => setIsMobileFilterOpen(false)}
                            onFilterChange={handleFilterChange}
                        />
                        <PostGrid
                            key={filterKey}
                            posts={filteredPosts}
                            onPostSelect={handleViewPost}
                            loading={loading}
                        />
                    </div>
                );

            case 'create':
                return (
                    <div className="max-w-4xl mx-auto px-8 py-8">
                        <PostForm
                            onCancel={handleFormCancel}
                            onSuccess={handleFormSuccess}
                        />
                    </div>
                );

            case 'edit':
                return (
                    <div className="max-w-4xl mx-auto px-8 py-8">
                        <PostForm
                            post={currentPost}
                            onCancel={handleFormCancel}
                            onSuccess={handleFormSuccess}
                        />
                    </div>
                );

            case 'detail':
                return currentPost ? (
                    <div className="max-w-4xl mx-auto px-8 py-8">
                        <PostDetail
                            post={currentPost}
                            onEdit={handleEditPost}
                            onClose={handleDetailClose}
                            onPostUpdate={() => dispatch(fetchPosts())}
                        />
                    </div>
                ) : null;

            default:
                return (
                    <div className="flex min-h-screen">
                        <Sidebar onFilterChange={handleFilterChange} />
                        <PostGrid
                            key={filterKey} // Принудительно сбрасываем компонент при изменении фильтров
                            posts={filteredPosts}
                            onPostSelect={handleViewPost}
                            loading={loading}

                        />
                    </div>
                );
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            <Header
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                currentView={currentPage}
                onViewChange={handlePageChange}
                onSignInClick={handleSignInClick}
                onMobileFilterClick={() => setIsMobileFilterOpen(prev => !prev)}
                mobileFilterActive={isMobileFilterOpen}
            />

            <main className="min-h-screen">
                {renderContent()}
            </main>

            <Footer />

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
            />
        </div>
    );
}

export default function BlogApp() {
    return (
        <AuthProvider>
            <BlogAppContent />
        </AuthProvider>
    );
} 