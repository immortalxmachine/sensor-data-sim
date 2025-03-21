
import React, { useRef, useState } from 'react';
import { Database, Upload, FileText } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ChartComponent } from '../ChartComponent';
import { ChartData } from '@/utils/dataGenerators';
import { CsvData, InsightSummary, handleFileUpload } from '@/utils/csvUtils';

const CsvUploadTab: React.FC = () => {
  const [csvData, setCsvData] = useState<CsvData | null>(null);
  const [csvChartData, setCsvChartData] = useState<ChartData[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [csvInsights, setCsvInsights] = useState<InsightSummary | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleUploadButtonClick = () => {
    fileInputRef.current?.click();
  };
  
  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleFileUpload(
        file, 
        setCsvData, 
        setCsvChartData, 
        setCsvInsights as (insights: InsightSummary) => void, 
        setIsProcessing
      );
    }
  };
  
  return (
    <div className="space-y-8">
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
            onChange={onFileChange}
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
        
        {csvData && !isProcessing && csvInsights && (
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
                            {csvInsights.summaryStats[column].mostCommon?.value} 
                            ({csvInsights.summaryStats[column].mostCommon?.count})
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
    </div>
  );
};

export default CsvUploadTab;
