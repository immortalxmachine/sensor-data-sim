
import React from 'react';
import { cn } from '@/lib/utils';
import GlassMorphism from '../GlassMorphism';

interface ComponentSelectorProps {
  activeComponent: string | null;
  onSelectComponent: (component: string | null) => void;
}

const ComponentSelector: React.FC<ComponentSelectorProps> = ({
  activeComponent,
  onSelectComponent
}) => {
  return (
    <GlassMorphism className="p-6">
      <h3 className="text-lg font-semibold mb-4">Components</h3>
      
      <div className="space-y-3">
        <div 
          className={cn(
            "p-4 rounded-lg border transition-all duration-200 cursor-pointer",
            activeComponent === 'motor' 
              ? "border-blue bg-blue/5" 
              : "border-gray-light hover:border-blue"
          )}
          onClick={() => onSelectComponent('motor')}
        >
          <div className="flex items-center mb-2">
            <div className="w-3 h-3 rounded-full bg-warning mr-2"></div>
            <h4 className="font-medium">Motor Assembly</h4>
          </div>
          <p className="text-sm text-gray-dark">Primary drive motor with electronic controls</p>
        </div>
        
        <div 
          className={cn(
            "p-4 rounded-lg border transition-all duration-200 cursor-pointer",
            activeComponent === 'temperature' 
              ? "border-blue bg-blue/5" 
              : "border-gray-light hover:border-blue"
          )}
          onClick={() => onSelectComponent('temperature')}
        >
          <div className="flex items-center mb-2">
            <div className="w-3 h-3 rounded-full bg-success mr-2"></div>
            <h4 className="font-medium">Temperature Sensor</h4>
          </div>
          <p className="text-sm text-gray-dark">High-precision thermal monitoring system</p>
        </div>
        
        <div 
          className={cn(
            "p-4 rounded-lg border transition-all duration-200 cursor-pointer",
            activeComponent === 'pressure' 
              ? "border-blue bg-blue/5" 
              : "border-gray-light hover:border-blue"
          )}
          onClick={() => onSelectComponent('pressure')}
        >
          <div className="flex items-center mb-2">
            <div className="w-3 h-3 rounded-full bg-success mr-2"></div>
            <h4 className="font-medium">Pressure Sensor</h4>
          </div>
          <p className="text-sm text-gray-dark">Hydraulic system pressure monitor</p>
        </div>
        
        <div 
          className="p-4 rounded-lg border border-gray-light hover:border-blue transition-all duration-200 cursor-pointer"
          onClick={() => onSelectComponent(null)}
        >
          <div className="flex items-center mb-2">
            <div className="w-3 h-3 rounded-full bg-gray mr-2"></div>
            <h4 className="font-medium">View All Components</h4>
          </div>
          <p className="text-sm text-gray-dark">Display the complete system overview</p>
        </div>
      </div>
    </GlassMorphism>
  );
};

export default ComponentSelector;
