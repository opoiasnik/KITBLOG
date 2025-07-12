'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Search, PlusCircle, LogIn, Filter as FilterIcon } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import UserProfile from './UserProfile';

interface HeaderProps {
    onSignInClick: () => void;
    searchTerm?: string;
    onSearchChange?: (term: string) => void;
    currentView?: string;
    onViewChange?: (page: string) => void;
    onMobileFilterClick?: () => void;
    mobileFilterActive?: boolean;
}

export default function Header({ onSignInClick, searchTerm = '', onSearchChange, onMobileFilterClick, mobileFilterActive }: HeaderProps) {
    const router = useRouter();
    const pathname = usePathname();
    const { user, loading } = useAuth();
    const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);

    const handleCreatePost = () => {
        if (!user) {
            onSignInClick();
            return;
        }
        router.push('/blog/create');
    };

    const handleSearchChange = (term: string) => {
        setLocalSearchTerm(term);
        if (onSearchChange) {
            onSearchChange(term);
        }
    };

    const navItems = [
        { key: '/blog', label: 'Blog', path: '/blog' },
        { key: '/tags', label: 'Tags', path: '/tags' },
        { key: '/projects', label: 'Projects', path: '/projects' },
        { key: '/about', label: 'About', path: '/about' },
    ];

    // Определяем текущую страницу
    const getCurrentPage = () => {
        if (pathname?.startsWith('/blog')) return '/blog';
        return pathname;
    };

    const currentPage = getCurrentPage();

    const headerBg = mobileFilterActive ? 'bg-gray-900' : 'bg-gray-900/95 backdrop-blur-sm';
    return (
        <header className={`${headerBg} border-b border-gray-800 sticky top-0 z-50`}>
            <div className="max-w-full px-8 py-4">
                <div className="flex items-center justify-between">
                    {/* Logo */}
                    <div className="flex items-center gap-3">
                        <Link
                            href="/blog"
                            className="flex items-center gap-2 text-2xl font-bold hover:opacity-80 transition-opacity"
                        >
                            <span className="text-cyan-400">⚡</span>
                            <span className="text-white">KITBLOG</span>
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav className="hidden md:flex items-center gap-8">
                        {navItems.map(item => (
                            <Link
                                key={item.key}
                                href={item.path}
                                className={`text-sm font-medium transition-colors outline-none focus:outline-none ${currentPage === item.key
                                    ? 'text-white'
                                    : 'text-gray-400 hover:text-white'
                                    }`}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Search */}
                    {currentPage === '/blog' && (
                        <div className="hidden lg:flex items-center gap-4 flex-1 max-w-md mx-8">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <input
                                    type="text"
                                    placeholder="Search posts..."
                                    value={localSearchTerm}
                                    onChange={(e) => handleSearchChange(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                                />
                            </div>
                        </div>
                    )}

                    {/* Right Side */}
                    <div className="flex items-center gap-4">
                        {/* Mobile Filter Button */}
                        {currentPage === '/blog' && (
                            <button
                                onClick={() => {
                                    console.log('Mobile filter button clicked');
                                    onMobileFilterClick?.();
                                }}
                                className="md:hidden flex items-center justify-center p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                                aria-label="Filters"
                            >
                                <FilterIcon className="h-5 w-5" />
                            </button>
                        )}
                        {loading ? (
                            <div className="w-8 h-8 rounded-full bg-gray-700 animate-pulse"></div>
                        ) : user ? (
                            <div className="flex items-center gap-3">
                                {/* Create Post Button for authenticated users */}
                                {currentPage === '/blog' && (
                                    <button
                                        onClick={handleCreatePost}
                                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                                    >
                                        <PlusCircle className="h-4 w-4" />
                                        <span className="hidden sm:inline">Create Post</span>
                                    </button>
                                )}
                                <UserProfile />
                            </div>
                        ) : (
                            <button
                                onClick={onSignInClick}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                            >
                                <LogIn className="h-4 w-4" />
                                <span className="hidden sm:inline">Sign In</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
} 