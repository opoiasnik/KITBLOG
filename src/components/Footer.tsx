'use client';

import { Mail, Github, Facebook, Youtube, Linkedin, Twitter, Instagram, MessageCircle, Globe } from 'lucide-react';

export default function Footer() {
    const socialLinks = [
        { icon: Mail, href: 'mailto:contact@example.com' },
        { icon: Github, href: 'https://github.com' },
        { icon: Facebook, href: 'https://facebook.com' },
        { icon: Youtube, href: 'https://youtube.com' },
        { icon: Linkedin, href: 'https://linkedin.com' },
        { icon: Twitter, href: 'https://twitter.com' },
        { icon: Instagram, href: 'https://instagram.com' },
        { icon: MessageCircle, href: 'https://threads.net' },
        { icon: Globe, href: 'https://example.com' },
    ];

    return (
        <footer className="bg-gray-900/95 backdrop-blur-sm border-t border-gray-800 mt-20">
            <div className="max-w-6xl mx-auto px-8 py-12">
                {/* Social Links */}
                <div className="flex justify-center gap-6 mb-8">
                    {socialLinks.map((link, index) => (
                        <a
                            key={index}
                            href={link.href}
                            className="p-2 text-gray-400 hover:text-white transition-colors"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <link.icon className="w-5 h-5" />
                        </a>
                    ))}
                </div>

                {/* Copyright */}
                <div className="text-center text-gray-400 text-sm">
                    <p className="mb-2">
                        <span className="font-medium">Oleh Poiasnik</span> • © 2025 • KITBLOG
                    </p>
                    <p>
                        <a
                            href="https://tailwindcss.com"
                            className="hover:text-white transition-colors"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Modern Blog Platform
                        </a>
                    </p>
                </div>
            </div>
        </footer>
    );
} 