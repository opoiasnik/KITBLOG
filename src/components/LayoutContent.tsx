'use client';

import { useState } from 'react';
import Header from './Header';
import Footer from './Footer';
import AuthModal from './AuthModal';

interface LayoutContentProps {
    children: React.ReactNode;
}

export default function LayoutContent({ children }: LayoutContentProps) {
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    const handleSignInClick = () => {
        setIsAuthModalOpen(true);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
            <Header onSignInClick={handleSignInClick} />
            <main className="min-h-screen">
                {children}
            </main>
            <Footer />

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
            />
        </div>
    );
} 