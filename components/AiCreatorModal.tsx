
import React, { useState } from 'react';

interface AiCreatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (prompt: string) => Promise<void>;
}

const AiCreatorModal: React.FC<AiCreatorModalProps> = ({ isOpen, onClose, onCreate }) => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!prompt.trim()) return;
    setIsLoading(true);
    try {
      await onCreate(prompt);
      setPrompt('');
    } catch (error) {
      console.error('Failed to create widget:', error);
      // Optionally show an error message to the user
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-40 flex justify-center items-center" onClick={onClose}>
      <div className="bg-gray-800/90 backdrop-blur-xl border border-gray-700 rounded-lg shadow-xl w-full max-w-lg m-4 p-6" onClick={e => e.stopPropagation()}>
        <h2 className="text-xl font-semibold text-white mb-4">Create Widget with AI</h2>
        <p className="text-gray-400 mb-4">Describe the data you want to visualize. For example: "Show total sales by month as a line chart".</p>
        <textarea
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          placeholder="e.g., Show top 5 products by revenue"
          className="w-full h-28 p-3 bg-gray-900 border border-gray-600 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
          disabled={isLoading}
        />
        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-md text-white font-semibold transition"
            disabled={isLoading}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-md text-white font-semibold transition flex items-center disabled:bg-indigo-400 disabled:cursor-not-allowed"
            disabled={isLoading || !prompt.trim()}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating...
              </>
            ) : 'Generate Widget'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AiCreatorModal;
