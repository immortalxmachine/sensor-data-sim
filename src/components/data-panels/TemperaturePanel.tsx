
import React from 'react';
import { ChartComponent, ChartData } from '../ChartComponent';
import { Bell } from 'lucide-react';

interface TemperaturePanelProps {
  data: ChartData[];
  isLoading: boolean;
}

export function TemperaturePanel({ data, isLoading }: TemperaturePanelProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-light/80 shadow-card p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h4 className="font-semibold">Temperature Monitoring</h4>
          <p className="text-sm text-gray-dark">Last 24 hours</p>
        </div>
        {data.length > 0 && 
          typeof data[data.length - 1]['Actual'] === 'number' && 
          (data[data.length - 1]['Actual'] as number) > 30 && (
          <div className="flex items-center text-warning text-sm">
            <Bell className="h-4 w-4 mr-1" />
            <span>Alert</span>
          </div>
        )}
      </div>
      
      <ChartComponent
        data={data}
        type="line"
        dataKeys={["Actual", "Predicted"]}
        colors={["#EF4444", "#0066CC"]}
        height={200}
        loading={isLoading}
        showLegend={true}
        animated={true}
      />
      
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="bg-gray-lightest rounded-lg p-3">
          <span className="text-sm text-gray-dark">Current</span>
          <div className="text-xl font-semibold">
            {data.length > 0 ? 
              `${data[data.length - 1]['Actual']}°C` : 
              '-'}
          </div>
        </div>
        <div className="bg-gray-lightest rounded-lg p-3">
          <span className="text-sm text-gray-dark">Trend</span>
          <div className="text-xl font-semibold text-error">
            +12.6%
          </div>
        </div>
      </div>
    </div>
  );
}
