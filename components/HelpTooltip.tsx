
import React from 'react';

interface HelpTooltipProps {
    text: string;
}

const HelpTooltip: React.FC<HelpTooltipProps> = ({ text }) => {
    return (
        <div className="group relative flex items-center ml-2">
            <i className="fas fa-question-circle text-slate-500 cursor-help"></i>
            <div className="absolute bottom-full mb-2 w-64 bg-slate-900 text-slate-200 text-sm rounded-lg shadow-lg p-3 border border-slate-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20 transform -translate-x-1/2 left-1/2">
                {text}
                <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-slate-700"></div>
            </div>
        </div>
    );
};

export default HelpTooltip;
