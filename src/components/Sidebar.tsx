'use client';

import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { setFilter, clearFilter } from '@/store/blogSlice';
import { FilterOptions } from '@/types';
import { MoreHorizontal } from 'lucide-react';
import TagModal from './TagModal';
import AuthorModal from './AuthorModal';

interface SidebarProps {
    onFilterChange: () => void;
}

export default function Sidebar({ onFilterChange }: SidebarProps) {
    const dispatch = useAppDispatch();
    const { posts, filter } = useAppSelector(state => state.blog);
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    const [selectedAuthor, setSelectedAuthor] = useState('');
    const [showOnlyPublished, setShowOnlyPublished] = useState(true);
    const [isTagModalOpen, setIsTagModalOpen] = useState(false);
    const [isAuthorModalOpen, setIsAuthorModalOpen] = useState(false);

    // Используем все посты из Redux store (теперь они всегда содержат все посты)
    const allPosts = posts;

    // Синхронизируем локальное состояние с Redux store
    useEffect(() => {
        setSelectedTags(filter.tags || []);
        setSelectedAuthor(filter.author || '');
        setShowOnlyPublished(filter.isPublished !== false);
    }, [filter]);

    // Получаем все уникальные теги и авторов с подсчетом из ВСЕХ постов
    const tagCounts = allPosts.reduce((acc, post) => {
        post.tags.forEach(tag => {
            acc[tag] = (acc[tag] || 0) + 1;
        });
        return acc;
    }, {} as Record<string, number>);

    const authorCounts = allPosts.reduce((acc, post) => {
        acc[post.author] = (acc[post.author] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const allTags = Object.keys(tagCounts).sort();
    const allAuthors = Object.keys(authorCounts).sort();

    // Ограничиваем количество отображаемых элементов
    const MAX_VISIBLE_ITEMS = 5;
    const visibleTags = allTags.slice(0, MAX_VISIBLE_ITEMS);
    const visibleAuthors = allAuthors.slice(0, MAX_VISIBLE_ITEMS);
    const hasMoreTags = allTags.length > MAX_VISIBLE_ITEMS;
    const hasMoreAuthors = allAuthors.length > MAX_VISIBLE_ITEMS;

    const handleTagToggle = (tag: string) => {
        const newSelectedTags = selectedTags.includes(tag)
            ? selectedTags.filter(t => t !== tag)
            : [...selectedTags, tag];

        setSelectedTags(newSelectedTags);
        applyFilters(newSelectedTags, selectedAuthor, showOnlyPublished);
    };

    const handleAuthorToggle = (author: string) => {
        const newAuthor = selectedAuthor === author ? '' : author;
        setSelectedAuthor(newAuthor);
        applyFilters(selectedTags, newAuthor, showOnlyPublished);
    };

    const handleStatusToggle = (published: boolean) => {
        setShowOnlyPublished(published);
        applyFilters(selectedTags, selectedAuthor, published);
    };

    const applyFilters = (tags: string[], author: string, published: boolean) => {
        const filterOptions: FilterOptions = {
            tags: tags.length > 0 ? tags : undefined,
            author: author || undefined,
            isPublished: published ? true : false
        };

        dispatch(setFilter(filterOptions));
        onFilterChange();
    };

    const handleClearFilters = () => {
        setSelectedTags([]);
        setSelectedAuthor('');
        setShowOnlyPublished(true);
        dispatch(clearFilter());
        onFilterChange();
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

    const getSelectedTagColor = (tag: string) => {
        const colors = [
            'bg-pink-500 text-white border-pink-500',
            'bg-blue-500 text-white border-blue-500',
            'bg-green-500 text-white border-green-500',
            'bg-yellow-500 text-white border-yellow-500',
            'bg-purple-500 text-white border-purple-500',
            'bg-orange-500 text-white border-orange-500',
            'bg-red-500 text-white border-red-500',
            'bg-indigo-500 text-white border-indigo-500',
        ];

        const index = tag.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
        return colors[index % colors.length];
    };

    return (
        <>
            <div className="w-80 bg-gray-900/95 backdrop-blur-sm border-r border-gray-800 min-h-screen p-6 space-y-8">
                {/* Post Status Header */}
                <div>
                    <h2 className="text-xl font-bold text-white mb-4">POSTS</h2>
                    <div className="space-y-2">
                        <button
                            onClick={() => handleStatusToggle(true)}
                            className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${showOnlyPublished
                                ? 'bg-gray-800 text-white'
                                : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                                }`}
                        >
                            Published ({allPosts.filter(p => p.isPublished).length})
                        </button>
                        <button
                            onClick={() => handleStatusToggle(false)}
                            className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${!showOnlyPublished
                                ? 'bg-gray-800 text-white'
                                : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                                }`}
                        >
                            Draft ({allPosts.filter(p => !p.isPublished).length})
                        </button>
                    </div>
                </div>

                {/* Tags */}
                <div>
                    <h3 className="text-lg font-semibold text-white mb-4">TAGS</h3>
                    <div className="space-y-2">
                        {visibleTags.map(tag => (
                            <button
                                key={tag}
                                onClick={() => handleTagToggle(tag)}
                                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border text-sm font-medium transition-all duration-200 ${selectedTags.includes(tag)
                                    ? getSelectedTagColor(tag)
                                    : getTagColor(tag) + ' hover:bg-opacity-30'
                                    }`}
                            >
                                <span className="uppercase">{tag}</span>
                                <span className="text-xs">({tagCounts[tag]})</span>
                            </button>
                        ))}

                        {hasMoreTags && (
                            <button
                                onClick={() => setIsTagModalOpen(true)}
                                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-gray-600 text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800/50 transition-all duration-200"
                            >
                                <MoreHorizontal className="w-4 h-4" />
                                <span>View More ({allTags.length - MAX_VISIBLE_ITEMS})</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Authors */}
                <div>
                    <h3 className="text-lg font-semibold text-white mb-4">AUTHORS</h3>
                    <div className="space-y-2">
                        {visibleAuthors.map(author => (
                            <button
                                key={author}
                                onClick={() => handleAuthorToggle(author)}
                                className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${selectedAuthor === author
                                    ? 'bg-blue-500 text-white'
                                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                                    }`}
                            >
                                <span className="uppercase">{author}</span>
                                <span className="text-xs">({authorCounts[author]})</span>
                            </button>
                        ))}

                        {hasMoreAuthors && (
                            <button
                                onClick={() => setIsAuthorModalOpen(true)}
                                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg border border-gray-600 text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800/50 transition-all duration-200"
                            >
                                <MoreHorizontal className="w-4 h-4" />
                                <span>View More ({allAuthors.length - MAX_VISIBLE_ITEMS})</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Clear Filters */}
                {(selectedTags.length > 0 || selectedAuthor || !showOnlyPublished) && (
                    <div className="pt-4 border-t border-gray-800">
                        <button
                            onClick={handleClearFilters}
                            className="w-full px-4 py-2 bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors text-sm"
                        >
                            Clear Filters
                        </button>
                    </div>
                )}
            </div>

            {/* Modals */}
            <TagModal
                isOpen={isTagModalOpen}
                onClose={() => setIsTagModalOpen(false)}
                tags={allTags}
                selectedTags={selectedTags}
                tagCounts={tagCounts}
                onTagToggle={handleTagToggle}
                getTagColor={getTagColor}
                getSelectedTagColor={getSelectedTagColor}
            />

            <AuthorModal
                isOpen={isAuthorModalOpen}
                onClose={() => setIsAuthorModalOpen(false)}
                authors={allAuthors}
                selectedAuthor={selectedAuthor}
                authorCounts={authorCounts}
                onAuthorToggle={handleAuthorToggle}
            />
        </>
    );
} 