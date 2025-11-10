
import React, { useState, useRef, useEffect } from 'react';
import { AddIcon, LibraryIcon } from './icons';

interface HeaderProps {
  onOpenAiCreator: () => void;
  onOpenLibrary: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenAiCreator, onOpenLibrary }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="flex items-center justify-between p-4 sm:p-5 bg-black bg-opacity-20 backdrop-blur-md border-b border-white/10 sticky top-0 z-20">
      <h1 className="text-xl md:text-2xl font-bold text-white">AI Dashboard</h1>
      <div className="relative" ref={menuRef}>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-lg text-white font-semibold transition-all duration-300 transform hover:scale-105"
        >
          <AddIcon className="w-5 h-5" />
          <span>Add Widget</span>
        </button>
        {isMenuOpen && (
          <div className="absolute right-0 mt-2 w-56 bg-gray-800/90 backdrop-blur-xl border border-gray-700 rounded-lg shadow-lg overflow-hidden animate-fade-in-down">
            <ul>
              <li>
                <button
                  onClick={() => {
                    onOpenAiCreator();
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 flex items-center gap-3 text-gray-200 hover:bg-indigo-600/50 transition-colors"
                >
                  <AddIcon className="w-5 h-5 text-indigo-400" />
                  <span>Create with AI</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onOpenLibrary();
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-3 flex items-center gap-3 text-gray-200 hover:bg-indigo-600/50 transition-colors"
                >
                  <LibraryIcon className="w-5 h-5 text-indigo-400" />
                  <span>Add from Library</span>
                </button>
              </li>
            </ul>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
