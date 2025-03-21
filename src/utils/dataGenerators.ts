
export type ChartData = {
  name: string;
  [key: string]: string | number;
};

export const generateTemperatureData = (): ChartData[] => {
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

export const generateVibrationData = (): ChartData[] => {
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

export const generateEnergyData = (): ChartData[] => {
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
