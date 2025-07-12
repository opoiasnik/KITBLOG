'use client';

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { ReduxProvider } from '@/providers/ReduxProvider';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import BlogPage from '@/pages/BlogPage';
import TagsPage from '@/components/TagsPage';
import ProjectsPage from '@/components/ProjectsPage';
import AboutPage from '@/components/AboutPage';
import AuthModal from '@/components/AuthModal';
import { useState } from 'react';
import './app/globals.css';

function AppContent() {
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    const handleSignInClick = () => {
        setIsAuthModalOpen(true);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            <Header onSignInClick={handleSignInClick} />

            <main className="min-h-screen">
                <Routes>
                    {/* Redirect root to blog */}
                    <Route path="/" element={<Navigate to="/blog" replace />} />

                    {/* Blog routes */}
                    <Route path="/blog" element={<BlogPage />} />
                    <Route path="/blog/create" element={<BlogPage />} />
                    <Route path="/blog/edit/:id" element={<BlogPage />} />
                    <Route path="/blog/post/:id" element={<BlogPage />} />

                    {/* Other pages */}
                    <Route path="/tags" element={<TagsPage />} />
                    <Route path="/projects" element={<ProjectsPage />} />
                    <Route path="/about" element={<AboutPage />} />

                    {/* Catch all - redirect to blog */}
                    <Route path="*" element={<Navigate to="/blog" replace />} />
                </Routes>
            </main>

            <Footer />

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
            />
        </div>
    );
}

export default function App() {
    return (
        <ReduxProvider>
            <AuthProvider>
                <Router>
                    <AppContent />
                </Router>
            </AuthProvider>
        </ReduxProvider>
    );
} 