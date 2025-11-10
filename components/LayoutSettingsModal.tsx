import React, { useState } from 'react';
import { WidgetConfig } from '../types';

interface LayoutSettingsModalProps {
  widget: WidgetConfig;
  onClose: () => void;
  onSave: (id: string, newSettings: { colSpan: number; rowSpan: number; }) => void;
}

const LayoutSettingsModal: React.FC<LayoutSettingsModalProps> = ({ widget, onClose, onSave }) => {
  const [colSpan, setColSpan] = useState(widget.colSpan || 1);
  const [rowSpan, setRowSpan] = useState(widget.rowSpan || 1);

  const handleSave = () => {
    onSave(widget.id, { 
        colSpan: Number(colSpan), 
        rowSpan: Number(rowSpan),
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-40 flex justify-center items-center" onClick={onClose}>
      <div className="bg-gray-800/90 backdrop-blur-xl border border-gray-700 rounded-lg shadow-xl w-full max-w-sm m-4 p-6" onClick={e => e.stopPropagation()}>
        <h2 className="text-xl font-semibold text-white mb-2">Layout Options</h2>
        <p className="text-gray-400 mb-6 truncate">For: "{widget.title}"</p>
        
        <div className="space-y-4">
            <div>
                <label htmlFor="colSpan" className="block text-sm font-medium text-gray-300 mb-1">Width (Column Span)</label>
                <input
                    type="number"
                    id="colSpan"
                    value={colSpan}
                    onChange={(e) => setColSpan(parseInt(e.target.value, 10))}
                    min="1"
                    max="4"
                    className="w-full p-2 bg-gray-900 border border-gray-600 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
                <p className="text-xs text-gray-500 mt-1">How many columns the widget should occupy (1-4).</p>
            </div>
            <div>
                <label htmlFor="rowSpan" className="block text-sm font-medium text-gray-300 mb-1">Height (Row Span)</label>
                <input
                    type="number"
                    id="rowSpan"
                    value={rowSpan}
                    onChange={(e) => setRowSpan(parseInt(e.target.value, 10))}
                    min="1"
                    max="10"
                    className="w-full p-2 bg-gray-900 border border-gray-600 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                />
                <p className="text-xs text-gray-500 mt-1">How many rows the widget should occupy.</p>
            </div>
        </div>

        <div className="flex justify-end gap-4 mt-8">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-md text-white font-semibold transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-md text-white font-semibold transition"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default LayoutSettingsModal;