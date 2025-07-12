'use client';

import { BlogPost } from '@/types';
import { format } from 'date-fns';
import { Calendar, User, BookOpen } from 'lucide-react';
import Pagination from './Pagination';
import { useState, useEffect } from 'react';

interface PostGridProps {
    posts: BlogPost[];
    onPostSelect: (post: BlogPost) => void;
    loading?: boolean;
    error?: string;
}

const POSTS_PER_PAGE = 5;

export default function PostGrid({ posts, onPostSelect, loading, error }: PostGridProps) {
    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
    const startIndex = (currentPage - 1) * POSTS_PER_PAGE;
    const endIndex = startIndex + POSTS_PER_PAGE;
    const currentPosts = posts.slice(startIndex, endIndex);

    
    useEffect(() => {
        setCurrentPage(1);
    }, [posts.length]);

    const formatDate = (date: Date) => {
        return format(date, 'MMMM dd, yyyy');
    };

    const getTagColor = (tag: string) => {
        const colors = [
            'bg-pink-500/20 text-pink-400 border-pink-500/30',
            'bg-blue-500/20 text-blue-400 border-blue-500/30',
            'bg-green-500/20 text-green-400 border-green-500/30',
            'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
            'bg-purple-500/20 text-purple-400 border-purple-500/30',
            'bg-orange-500/20 text-orange-400 border-orange-500/30',
            'bg-red-500/20 text-red-400 border-red-500/30',
            'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
        ];

        const index = tag.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return colors[index % colors.length];
    };

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (loading) {
        return (
            <div className="flex-1 flex justify-center items-center h-64">
                <div className="relative">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    <div className="absolute inset-0 animate-pulse rounded-full h-12 w-12 border-2 border-purple-500/30"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex-1 p-8">
                <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-6 backdrop-blur-sm">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        <div className="text-red-300">
                            <strong>Error:</strong> {error}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (posts.length === 0) {
        return (
            <div className="flex-1 flex flex-col items-center justify-center py-20">
                <div className="w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center mb-4">
                    <BookOpen className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-400 text-xl mb-2">No posts found</p>
                <p className="text-gray-500">Try adjusting your filters or search</p>
            </div>
        );
    }

    return (
        <div className="flex-1 min-w-0 flex flex-col">
            <div className="flex-1 px-4 py-6 sm:p-8 space-y-4 sm:space-y-6">
                {currentPosts.map(post => (
                    <article
                        key={post.id}
                        className="relative bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 rounded-xl p-4 sm:p-6 hover:bg-gray-900/70 hover:border-gray-700/50 transition-all duration-300 cursor-pointer group"
                        onClick={() => onPostSelect(post)}
                    >
                        
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2 text-sm text-gray-400">
                                    <Calendar className="w-4 h-4" />
                                    <span>{formatDate(post.createdAt)}</span>
                                </div>
                                <h2 className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors mb-2">
                                    {post.title}
                                </h2>
                                <p className="text-gray-300 line-clamp-2 leading-relaxed">
                                    {post.content.substring(0, 200)}...
                                </p>
                            </div>
                            {!post.isPublished && (
                                <span className="absolute sm:static top-3 right-3 sm:ml-4 px-2.5 py-0.5 bg-amber-500/20 text-amber-400 text-[10px] sm:text-xs rounded-full border border-amber-500/30 font-medium">
                                    Draft
                                </span>
                            )}
                        </div>

                        
                        <div className="flex flex-wrap gap-2 mb-4">
                            {post.tags.map(tag => (
                                <span
                                    key={tag}
                                    className={`px-3 py-1 rounded-full text-xs font-medium border uppercase ${getTagColor(tag)}`}
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>

                        
                        <div className="flex flex-wrap items-center justify-between text-sm text-gray-400 border-t border-gray-800/50 pt-4 gap-2">
                            <div className="flex items-center gap-2">
                                <User className="w-4 h-4" />
                                <span className="uppercase">{post.author}</span>
                            </div>
                            <div className="hidden sm:flex items-center gap-4">
                                <span className="uppercase">{post.tags.join(', ')}</span>
                                <span className="uppercase">{post.tags.length > 1 ? 'Guide' : 'Feature'}</span>
                            </div>
                        </div>
                    </article>
                ))}
            </div>

            
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                totalItems={posts.length}
                itemsPerPage={POSTS_PER_PAGE}
            />
        </div>
    );
}
