import { createPostSchema, createCommentSchema } from '@/schemas';

describe('Validation Schemas', () => {
  describe('createPostSchema', () => {
    test('should validate valid post data', () => {
      const validPostData = {
        title: 'Test Blog Post',
        content: 'This is a test blog post content that is long enough to pass validation.',
        author: 'Test Author',
        tags: ['javascript', 'react'],
        excerpt: 'This is a test excerpt for the blog post.',
        isPublished: true,
      };

      const result = createPostSchema.safeParse(validPostData);
      expect(result.success).toBe(true);
    });

    test('should reject post with empty title', () => {
      const invalidPostData = {
        title: '',
        content: 'This is a test blog post content that is long enough to pass validation.',
        author: 'Test Author',
        tags: ['javascript', 'react'],
        excerpt: 'This is a test excerpt for the blog post.',
        isPublished: true,
      };

      const result = createPostSchema.safeParse(invalidPostData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('title');
        expect(result.error.issues[0].message).toContain('Title is required');
      }
    });

    test('should reject post with short content', () => {
      const invalidPostData = {
        title: 'Test Blog Post',
        content: 'Short',
        author: 'Test Author',
        tags: ['javascript', 'react'],
        excerpt: 'This is a test excerpt for the blog post.',
        isPublished: true,
      };

      const result = createPostSchema.safeParse(invalidPostData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('content');
        expect(result.error.issues[0].message).toContain('10 characters');
      }
    });

    test('should reject post with empty author', () => {
      const invalidPostData = {
        title: 'Test Blog Post',
        content: 'This is a test blog post content that is long enough to pass validation.',
        author: '',
        tags: ['javascript', 'react'],
        excerpt: 'This is a test excerpt for the blog post.',
        isPublished: true,
      };

      const result = createPostSchema.safeParse(invalidPostData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('author');
        expect(result.error.issues[0].message).toContain('Author is required');
      }
    });

    test('should accept post with empty tags array', () => {
      const validPostData = {
        title: 'Test Blog Post',
        content: 'This is a test blog post content that is long enough to pass validation.',
        author: 'Test Author',
        tags: [],
        excerpt: 'This is a test excerpt for the blog post.',
        isPublished: true,
      };

      const result = createPostSchema.safeParse(validPostData);
      expect(result.success).toBe(true);
    });

    test('should reject post with short excerpt', () => {
      const invalidPostData = {
        title: 'Test Blog Post',
        content: 'This is a test blog post content that is long enough to pass validation.',
        author: 'Test Author',
        tags: ['javascript', 'react'],
        excerpt: 'Short',
        isPublished: true,
      };

      const result = createPostSchema.safeParse(invalidPostData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('excerpt');
        expect(result.error.issues[0].message).toContain('10 characters');
      }
    });

    test('should handle boolean isPublished field', () => {
      const postData = {
        title: 'Test Blog Post',
        content: 'This is a test blog post content that is long enough to pass validation.',
        author: 'Test Author',
        tags: ['javascript', 'react'],
        excerpt: 'This is a test excerpt for the blog post.',
        isPublished: false,
      };

      const result = createPostSchema.safeParse(postData);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.isPublished).toBe(false);
      }
    });
  });

  describe('createCommentSchema', () => {
    test('should validate valid comment data', () => {
      const validCommentData = {
        postId: 'test-post-id',
        author: 'Test Author',
        content: 'This is a test comment content.',
      };

      const result = createCommentSchema.safeParse(validCommentData);
      expect(result.success).toBe(true);
    });

    test('should reject comment with empty postId', () => {
      const invalidCommentData = {
        postId: '',
        author: 'Test Author',
        content: 'This is a test comment content.',
      };

      const result = createCommentSchema.safeParse(invalidCommentData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('postId');
        expect(result.error.issues[0].message).toContain('Post ID is required');
      }
    });

    test('should reject comment with empty author', () => {
      const invalidCommentData = {
        postId: 'test-post-id',
        author: '',
        content: 'This is a test comment content.',
      };

      const result = createCommentSchema.safeParse(invalidCommentData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('author');
        expect(result.error.issues[0].message).toContain('Author is required');
      }
    });

    test('should reject comment with empty content', () => {
      const invalidCommentData = {
        postId: 'test-post-id',
        author: 'Test Author',
        content: '',
      };

      const result = createCommentSchema.safeParse(invalidCommentData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].path).toContain('content');
        expect(result.error.issues[0].message).toContain('Comment content is required');
      }
    });

    test('should accept comment with short content', () => {
      const validCommentData = {
        postId: 'test-post-id',
        author: 'Test Author',
        content: 'Hi',
      };

      const result = createCommentSchema.safeParse(validCommentData);
      expect(result.success).toBe(true);
    });

    test('should reject comment with missing fields', () => {
      const invalidCommentData = {
        postId: 'test-post-id',
        // Missing author and content
      };

      const result = createCommentSchema.safeParse(invalidCommentData);
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues.length).toBeGreaterThan(0);
      }
    });
  });
}); 