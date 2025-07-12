'use client';

import { useState } from 'react';
import { useAppDispatch } from '@/hooks/redux';
import { createComment } from '@/store/blogSlice';
import { Comment } from '@/types';
import { format } from 'date-fns';
import { User, MessageCircle, Send } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface CommentsProps {
    postId: string;
    comments: Comment[];
}

export default function Comments({ postId, comments }: CommentsProps) {
    const dispatch = useAppDispatch();
    const { user } = useAuth();
    const [newComment, setNewComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const formatDate = (date: Date) => {
        return format(date, 'MMM dd, yyyy HH:mm');
    };

    const handleSubmitComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim() || !user) return;

        setIsSubmitting(true);
        try {
            await dispatch(createComment({
                postId,
                author: user.displayName || user.email || 'Anonymous',
                content: newComment.trim()
            }));
            setNewComment('');
        } catch (error) {
            console.error('Error creating comment:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            
            {user && (
                <form onSubmit={handleSubmitComment} className="space-y-4">
                    <div className="flex items-start gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0">
                            <User className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1">
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Write a comment..."
                                className="w-full bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                rows={3}
                                disabled={isSubmitting}
                            />
                            <div className="flex items-center justify-between mt-3">
                                <span className="text-sm text-gray-400">
                                    Commenting as {user.displayName || user.email}
                                </span>
                                <button
                                    type="submit"
                                    disabled={!newComment.trim() || isSubmitting}
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    ) : (
                                        <Send className="w-4 h-4" />
                                    )}
                                    {isSubmitting ? 'Posting...' : 'Post Comment'}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            )}

            
            <div className="space-y-4">
                {comments.length === 0 ? (
                    <div className="text-center py-8">
                        <MessageCircle className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                        <p className="text-gray-400">No comments yet</p>
                        <p className="text-gray-500 text-sm">Be the first to share your thoughts!</p>
                    </div>
                ) : (
                    comments.map(comment => (
                        <div key={comment.id} className="flex items-start gap-3 p-4 bg-gray-800/30 rounded-lg">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center flex-shrink-0">
                                <User className="w-4 h-4 text-white" />
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-sm font-medium text-white uppercase">
                                        {comment.author}
                                    </span>
                                    <span className="text-xs text-gray-400">
                                        {formatDate(comment.createdAt)}
                                    </span>
                                </div>
                                <p className="text-gray-300 leading-relaxed">
                                    {comment.content}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
