'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth, isGuestUser } from '@/contexts/AuthContext';
import { User, LogOut, ChevronDown } from 'lucide-react';

export default function UserProfile() {
    const { user, logout } = useAuth();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = async () => {
        try {
            await logout();
            setIsDropdownOpen(false);
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    if (!user) return null;

    const isGuest = isGuestUser(user);
    const displayName = user.displayName || 'User';
    const email = user.email || '';
    const photoURL = user.photoURL || '';

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center gap-2 p-2 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors"
            >
                {photoURL ? (
                    <img
                        src={photoURL}
                        alt={displayName}
                        className="w-8 h-8 rounded-full object-cover"
                    />
                ) : (
                    <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-gray-300" />
                    </div>
                )}
                <span className="hidden sm:inline text-sm text-white font-medium">
                    {displayName}
                </span>
                {isGuest && (
                    <span className="hidden sm:inline text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded">
                        Гость
                    </span>
                )}
                <ChevronDown className="w-4 h-4 text-gray-400" />
            </button>

            {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-gray-800 rounded-lg shadow-lg border border-gray-700 z-50">
                    <div className="p-4 border-b border-gray-700">
                        <div className="flex items-center gap-3">
                            {photoURL ? (
                                <img
                                    src={photoURL}
                                    alt={displayName}
                                    className="w-10 h-10 rounded-full object-cover"
                                />
                            ) : (
                                <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                                    <User className="w-5 h-5 text-gray-300" />
                                </div>
                            )}
                            <div>
                                <h3 className="font-medium text-white">
                                    {displayName}
                                    {isGuest && (
                                        <span className="ml-2 text-xs text-gray-400 bg-gray-700 px-2 py-1 rounded">
                                            Гость
                                        </span>
                                    )}
                                </h3>
                                {!isGuest && email && (
                                    <p className="text-sm text-gray-400">{email}</p>
                                )}
                                {isGuest && (
                                    <p className="text-sm text-gray-400">
                                        Временный аккаунт
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                    <div className="p-2">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-2 px-3 py-2 text-left text-red-400 hover:bg-gray-700 rounded-lg transition-colors"
                        >
                            <LogOut className="w-4 h-4" />
                            {isGuest ? 'Выйти из гостевого режима' : 'Выйти'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
} 