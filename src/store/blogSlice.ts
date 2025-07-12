import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  Timestamp 
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { BlogPost, Comment, CreatePostData, UpdatePostData, CreateCommentData, FilterOptions, BlogState } from '@/types';


const convertTimestampToDate = (timestamp: unknown): Date => {
  if (timestamp && typeof timestamp === 'object' && 'toDate' in timestamp) {
    
    const firebaseDate = (timestamp as { toDate(): Date }).toDate();
    return new Date(firebaseDate.getTime());
  }
  if (timestamp instanceof Date) {
    
    return new Date(timestamp.getTime());
  }
  if (typeof timestamp === 'string' || typeof timestamp === 'number') {
    return new Date(timestamp);
  }
  return new Date();
};

const convertPostFromFirestore = (doc: { id: string; data: () => Record<string, unknown> }): BlogPost => {
  const data = doc.data();
  return {
    id: doc.id,
    title: data.title as string,
    content: data.content as string,
    author: data.author as string,
    createdAt: convertTimestampToDate(data.createdAt),
    updatedAt: convertTimestampToDate(data.updatedAt),
    tags: (data.tags as string[]) || [],
    excerpt: data.excerpt as string,
    publishedAt: data.publishedAt ? convertTimestampToDate(data.publishedAt) : undefined,
    isPublished: data.isPublished as boolean
  };
};

const convertCommentFromFirestore = (doc: { id: string; data: () => Record<string, unknown> }): Comment => {
  const data = doc.data();
  return {
    id: doc.id,
    postId: data.postId as string,
    author: data.author as string,
    content: data.content as string,
    createdAt: convertTimestampToDate(data.createdAt),
    updatedAt: convertTimestampToDate(data.updatedAt)
  };
};


export const fetchPosts = createAsyncThunk(
  'blog/fetchPosts',
  async (filterOptions?: FilterOptions) => {
    let q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    
    if (filterOptions?.isPublished !== undefined) {
      q = query(q, where('isPublished', '==', filterOptions.isPublished));
    }
    
    if (filterOptions?.author) {
      q = query(q, where('author', '==', filterOptions.author));
    }
    
    const querySnapshot = await getDocs(q);
    let posts = querySnapshot.docs.map(convertPostFromFirestore);
    
    
    if (filterOptions?.tags && filterOptions.tags.length > 0) {
      posts = posts.filter(post => 
        filterOptions.tags!.some(tag => post.tags.includes(tag))
      );
    }
    
    if (filterOptions?.searchTerm) {
      const searchLower = filterOptions.searchTerm.toLowerCase();
      posts = posts.filter(post =>
        post.title.toLowerCase().includes(searchLower) ||
        post.content.toLowerCase().includes(searchLower) ||
        post.excerpt.toLowerCase().includes(searchLower)
      );
    }
    
    return posts;
  }
);

export const fetchPostById = createAsyncThunk(
  'blog/fetchPostById',
  async (postId: string) => {
    const querySnapshot = await getDocs(
      query(collection(db, 'posts'), where('__name__', '==', postId))
    );
    
    if (querySnapshot.empty) {
      throw new Error('Post not found');
    }
    
    return convertPostFromFirestore(querySnapshot.docs[0]);
  }
);

export const createPost = createAsyncThunk(
  'blog/createPost',
  async (postData: CreatePostData) => {
    const now = Timestamp.now();
    const docRef = await addDoc(collection(db, 'posts'), {
      ...postData,
      createdAt: now,
      updatedAt: now,
      publishedAt: postData.isPublished ? now : null
    });
    
    const newPost: BlogPost = {
      id: docRef.id,
      ...postData,
      createdAt: convertTimestampToDate(now),
      updatedAt: convertTimestampToDate(now),
      publishedAt: postData.isPublished ? convertTimestampToDate(now) : undefined
    };
    
    return newPost;
  }
);

export const updatePost = createAsyncThunk(
  'blog/updatePost',
  async ({ id, updates }: { id: string; updates: UpdatePostData }) => {
    const now = Timestamp.now();
    const updateData = {
      ...updates,
      updatedAt: now,
      ...(updates.isPublished && { publishedAt: now })
    };
    
    await updateDoc(doc(db, 'posts', id), updateData);
    
    return { id, updates: { ...updates, updatedAt: convertTimestampToDate(now) } };
  }
);

export const deletePost = createAsyncThunk(
  'blog/deletePost',
  async (postId: string) => {
    await deleteDoc(doc(db, 'posts', postId));
    return postId;
  }
);

export const fetchComments = createAsyncThunk(
  'blog/fetchComments',
  async (postId: string) => {
    const q = query(
      collection(db, 'comments'),
      where('postId', '==', postId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(convertCommentFromFirestore);
  }
);

export const createComment = createAsyncThunk(
  'blog/createComment',
  async (commentData: CreateCommentData) => {
    const now = Timestamp.now();
    const docRef = await addDoc(collection(db, 'comments'), {
      ...commentData,
      createdAt: now,
      updatedAt: now
    });
    
    const newComment: Comment = {
      id: docRef.id,
      ...commentData,
      createdAt: convertTimestampToDate(now),
      updatedAt: convertTimestampToDate(now)
    };
    
    return newComment;
  }
);


const initialState: BlogState = {
  posts: [],
  comments: [],
  loading: false,
  error: null,
  currentPost: undefined,
  filter: {}
};


const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentPost: (state, action: PayloadAction<BlogPost | undefined>) => {
      state.currentPost = action.payload;
    },
    setFilter: (state, action: PayloadAction<FilterOptions>) => {
      state.filter = action.payload;
    },
    clearFilter: (state) => {
      state.filter = {};
    }
  },
  extraReducers: (builder) => {
    builder
      
      .addCase(fetchPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch posts';
      })
      
      
      .addCase(fetchPostById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPostById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPost = action.payload;
      })
      .addCase(fetchPostById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch post';
      })
      
      
      .addCase(createPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.loading = false;
        state.posts.unshift(action.payload);
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create post';
      })
      
      
      .addCase(updatePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.loading = false;
        const { id, updates } = action.payload;
        const index = state.posts.findIndex(post => post.id === id);
        if (index !== -1) {
          state.posts[index] = { ...state.posts[index], ...updates };
        }
        if (state.currentPost && state.currentPost.id === id) {
          state.currentPost = { ...state.currentPost, ...updates };
        }
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to update post';
      })
      
      
      .addCase(deletePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = state.posts.filter(post => post.id !== action.payload);
        if (state.currentPost && state.currentPost.id === action.payload) {
          state.currentPost = undefined;
        }
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete post';
      })
      
      
      .addCase(fetchComments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = action.payload;
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch comments';
      })
      
      
      .addCase(createComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createComment.fulfilled, (state, action) => {
        state.loading = false;
        state.comments.unshift(action.payload);
      })
      .addCase(createComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to create comment';
      });
  }
});

export const { clearError, setCurrentPost, setFilter, clearFilter } = blogSlice.actions;
export default blogSlice.reducer;
