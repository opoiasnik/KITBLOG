'use client';

import { useState, createContext, useContext } from 'react';
import Header from './Header';
import Footer from './Footer';
import AuthModal from './AuthModal';

interface SidebarContextType {
    isSidebarOpen: boolean;
    onSidebarToggle: (isOpen: boolean) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export const useSidebar = () => {
    const context = useContext(SidebarContext);
    if (!context) {
        throw new Error('useSidebar must be used within LayoutContent');
    }
    return context;
};

interface LayoutContentProps {
    children: React.ReactNode;
}

export default function LayoutContent({ children }: LayoutContentProps) {
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const handleSignInClick = () => {
        setIsAuthModalOpen(true);
    };

    const handleSidebarToggle = (isOpen: boolean) => {
        setIsSidebarOpen(isOpen);
    };

    return (
        <SidebarContext.Provider value={{ isSidebarOpen, onSidebarToggle: handleSidebarToggle }}>
            <div className="min-h-screen flex flex-col overflow-x-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
                <Header
                    onSignInClick={handleSignInClick}
                    onMobileFilterClick={() => setIsSidebarOpen(prev => !prev)}
                    mobileFilterActive={isSidebarOpen}
                />
                <main className="flex-1">
                    {children}
                </main>
                <Footer />

                <AuthModal
                    isOpen={isAuthModalOpen}
                    onClose={() => setIsAuthModalOpen(false)}
                />
            </div>
        </SidebarContext.Provider>
    );
}
