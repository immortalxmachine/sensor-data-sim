
import React from 'react';
import { ChartComponent, ChartData } from '../ChartComponent';

interface VibrationPanelProps {
  data: ChartData[];
  isLoading: boolean;
}

export function VibrationPanel({ data, isLoading }: VibrationPanelProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-light/80 shadow-card p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h4 className="font-semibold">Vibration Analysis</h4>
          <p className="text-sm text-gray-dark">Last 24 hours</p>
        </div>
      </div>
      
      <ChartComponent
        data={data}
        type="area"
        dataKeys={["Axial", "Radial", "Threshold"]}
        colors={["#0066CC", "#8B5CF6", "#F59E0B"]}
        height={200}
        loading={isLoading}
        showLegend={true}
        animated={true}
      />
      
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="bg-gray-lightest rounded-lg p-3">
          <span className="text-sm text-gray-dark">Axial</span>
          <div className="text-xl font-semibold">
            {data.length > 0 ? 
              `${data[data.length - 1]['Axial']} mm/s` : 
              '-'}
          </div>
        </div>
        <div className="bg-gray-lightest rounded-lg p-3">
          <span className="text-sm text-gray-dark">Status</span>
          <div className="text-xl font-semibold text-success">
            Normal
          </div>
        </div>
      </div>
    </div>
  );
}
