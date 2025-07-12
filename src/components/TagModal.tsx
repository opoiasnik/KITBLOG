'use client';

import { X } from 'lucide-react';

interface TagModalProps {
    isOpen: boolean;
    onClose: () => void;
    tags: string[];
    selectedTags: string[];
    tagCounts: Record<string, number>;
    onTagToggle: (tag: string) => void;
    getTagColor: (tag: string) => string;
    getSelectedTagColor: (tag: string) => string;
}

export default function TagModal({
    isOpen,
    onClose,
    tags,
    selectedTags,
    tagCounts,
    onTagToggle,
    getTagColor,
    getSelectedTagColor
}: TagModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gray-900 border border-gray-700 rounded-xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-700">
                    <h2 className="text-xl font-bold text-white">All Tags</h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-800"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[60vh]">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {tags.map(tag => (
                            <button
                                key={tag}
                                onClick={() => onTagToggle(tag)}
                                className={`flex items-center justify-between px-4 py-3 rounded-lg border text-sm font-medium transition-all duration-200 ${selectedTags.includes(tag)
                                    ? getSelectedTagColor(tag)
                                    : getTagColor(tag) + ' hover:bg-opacity-30'
                                    }`}
                            >
                                <span className="uppercase truncate">{tag}</span>
                                <span className="text-xs ml-2">({tagCounts[tag]})</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-700 flex justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
} 