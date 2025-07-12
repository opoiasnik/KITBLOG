'use client';

import { ExternalLink } from 'lucide-react';

export default function ProjectsPage() {
    const projects = [
        {
            id: 1,
            title: 'A Search Engine',
            description: 'What if you could look up any information in the world? Webpages, images, videos and more. Google has many features to help you find exactly what you\'re looking for.',
            image: '/api/placeholder/400/300',
            link: '#',
            tags: ['Google', 'Search', 'Web'],
            gradient: 'from-blue-500 to-purple-600'
        },
        {
            id: 2,
            title: 'The Time Machine',
            description: 'Imagine being able to travel back in time or to the future. Simple turn the knob to the desired date and press "Go". No more worrying about lost keys or forgotten headphones with this simple yet affordable solution.',
            image: '/api/placeholder/400/300',
            link: '#',
            tags: ['Time', 'Machine', 'Future'],
            gradient: 'from-gray-500 to-gray-700'
        }
    ];

    return (
        <div className="max-w-6xl mx-auto px-8 py-12">
            <div className="mb-12">
                <h1 className="text-4xl font-bold text-white mb-4">Projects</h1>
                <p className="text-gray-400 text-lg">Showcase your projects with a hero image (16 x 9)</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {projects.map(project => (
                    <div
                        key={project.id}
                        className="bg-gray-900/50 backdrop-blur-sm border border-gray-800/50 rounded-xl overflow-hidden hover:bg-gray-900/70 hover:border-gray-700/50 transition-all duration-300 group"
                    >
                        
                        <div className={`h-48 bg-gradient-to-br ${project.gradient} flex items-center justify-center`}>
                            <div className="text-white text-6xl font-bold opacity-50">
                                {project.id === 1 ? 'Google' : '⚙️'}
                            </div>
                        </div>

                        
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-3">
                                <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                                    {project.title}
                                </h3>
                                <ExternalLink className="w-5 h-5 text-gray-400 group-hover:text-blue-400 transition-colors" />
                            </div>

                            <p className="text-gray-300 mb-4 leading-relaxed">
                                {project.description}
                            </p>

                            
                            <div className="flex flex-wrap gap-2 mb-4">
                                {project.tags.map(tag => (
                                    <span
                                        key={tag}
                                        className="px-3 py-1 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-full text-xs font-medium uppercase"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            <a
                                href={project.link}
                                className="inline-flex items-center gap-2 text-pink-400 hover:text-pink-300 transition-colors font-medium"
                            >
                                Learn more →
                            </a>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
