'use client';

import { X } from 'lucide-react';

interface AuthorModalProps {
    isOpen: boolean;
    onClose: () => void;
    authors: string[];
    selectedAuthor: string;
    authorCounts: Record<string, number>;
    onAuthorToggle: (author: string) => void;
}

export default function AuthorModal({
    isOpen,
    onClose,
    authors,
    selectedAuthor,
    authorCounts,
    onAuthorToggle
}: AuthorModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-gray-900 border border-gray-700 rounded-xl max-w-4xl w-full max-h-[80vh] overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-700">
                    <h2 className="text-xl font-bold text-white">All Authors</h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-400 hover:text-white transition-colors rounded-lg hover:bg-gray-800"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 overflow-y-auto max-h-[60vh]">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {authors.map(author => (
                            <button
                                key={author}
                                onClick={() => onAuthorToggle(author)}
                                className={`flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${selectedAuthor === author
                                    ? 'bg-blue-500 text-white'
                                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50 border border-gray-700'
                                    }`}
                            >
                                <span className="uppercase truncate">{author}</span>
                                <span className="text-xs ml-2">({authorCounts[author]})</span>
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