'use client';

import { useAppSelector } from '@/hooks/redux';

export default function TagsPage() {
    const { posts } = useAppSelector(state => state.blog);

    // Подсчет тегов
    const tagCounts = posts.reduce((acc, post) => {
        post.tags.forEach(tag => {
            acc[tag] = (acc[tag] || 0) + 1;
        });
        return acc;
    }, {} as Record<string, number>);

    const sortedTags = Object.entries(tagCounts)
        .sort((a, b) => b[1] - a[1])
        .map(([tag, count]) => ({ tag, count }));

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

    return (
        <div className="max-w-4xl mx-auto px-8 py-12">
            <div className="mb-12">
                <h1 className="text-4xl font-bold text-white mb-4">Tags</h1>
                <p className="text-gray-400 text-lg">Explore content by topics and categories</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sortedTags.map(({ tag, count }) => (
                    <div
                        key={tag}
                        className={`p-4 rounded-lg border hover:bg-opacity-30 transition-all duration-200 cursor-pointer ${getTagColor(tag)}`}
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-medium uppercase">{tag}</span>
                            <span className="text-xs">({count})</span>
                        </div>
                    </div>
                ))}
            </div>

            {sortedTags.length === 0 && (
                <div className="text-center py-20">
                    <p className="text-gray-400 text-xl">No tags available</p>
                    <p className="text-gray-500 mt-2">Create some posts to see tags here</p>
                </div>
            )}
        </div>
    );
} 