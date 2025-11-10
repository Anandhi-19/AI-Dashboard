
import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  AreaChart,
  Area,
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  FunnelChart,
  Funnel,
  LabelList,
  RadialBarChart,
  RadialBar,
} from 'recharts';
import { ChartType } from '../types';

interface ChartRendererProps {
  chartType: ChartType;
  data: Record<string, any>[];
  columns: string[];
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800/80 backdrop-blur-sm p-3 border border-gray-600 rounded-md shadow-lg">
        <p className="label text-gray-200 font-semibold">{`${label}`}</p>
        {payload.map((pld: any, index: number) => (
          <p key={index} style={{ color: pld.color }} className="intro">{`${pld.name} : ${pld.value.toLocaleString()}`}</p>
        ))}
      </div>
    );
  }
  return null;
};


const ChartRenderer: React.FC<ChartRendererProps> = ({ chartType, data, columns }) => {
  if (!data || data.length === 0 || columns.length === 0) {
    return <div className="flex items-center justify-center h-full text-gray-400">No data available</div>;
  }

  const labelKey = columns[0];
  const dataKeys = columns.slice(1);

  const renderCard = () => {
    const value = data[0]?.[columns[0]];
    const formattedValue = typeof value === 'number' ? value.toLocaleString() : value;
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <div className="text-4xl lg:text-5xl font-bold text-white">{formattedValue}</div>
      </div>
    );
  };
  
  const renderPieChart = () => {
    const nameKey = columns[0];
    const valueKey = columns[1];
    return(
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Tooltip content={<CustomTooltip />} />
        <Pie data={data} dataKey={valueKey} nameKey={nameKey} cx="50%" cy="50%" outerRadius={80} fill="#8884d8">
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )};

  const renderDonutChart = () => {
    const nameKey = columns[0];
    const valueKey = columns[1];
    return(
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Tooltip content={<CustomTooltip />} />
        <Pie data={data} dataKey={valueKey} nameKey={nameKey} cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#8884d8" paddingAngle={5}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )};
  
  const renderRadarChart = () => (
    <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
            <PolarGrid stroke="rgba(255, 255, 255, 0.2)" />
            <PolarAngleAxis dataKey={labelKey} tick={{ fill: '#a0aec0' }} fontSize={12} />
            <PolarRadiusAxis angle={30} domain={[0, 'dataMax']} tick={{ fill: '#a0aec0' }} fontSize={10} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {dataKeys.map((key, index) => (
                <Radar key={key} name={key} dataKey={key} stroke={COLORS[index % COLORS.length]} fill={COLORS[index % COLORS.length]} fillOpacity={0.6} />
            ))}
        </RadarChart>
    </ResponsiveContainer>
  );

  const renderFunnelChart = () => (
    <ResponsiveContainer width="100%" height="100%">
        <FunnelChart>
            <Tooltip content={<CustomTooltip />} />
            <Funnel dataKey={dataKeys[0]} data={data} isAnimationActive>
                <LabelList position="right" fill="#fff" stroke="none" dataKey={labelKey} />
                {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
            </Funnel>
        </FunnelChart>
    </ResponsiveContainer>
  );

  const renderRadialBarChart = () => (
    <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart 
            cx="50%" 
            cy="50%" 
            innerRadius="20%" 
            outerRadius="80%" 
            barSize={10} 
            data={data}
            startAngle={90}
            endAngle={-270}
        >
            <RadialBar
                minAngle={15}
                label={{ position: 'insideStart', fill: '#fff' }}
                background
                dataKey={dataKeys[0]}
            >
            {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
            </RadialBar>
            <Legend iconSize={10} layout="vertical" verticalAlign="middle" align="right" />
            <Tooltip content={<CustomTooltip />} />
        </RadialBarChart>
    </ResponsiveContainer>
  );


  const renderStandardChart = (ChartComponent: any, SeriesComponent: any, extraProps = {}) => (
    <ResponsiveContainer width="100%" height="100%">
      <ChartComponent data={data} margin={{ top: 5, right: 20, left: 10, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.2)" />
        <XAxis dataKey={labelKey} tick={{ fill: '#a0aec0' }} fontSize={12} />
        <YAxis tick={{ fill: '#a0aec0' }} fontSize={12} />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        {dataKeys.map((key, index) => (
            <SeriesComponent key={key} dataKey={key} fill={COLORS[index % COLORS.length]} stroke={COLORS[index % COLORS.length]} {...extraProps} />
        ))}
      </ChartComponent>
    </ResponsiveContainer>
  );

  const renderHorizontalBarChart = () => (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} layout="vertical" margin={{ top: 5, right: 20, left: 40, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.2)" />
        <XAxis type="number" tick={{ fill: '#a0aec0' }} fontSize={12} />
        <YAxis type="category" dataKey={labelKey} tick={{ fill: '#a0aec0' }} fontSize={12} width={80} />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        {dataKeys.map((key, index) => (
            <Bar key={key} dataKey={key} fill={COLORS[index % COLORS.length]} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );


  switch (chartType) {
    case 'card':
      return renderCard();
    case 'pie':
      return renderPieChart();
    case 'donut':
        return renderDonutChart();
    case 'bar':
        return renderStandardChart(BarChart, Bar);
    case 'horizontalBar':
        return renderHorizontalBarChart();
    case 'line':
        return renderStandardChart(LineChart, Line);
    case 'area':
        return renderStandardChart(AreaChart, Area, { type: 'monotone' });
    case 'radar':
        return renderRadarChart();
    case 'funnel':
        return renderFunnelChart();
    case 'radialBar':
        return renderRadialBarChart();
    case 'stackedBar':
        return renderStandardChart(BarChart, Bar, { stackId: "a" });
    default:
      return <div className="text-gray-400">Unknown chart type</div>;
  }
};

export default ChartRenderer;