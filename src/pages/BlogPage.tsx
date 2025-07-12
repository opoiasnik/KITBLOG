'use client';

import dynamic from 'next/dynamic';


const BlogApp = dynamic(() => import('@/components/BlogApp'), { ssr: false });

export default function BlogPage() {
    return <BlogApp />;
}
