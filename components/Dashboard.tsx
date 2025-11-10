import React, { useState } from 'react';
import Widget from './Widget';
import { WidgetConfig, ChartType } from '../types';

interface DashboardProps {
  widgets: WidgetConfig[];
  onDeleteWidget: (id: string) => void;
  onOpenLayoutSettings: (id: string) => void;
  onReorderWidgets: (draggedId: string, targetId: string) => void;
  onUpdateWidgetChartType: (id: string, chartType: ChartType) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ widgets, onDeleteWidget, onOpenLayoutSettings, onReorderWidgets, onUpdateWidgetChartType }) => {
  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverId, setDragOverId] = useState<string | null>(null);

  const handleDragStart = (id: string) => {
    setDraggedId(id);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, id: string) => {
    e.preventDefault();
    if (id !== dragOverId) {
      setDragOverId(id);
    }
  };

  const handleDragLeave = () => {
    setDragOverId(null);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, targetId: string) => {
    e.preventDefault();
    if (draggedId && draggedId !== targetId) {
      onReorderWidgets(draggedId, targetId);
    }
    setDraggedId(null);
    setDragOverId(null);
  };
  
  const handleDragEnd = () => {
    setDraggedId(null);
    setDragOverId(null);
  };

  if (widgets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-200px)] text-center text-gray-400">
        <div className="text-5xl mb-4">📊</div>
        <h2 className="text-2xl font-semibold">Your Dashboard is Empty</h2>
        <p className="mt-2 max-w-md">
          Click the "Add Widget" button to create a new chart using AI or choose from our pre-defined library to start visualizing your data.
        </p>
      </div>
    );
  }

  return (
    <div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 grid-flow-dense" 
      style={{ gridAutoRows: '20rem' }}
      onDragEnd={handleDragEnd}
    >
      {widgets.map(widget => {
        const colSpan = Math.max(1, Math.min(4, widget.colSpan || 1));
        const rowSpan = Math.max(1, widget.rowSpan || 1);
        const style = {
            gridColumn: `span ${colSpan}`,
            gridRow: `span ${rowSpan}`,
        };
        const isBeingDragged = draggedId === widget.id;
        const isDragTarget = dragOverId === widget.id && draggedId !== widget.id;

        return (
            <div 
              key={widget.id} 
              style={style}
              onDragOver={(e) => handleDragOver(e, widget.id)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, widget.id)}
              className={`transition-all duration-300 ${isDragTarget ? 'ring-2 ring-indigo-500 ring-offset-2 ring-offset-gray-900 rounded-2xl' : ''}`}
            >
                 <Widget 
                    config={widget} 
                    onDelete={onDeleteWidget} 
                    onOpenLayoutSettings={onOpenLayoutSettings}
                    onUpdateChartType={onUpdateWidgetChartType}
                    onDragStart={handleDragStart}
                    isDragging={isBeingDragged}
                />
            </div>
        )
      })}
    </div>
  );
};

export default Dashboard;