export interface BlogPost {
  id: string;
  title: string;
  content: string;
  author: string;
  createdAt: Date;
  updatedAt: Date;
  tags: string[];
  excerpt: string;
  publishedAt?: Date;
  isPublished: boolean;
}

export interface Comment {
  id: string;
  postId: string;
  author: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePostData {
  title: string;
  content: string;
  author: string;
  tags: string[];
  excerpt: string;
  isPublished: boolean;
}

export interface UpdatePostData {
  title?: string;
  content?: string;
  tags?: string[];
  excerpt?: string;
  isPublished?: boolean;
}

export interface CreateCommentData {
  postId: string;
  author: string;
  content: string;
}

export interface FilterOptions {
  tags?: string[];
  author?: string;
  isPublished?: boolean;
  searchTerm?: string;
}

export interface BlogState {
  posts: BlogPost[];
  comments: Comment[];
  loading: boolean;
  error: string | null;
  currentPost: BlogPost | undefined;
  filter: FilterOptions;
}

export interface FirebaseError {
  code: string;
  message: string;
} 