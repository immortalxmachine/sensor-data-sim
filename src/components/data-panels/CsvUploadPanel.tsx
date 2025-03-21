
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Database, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { ChartComponent, ChartData } from '../ChartComponent';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface CsvData {
  headers: string[];
  rows: string[][];
}

export function CsvUploadPanel() {
  const [csvData, setCsvData] = useState<CsvData | null>(null);
  const [csvChartData, setCsvChartData] = useState<ChartData[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [csvInsights, setCsvInsights] = useState<{[key: string]: any}>({});
  const fileInputRef = useRef<HTMLInputElement>(null);
  
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
  );
}
