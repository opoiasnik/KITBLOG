'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { fetchPostById, fetchComments, deletePost } from '@/store/blogSlice';
import { format } from 'date-fns';
import { Calendar, User, ArrowLeft, MessageCircle, Edit3 } from 'lucide-react';
import Comments from '@/components/Comments';
import { useAuth } from '@/contexts/AuthContext';

export default function PostPage() {
    const params = useParams();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { currentPost, comments, loading, error } = useAppSelector(state => state.blog);
    const { user } = useAuth();
    const [showComments, setShowComments] = useState(false);

    const raw = params?.id;
    const postId = Array.isArray(raw) ? raw[0] : (raw ?? '');

    useEffect(() => {
        if (postId) {
            dispatch(fetchPostById(postId));
            dispatch(fetchComments(postId));
        }
    }, [dispatch, postId]);

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

    const handleEditPost = () => {
        router.push(`/blog/edit/${postId}`);
    };

    const handleDeletePost = async () => {
        if (!postId) return;
        const confirmDelete = window.confirm('Delete this post? This action cannot be undone.');
        if (!confirmDelete) return;
        try {
            await dispatch(deletePost(postId)).unwrap();
            router.push('/blog');
        } catch (err) {
            console.error('Failed to delete post', err);
        }
    };

    const handleBackClick = () => {
        router.push('/blog');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <div className="relative">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                    <div className="absolute inset-0 animate-pulse rounded-full h-12 w-12 border-2 border-purple-500/30"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-8">
                <div className="bg-red-900/20 border border-red-500/30 rounded-xl p-6 backdrop-blur-sm max-w-md w-full">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        <div className="text-red-300">
                            <strong>Error:</strong> {error}
                        </div>
                    </div>
                </div>
                <button
                    onClick={handleBackClick}
                    className="mt-4 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Blog
                </button>
            </div>
        );
    }

    if (!currentPost) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-8">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-white mb-2">Post Not Found</h1>
                    <p className="text-gray-400 mb-4">The post you&apos;re looking for doesn&apos;t exist or has been deleted.</p>
                    <button
                        onClick={handleBackClick}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Blog
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-950">
            <div className="max-w-4xl mx-auto p-8">

                <div className="flex items-center gap-4 mb-8">
                    <button
                        onClick={handleBackClick}
                        className="p-2 hover:bg-gray-800 rounded-lg transition-colors group"
                    >
                        <ArrowLeft className="w-5 h-5 text-gray-400 group-hover:text-white" />
                    </button>
                    <h1 className="text-lg font-medium text-gray-300">Blog Post</h1>
                </div>


                <article className="bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 rounded-xl p-8 mb-8">

                    <div className="flex items-start justify-between mb-6">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-3 text-sm text-gray-400">
                                <Calendar className="w-4 h-4" />
                                <span>{formatDate(currentPost.createdAt)}</span>
                                {currentPost.updatedAt > currentPost.createdAt && (
                                    <span className="text-gray-500">
                                        (Updated {formatDate(currentPost.updatedAt)})
                                    </span>
                                )}
                            </div>
                            <h1 className="text-3xl font-bold text-white mb-4 leading-tight">
                                {currentPost.title}
                            </h1>
                            <div className="flex items-center gap-4 text-sm text-gray-400 mb-6">
                                <div className="flex items-center gap-2">
                                    <User className="w-4 h-4" />
                                    <span className="uppercase">{currentPost.author}</span>
                                </div>
                                {currentPost.publishedAt && (
                                    <div>
                                        Published {formatDate(currentPost.publishedAt)}
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            {!currentPost.isPublished && (
                                <span className="px-3 py-1 bg-amber-500/20 text-amber-400 text-xs rounded-full border border-amber-500/30 font-medium">
                                    Draft
                                </span>
                            )}
                            {user && (user.displayName === currentPost.author || user.email === currentPost.author) && (
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={handleEditPost}
                                        className="p-2 hover:bg-gray-800 rounded-lg transition-colors group"
                                        title="Edit Post"
                                    >
                                        <Edit3 className="w-5 h-5 text-gray-400 group-hover:text-white" />
                                    </button>
                                    <button
                                        onClick={handleDeletePost}
                                        className="p-2 hover:bg-gray-800 rounded-lg transition-colors group"
                                        title="Delete Post"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-red-400 group-hover:text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6" /><path d="M14 11v6" /><path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" /></svg>
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>


                    <div className="flex flex-wrap gap-2 mb-6">
                        {currentPost.tags.map(tag => (
                            <span
                                key={tag}
                                className={`px-3 py-1 rounded-full text-xs font-medium border uppercase ${getTagColor(tag)}`}
                            >
                                {tag}
                            </span>
                        ))}
                    </div>


                    <div className="prose prose-invert max-w-none">
                        <div className="text-gray-300 leading-relaxed whitespace-pre-wrap">
                            {currentPost.content}
                        </div>
                    </div>
                </article>


                <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 rounded-xl p-6">
                    <button
                        onClick={() => setShowComments(!showComments)}
                        className="flex items-center gap-3 w-full text-left hover:bg-gray-800/30 rounded-lg p-3 transition-colors"
                    >
                        <MessageCircle className="w-5 h-5 text-gray-400" />
                        <span className="text-white font-medium">
                            Comments ({comments.length})
                        </span>
                        <div className={`ml-auto transition-transform ${showComments ? 'rotate-180' : ''}`}>
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>
                    </button>

                    {showComments && (
                        <div className="mt-4 border-t border-gray-800/50 pt-4">
                            <Comments postId={postId} comments={comments} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
