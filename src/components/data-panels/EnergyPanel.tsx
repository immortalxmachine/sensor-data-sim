
import React from 'react';
import { ChartComponent, ChartData } from '../ChartComponent';

interface EnergyPanelProps {
  data: ChartData[];
  isLoading: boolean;
}

export function EnergyPanel({ data, isLoading }: EnergyPanelProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-light/80 shadow-card p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h4 className="font-semibold">Energy Consumption</h4>
          <p className="text-sm text-gray-dark">Last 7 days</p>
        </div>
      </div>
      
      <ChartComponent
        data={data}
        type="bar"
        dataKeys={["Current", "Optimized"]}
        colors={["#0066CC", "#10B981"]}
        height={200}
        loading={isLoading}
        showLegend={true}
        animated={true}
      />
      
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="bg-gray-lightest rounded-lg p-3">
          <span className="text-sm text-gray-dark">Daily Avg</span>
          <div className="text-xl font-semibold">
            {data.length > 0 ? 
              `${data[data.length - 1]['Current']} kWh` : 
              '-'}
          </div>
        </div>
        <div className="bg-gray-lightest rounded-lg p-3">
          <span className="text-sm text-gray-dark">Potential Savings</span>
          <div className="text-xl font-semibold text-success">
            15%
          </div>
        </div>
      </div>
    </div>
  );
}
