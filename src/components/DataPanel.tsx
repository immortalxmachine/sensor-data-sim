import React, { useEffect, useState, useRef } from 'react';
import { ChartComponent, ChartData } from './ChartComponent';
import { useInView } from '@/utils/animations';
import GlassMorphism from './GlassMorphism';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bell, Database, Download, Filter, RefreshCw, Upload, FileText } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

const generateTemperatureData = (): ChartData[] => {
  const data: ChartData[] = [];
  const now = new Date();
  
  for (let i = 11; i >= 0; i--) {
    const time = new Date(now);
    time.setHours(now.getHours() - i * 2);
    
    const timeString = time.getHours().toString().padStart(2, '0') + ':00';
    
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

interface CsvData {
  headers: string[];
  rows: string[][];
}

export function DataPanel() {
  const [temperatureData, setTemperatureData] = useState<ChartData[]>([]);
  const [vibrationData, setVibrationData] = useState<ChartData[]>([]);
  const [energyData, setEnergyData] = useState<ChartData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [ref, isInView] = useInView({ threshold: 0.1, triggerOnce: true });
  
  const [csvData, setCsvData] = useState<CsvData | null>(null);
  const [csvChartData, setCsvChartData] = useState<ChartData[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [csvInsights, setCsvInsights] = useState<{[key: string]: any}>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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
  
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setIsProcessing(true);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csvContent = e.target?.result as string;
        const parsedData = parseCSV(csvContent);
        setCsvData(parsedData);
        
        const chartData = generateChartFromCSV(parsedData);
        setCsvChartData(chartData);
        
        const insights = generateInsightsFromCSV(parsedData);
        setCsvInsights(insights);
        
        setIsProcessing(false);
        toast.success("CSV file processed successfully");
      } catch (error) {
        console.error("Error processing CSV:", error);
        setIsProcessing(false);
        toast.error("Error processing CSV. Please check file format.");
      }
    };
    
    reader.onerror = () => {
      setIsProcessing(false);
      toast.error("Failed to read file");
    };
    
    reader.readAsText(file);
  };
  
  const parseCSV = (csvContent: string): CsvData => {
    const lines = csvContent.split('\n');
    const headers = lines[0].split(',').map(header => header.trim());
    
    const rows = lines.slice(1)
      .filter(line => line.trim() !== '')
      .map(line => line.split(',').map(cell => cell.trim()));
    
    return { headers, rows };
  };
  
  const generateChartFromCSV = (data: CsvData): ChartData[] => {
    const numericColumns: number[] = [];
    const firstDataRow = data.rows[0] || [];
    
    firstDataRow.forEach((value, index) => {
      if (!isNaN(Number(value))) {
        numericColumns.push(index);
      }
    });
    
    if (numericColumns.length > 0) {
      const labelColumnIndex = numericColumns.includes(0) ? -1 : 0;
      
      return data.rows.map((row, rowIndex) => {
        const chartPoint: ChartData = { 
          name: labelColumnIndex >= 0 ? row[labelColumnIndex] : `Row ${rowIndex + 1}` 
        };
        
        numericColumns.forEach(colIndex => {
          if (colIndex !== labelColumnIndex) {
            const colName = data.headers[colIndex] || `Column ${colIndex + 1}`;
            chartPoint[colName] = Number(row[colIndex]);
          }
        });
        
        return chartPoint;
      });
    }
    
    return [];
  };
  
  const generateInsightsFromCSV = (data: CsvData) => {
    const insights: {[key: string]: any} = {
      rowCount: data.rows.length,
      columnCount: data.headers.length,
      columnTypes: {},
      summaryStats: {}
    };
    
    data.headers.forEach((header, index) => {
      const columnValues = data.rows.map(row => row[index]);
      const numericValues = columnValues
        .filter(val => !isNaN(Number(val)))
        .map(val => Number(val));
      
      if (numericValues.length > 0) {
        insights.columnTypes[header] = 'numeric';
        
        const sum = numericValues.reduce((a, b) => a + b, 0);
        const avg = sum / numericValues.length;
        const min = Math.min(...numericValues);
        const max = Math.max(...numericValues);
        
        insights.summaryStats[header] = {
          min,
          max,
          avg: Math.round(avg * 100) / 100,
          sum: Math.round(sum * 100) / 100
        };
      } else {
        insights.columnTypes[header] = 'text';
        
        const uniqueValues = new Set(columnValues);
        insights.summaryStats[header] = {
          uniqueValues: uniqueValues.size,
          mostCommon: getMostCommonValue(columnValues)
        };
      }
    });
    
    return insights;
  };
  
  const getMostCommonValue = (values: string[]) => {
    const counts: {[key: string]: number} = {};
    values.forEach(val => {
      counts[val] = (counts[val] || 0) + 1;
    });
    
    let mostCommonValue = '';
    let highestCount = 0;
    
    Object.keys(counts).forEach(key => {
      if (counts[key] > highestCount) {
        mostCommonValue = key;
        highestCount = counts[key];
      }
    });
    
    return { value: mostCommonValue, count: highestCount };
  };
  
  const handleUploadButtonClick = () => {
    fileInputRef.current?.click();
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

            <TabsContent value="csv-upload" className="space-y-8">
              <div className="bg-white rounded-xl border border-gray-light/80 shadow-card p-6">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h4 className="font-semibold">CSV Data Upload</h4>
                    <p className="text-sm text-gray-dark">Upload your CSV file to get real-time insights</p>
                  </div>
                </div>
                
                <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed border-gray-light/50 rounded-lg bg-gray-lighter/30">
                  <Database className="h-10 w-10 text-blue mb-4" />
                  <h3 className="text-lg font-medium mb-2">Upload Your Data</h3>
                  <p className="text-sm text-gray-dark text-center mb-4">
                    Drag and drop a CSV file here, or click to select
                  </p>
                  
                  <Input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                  
                  <Button 
                    onClick={handleUploadButtonClick}
                    disabled={isProcessing}
                    className="mb-2"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Select CSV File
                  </Button>
                  
                  <p className="text-xs text-gray-dark">
                    CSV files with headers in the first row are supported
                  </p>
                </div>
                
                {isProcessing && (
                  <div className="mt-6 flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-blue rounded-full border-t-transparent animate-spin mr-3"></div>
                    <span>Processing data...</span>
                  </div>
                )}
                
                {csvData && !isProcessing && (
                  <div className="mt-8 space-y-6">
                    <div className="bg-gray-lighter/30 p-4 rounded-lg">
                      <h4 className="font-medium mb-2">File Overview</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-dark">Rows:</span> {csvInsights.rowCount}
                        </div>
                        <div>
                          <span className="text-gray-dark">Columns:</span> {csvInsights.columnCount}
                        </div>
                      </div>
                    </div>
                    
                    {csvChartData.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">Data Visualization</h4>
                        <ChartComponent
                          data={csvChartData}
                          type="line"
                          dataKeys={Object.keys(csvChartData[0]).filter(key => key !== 'name')}
                          height={300}
                          loading={false}
                          showLegend={true}
                          animated={true}
                        />
                      </div>
                    )}
                    
                    <div>
                      <h4 className="font-medium mb-2">Data Insights</h4>
                      
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Object.keys(csvInsights.summaryStats || {}).map(column => (
                          <div key={column} className="bg-white border border-gray-light/50 rounded-lg p-4">
                            <h5 className="font-medium mb-2 text-blue">{column}</h5>
                            <p className="text-xs text-gray-dark mb-2">
                              Type: {csvInsights.columnTypes[column]}
                            </p>
                            
                            {csvInsights.columnTypes[column] === 'numeric' ? (
                              <div className="space-y-1 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-dark">Min:</span>
                                  <span>{csvInsights.summaryStats[column].min}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-dark">Max:</span>
                                  <span>{csvInsights.summaryStats[column].max}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-dark">Average:</span>
                                  <span>{csvInsights.summaryStats[column].avg}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-dark">Sum:</span>
                                  <span>{csvInsights.summaryStats[column].sum}</span>
                                </div>
                              </div>
                            ) : (
                              <div className="space-y-1 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-dark">Unique Values:</span>
                                  <span>{csvInsights.summaryStats[column].uniqueValues}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-dark">Most Common:</span>
                                  <span>
                                    {csvInsights.summaryStats[column].mostCommon.value} 
                                    ({csvInsights.summaryStats[column].mostCommon.count})
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-medium mb-2">Data Preview</h4>
                      <div className="overflow-x-auto">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              {csvData.headers.map((header, index) => (
                                <TableHead key={index}>{header}</TableHead>
                              ))}
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {csvData.rows.slice(0, 5).map((row, rowIndex) => (
                              <TableRow key={rowIndex}>
                                {row.map((cell, cellIndex) => (
                                  <TableCell key={cellIndex}>{cell}</TableCell>
                                ))}
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                      {csvData.rows.length > 5 && (
                        <p className="text-xs text-gray-dark text-center mt-2">
                          Showing 5 of {csvData.rows.length} rows
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </GlassMorphism>
      </div>
    </section>
  );
}

export default DataPanel;
