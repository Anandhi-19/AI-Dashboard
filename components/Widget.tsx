import React, { useState, useRef, useEffect } from 'react';
import ChartRenderer from './ChartRenderer';
import { WidgetConfig, ChartType } from '../types';
import { CloseIcon, SettingsIcon, BarChartIcon } from './icons';

const CHART_TYPES: ChartType[] = ['card', 'bar', 'horizontalBar', 'line', 'pie', 'donut', 'area', 'stackedBar', 'radar', 'funnel', 'radialBar'];

interface WidgetProps {
  config: WidgetConfig;
  onDelete: (id: string) => void;
  onOpenLayoutSettings: (id: string) => void;
  onUpdateChartType: (id: string, chartType: ChartType) => void;
  onDragStart: (id: string) => void;
  isDragging: boolean;
}

const Widget: React.FC<WidgetProps> = ({ config, onDelete, onOpenLayoutSettings, onUpdateChartType, onDragStart, isDragging }) => {
  const [isChartSelectorOpen, setIsChartSelectorOpen] = useState(false);
  const chartSelectorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (chartSelectorRef.current && !chartSelectorRef.current.contains(event.target as Node)) {
        setIsChartSelectorOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleChartTypeChange = (chartType: ChartType) => {
    onUpdateChartType(config.id, chartType);
    setIsChartSelectorOpen(false);
  };

  const formatChartName = (type: ChartType) => {
    switch (type) {
      case 'horizontalBar': return 'Horizontal Bar';
      case 'stackedBar': return 'Stacked Bar';
      case 'radialBar': return 'Radial Bar';
      default: return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };

  return (
    <div className={`bg-slate-800/60 backdrop-blur-xl border border-slate-700 rounded-2xl shadow-lg p-4 flex flex-col h-full transition-all duration-300 ease-in-out hover:shadow-indigo-500/30 hover:border-indigo-700/60 ${isDragging ? 'opacity-30' : ''}`}>
      <div 
        className="flex justify-between items-start mb-2 cursor-grab active:cursor-grabbing"
        draggable="true"
        onDragStart={() => onDragStart(config.id)}
      >
        <h3 className="font-semibold text-gray-100 text-base leading-tight pr-2 select-none">{config.title}</h3>
        <div className="relative flex items-center gap-1 flex-shrink-0">
          <div ref={chartSelectorRef}>
            <button
              onClick={() => setIsChartSelectorOpen(!isChartSelectorOpen)}
              className="text-gray-400 hover:text-white transition-colors"
              aria-label="Change chart type"
            >
              <BarChartIcon className="w-5 h-5" />
            </button>
            {isChartSelectorOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-gray-800/90 backdrop-blur-xl border border-gray-700 rounded-lg shadow-lg z-10 animate-fade-in-down">
                <ul>
                  {CHART_TYPES.map(type => (
                    <li key={type}>
                      <button
                        onClick={() => handleChartTypeChange(type)}
                        className="w-full text-left px-4 py-2 text-sm text-gray-200 hover:bg-indigo-600/50 transition-colors disabled:text-gray-500 disabled:hover:bg-transparent"
                        disabled={type === config.chartType}
                      >
                        {formatChartName(type)}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <button
            onClick={() => onOpenLayoutSettings(config.id)}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Widget settings"
          >
            <SettingsIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => onDelete(config.id)}
            className="text-gray-400 hover:text-white transition-colors"
            aria-label="Delete widget"
          >
            <CloseIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
      <div className="flex-grow">
        <ChartRenderer
          chartType={config.chartType}
          data={config.data}
          columns={config.columns}
        />
      </div>
    </div>
  );
};

export default Widget;