'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { fetchPostById } from '@/store/blogSlice';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import PostForm from '@/components/PostForm';
import { useAuth } from '@/contexts/AuthContext';

export default function EditPostPage() {
    const params = useParams();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { currentPost, loading, error } = useAppSelector(state => state.blog);
    const { user } = useAuth();

    const postId = params.id as string;

    useEffect(() => {
        if (postId) {
            dispatch(fetchPostById(postId));
        }
    }, [dispatch, postId]);

    const handleBackClick = () => {
        router.push(`/blog/post/${postId}`);
    };

    const handleCancel = () => {
        router.push(`/blog/post/${postId}`);
    };

    const handleSuccess = () => {
        router.push(`/blog/post/${postId}`);
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
                    Back to Post
                </button>
            </div>
        );
    }

    if (!currentPost) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-8">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-white mb-2">Post Not Found</h1>
                    <p className="text-gray-400 mb-4">The post you&apos;re trying to edit doesn&apos;t exist or has been deleted.</p>
                    <button
                        onClick={() => router.push('/blog')}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Blog
                    </button>
                </div>
            </div>
        );
    }

    // Проверка прав на редактирование
    if (user && (user.displayName !== currentPost.author && user.email !== currentPost.author)) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center p-8">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-white mb-2">Access Denied</h1>
                    <p className="text-gray-400 mb-4">You don&apos;t have permission to edit this post.</p>
                    <button
                        onClick={handleBackClick}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Post
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-950">
            <div className="max-w-4xl mx-auto p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={handleBackClick}
                            className="p-2 hover:bg-gray-800 rounded-lg transition-colors group"
                        >
                            <ArrowLeft className="w-5 h-5 text-gray-400 group-hover:text-white" />
                        </button>
                        <div>
                            <h1 className="text-lg font-medium text-gray-300">Edit Post</h1>
                            <p className="text-sm text-gray-500">
                                Editing: {currentPost.title}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {currentPost.isPublished ? (
                            <div className="flex items-center gap-2 px-3 py-1 bg-green-500/20 text-green-400 text-sm rounded-full border border-green-500/30">
                                <Eye className="w-4 h-4" />
                                Published
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 px-3 py-1 bg-amber-500/20 text-amber-400 text-sm rounded-full border border-amber-500/30">
                                <EyeOff className="w-4 h-4" />
                                Draft
                            </div>
                        )}
                    </div>
                </div>

                {/* Edit Form */}
                <PostForm
                    post={currentPost}
                    onCancel={handleCancel}
                    onSuccess={handleSuccess}
                />
            </div>
        </div>
    );
} 