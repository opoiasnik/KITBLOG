'use client';

import { Mail, Github, Linkedin, Twitter } from 'lucide-react';

export default function AboutPage() {
    return (
        <div className="max-w-4xl mx-auto px-8 py-12">
            <div className="mb-12">
                <h1 className="text-4xl font-bold text-white mb-4">About</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

                <div className="lg:col-span-1">
                    <div className="text-center">

                        <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                            <div className="text-white text-4xl">
                                🤖
                            </div>
                        </div>

                        <h2 className="text-2xl font-bold text-white mb-2">Oleh Poiasnik</h2>
                        <p className="text-gray-400 mb-4">Professor of Atmospheric Science</p>
                        <p className="text-gray-400 mb-6">Stanford University</p>


                        <div className="flex justify-center gap-4">
                            <a
                                href="mailto:contact@example.com"
                                className="p-2 text-gray-400 hover:text-white transition-colors"
                            >
                                <Mail className="w-5 h-5" />
                            </a>
                            <a
                                href="https://github.com/your-profile"
                                className="p-2 text-gray-400 hover:text-white transition-colors"
                            >
                                <Github className="w-5 h-5" />
                            </a>
                            <a
                                href="https://linkedin.com/in/your-profile"
                                className="p-2 text-gray-400 hover:text-white transition-colors"
                            >
                                <Linkedin className="w-5 h-5" />
                            </a>
                            <a
                                href="https://twitter.com/your-profile"
                                className="p-2 text-gray-400 hover:text-white transition-colors"
                            >
                                <Twitter className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </div>


                <div className="lg:col-span-2 space-y-6">
                    <div>
                        <p className="text-gray-300 leading-relaxed mb-4">
                            Oleh Poiasnik is a professor of atmospheric sciences at the Stanford AI Lab. His
                            research interests includes complexity modelling of tailwinds, headwinds and
                            crosswinds.
                        </p>

                        <p className="text-gray-300 leading-relaxed mb-4">
                            He leads the clean energy group which develops 3D air pollution-climate models,
                            writes differential equation solvers, and manufactures titanium plated air balloons. In his
                            free time he bakes raspberry pi.
                        </p>

                        <p className="text-gray-300 leading-relaxed">
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed neque elit, tristique
                            placerat feugiat ac, facilisis vitae arcu. Proin eget egestas augue. Praesent ut sem neque.
                            Arcu pellentesque aliquet. Duis dapibus diam vel metus tempus vulputate.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
