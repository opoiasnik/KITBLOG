'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, onAuthStateChanged } from 'firebase/auth';
import { auth, signInWithGoogle, signInWithGitHub, logOut } from '@/lib/firebase';


interface GuestUser {
    uid: string;
    displayName: string;
    email: string;
    photoURL: string;
    isGuest: true;
}


type AppUser = User | GuestUser | null;

interface AuthContextType {
    user: AppUser;
    loading: boolean;
    signInWithGoogle: () => Promise<void>;
    signInWithGitHub: () => Promise<void>;
    signInAsGuest: () => Promise<void>;
    logout: () => Promise<void>;
    error: string | null;
    clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};


const createGuestUser = (): GuestUser => {
    const guestId = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const guestUser: GuestUser = {
        uid: guestId,
        displayName: 'Guest',
        email: 'guest@example.com',
        photoURL: '',
        isGuest: true,
    };
    return guestUser;
};


export const isGuestUser = (user: AppUser): user is GuestUser => {
    return user !== null && 'isGuest' in user && user.isGuest === true;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<AppUser>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        
        const checkGuestUser = () => {
            const guestData = localStorage.getItem('guestUser');
            if (guestData) {
                try {
                    const guestUser = JSON.parse(guestData) as GuestUser;
                    setUser(guestUser);
                    setLoading(false);
                    return true;
                } catch {
                    localStorage.removeItem('guestUser');
                }
            }
            return false;
        };

        
        const hasGuestUser = checkGuestUser();

        
        if (!hasGuestUser) {
            const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
                if (firebaseUser) {
                    
                    localStorage.removeItem('guestUser');
                }
                setUser(firebaseUser);
                setLoading(false);
            });

            return unsubscribe;
        }
    }, []);

    const clearError = () => setError(null);

    const handleAuthError = (error: unknown) => {
        console.error('Auth error:', error);

        const authError = error as { code?: string };

        if (authError.code === 'auth/account-exists-with-different-credential') {
            setError('An account with this email already exists. Try signing in with another provider (Google/GitHub).');
        } else if (authError.code === 'auth/popup-closed-by-user') {
            setError('The sign-in popup was closed.');
        } else if (authError.code === 'auth/cancelled-popup-request') {
            setError('Authentication was cancelled.');
        } else {
            setError('Authentication error. Please try again.');
        }
    };

    const handleSignInWithGoogle = async () => {
        try {
            setLoading(true);
            setError(null);
            
            localStorage.removeItem('guestUser');
            await signInWithGoogle();
        } catch (error) {
            handleAuthError(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSignInWithGitHub = async () => {
        try {
            setLoading(true);
            setError(null);
            
            localStorage.removeItem('guestUser');
            await signInWithGitHub();
        } catch (error) {
            handleAuthError(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSignInAsGuest = async () => {
        try {
            setLoading(true);
            setError(null);

            const guestUser = createGuestUser();

            
            localStorage.setItem('guestUser', JSON.stringify(guestUser));

            setUser(guestUser);
        } catch (error) {
            handleAuthError(error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        try {
            setLoading(true);
            setError(null);

            
            localStorage.removeItem('guestUser');

            
            if (user && !isGuestUser(user)) {
                await logOut();
            } else {
                
                setUser(null);
            }
        } catch (error) {
            handleAuthError(error);
        } finally {
            setLoading(false);
        }
    };

    const value = {
        user,
        loading,
        error,
        clearError,
        signInWithGoogle: handleSignInWithGoogle,
        signInWithGitHub: handleSignInWithGitHub,
        signInAsGuest: handleSignInAsGuest,
        logout: handleLogout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
