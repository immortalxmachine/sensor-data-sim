
import React, { useState, useEffect } from 'react';
import { 
  Calendar, 
  ChevronDown, 
  Clock, 
  Download, 
  Filter,
  ChartLine,
  ChartBarStacked,
  ChartArea
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import ChartComponent from '../ChartComponent';
import { ChartData, generateTemperatureData, generateVibrationData, generateEnergyData } from '@/utils/dataGenerators';

// Generate historical data for different time periods
const generateHistoricalData = (metric: string, timeframe: string): ChartData[] => {
  let data: ChartData[] = [];
  const now = new Date();
  
  // Different data generation based on metric type
  switch (metric) {
    case 'temperature':
      data = generateTemperatureData();
      break;
    case 'vibration':
      data = generateVibrationData();
      break;
    case 'energy':
      data = generateEnergyData();
      break;
    default:
      data = generateTemperatureData();
  }
  
  // Adjust data based on timeframe
  if (timeframe === 'month') {
    // For monthly data, we'll generate data for each day of the month
    data = Array.from({ length: 30 }, (_, i) => {
      const date = new Date(now);
      date.setDate(now.getDate() - (29 - i));
      
      const baseValue = 20 + Math.sin(i / 5) * 5;
      const fluctuation = Math.random() * 4 - 2;
      
      return {
        name: `${date.getMonth() + 1}/${date.getDate()}`,
        'Value': Math.round((baseValue + fluctuation) * 10) / 10,
        'Average': Math.round(baseValue * 10) / 10,
        'Threshold': metric === 'temperature' ? 30 : (metric === 'vibration' ? 0.5 : 60)
      };
    });
  } else if (timeframe === 'year') {
    // For yearly data, we'll generate data for each month
    data = Array.from({ length: 12 }, (_, i) => {
      const date = new Date(now);
      date.setMonth(now.getMonth() - (11 - i));
      
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const baseValue = 20 + Math.cos(i / 3) * 8;
      const fluctuation = Math.random() * 5 - 2.5;
      
      return {
        name: monthNames[date.getMonth()],
        'Value': Math.round((baseValue + fluctuation) * 10) / 10,
        'Average': Math.round(baseValue * 10) / 10,
        'Threshold': metric === 'temperature' ? 30 : (metric === 'vibration' ? 0.5 : 60)
      };
    });
  }
  
  return data;
};

const HistoricalTab: React.FC = () => {
  const [selectedMetric, setSelectedMetric] = useState<string>('temperature');
  const [selectedTimeframe, setSelectedTimeframe] = useState<string>('week');
  const [selectedChartType, setSelectedChartType] = useState<'line' | 'area' | 'bar'>('line');
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // Update chart data when metric or timeframe changes
  useEffect(() => {
    setIsLoading(true);
    
    // Simulate loading delay
    const timer = setTimeout(() => {
      setChartData(generateHistoricalData(selectedMetric, selectedTimeframe));
      setIsLoading(false);
    }, 800);
    
    return () => clearTimeout(timer);
  }, [selectedMetric, selectedTimeframe]);
  
  // Get appropriate title and units based on selected metric
  const getMetricDetails = () => {
    switch (selectedMetric) {
      case 'temperature':
        return { title: 'Temperature History', units: '°C' };
      case 'vibration':
        return { title: 'Vibration History', units: 'mm/s' };
      case 'energy':
        return { title: 'Energy Consumption History', units: 'kWh' };
      default:
        return { title: 'Sensor Data History', units: '' };
    }
  };
  
  // Get appropriate timeframe label
  const getTimeframeLabel = () => {
    switch (selectedTimeframe) {
      case 'week':
        return 'Past Week';
      case 'month':
        return 'Past Month';
      case 'year':
        return 'Past Year';
      default:
        return 'Time Period';
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls for the charts */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div className="flex flex-wrap items-center gap-3">
          <Select value={selectedMetric} onValueChange={setSelectedMetric}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Metric" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Metrics</SelectLabel>
                <SelectItem value="temperature">Temperature</SelectItem>
                <SelectItem value="vibration">Vibration</SelectItem>
                <SelectItem value="energy">Energy Consumption</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          
          <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Select Timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Time Period</SelectLabel>
                <SelectItem value="week">Past Week</SelectItem>
                <SelectItem value="month">Past Month</SelectItem>
                <SelectItem value="year">Past Year</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1 text-xs">
                <ChartLine className="h-3.5 w-3.5" />
                <span>Chart Type</span>
                <ChevronDown className="h-3 w-3 opacity-50" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setSelectedChartType('line')}>
                <ChartLine className="mr-2 h-3.5 w-3.5" />
                <span>Line Chart</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedChartType('area')}>
                <ChartArea className="mr-2 h-3.5 w-3.5" />
                <span>Area Chart</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setSelectedChartType('bar')}>
                <ChartBarStacked className="mr-2 h-3.5 w-3.5" />
                <span>Bar Chart</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button variant="outline" size="sm" className="gap-1 text-xs">
            <Filter className="h-3 w-3" />
            <span>Filter</span>
          </Button>
          
          <Button variant="outline" size="sm" className="gap-1 text-xs">
            <Download className="h-3 w-3" />
            <span>Export</span>
          </Button>
        </div>
      </div>
      
      {/* Main Chart */}
      <div className="bg-white p-4 rounded-lg border">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-medium">{getMetricDetails().title}</h3>
            <p className="text-sm text-gray-dark">{getTimeframeLabel()} • Units: {getMetricDetails().units}</p>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-dark">
            <Clock className="h-3.5 w-3.5" />
            <span>Last updated: {new Date().toLocaleTimeString()}</span>
          </div>
        </div>
        
        <ChartComponent
          data={chartData}
          type={selectedChartType}
          dataKeys={['Value', 'Average', 'Threshold']}
          colors={['#0066CC', '#10B981', '#F59E0B']}
          height={350}
          loading={isLoading}
          showGrid={true}
          showLegend={true}
        />
      </div>
      
      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { 
            title: 'Average', 
            value: chartData.length > 0 ? 
              Math.round(chartData.reduce((sum, item) => sum + (typeof item['Value'] === 'number' ? item['Value'] : 0), 0) / chartData.length * 10) / 10 : 
              0,
            trend: '+5.2%',
            trendUp: true
          },
          { 
            title: 'Maximum', 
            value: chartData.length > 0 ? 
              Math.max(...chartData.map(item => typeof item['Value'] === 'number' ? item['Value'] : 0)) : 
              0,
            trend: '+12.7%',
            trendUp: true
          },
          { 
            title: 'Minimum', 
            value: chartData.length > 0 ? 
              Math.min(...chartData.map(item => typeof item['Value'] === 'number' ? item['Value'] : 0)) : 
              0,
            trend: '-3.1%',
            trendUp: false
          }
        ].map((stat, index) => (
          <div key={index} className="bg-white p-4 rounded-lg border">
            <div className="text-sm text-gray-dark mb-1">{stat.title}</div>
            <div className="flex items-end gap-2">
              <div className="text-2xl font-semibold">
                {stat.value} {getMetricDetails().units}
              </div>
              <div className={`text-xs ${stat.trendUp ? 'text-green-500' : 'text-red-500'} flex items-center`}>
                {stat.trend}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoricalTab;
