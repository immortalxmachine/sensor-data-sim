
import React, { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { useInView } from '@/utils/animations';
import { cn } from '@/lib/utils';

export type ChartData = {
  name: string;
  [key: string]: string | number;
};

interface ChartComponentProps {
  data: ChartData[];
  type: 'line' | 'area' | 'bar';
  colors?: string[];
  dataKeys: string[];
  height?: number | string;
  className?: string;
  title?: string;
  subtitle?: string;
  loading?: boolean;
  showGrid?: boolean;
  showLegend?: boolean;
  animated?: boolean;
}

export function ChartComponent({
  data,
  type = 'line',
  colors = ['#0066CC', '#10B981', '#F59E0B', '#EF4444'],
  dataKeys,
  height = 300,
  className,
  title,
  subtitle,
  loading = false,
  showGrid = true,
  showLegend = true,
  animated = true,
}: ChartComponentProps) {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [ref, isInView] = useInView({ threshold: 0.1, triggerOnce: true });

  // If animated is true, gradually reveal the chart data when in view
  useEffect(() => {
    if (!animated || !isInView) {
      setChartData(data);
      return;
    }

    setChartData([]);
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setChartData(prev => {
          if (prev.length >= data.length) {
            clearInterval(interval);
            return data;
          }
          return [...prev, data[prev.length]];
        });
      }, 100);

      return () => clearInterval(interval);
    }, 300);

    return () => clearTimeout(timer);
  }, [data, isInView, animated]);

  // Choose chart type based on prop
  const renderChart = () => {
    switch (type) {
      case 'line':
        return (
          <LineChart data={chartData}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />}
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12, fill: '#4B5563' }}
              tickLine={{ stroke: '#e0e0e0' }}
              axisLine={{ stroke: '#e0e0e0' }}
            />
            <YAxis 
              tick={{ fontSize: 12, fill: '#4B5563' }}
              tickLine={{ stroke: '#e0e0e0' }}
              axisLine={{ stroke: '#e0e0e0' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '0.5rem',
                border: '1px solid #e0e0e0',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)'
              }}
            />
            {showLegend && <Legend />}
            {dataKeys.map((key, index) => (
              <Line
                key={key}
                type="monotone"
                dataKey={key}
                stroke={colors[index % colors.length]}
                strokeWidth={2}
                dot={{ r: 3, strokeWidth: 2, fill: '#fff' }}
                activeDot={{ r: 6, strokeWidth: 0 }}
                animationDuration={1500}
                animationEasing="ease-out"
              />
            ))}
          </LineChart>
        );
      case 'area':
        return (
          <AreaChart data={chartData}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />}
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12, fill: '#4B5563' }}
              tickLine={{ stroke: '#e0e0e0' }}
              axisLine={{ stroke: '#e0e0e0' }}
            />
            <YAxis 
              tick={{ fontSize: 12, fill: '#4B5563' }}
              tickLine={{ stroke: '#e0e0e0' }}
              axisLine={{ stroke: '#e0e0e0' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '0.5rem',
                border: '1px solid #e0e0e0',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)'
              }}
            />
            {showLegend && <Legend />}
            {dataKeys.map((key, index) => (
              <Area
                key={key}
                type="monotone"
                dataKey={key}
                stroke={colors[index % colors.length]}
                fill={`${colors[index % colors.length]}25`}
                animationDuration={1500}
                animationEasing="ease-out"
              />
            ))}
          </AreaChart>
        );
      case 'bar':
        return (
          <BarChart data={chartData}>
            {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />}
            <XAxis 
              dataKey="name" 
              tick={{ fontSize: 12, fill: '#4B5563' }}
              tickLine={{ stroke: '#e0e0e0' }}
              axisLine={{ stroke: '#e0e0e0' }}
            />
            <YAxis 
              tick={{ fontSize: 12, fill: '#4B5563' }}
              tickLine={{ stroke: '#e0e0e0' }}
              axisLine={{ stroke: '#e0e0e0' }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderRadius: '0.5rem',
                border: '1px solid #e0e0e0',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)'
              }}
            />
            {showLegend && <Legend />}
            {dataKeys.map((key, index) => (
              <Bar
                key={key}
                dataKey={key}
                fill={colors[index % colors.length]}
                animationDuration={1500}
                animationEasing="ease-out"
                radius={[4, 4, 0, 0]}
              />
            ))}
          </BarChart>
        );
      default:
        return null;
    }
  };

  return (
    <div 
      ref={ref as React.RefObject<HTMLDivElement>} 
      className={cn("w-full", className)}
    >
      {(title || subtitle) && (
        <div className="mb-4">
          {title && <h3 className="text-lg font-semibold">{title}</h3>}
          {subtitle && <p className="text-sm text-gray-dark">{subtitle}</p>}
        </div>
      )}
      
      {loading ? (
        <div className="flex items-center justify-center h-[300px] bg-gray-lighter/50 rounded-lg animate-pulse">
          <div className="w-8 h-8 border-4 border-blue rounded-full border-t-transparent animate-spin"></div>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={height}>
          {renderChart()}
        </ResponsiveContainer>
      )}
    </div>
  );
}

export default ChartComponent;
