import { z } from 'zod';


export const createPostSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(200, 'Title cannot be longer than 200 characters'),
  content: z.string()
    .min(10, 'Content must be at least 10 characters')
    .max(10000, 'Content cannot be longer than 10000 characters'),
  author: z.string()
    .min(1, 'Author is required')
    .max(100, 'Author name cannot be longer than 100 characters'),
  tags: z.array(z.string())
    .max(10, 'Maximum 10 tags allowed'),
  excerpt: z.string()
    .min(10, 'Excerpt must be at least 10 characters')
    .max(300, 'Excerpt cannot be longer than 300 characters'),
  isPublished: z.boolean()
});


export const updatePostSchema = z.object({
  title: z.string()
    .min(1, 'Title is required')
    .max(200, 'Title cannot be longer than 200 characters')
    .optional(),
  content: z.string()
    .min(10, 'Content must be at least 10 characters')
    .max(10000, 'Content cannot be longer than 10000 characters')
    .optional(),
  tags: z.array(z.string())
    .max(10, 'Maximum 10 tags allowed')
    .optional(),
  excerpt: z.string()
    .min(10, 'Excerpt must be at least 10 characters')
    .max(300, 'Excerpt cannot be longer than 300 characters')
    .optional(),
  isPublished: z.boolean().optional()
});


export const createCommentSchema = z.object({
  postId: z.string().min(1, 'Post ID is required'),
  author: z.string()
    .min(1, 'Author is required')
    .max(100, 'Author name cannot be longer than 100 characters'),
  content: z.string()
    .min(1, 'Comment content is required')
    .max(1000, 'Comment cannot be longer than 1000 characters')
});


export const filterPostsSchema = z.object({
  tags: z.array(z.string()).optional(),
  author: z.string().optional(),
  isPublished: z.boolean().optional(),
  searchTerm: z.string().optional()
});


export type CreatePostFormData = z.infer<typeof createPostSchema>;
export type UpdatePostFormData = z.infer<typeof updatePostSchema>;
export type CreateCommentFormData = z.infer<typeof createCommentSchema>;
export type FilterPostsFormData = z.infer<typeof filterPostsSchema>;
