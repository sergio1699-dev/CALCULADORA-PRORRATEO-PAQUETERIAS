import React from 'react';

const Header: React.FC = () => {
    return (
        <header className="bg-slate-800/30 backdrop-blur-lg border-b border-slate-700 shadow-md sticky top-0 z-10">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-center h-20">
                    <div className="flex items-center space-x-4">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="7" cy="17" r="2" stroke="#94a3b8"/>
                            <circle cx="17" cy="17" r="2" stroke="#94a3b8"/>
                            <path d="M5 17H3V6C3 5.44772 3.44772 5 4 5H14V17H9" stroke="#06b6d4"/>
                            <path d="M14 17H19" stroke="#06b6d4"/>
                            <path d="M14 5H21L19 11H14V5Z" stroke="#06b6d4"/>
                            <line x1="3" y1="11" x2="0" y2="11" stroke="#94a3b8"/>
                            <line x1="3" y1="8" x2="1" y2="8" stroke="#94a3b8"/>
                        </svg>
                        <h1 className="text-xl sm:text-2xl font-bold text-slate-100 tracking-tight">
                           Calculadora de Prorrateo de Envíos
                        </h1>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;