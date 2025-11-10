import React, { useState, useCallback } from 'react';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import AiCreatorModal from './components/AiCreatorModal';
import WidgetLibraryModal from './components/WidgetLibraryModal';
import LayoutSettingsModal from './components/LayoutSettingsModal';
import { WidgetConfig, PredefinedWidget, ChartType } from './types';
import useLocalStorage from './hooks/useLocalStorage';
import { generateWidgetFromPrompt, fetchPredefinedWidgetData } from './services/apiService';

const getDefaultSpan = (chartType: ChartType): { colSpan: number; rowSpan: number } => {
  switch (chartType) {
    case 'card':
    case 'pie':
    case 'donut':
      return { colSpan: 1, rowSpan: 1 };
    case 'bar':
    case 'horizontalBar':
      return { colSpan: 2, rowSpan: 1 };
    case 'line':
    case 'area':
    case 'stackedBar':
      return { colSpan: 2, rowSpan: 2 };
    case 'radar':
    case 'funnel':
    case 'radialBar':
      return { colSpan: 2, rowSpan: 2 };
    default:
      return { colSpan: 1, rowSpan: 1 };
  }
};


export default function App() {
  const [widgets, setWidgets] = useLocalStorage<WidgetConfig[]>('dashboard-widgets', []);
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [isLibraryModalOpen, setIsLibraryModalOpen] = useState(false);
  const [editingWidgetId, setEditingWidgetId] = useState<string | null>(null);

  const addWidget = useCallback((newWidget: WidgetConfig) => {
    setWidgets(prevWidgets => [...prevWidgets, newWidget]);
  }, [setWidgets]);

  const deleteWidget = useCallback((id: string) => {
    setWidgets(prevWidgets => prevWidgets.filter(widget => widget.id !== id));
  }, [setWidgets]);
  
  const updateWidgetChartType = useCallback((id: string, newChartType: ChartType) => {
    setWidgets(prevWidgets =>
      prevWidgets.map(widget =>
        widget.id === id ? { ...widget, chartType: newChartType } : widget
      )
    );
  }, [setWidgets]);

  const openLayoutSettings = (id: string) => setEditingWidgetId(id);
  const closeLayoutSettings = () => setEditingWidgetId(null);

  const saveLayoutSettings = (id: string, newSettings: { colSpan: number, rowSpan: number }) => {
    setWidgets(widgets.map(w => w.id === id ? { ...w, ...newSettings } : w));
    closeLayoutSettings();
  };

  const reorderWidgets = useCallback((draggedId: string, targetId: string) => {
    setWidgets(prevWidgets => {
        const draggedIndex = prevWidgets.findIndex(w => w.id === draggedId);
        const targetIndex = prevWidgets.findIndex(w => w.id === targetId);

        if (draggedIndex === -1 || targetIndex === -1) {
            return prevWidgets;
        }

        const newWidgets = [...prevWidgets];
        const [draggedWidget] = newWidgets.splice(draggedIndex, 1);
        newWidgets.splice(targetIndex, 0, draggedWidget);
        return newWidgets;
    });
  }, [setWidgets]);

  const handleCreateWidgetFromPrompt = async (prompt: string): Promise<void> => {
    const aiResponse = await generateWidgetFromPrompt(prompt);
    if (aiResponse) {
      const { colSpan, rowSpan } = getDefaultSpan(aiResponse.chart_type);
      const newWidget: WidgetConfig = {
        id: `widget-${Date.now()}`,
        title: aiResponse.title,
        chartType: aiResponse.chart_type,
        sql: aiResponse.sql,
        data: aiResponse.data,
        columns: aiResponse.columns,
        colSpan,
        rowSpan,
      };
      addWidget(newWidget);
    }
    setIsAiModalOpen(false);
  };

  const handleAddWidgetFromLibrary = async (predefinedWidget: PredefinedWidget): Promise<void> => {
    const widgetData = await fetchPredefinedWidgetData(predefinedWidget);
    if (widgetData) {
      const { colSpan, rowSpan } = getDefaultSpan(widgetData.chartType);
      const newWidget: WidgetConfig = {
        id: `widget-${Date.now()}`,
        title: widgetData.title,
        chartType: widgetData.chartType,
        sql: widgetData.sql,
        data: widgetData.data,
        columns: widgetData.columns,
        colSpan,
        rowSpan,
      };
      addWidget(newWidget);
    }
    setIsLibraryModalOpen(false);
  };
  
  const widgetToEdit = widgets.find(w => w.id === editingWidgetId);

  return (
    <div className="min-h-screen">
      <Header
        onOpenAiCreator={() => setIsAiModalOpen(true)}
        onOpenLibrary={() => setIsLibraryModalOpen(true)}
      />
      <main className="p-4 sm:p-6 lg:p-8">
        <Dashboard 
          widgets={widgets} 
          onDeleteWidget={deleteWidget} 
          onOpenLayoutSettings={openLayoutSettings}
          onReorderWidgets={reorderWidgets}
          onUpdateWidgetChartType={updateWidgetChartType}
        />
      </main>
      <AiCreatorModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        onCreate={handleCreateWidgetFromPrompt}
      />
      <WidgetLibraryModal
        isOpen={isLibraryModalOpen}
        onClose={() => setIsLibraryModalOpen(false)}
        onAdd={handleAddWidgetFromLibrary}
      />
      {widgetToEdit && (
        <LayoutSettingsModal
          widget={widgetToEdit}
          onClose={closeLayoutSettings}
          onSave={saveLayoutSettings}
        />
      )}
    </div>
  );
}