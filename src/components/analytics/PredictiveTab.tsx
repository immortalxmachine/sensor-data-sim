
import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Target, 
  Filter,
  History,
  Zap
} from 'lucide-react';
import ChartComponent from '@/components/ChartComponent';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChartData } from '@/utils/dataGenerators';

// Prediction data for temperature
const generatePredictionData = (): ChartData[] => {
  const data: ChartData[] = [];
  const now = new Date();
  
  // Past data (last 12 hours)
  for (let i = 12; i >= 1; i--) {
    const time = new Date(now);
    time.setHours(now.getHours() - i);
    const timeString = time.getHours().toString().padStart(2, '0') + ':00';
    
    const baseTemp = 23 + Math.sin(i / 3) * 2;
    const actualTemp = baseTemp + (Math.random() * 2 - 1);
    
    data.push({
      name: timeString,
      "Actual": Math.round(actualTemp * 10) / 10,
    });
  }
  
  // Current hour
  data.push({
    name: now.getHours().toString().padStart(2, '0') + ':00',
    "Actual": Math.round((24 + Math.random() * 2) * 10) / 10,
  });
  
  // Future predictions (next 12 hours)
  for (let i = 1; i <= 12; i++) {
    const time = new Date(now);
    time.setHours(now.getHours() + i);
    const timeString = time.getHours().toString().padStart(2, '0') + ':00';
    
    const baseTemp = 24 + Math.sin(i / 3) * 2;
    const predictedTemp = baseTemp + (Math.random() * 1.5 - 0.75);
    
    // Add upper and lower bounds for confidence interval
    data.push({
      name: timeString,
      "Predicted": Math.round(predictedTemp * 10) / 10,
      "Upper Bound": Math.round((predictedTemp + 1.2) * 10) / 10,
      "Lower Bound": Math.round((predictedTemp - 1.2) * 10) / 10,
    });
  }
  
  return data;
};

// Generate maintenance prediction data
const generateMaintenanceData = (): { 
  component: string; 
  health: number; 
  timeToFailure: number;
  recommendation: string;
  priority: 'low' | 'medium' | 'high';
}[] => {
  return [
    {
      component: 'Bearing Assembly',
      health: 78,
      timeToFailure: 42,
      recommendation: 'Schedule inspection in next 30 days',
      priority: 'medium'
    },
    {
      component: 'Impeller',
      health: 92,
      timeToFailure: 86,
      recommendation: 'No action required',
      priority: 'low'
    },
    {
      component: 'Mechanical Seal',
      health: 65,
      timeToFailure: 24,
      recommendation: 'Replace within 3 weeks',
      priority: 'high'
    },
    {
      component: 'Motor Coupling',
      health: 87,
      timeToFailure: 68,
      recommendation: 'Monitor closely',
      priority: 'low'
    }
  ];
};

// Generate anomaly detection data
const generateAnomalyData = (): ChartData[] => {
  const data: ChartData[] = [];
  const now = new Date();
  
  for (let i = 30; i >= 0; i--) {
    const time = new Date(now);
    time.setHours(now.getHours() - i);
    const timeString = `${time.getMonth() + 1}/${time.getDate()} ${time.getHours()}:00`;
    
    const normalValue = 45 + Math.sin(i / 5) * 5;
    
    // Insert anomalies at specific points
    let value = normalValue;
    let anomaly = 0;
    
    if (i === 12 || i === 13) {
      value = normalValue * 1.5;
      anomaly = 1;
    } else if (i === 22) {
      value = normalValue * 0.6;
      anomaly = 1;
    }
    
    data.push({
      name: timeString,
      "Value": Math.round(value * 10) / 10,
      "Anomaly": anomaly
    });
  }
  
  return data;
};

interface MetricCardProps {
  title: string;
  value: string | number;
  change: number;
  icon: React.ReactNode;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, change, icon }) => {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm text-gray-dark font-medium mb-1">{title}</p>
          <h4 className="text-2xl font-bold">{value}</h4>
        </div>
        <div className="bg-blue/10 p-2 rounded-full">
          {icon}
        </div>
      </div>
      <div className="mt-2 flex items-center">
        {change > 0 ? (
          <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
        ) : (
          <TrendingDown className="w-3 h-3 text-red-500 mr-1" />
        )}
        <span className={`text-xs font-medium ${change > 0 ? 'text-green-500' : 'text-red-500'}`}>
          {Math.abs(change)}% {change > 0 ? 'increase' : 'decrease'}
        </span>
      </div>
    </div>
  );
};

