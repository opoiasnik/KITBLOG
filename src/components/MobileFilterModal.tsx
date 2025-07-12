// MobileFilterModal.tsx
'use client';

import Sidebar from './Sidebar';

interface MobileFilterModalProps {
    isOpen: boolean;
    onClose: () => void;
    onFilterChange: () => void;
}

export default function MobileFilterModal({ isOpen, onClose, onFilterChange }: MobileFilterModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-center items-start pt-16">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal content */}
            <div className="relative w-full max-w-xs mx-auto bg-gray-900 border border-gray-800 rounded-lg p-6 space-y-8 overflow-y-auto shadow-xl">
                {/* Close button */}
                <button
                    className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl"
                    onClick={onClose}
                    aria-label="Close filters"
                >
                    &times;
                </button>

                {/* Sidebar content (filters) */}
                <Sidebar 
                    onFilterChange={onFilterChange} 
                    className="block" 
                    onClick={() => {}} 
                    isOpen={true}
                />
            </div>
        </div>
    );
} 