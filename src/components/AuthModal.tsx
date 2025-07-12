'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { X, Chrome, Github, User, Loader2, AlertCircle } from 'lucide-react';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
    const { signInWithGoogle, signInWithGitHub, signInAsGuest, loading, error, clearError } = useAuth();
    const [authLoading, setAuthLoading] = useState<'google' | 'github' | 'guest' | null>(null);

    if (!isOpen) return null;

    const handleGoogleSignIn = async () => {
        try {
            setAuthLoading('google');
            await signInWithGoogle();
            onClose();
        } catch (error) {
            console.error('Google sign in failed:', error);
        } finally {
            setAuthLoading(null);
        }
    };

    const handleGitHubSignIn = async () => {
        try {
            setAuthLoading('github');
            await signInWithGitHub();
            onClose();
        } catch (error) {
            console.error('GitHub sign in failed:', error);
        } finally {
            setAuthLoading(null);
        }
    };

    const handleGuestSignIn = async () => {
        try {
            setAuthLoading('guest');
            await signInAsGuest();
            onClose();
        } catch (error) {
            console.error('Guest sign in failed:', error);
        } finally {
            setAuthLoading(null);
        }
    };

    const handleClose = () => {
        clearError();
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 max-w-md w-full mx-4 relative">
                
                <button
                    onClick={handleClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                >
                    <X className="w-6 h-6" />
                </button>

                
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-white mb-2">Welcome</h2>
                    <p className="text-gray-400">Sign in to create and manage your blog posts</p>
                </div>

                
                {error && (
                    <div className="mb-6 p-4 bg-red-900/20 border border-red-500/30 rounded-xl">
                        <div className="flex items-center gap-3">
                            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                            <div className="text-red-300 text-sm">
                                {error}
                            </div>
                        </div>
                    </div>
                )}

                
                <div className="space-y-4">
                    
                    <button
                        onClick={handleGoogleSignIn}
                        disabled={loading || authLoading !== null}
                        className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-900 font-medium py-3 px-6 rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {authLoading === 'google' ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <Chrome className="w-5 h-5" />
                        )}
                        {authLoading === 'google' ? 'Signing in...' : 'Continue with Google'}
                    </button>

                    
                    <button
                        onClick={handleGitHubSignIn}
                        disabled={loading || authLoading !== null}
                        className="w-full flex items-center justify-center gap-3 bg-gray-800 hover:bg-gray-700 text-white font-medium py-3 px-6 rounded-xl transition-colors border border-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {authLoading === 'github' ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <Github className="w-5 h-5" />
                        )}
                        {authLoading === 'github' ? 'Signing in...' : 'Continue with GitHub'}
                    </button>

                    
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-700"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="bg-gray-900 px-3 text-gray-400">или</span>
                        </div>
                    </div>

                    
                    <button
                        onClick={handleGuestSignIn}
                        disabled={loading || authLoading !== null}
                        className="w-full flex items-center justify-center gap-3 bg-gray-700 hover:bg-gray-600 text-white font-medium py-3 px-6 rounded-xl transition-colors border border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {authLoading === 'guest' ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <User className="w-5 h-5" />
                        )}
                        {authLoading === 'guest' ? 'Signing in...' : 'Continue as Guest'}
                    </button>
                </div>

                
                <div className="mt-8 text-center">
                    <p className="text-sm text-gray-500">
                        By continuing, you agree to our Terms of Service and Privacy Policy
                    </p>
                </div>
            </div>
        </div>
    );
}
