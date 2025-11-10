
import React, { useState } from 'react';
import { PredefinedWidget } from '../types';
import { PREDEFINED_WIDGETS } from '../constants';
import { AddIcon } from './icons';

interface WidgetLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (widget: PredefinedWidget) => Promise<void>;
}

const WidgetLibraryModal: React.FC<WidgetLibraryModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [loadingWidgetId, setLoadingWidgetId] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleAddClick = async (widget: PredefinedWidget) => {
    setLoadingWidgetId(widget.id);
    try {
      await onAdd(widget);
    } catch (error) {
      console.error("Failed to add widget from library:", error);
    } finally {
      setLoadingWidgetId(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-40 flex justify-center items-center" onClick={onClose}>
      <div className="bg-gray-800/90 backdrop-blur-xl border border-gray-700 rounded-lg shadow-xl w-full max-w-2xl m-4 p-6 flex flex-col" onClick={e => e.stopPropagation()}>
        <h2 className="text-xl font-semibold text-white mb-4">Add Widget from Library</h2>
        <div className="overflow-y-auto max-h-[70vh] pr-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PREDEFINED_WIDGETS.map((widget) => {
                const Icon = widget.icon;
                const isLoading = loadingWidgetId === widget.id;
                return (
                <div key={widget.id} className="bg-gray-900/50 border border-gray-700 rounded-lg p-4 flex flex-col justify-between hover:bg-gray-700/50 transition-colors">
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 text-indigo-400 mt-1">
                            <Icon className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-100">{widget.title}</h3>
                            <p className="text-sm text-gray-400 mt-1">Type: {widget.chart_type}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => handleAddClick(widget)}
                        disabled={isLoading}
                        className="mt-4 ml-auto w-full sm:w-auto self-end px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 rounded-md text-white font-semibold text-sm transition flex items-center justify-center gap-2 disabled:bg-indigo-400 disabled:cursor-not-allowed"
                    >
                    {isLoading ? (
                        <>
                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Adding...</span>
                        </>
                    ) : (
                        <>
                            <AddIcon className="w-4 h-4" />
                            <span>Add to Dashboard</span>
                        </>
                    )}
                    </button>
                </div>
                );
            })}
            </div>
        </div>
      </div>
    </div>
  );
};

export default WidgetLibraryModal;
