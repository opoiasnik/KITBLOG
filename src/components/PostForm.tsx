'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { createPostSchema, CreatePostFormData } from '@/schemas';
import { useAppDispatch } from '@/hooks/redux';
import { createPost, updatePost } from '@/store/blogSlice';
import { BlogPost } from '@/types';
import { useState, useEffect } from 'react';
import { Save, X, Plus, User } from 'lucide-react';
import { useAuth, isGuestUser } from '@/contexts/AuthContext';

interface PostFormProps {
    post?: BlogPost | undefined;
    onCancel: () => void;
    onSuccess: () => void;
}

export default function PostForm({ post, onCancel, onSuccess }: PostFormProps) {
    const dispatch = useAppDispatch();
    const { user } = useAuth();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [tags, setTags] = useState<string[]>(post?.tags || []);
    const [tagInput, setTagInput] = useState('');

    
    const isGuest = user ? isGuestUser(user) : false;
    const defaultAuthor = post?.author ||
        (isGuest ? 'Guest' :
            (user?.displayName || user?.email?.split('@')[0] || ''));

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue
    } = useForm<CreatePostFormData>({
        resolver: zodResolver(createPostSchema),
        defaultValues: {
            title: post?.title || '',
            content: post?.content || '',
            author: defaultAuthor,
            excerpt: post?.excerpt || '',
            isPublished: post?.isPublished || false,
            tags: post?.tags || []
        }
    });

    
    useEffect(() => {
        if (!post && user) {
            const authorName = isGuest ? 'Guest' :
                (user.displayName || user.email?.split('@')[0] || '');
            setValue('author', authorName);
        }
    }, [user, post, setValue, isGuest]);

    const handleAddTag = () => {
        if (tagInput.trim() && !tags.includes(tagInput.trim())) {
            const newTags = [...tags, tagInput.trim()];
            setTags(newTags);
            setValue('tags', newTags);
            setTagInput('');
        }
    };

    const handleRemoveTag = (tagToRemove: string) => {
        const newTags = tags.filter(tag => tag !== tagToRemove);
        setTags(newTags);
        setValue('tags', newTags);
    };

    const handleTagInputKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleAddTag();
        }
    };

    const onSubmit = async (data: CreatePostFormData) => {
        setIsSubmitting(true);

        try {
            if (post) {
                await dispatch(updatePost({
                    id: post.id,
                    updates: {
                        title: data.title,
                        content: data.content,
                        excerpt: data.excerpt,
                        tags: data.tags,
                        isPublished: data.isPublished
                    }
                })).unwrap();
            } else {
                await dispatch(createPost(data)).unwrap();
            }

            onSuccess();
        } catch (error) {
            console.error('Error saving post:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl border border-gray-700/50 shadow-xl">
            <div className="p-6 sm:p-8">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                        <Save className="h-5 w-5 text-white" />
                    </div>
                    <h2 className="text-2xl font-semibold text-white">
                        {post ? 'Edit Post' : 'Create New Post'}
                    </h2>
                    {user && (
                        <div className="ml-auto flex items-center gap-2 text-sm text-gray-400">
                            <span>Author:</span>
                            <div className="flex items-center gap-2">
                                {isGuest && <User className="w-4 h-4" />}
                                <span className="text-blue-400">
                                    {isGuest ? 'Guest' : (user.displayName || user.email)}
                                </span>
                                {isGuest && (
                                    <span className="text-xs bg-gray-700 px-2 py-1 rounded">
                                        Guest mode
                                    </span>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                
                {isGuest && (
                    <div className="mb-6 p-4 bg-blue-900/20 border border-blue-500/30 rounded-xl">
                        <div className="flex items-center gap-3">
                            <User className="w-5 h-5 text-blue-400 flex-shrink-0" />
                            <div>
                                <p className="text-blue-300 text-sm font-medium">
                                    You are creating a post as a guest
                                </p>
                                <p className="text-blue-400/70 text-xs mt-1">
                                    Your post will be saved with author &quot;Guest&quot;.
                                    Sign in with Google or GitHub to personalize.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-3">
                            Title *
                        </label>
                        <input
                            {...register('title')}
                            type="text"
                            className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                            placeholder="Enter post title"
                        />
                        {errors.title && (
                            <p className="mt-2 text-sm text-red-400 flex items-center gap-2">
                                <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                                {errors.title.message}
                            </p>
                        )}
                    </div>

                    
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-3">
                            Author *
                        </label>
                        <input
                            {...register('author')}
                            type="text"
                            className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                            placeholder="Enter author name"
                            readOnly={!post && !!user} 
                        />
                        {errors.author && (
                            <p className="mt-2 text-sm text-red-400 flex items-center gap-2">
                                <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                                {errors.author.message}
                            </p>
                        )}
                        {!post && user && (
                            <p className="mt-2 text-sm text-gray-400">
                                {isGuest
                                    ? 'Author set to &quot;Guest&quot; in guest mode'
                                    : 'Author is automatically set based on your profile'
                                }
                            </p>
                        )}
                    </div>

                    
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-3">
                            Excerpt *
                        </label>
                        <textarea
                            {...register('excerpt')}
                            rows={3}
                            className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
                            placeholder="Enter post excerpt"
                        />
                        {errors.excerpt && (
                            <p className="mt-2 text-sm text-red-400 flex items-center gap-2">
                                <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                                {errors.excerpt.message}
                            </p>
                        )}
                    </div>

                    
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-3">
                            Tags
                        </label>
                        <div className="flex gap-3 mb-4">
                            <input
                                type="text"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyPress={handleTagInputKeyPress}
                                className="flex-1 px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                                placeholder="Add a tag"
                            />
                            <button
                                type="button"
                                onClick={handleAddTag}
                                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
                            >
                                <Plus className="h-4 w-4" />
                            </button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {tags.map(tag => (
                                <span
                                    key={tag}
                                    className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/20 text-blue-400 rounded-xl text-sm font-medium border border-blue-500/30"
                                >
                                    {tag}
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveTag(tag)}
                                        className="hover:text-red-400 transition-colors hover:scale-110"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </span>
                            ))}
                        </div>
                        {errors.tags && (
                            <p className="mt-2 text-sm text-red-400 flex items-center gap-2">
                                <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                                {errors.tags.message}
                            </p>
                        )}
                    </div>

                    
                    <div>
                        <label className="block text-sm font-medium text-gray-300 mb-3">
                            Content *
                        </label>
                        <textarea
                            {...register('content')}
                            rows={12}
                            className="w-full px-4 py-3 bg-gray-900/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none"
                            placeholder="Write your post content here..."
                        />
                        {errors.content && (
                            <p className="mt-2 text-sm text-red-400 flex items-center gap-2">
                                <span className="w-1 h-1 bg-red-400 rounded-full"></span>
                                {errors.content.message}
                            </p>
                        )}
                    </div>

                    
                    <div className="p-4 bg-gray-900/30 rounded-xl border border-gray-700/50">
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <input
                                {...register('isPublished')}
                                type="checkbox"
                                className="w-4 h-4 text-blue-600 bg-gray-900 border-gray-600 rounded focus:ring-blue-500 focus:ring-2"
                            />
                            <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">
                                Publish post immediately
                            </span>
                        </label>
                    </div>

                    
                    <div className="flex justify-end gap-4 pt-6 border-t border-gray-700/50">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-6 py-3 border border-gray-600 text-gray-300 rounded-xl hover:bg-gray-700/50 hover:text-white transition-all duration-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg hover:shadow-xl hover:scale-105 font-medium"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="h-4 w-4" />
                                    {post ? 'Update Post' : 'Create Post'}
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
