'use client';

import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { fetchPosts, setFilter, clearFilter } from '@/store/blogSlice';
import { BlogPost, FilterOptions } from '@/types';
import { format } from 'date-fns';
import { Search, Filter, Calendar, User, Tag, BookOpen } from 'lucide-react';

interface PostListProps {
    onPostSelect: (post: BlogPost) => void;
}

export default function PostList({ onPostSelect }: PostListProps) {
    const dispatch = useAppDispatch();
    const { posts, loading, error } = useAppSelector(state => state.blog);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [selectedAuthor, setSelectedAuthor] = useState('');
    const [showOnlyPublished, setShowOnlyPublished] = useState(true);
    const [showFilters, setShowFilters] = useState(false);

    
    const allTags = Array.from(new Set(posts.flatMap(post => post.tags)));
    const allAuthors = Array.from(new Set(posts.map(post => post.author)));

    useEffect(() => {
        const filterOptions: FilterOptions = {
            searchTerm: searchTerm || undefined,
            tags: selectedTags.length > 0 ? selectedTags : undefined,
            author: selectedAuthor || undefined,
            isPublished: showOnlyPublished ? true : undefined
        };

        dispatch(setFilter(filterOptions));
        dispatch(fetchPosts(filterOptions));
    }, [dispatch, searchTerm, selectedTags, selectedAuthor, showOnlyPublished]);

    const handleTagToggle = (tag: string) => {
        setSelectedTags(prev =>
            prev.includes(tag)
                ? prev.filter(t => t !== tag)
                : [...prev, tag]
        );
    };

    const handleClearFilters = () => {
        setSearchTerm('');
        setSelectedTags([]);
        setSelectedAuthor('');
        setShowOnlyPublished(true);
        dispatch(clearFilter());
        dispatch(fetchPosts());
    };

    const formatDate = (date: Date) => {
        return format(date, 'MMM dd, yyyy');
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="relative">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    <div className="absolute inset-0 animate-pulse rounded-full h-12 w-12 border-2 border-purple-500/30"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-6 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <div className="text-red-300">
                        <strong>Error:</strong> {error}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            
            <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 p-6 shadow-xl">
                <div className="flex flex-col md:flex-row gap-4 mb-4">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                        <input
                            type="text"
                            placeholder="Search posts..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 bg-gray-900/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                        />
                    </div>
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-200 font-medium ${showFilters
                            ? 'bg-blue-600 text-white shadow-lg'
                            : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 hover:text-white'
                            }`}
                    >
                        <Filter className="h-4 w-4" />
                        Filters
                    </button>
                </div>

                {showFilters && (
                    <div className="space-y-6 pt-6 border-t border-gray-700/50">
                        <div>
                            <label className="flex items-center gap-3 mb-4 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={showOnlyPublished}
                                    onChange={(e) => setShowOnlyPublished(e.target.checked)}
                                    className="w-4 h-4 text-blue-600 bg-gray-900 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                                />
                                <span className="text-gray-300 group-hover:text-white transition-colors">Published posts only</span>
                            </label>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-3">
                                Author
                            </label>
                            <select
                                value={selectedAuthor}
                                onChange={(e) => setSelectedAuthor(e.target.value)}
                                className="w-full p-3 bg-gray-900/50 border border-gray-600 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                            >
                                <option value="">All authors</option>
                                {allAuthors.map(author => (
                                    <option key={author} value={author}>{author}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-300 mb-3">
                                Tags
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {allTags.map(tag => (
                                    <button
                                        key={tag}
                                        onClick={() => handleTagToggle(tag)}
                                        className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${selectedTags.includes(tag)
                                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105'
                                            : 'bg-gray-700/50 text-gray-300 hover:bg-gray-600/50 hover:text-white hover:scale-105'
                                            }`}
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button
                                onClick={handleClearFilters}
                                className="px-4 py-2 text-sm text-gray-400 hover:text-white transition-colors hover:underline"
                            >
                                Clear filters
                            </button>
                        </div>
                    </div>
                )}
            </div>

            
            <div className="space-y-4">
                {posts.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="mx-auto w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center mb-4">
                            <BookOpen className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-gray-400 text-lg">No posts found</p>
                        <p className="text-gray-500 text-sm mt-2">Try adjusting your search or filters</p>
                    </div>
                ) : (
                    posts.map(post => (
                        <div
                            key={post.id}
                            className="bg-gray-800/30 backdrop-blur-sm rounded-xl border border-gray-700/50 hover:border-gray-600/50 hover:bg-gray-800/50 transition-all duration-300 cursor-pointer group overflow-hidden"
                            onClick={() => onPostSelect(post)}
                        >
                            <div className="p-6">
                                <div className="flex items-start justify-between mb-3">
                                    <h2 className="text-xl font-semibold text-white group-hover:text-blue-400 transition-colors line-clamp-2">
                                        {post.title}
                                    </h2>
                                    {!post.isPublished && (
                                        <span className="px-3 py-1 bg-amber-500/20 text-amber-400 text-xs rounded-full border border-amber-500/30 font-medium">
                                            Draft
                                        </span>
                                    )}
                                </div>

                                <p className="text-gray-300 mb-4 line-clamp-2 leading-relaxed">
                                    {post.excerpt}
                                </p>

                                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                                    <div className="flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                                        <User className="h-4 w-4" />
                                        <span className="text-gray-300">{post.author}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Calendar className="h-4 w-4" />
                                        <span>{formatDate(post.createdAt)}</span>
                                    </div>
                                    {post.tags.length > 0 && (
                                        <div className="flex items-center gap-2">
                                            <Tag className="h-4 w-4" />
                                            <div className="flex gap-1.5">
                                                {post.tags.slice(0, 3).map(tag => (
                                                    <span key={tag} className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-md font-medium">
                                                        {tag}
                                                    </span>
                                                ))}
                                                {post.tags.length > 3 && (
                                                    <span className="text-gray-400 text-xs">+{post.tags.length - 3} more</span>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
