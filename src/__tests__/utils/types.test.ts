import { BlogPost, Comment, CreatePostData, CreateCommentData, FilterOptions } from '@/types';

describe('Type Interfaces', () => {
  describe('BlogPost', () => {
    test('should create valid BlogPost object', () => {
      const blogPost: BlogPost = {
        id: 'test-post-id',
        title: 'Test Blog Post',
        content: 'This is a test blog post content.',
        author: 'Test Author',
        createdAt: new Date(),
        updatedAt: new Date(),
        tags: ['javascript', 'react'],
        excerpt: 'This is a test excerpt.',
        isPublished: true,
      };

      expect(blogPost.id).toBe('test-post-id');
      expect(blogPost.title).toBe('Test Blog Post');
      expect(blogPost.content).toBe('This is a test blog post content.');
      expect(blogPost.author).toBe('Test Author');
      expect(blogPost.tags).toEqual(['javascript', 'react']);
      expect(blogPost.excerpt).toBe('This is a test excerpt.');
      expect(blogPost.isPublished).toBe(true);
    });

    test('should handle optional publishedAt field', () => {
      const blogPost: BlogPost = {
        id: 'test-post-id',
        title: 'Test Blog Post',
        content: 'This is a test blog post content.',
        author: 'Test Author',
        createdAt: new Date(),
        updatedAt: new Date(),
        tags: ['javascript', 'react'],
        excerpt: 'This is a test excerpt.',
        isPublished: true,
        publishedAt: new Date(),
      };

      expect(blogPost.publishedAt).toBeDefined();
      expect(blogPost.publishedAt).toBeInstanceOf(Date);
    });

    test('should handle draft post without publishedAt', () => {
      const blogPost: BlogPost = {
        id: 'test-post-id',
        title: 'Test Blog Post',
        content: 'This is a test blog post content.',
        author: 'Test Author',
        createdAt: new Date(),
        updatedAt: new Date(),
        tags: ['javascript', 'react'],
        excerpt: 'This is a test excerpt.',
        isPublished: false,
      };

      expect(blogPost.publishedAt).toBeUndefined();
      expect(blogPost.isPublished).toBe(false);
    });
  });

  describe('Comment', () => {
    test('should create valid Comment object', () => {
      const comment: Comment = {
        id: 'test-comment-id',
        postId: 'test-post-id',
        author: 'Test Author',
        content: 'This is a test comment content.',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      expect(comment.id).toBe('test-comment-id');
      expect(comment.postId).toBe('test-post-id');
      expect(comment.author).toBe('Test Author');
      expect(comment.content).toBe('This is a test comment content.');
      expect(comment.createdAt).toBeInstanceOf(Date);
      expect(comment.updatedAt).toBeInstanceOf(Date);
    });
  });

  describe('CreatePostData', () => {
    test('should create valid CreatePostData object', () => {
      const createPostData: CreatePostData = {
        title: 'Test Blog Post',
        content: 'This is a test blog post content.',
        author: 'Test Author',
        tags: ['javascript', 'react'],
        excerpt: 'This is a test excerpt.',
        isPublished: true,
      };

      expect(createPostData.title).toBe('Test Blog Post');
      expect(createPostData.content).toBe('This is a test blog post content.');
      expect(createPostData.author).toBe('Test Author');
      expect(createPostData.tags).toEqual(['javascript', 'react']);
      expect(createPostData.excerpt).toBe('This is a test excerpt.');
      expect(createPostData.isPublished).toBe(true);
    });
  });

  describe('CreateCommentData', () => {
    test('should create valid CreateCommentData object', () => {
      const createCommentData: CreateCommentData = {
        postId: 'test-post-id',
        author: 'Test Author',
        content: 'This is a test comment content.',
      };

      expect(createCommentData.postId).toBe('test-post-id');
      expect(createCommentData.author).toBe('Test Author');
      expect(createCommentData.content).toBe('This is a test comment content.');
    });
  });

  describe('FilterOptions', () => {
    test('should create valid FilterOptions object with all fields', () => {
      const filterOptions: FilterOptions = {
        tags: ['javascript', 'react'],
        author: 'Test Author',
        isPublished: true,
        searchTerm: 'test search',
      };

      expect(filterOptions.tags).toEqual(['javascript', 'react']);
      expect(filterOptions.author).toBe('Test Author');
      expect(filterOptions.isPublished).toBe(true);
      expect(filterOptions.searchTerm).toBe('test search');
    });

    test('should handle empty FilterOptions object', () => {
      const filterOptions: FilterOptions = {};

      expect(filterOptions.tags).toBeUndefined();
      expect(filterOptions.author).toBeUndefined();
      expect(filterOptions.isPublished).toBeUndefined();
      expect(filterOptions.searchTerm).toBeUndefined();
    });

    test('should handle partial FilterOptions object', () => {
      const filterOptions: FilterOptions = {
        tags: ['javascript'],
        isPublished: true,
      };

      expect(filterOptions.tags).toEqual(['javascript']);
      expect(filterOptions.author).toBeUndefined();
      expect(filterOptions.isPublished).toBe(true);
      expect(filterOptions.searchTerm).toBeUndefined();
    });

    test('should handle filter with empty arrays', () => {
      const filterOptions: FilterOptions = {
        tags: [],
        author: '',
        searchTerm: '',
      };

      expect(filterOptions.tags).toEqual([]);
      expect(filterOptions.author).toBe('');
      expect(filterOptions.searchTerm).toBe('');
    });
  });
});
