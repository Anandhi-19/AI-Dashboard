// FIX: Import ComponentType from 'react' to resolve 'Cannot find namespace 'React'' error.
import type { ComponentType } from 'react';

export type ChartType = 
  'card' | 
  'bar' | 
  'line' | 
  'pie' | 
  'donut' |
  'area' |
  'radar' |
  'funnel' |
  'radialBar' |
  'stackedBar' | 
  'horizontalBar';

export interface WidgetConfig {
  id: string;
  title: string;
  chartType: ChartType;
  sql: string;
  data: Record<string, any>[];
  columns: string[];
  colSpan: number;
  rowSpan: number;
}

export interface PredefinedWidget {
    id: string;
    title: string;
    chart_type: ChartType;
    sql: string;
    icon: ComponentType<{ className?: string }>;
}

export interface AiQueryResponse {
  sql: string;
  chart_type: ChartType;
  title: string;
  data: Record<string, any>[];
  columns: string[];
}

export interface ExecuteSqlResponse {
  columns: string[];
  data: Record<string, any>[];
}

export interface FetchedWidgetData {
    title: string;
    chartType: ChartType;
    sql: string;
    data: Record<string, any>[];
    columns: string[];
}

export type DateRange = {
  startDate: string;
  endDate: string;
};