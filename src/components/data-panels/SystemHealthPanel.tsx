
import React from 'react';

export function SystemHealthPanel() {
  return (
    <div className="bg-white rounded-xl border border-gray-light/80 shadow-card p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h4 className="font-semibold">System Health Overview</h4>
          <p className="text-sm text-gray-dark">All connected sensors and subsystems</p>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-success mr-2"></div>
          <span className="text-sm font-medium">Healthy</span>
        </div>
      </div>
      
      <div className="grid md:grid-cols-3 gap-4">
        <HealthIndicator label="Motor Efficiency" value={94.6} />
        <HealthIndicator label="Bearing Health" value={87} />
        <HealthIndicator label="Hydraulic System" value={92} />
        <HealthIndicator label="Cooling System" value={78} status="warning" />
        <HealthIndicator label="Control Electronics" value={97} />
        <HealthIndicator label="Sensor Network" value={100} />
      </div>
    </div>
  );
}

interface HealthIndicatorProps {
  label: string;
  value: number;
  status?: 'success' | 'warning' | 'error';
}

function HealthIndicator({ label, value, status = 'success' }: HealthIndicatorProps) {
  return (
    <div className="space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-gray-dark">{label}</span>
        <span className="font-medium">{value}%</span>
      </div>
      <div className="w-full h-2 bg-gray-light/50 rounded-full overflow-hidden">
        <div 
          className={`h-full ${status === 'warning' ? 'bg-warning' : 'bg-success'} rounded-full`} 
          style={{ width: `${value}%` }}
        ></div>
      </div>
    </div>
  );
}
