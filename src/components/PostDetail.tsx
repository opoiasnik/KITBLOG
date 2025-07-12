'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createCommentSchema, CreateCommentFormData } from '@/schemas';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { fetchComments, createComment, deletePost, updatePost } from '@/store/blogSlice';
import { BlogPost } from '@/types';
import { format } from 'date-fns';
import { Calendar, User, Tag, Edit, Trash2, MessageSquare, Send, Globe } from 'lucide-react';

interface PostDetailProps {
    post: BlogPost;
    onEdit: (post: BlogPost) => void;
    onClose: () => void;
    onPostUpdate?: () => void;
}

export default function PostDetail({ post, onEdit, onClose, onPostUpdate }: PostDetailProps) {
    const dispatch = useAppDispatch();
    const { comments, loading } = useAppSelector(state => state.blog);
    const [showCommentForm, setShowCommentForm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isPublishing, setIsPublishing] = useState(false);
    const [showPublishSuccess, setShowPublishSuccess] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<CreateCommentFormData>({
        resolver: zodResolver(createCommentSchema),
        defaultValues: {
            postId: post.id,
            author: '',
            content: ''
        }
    });

    useEffect(() => {
        dispatch(fetchComments(post.id));
    }, [dispatch, post.id]);

    const formatDate = (date: Date) => {
        return format(date, 'MMM dd, yyyy • HH:mm');
    };

    const handleCommentSubmit = async (data: CreateCommentFormData) => {
        try {
            await dispatch(createComment(data)).unwrap();
            reset();
            setShowCommentForm(false);
        } catch (error) {
            console.error('Error creating comment:', error);
        }
    };

    const handleDeletePost = async () => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            setIsDeleting(true);
            try {
                await dispatch(deletePost(post.id)).unwrap();
                onClose();
            } catch (error) {
                console.error('Error deleting post:', error);
            } finally {
                setIsDeleting(false);
            }
        }
    };

    const handlePublishPost = async () => {
        if (window.confirm('Are you sure you want to publish this post?')) {
            setIsPublishing(true);
            try {
                await dispatch(updatePost({
                    id: post.id,
                    updates: {
                        isPublished: true
                    }
                })).unwrap();

                setShowPublishSuccess(true);
                setTimeout(() => setShowPublishSuccess(false), 3000);

                if (onPostUpdate) {
                    onPostUpdate();
                }
            } catch (error) {
                console.error('Error publishing post:', error);
            } finally {
                setIsPublishing(false);
            }
        }
    };

    return (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 shadow-xl">
            
            {showPublishSuccess && (
                <div className="bg-green-500/20 border border-green-500/30 text-green-400 px-6 py-4 rounded-t-xl">
                    <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        <span>Post published successfully!</span>
                    </div>
                </div>
            )}
            <div className="p-8">
                
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-6 mb-8">
                    <div className="flex-1">
                        <h1 className="text-4xl font-bold text-white mb-4 leading-tight">{post.title}</h1>
                        <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400">
                            <div className="flex items-center gap-2">
                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                                <User className="h-4 w-4" />
                                <span className="text-gray-300">{post.author}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4" />
                                <span>{formatDate(post.createdAt)}</span>
                            </div>
                            {!post.isPublished && (
                                <span className="px-3 py-1 bg-amber-500/20 text-amber-400 text-xs rounded-full border border-amber-500/30 font-medium">
                                    Draft
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="flex gap-3 flex-wrap">
                        
                        {!post.isPublished && (
                            <button
                                onClick={handlePublishPost}
                                disabled={isPublishing}
                                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                            >
                                {isPublishing ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                        Publishing...
                                    </>
                                ) : (
                                    <>
                                        <Globe className="h-4 w-4" />
                                        Publish
                                    </>
                                )}
                            </button>
                        )}

                        <button
                            onClick={() => onEdit(post)}
                            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 font-medium"
                        >
                            <Edit className="h-4 w-4" />
                            Edit Post
                        </button>
                        <button
                            onClick={handleDeletePost}
                            disabled={isDeleting}
                            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                        >
                            {isDeleting ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    Deleting...
                                </>
                            ) : (
                                <>
                                    <Trash2 className="h-4 w-4" />
                                    Delete
                                </>
                            )}
                        </button>
                    </div>
                </div>

                
                {post.tags.length > 0 && (
                    <div className="flex items-center gap-3 mb-8">
                        <Tag className="h-5 w-5 text-gray-400" />
                        <div className="flex flex-wrap gap-2">
                            {post.tags.map(tag => (
                                <span
                                    key={tag}
                                    className="px-4 py-2 bg-blue-500/20 text-blue-400 text-sm rounded-xl font-medium border border-blue-500/30"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                )}

                
                <div className="mb-8 p-6 bg-gray-900/30 rounded-xl border border-gray-700/50">
                    <p className="text-gray-300 italic text-lg leading-relaxed">{post.excerpt}</p>
                </div>

                
                <div className="mb-12">
                    <div className="prose prose-lg max-w-none prose-invert">
                        <div className="whitespace-pre-wrap text-gray-100 leading-relaxed text-lg">
                            {post.content}
                        </div>
                    </div>
                </div>

                
                <div className="border-t border-gray-700/50 pt-8">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                        <h3 className="text-2xl font-semibold text-white flex items-center gap-3">
                            <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
                                <MessageSquare className="h-5 w-5 text-white" />
                            </div>
                            Comments ({comments.length})
                        </h3>
                        <button
                            onClick={() => setShowCommentForm(!showCommentForm)}
                            className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 ${showCommentForm
                                ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                : 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700'
                                }`}
                        >
                            {showCommentForm ? 'Cancel' : 'Add Comment'}
                        </button>
                    </div>

                    
                    {showCommentForm && (
                        <div className="mb-8 p-6 bg-gray-900/30 rounded-xl border border-gray-700/50">
                            <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                                <MessageSquare className="h-4 w-4" />
                                New Comment
                            </h4>
                            <form onSubmit={handleSubmit(handleCommentSubmit)} className="space-y-4">
                                <div>
                                    <input
                                        {...register('author')}
                                        type="text"
                                        placeholder="Your name"
                                        className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                    />
                                    {errors.author && (
                                        <p className="mt-2 text-sm text-red-400 flex items-center gap-2">
                                            <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                                            {errors.author.message}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <textarea
                                        {...register('content')}
                                        rows={4}
                                        placeholder="Write your comment..."
                                        className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
                                    />
                                    {errors.content && (
                                        <p className="mt-2 text-sm text-red-400 flex items-center gap-2">
                                            <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                                            {errors.content.message}
                                        </p>
                                    )}
                                </div>
                                <div className="flex justify-end gap-3 pt-2">
                                    <button
                                        type="button"
                                        onClick={() => setShowCommentForm(false)}
                                        className="px-6 py-3 text-gray-400 hover:text-white transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105 font-medium"
                                    >
                                        <Send className="h-4 w-4" />
                                        Post Comment
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    
                    <div className="space-y-4">
                        {loading ? (
                            <div className="flex justify-center py-12">
                                <div className="relative">
                                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
                                    <div className="absolute inset-0 animate-pulse rounded-full h-10 w-10 border-2 border-purple-500/30"></div>
                                </div>
                            </div>
                        ) : comments.length === 0 ? (
                            <div className="text-center py-16">
                                <div className="mx-auto w-16 h-16 bg-gray-700/50 rounded-full flex items-center justify-center mb-4">
                                    <MessageSquare className="h-8 w-8 text-gray-400" />
                                </div>
                                <p className="text-gray-400 text-lg">No comments yet</p>
                                <p className="text-gray-500 text-sm mt-2">Be the first to share your thoughts!</p>
                            </div>
                        ) : (
                            comments.map(comment => (
                                <div key={comment.id} className="bg-gray-900/30 rounded-xl border border-gray-700/50 p-6 hover:bg-gray-900/40 transition-colors">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                                                <User className="h-5 w-5 text-white" />
                                            </div>
                                            <span className="font-semibold text-white">{comment.author}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-gray-400">
                                            <Calendar className="h-3 w-3" />
                                            <span>{formatDate(comment.createdAt)}</span>
                                        </div>
                                    </div>
                                    <p className="text-gray-300 whitespace-pre-wrap leading-relaxed pl-13">{comment.content}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
