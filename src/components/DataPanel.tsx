import React, { useEffect, useState } from 'react';
import { ChartComponent, ChartData } from './ChartComponent';
import { useInView } from '@/utils/animations';
import GlassMorphism from './GlassMorphism';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, Database, Download, Filter, RefreshCw } from 'lucide-react';

// Simulation of sensor data
const generateTemperatureData = (): ChartData[] => {
  const data: ChartData[] = [];
  const now = new Date();
  
  for (let i = 11; i >= 0; i--) {
    const time = new Date(now);
    time.setHours(now.getHours() - i * 2);
    
    const timeString = time.getHours().toString().padStart(2, '0') + ':00';
    
    // Simulate realistic temperature patterns
    const baseTemp = 24 + Math.sin(i / 3) * 2;
    const normalTemp = baseTemp + (Math.random() * 2 - 1);
    const criticalTemp = i >= 9 ? normalTemp + 12 * Math.exp(-(i-10)*(i-10) / 2) : normalTemp;
    
    data.push({
      name: timeString,
      "Actual": Math.round(criticalTemp * 10) / 10,
      "Predicted": Math.round(normalTemp * 10) / 10,
    });
  }
  
  return data;
};

const generateVibrationData = (): ChartData[] => {
  const data: ChartData[] = [];
  const now = new Date();
  
  for (let i = 11; i >= 0; i--) {
    const time = new Date(now);
    time.setHours(now.getHours() - i * 2);
    
    const timeString = time.getHours().toString().padStart(2, '0') + ':00';
    
    // Simulate realistic vibration patterns
    const baseVibration = 0.2 + Math.sin(i / 2) * 0.1;
    const normalVibration = baseVibration + (Math.random() * 0.2 - 0.1);
    
    data.push({
      name: timeString,
      "Axial": Math.round(normalVibration * 100) / 100,
      "Radial": Math.round((normalVibration * 0.7) * 100) / 100,
      "Threshold": 0.5
    });
  }
  
  return data;
};

const generateEnergyData = (): ChartData[] => {
  const data: ChartData[] = [];
  const now = new Date();
  
  for (let i = 6; i >= 0; i--) {
    const time = new Date(now);
    time.setDate(now.getDate() - i);
    
    const timeString = `${time.getMonth() + 1}/${time.getDate()}`;
    
    // Simulate realistic energy consumption patterns
    const baseEnergy = 45 - i * 0.5;
    const actualEnergy = baseEnergy + (Math.random() * 10 - 5);
    const optimizedEnergy = actualEnergy * 0.85;
    
    data.push({
      name: timeString,
      "Current": Math.round(actualEnergy),
      "Optimized": Math.round(optimizedEnergy)
    });
  }
  
  return data;
};

export function DataPanel() {
  const [temperatureData, setTemperatureData] = useState<ChartData[]>([]);
  const [vibrationData, setVibrationData] = useState<ChartData[]>([]);
  const [energyData, setEnergyData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [ref, isInView] = useInView({ threshold: 0.1, triggerOnce: true });
  
  useEffect(() => {
    // Simulate data loading
    if (isInView) {
      setTimeout(() => {
        setTemperatureData(generateTemperatureData());
        setVibrationData(generateVibrationData());
        setEnergyData(generateEnergyData());
        setIsLoading(false);
      }, 800);
    }
  }, [isInView]);
  
  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => {
      setTemperatureData(generateTemperatureData());
      setVibrationData(generateVibrationData());
      setEnergyData(generateEnergyData());
      setIsLoading(false);
    }, 800);
  };
  
  return (
    <section 
      id="analytics" 
      className="py-24 bg-white relative"
      ref={ref as React.RefObject<HTMLElement>}
    >
      <div className="container px-6 md:px-10 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block px-3 py-1 mb-6 rounded-full bg-blue/10 border border-blue/20 text-blue text-sm font-medium">
            Data Analytics
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
            Turn Raw Data into Actionable Insights
          </h2>
          <p className="text-lg text-gray-dark">
            Our analytics platform provides clear visualizations and predictive insights to help you make informed decisions.
          </p>
        </div>
        
        <GlassMorphism className="p-6 md:p-8">
          <div className="flex flex-wrap justify-between items-center mb-6">
            <div>
              <h3 className="text-xl font-semibold mb-1">Asset Performance Dashboard</h3>
              <p className="text-gray-dark">Monitoring Industrial Pump XL-5000</p>
            </div>
            
            <div className="flex space-x-2 mt-4 sm:mt-0">
              <Button variant="outline" size="sm" className="text-xs">
                <Filter className="h-3 w-3 mr-1" />
                Filter
              </Button>
              <Button variant="outline" size="sm" className="text-xs">
                <Download className="h-3 w-3 mr-1" />
                Export
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                className="text-xs"
                onClick={handleRefresh}
                disabled={isLoading}
              >
                <RefreshCw className={cn(
                  "h-3 w-3 mr-1",
                  isLoading && "animate-spin"
                )} />
                Refresh
              </Button>
            </div>
          </div>
          
          <Tabs defaultValue="real-time">
            <TabsList className="mb-6">
              <TabsTrigger value="real-time">Real-Time Analysis</TabsTrigger>
              <TabsTrigger value="historical">Historical Trends</TabsTrigger>
              <TabsTrigger value="predictive">Predictive Insights</TabsTrigger>
            </TabsList>
            
            <TabsContent value="real-time" className="space-y-8">
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
            </TabsContent>
            
            <TabsContent value="historical" className="min-h-[400px] flex items-center justify-center text-gray-dark">
              Historical data analysis view will appear here.
            </TabsContent>
            
            <TabsContent value="predictive" className="min-h-[400px] flex items-center justify-center text-gray-dark">
              Predictive analytics and maintenance forecasts will appear here.
            </TabsContent>
          </Tabs>
        </GlassMorphism>
      </div>
    </section>
  );
}

export default DataPanel;
