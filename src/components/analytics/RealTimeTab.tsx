
import React from 'react';
import { Bell, Database } from 'lucide-react';
import { ChartComponent } from '../ChartComponent';
import { ChartData } from '@/utils/dataGenerators';

interface RealTimeTabProps {
  temperatureData: ChartData[];
  vibrationData: ChartData[];
  energyData: ChartData[];
  isLoading: boolean;
}

const RealTimeTab: React.FC<RealTimeTabProps> = ({
  temperatureData,
  vibrationData,
  energyData,
  isLoading
}) => {
  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="bg-white rounded-xl border border-gray-light/80 shadow-card p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h4 className="font-semibold">Temperature Monitoring</h4>
              <p className="text-sm text-gray-dark">Last 24 hours</p>
            </div>
            {temperatureData.length > 0 && 
              typeof temperatureData[temperatureData.length - 1]['Actual'] === 'number' && 
              (temperatureData[temperatureData.length - 1]['Actual'] as number) > 30 && (
              <div className="flex items-center text-warning text-sm">
                <Bell className="h-4 w-4 mr-1" />
                <span>Alert</span>
              </div>
            )}
          </div>
          
          <ChartComponent
            data={temperatureData}
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
                {temperatureData.length > 0 ? 
                  `${temperatureData[temperatureData.length - 1]['Actual']}°C` : 
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
        
        <div className="bg-white rounded-xl border border-gray-light/80 shadow-card p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h4 className="font-semibold">Vibration Analysis</h4>
              <p className="text-sm text-gray-dark">Last 24 hours</p>
            </div>
          </div>
          
          <ChartComponent
            data={vibrationData}
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
                {vibrationData.length > 0 ? 
                  `${vibrationData[vibrationData.length - 1]['Axial']} mm/s` : 
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
        
        <div className="bg-white rounded-xl border border-gray-light/80 shadow-card p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h4 className="font-semibold">Energy Consumption</h4>
              <p className="text-sm text-gray-dark">Last 7 days</p>
            </div>
          </div>
          
          <ChartComponent
            data={energyData}
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
                {energyData.length > 0 ? 
                  `${energyData[energyData.length - 1]['Current']} kWh` : 
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
      </div>
      
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
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-dark">Motor Efficiency</span>
              <span className="font-medium">94.6%</span>
            </div>
            <div className="w-full h-2 bg-gray-light/50 rounded-full overflow-hidden">
              <div className="h-full bg-success rounded-full" style={{ width: '94.6%' }}></div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-dark">Bearing Health</span>
              <span className="font-medium">87%</span>
            </div>
            <div className="w-full h-2 bg-gray-light/50 rounded-full overflow-hidden">
              <div className="h-full bg-success rounded-full" style={{ width: '87%' }}></div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-dark">Hydraulic System</span>
              <span className="font-medium">92%</span>
            </div>
            <div className="w-full h-2 bg-gray-light/50 rounded-full overflow-hidden">
              <div className="h-full bg-success rounded-full" style={{ width: '92%' }}></div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-dark">Cooling System</span>
              <span className="font-medium">78%</span>
            </div>
            <div className="w-full h-2 bg-gray-light/50 rounded-full overflow-hidden">
              <div className="h-full bg-warning rounded-full" style={{ width: '78%' }}></div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-dark">Control Electronics</span>
              <span className="font-medium">97%</span>
            </div>
            <div className="w-full h-2 bg-gray-light/50 rounded-full overflow-hidden">
              <div className="h-full bg-success rounded-full" style={{ width: '97%' }}></div>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-dark">Sensor Network</span>
              <span className="font-medium">100%</span>
            </div>
            <div className="w-full h-2 bg-gray-light/50 rounded-full overflow-hidden">
              <div className="h-full bg-success rounded-full" style={{ width: '100%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealTimeTab;