const PredictiveTab: React.FC = () => {
  const [predictionType, setPredictionType] = useState<string>('temperature');
  const [predictionData, setPredictionData] = useState<ChartData[]>(generatePredictionData());
  const [maintenanceData, setMaintenanceData] = useState(generateMaintenanceData());
  const [anomalyData, setAnomalyData] = useState(generateAnomalyData());
  const [isLoading, setIsLoading] = useState(false);
  
  const handlePredictionTypeChange = (value: string) => {
    setIsLoading(true);
    setPredictionType(value);
    
    // Simulate loading
    setTimeout(() => {
      setPredictionData(generatePredictionData());
      setIsLoading(false);
    }, 800);
  };
  
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row gap-4 justify-between mb-6">
        <div className="flex-1">
          <h3 className="text-lg font-semibold mb-4">Predictive Insights</h3>
          <p className="text-sm text-gray-dark mb-6">
            Anticipate potential issues before they occur with AI-powered predictions based on historical data.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <Select
              value={predictionType}
              onValueChange={handlePredictionTypeChange}
            >
              <SelectTrigger className="w-full sm:w-[200px]">
                <SelectValue placeholder="Prediction Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="temperature">Temperature Prediction</SelectItem>
                <SelectItem value="vibration">Vibration Prediction</SelectItem>
                <SelectItem value="energy">Energy Consumption</SelectItem>
                <SelectItem value="anomaly">Anomaly Detection</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" size="sm" className="h-10 gap-1">
              <Filter className="h-4 w-4" />
              Filter Data
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full md:w-auto">
          <MetricCard 
            title="Predicted Efficiency" 
            value="87.4%" 
            change={2.3} 
            icon={<Target className="h-6 w-6 text-blue" />} 
          />
          <MetricCard 
            title="Maintenance Alerts" 
            value={maintenanceData.filter(item => item.priority === 'high').length} 
            change={-15} 
            icon={<Zap className="h-6 w-6 text-blue" />} 
          />
        </div>
      </div>
      
      {predictionType === 'anomaly' ? (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-semibold">Anomaly Detection</h4>
            <div className="flex items-center text-xs">
              <span className="w-3 h-3 rounded-full bg-red-500 mr-1"></span>
              <span>Detected Anomalies</span>
            </div>
          </div>
          <ChartComponent 
            data={anomalyData}
            type="line"
            dataKeys={["Value"]}
            height={300}
            colors={["#0066CC", "#EF4444"]}
            loading={isLoading}
            showGrid={true}
            animated={true}
          />
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            {anomalyData.filter(item => item.Anomaly === 1).map((anomaly, index) => (
              <div key={index} className="bg-red-50 border border-red-100 p-3 rounded-md">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="h-4 w-4 text-red-500" />
                  <span className="font-medium text-sm">Anomaly Detected</span>
                </div>
                <p className="text-xs text-gray-dark">
                  Value: <span className="font-semibold">{anomaly.Value}</span> at <span className="font-semibold">{anomaly.name}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <ChartComponent 
          data={predictionData}
          type="area"
          dataKeys={predictionType === 'temperature' ? ["Actual", "Predicted", "Upper Bound", "Lower Bound"] : ["Actual", "Predicted"]}
          height={400}
          colors={["#0066CC", "#10B981", "#E0E0E0", "#E0E0E0"]}
          title={`${predictionType.charAt(0).toUpperCase() + predictionType.slice(1)} Forecast`}
          subtitle="Historical data and future projections with confidence intervals"
          loading={isLoading}
          showGrid={true}
          animated={true}
        />
      )}
      
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold">Maintenance Recommendations</h4>
          <div className="flex items-center gap-2">
            <History className="h-4 w-4 text-gray-dark" />
            <span className="text-xs text-gray-dark">Updated 2 hours ago</span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] table-auto">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="py-2 px-4 text-left text-xs font-semibold text-gray-dark">Component</th>
                <th className="py-2 px-4 text-left text-xs font-semibold text-gray-dark">Health Score</th>
                <th className="py-2 px-4 text-left text-xs font-semibold text-gray-dark">Est. Days to Failure</th>
                <th className="py-2 px-4 text-left text-xs font-semibold text-gray-dark">Recommendation</th>
                <th className="py-2 px-4 text-left text-xs font-semibold text-gray-dark">Priority</th>
              </tr>
            </thead>
            <tbody>
              {maintenanceData.map((item, index) => (
                <tr key={index} className="border-b border-gray-100">
                  <td className="py-3 px-4 text-sm">{item.component}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-24 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full ${
                            item.health > 80 ? 'bg-green-500' : 
                            item.health > 70 ? 'bg-yellow-500' : 'bg-red-500'
                          }`} 
                          style={{ width: `${item.health}%` }}
                        ></div>
                      </div>
                      <span className="text-sm">{item.health}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-sm">{item.timeToFailure} days</td>
                  <td className="py-3 px-4 text-sm">{item.recommendation}</td>
                  <td className="py-3 px-4">
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                      item.priority === 'high' ? 'bg-red-100 text-red-700' : 
                      item.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' : 
                      'bg-green-100 text-green-700'
                    }`}>
                      {item.priority.charAt(0).toUpperCase() + item.priority.slice(1)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PredictiveTab;
