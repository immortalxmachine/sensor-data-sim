
import React, { useEffect, useState } from 'react';
import { useInView } from '@/utils/animations';
import GlassMorphism from './GlassMorphism';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Filter, Download, RefreshCw } from 'lucide-react';
import { ChartData } from './ChartComponent';
import { 
  generateTemperatureData, 
  generateVibrationData, 
  generateEnergyData 
} from '@/utils/dataGenerators';

// Import all panel components
import { TemperaturePanel } from './data-panels/TemperaturePanel';
import { VibrationPanel } from './data-panels/VibrationPanel';
import { EnergyPanel } from './data-panels/EnergyPanel';
import { SystemHealthPanel } from './data-panels/SystemHealthPanel';
import { CsvUploadPanel } from './data-panels/CsvUploadPanel';

export function DataPanel() {
  const [temperatureData, setTemperatureData] = useState<ChartData[]>([]);
  const [vibrationData, setVibrationData] = useState<ChartData[]>([]);
  const [energyData, setEnergyData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [ref, isInView] = useInView({ threshold: 0.1, triggerOnce: true });
  
  useEffect(() => {
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
              <TabsTrigger value="csv-upload">CSV Upload</TabsTrigger>
            </TabsList>
            
            <TabsContent value="real-time" className="space-y-8">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <TemperaturePanel data={temperatureData} isLoading={isLoading} />
                <VibrationPanel data={vibrationData} isLoading={isLoading} />
                <EnergyPanel data={energyData} isLoading={isLoading} />
              </div>
              
              <SystemHealthPanel />
            </TabsContent>
            
            <TabsContent value="historical" className="min-h-[400px] flex items-center justify-center text-gray-dark">
              Historical data analysis view will appear here.
            </TabsContent>
            
            <TabsContent value="predictive" className="min-h-[400px] flex items-center justify-center text-gray-dark">
              Predictive analytics and maintenance forecasts will appear here.
            </TabsContent>

            <TabsContent value="csv-upload" className="space-y-8">
              <CsvUploadPanel />
            </TabsContent>
          </Tabs>
        </GlassMorphism>
      </div>
    </section>
  );
}

export default DataPanel;
