
import { toast } from 'sonner';
import { ChartData } from './dataGenerators';

export interface CsvData {
  headers: string[];
  rows: string[][];
}

export interface InsightSummary {
  rowCount: number;
  columnCount: number;
  columnTypes: {[key: string]: string};
  summaryStats: {
    [key: string]: {
      min?: number;
      max?: number;
      avg?: number;
      sum?: number;
      uniqueValues?: number;
      mostCommon?: {
        value: string;
        count: number;
      };
    };
  };
}

export const parseCSV = (csvContent: string): CsvData => {
  const lines = csvContent.split('\n');
  const headers = lines[0].split(',').map(header => header.trim());
  
  const rows = lines.slice(1)
    .filter(line => line.trim() !== '')
    .map(line => line.split(',').map(cell => cell.trim()));
  
  return { headers, rows };
};

export const generateChartFromCSV = (data: CsvData): ChartData[] => {
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

export const generateInsightsFromCSV = (data: CsvData): InsightSummary => {
  const insights: InsightSummary = {
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

export const getMostCommonValue = (values: string[]) => {
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

export const handleFileUpload = (
  file: File,
  setCsvData: (data: CsvData | null) => void,
  setCsvChartData: (data: ChartData[]) => void,
  setCsvInsights: (insights: InsightSummary) => void,
  setIsProcessing: (isProcessing: boolean) => void
) => {
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
