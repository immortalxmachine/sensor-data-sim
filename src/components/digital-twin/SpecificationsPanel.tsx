
import React from 'react';
import { cn } from '@/lib/utils';
import GlassMorphism from '../GlassMorphism';

interface SpecificationsPanelProps {
  activeComponent: string | null;
  showDetails: boolean;
}

const SpecificationsPanel: React.FC<SpecificationsPanelProps> = ({
  activeComponent,
  showDetails
}) => {
  return (
    <div className={cn(
      "transition-all duration-300 transform",
      !showDetails && "opacity-50 lg:translate-x-4"
    )}>
      <GlassMorphism className="p-6">
        <h3 className="text-lg font-semibold mb-4">Specifications</h3>
        
        {activeComponent ? (
          <div className="space-y-4">
            {activeComponent === 'motor' && (
              <>
                <div>
                  <h4 className="text-sm text-gray-dark mb-1">Motor Type</h4>
                  <p className="font-medium">Brushless DC Electric</p>
                </div>
                <div>
                  <h4 className="text-sm text-gray-dark mb-1">Power Rating</h4>
                  <p className="font-medium">7.5 kW (10 HP)</p>
                </div>
                <div>
                  <h4 className="text-sm text-gray-dark mb-1">Efficiency</h4>
                  <p className="font-medium">94.6%</p>
                </div>
                <div>
                  <h4 className="text-sm text-gray-dark mb-1">Operating Temperature</h4>
                  <p className="font-medium">-20°C to 85°C</p>
                </div>
                <div>
                  <h4 className="text-sm text-gray-dark mb-1">Status</h4>
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-success mr-2"></div>
                    <p className="font-medium">Operational</p>
                  </div>
                </div>
              </>
            )}
            
            {activeComponent === 'temperature' && (
              <>
                <div>
                  <h4 className="text-sm text-gray-dark mb-1">Sensor Type</h4>
                  <p className="font-medium">Platinum RTD PT100</p>
                </div>
                <div>
                  <h4 className="text-sm text-gray-dark mb-1">Range</h4>
                  <p className="font-medium">-200°C to 850°C</p>
                </div>
                <div>
                  <h4 className="text-sm text-gray-dark mb-1">Accuracy</h4>
                  <p className="font-medium">±0.1°C</p>
                </div>
                <div>
                  <h4 className="text-sm text-gray-dark mb-1">Current Reading</h4>
                  <p className="font-medium">27.5°C</p>
                </div>
                <div>
                  <h4 className="text-sm text-gray-dark mb-1">Status</h4>
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-success mr-2"></div>
                    <p className="font-medium">Operational</p>
                  </div>
                </div>
              </>
            )}
            
            {activeComponent === 'pressure' && (
              <>
                <div>
                  <h4 className="text-sm text-gray-dark mb-1">Sensor Type</h4>
                  <p className="font-medium">Piezoresistive Transducer</p>
                </div>
                <div>
                  <h4 className="text-sm text-gray-dark mb-1">Range</h4>
                  <p className="font-medium">0 to 25 MPa</p>
                </div>
                <div>
                  <h4 className="text-sm text-gray-dark mb-1">Accuracy</h4>
                  <p className="font-medium">±0.05% FS</p>
                </div>
                <div>
                  <h4 className="text-sm text-gray-dark mb-1">Current Reading</h4>
                  <p className="font-medium">1.2 MPa</p>
                </div>
                <div>
                  <h4 className="text-sm text-gray-dark mb-1">Status</h4>
                  <div className="flex items-center">
                    <div className="w-2 h-2 rounded-full bg-success mr-2"></div>
                    <p className="font-medium">Operational</p>
                  </div>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <h4 className="text-sm text-gray-dark mb-1">Model</h4>
              <p className="font-medium">Industrial Pump XL-5000</p>
            </div>
            <div>
              <h4 className="text-sm text-gray-dark mb-1">Serial Number</h4>
              <p className="font-medium">XL5-29871-B</p>
            </div>
            <div>
              <h4 className="text-sm text-gray-dark mb-1">Installation Date</h4>
              <p className="font-medium">March 15, 2023</p>
            </div>
            <div>
              <h4 className="text-sm text-gray-dark mb-1">Operating Hours</h4>
              <p className="font-medium">4,362 hrs</p>
            </div>
            <div>
              <h4 className="text-sm text-gray-dark mb-1">Overall Health</h4>
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-success mr-2"></div>
                <p className="font-medium">96% - Excellent</p>
              </div>
            </div>
          </div>
        )}
      </GlassMorphism>
    </div>
  );
};

export default SpecificationsPanel;
