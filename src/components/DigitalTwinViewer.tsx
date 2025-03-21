
import React, { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { ViewerState } from './digital-twin/types';
import ModelCanvas from './digital-twin/ModelCanvas';
import ComponentSelector from './digital-twin/ComponentSelector';
import SpecificationsPanel from './digital-twin/SpecificationsPanel';

export function DigitalTwinViewer() {
  const [viewerState, setViewerState] = useState<ViewerState>({
    zoom: 1,
    rotation: 0,
    activeComponent: null,
    showDetails: true
  });
  const [isLoading, setIsLoading] = useState(true);

  // Initialize the model
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      
      // Show a toast notification when the model loads
      toast({
        title: "Digital Twin loaded",
        description: "Interactive 3D model is now ready to explore",
      });
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  const handleZoom = (delta: number) => {
    setViewerState(prev => ({
      ...prev,
      zoom: Math.max(0.5, Math.min(2, prev.zoom + delta))
    }));
  };

  const handleRotate = (delta: number) => {
    setViewerState(prev => ({
      ...prev,
      rotation: (prev.rotation + delta) % 360
    }));
  };

  const toggleDetails = () => {
    setViewerState(prev => ({
      ...prev,
      showDetails: !prev.showDetails
    }));
  };

  const setActiveComponent = (component: string | null) => {
    setViewerState(prev => ({
      ...prev,
      activeComponent: component
    }));
    
    // Provide feedback when a component is selected
    if (component) {
      toast({
        title: `${component.charAt(0).toUpperCase() + component.slice(1)} selected`,
        description: "View component details in the right panel",
      });
    }
  };

  return (
    <section id="visualize" className="py-24 bg-gray-lightest relative">
      <div className="container px-6 md:px-10 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block px-3 py-1 mb-6 rounded-full bg-blue/10 border border-blue/20 text-blue text-sm font-medium">
            Visualize
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
            Interactive Digital Twin Visualization
          </h2>
          <p className="text-lg text-gray-dark">
            Explore and interact with your digital twin models in a high-fidelity 3D environment.
          </p>
        </div>
        
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Component Selector */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <ComponentSelector 
              activeComponent={viewerState.activeComponent} 
              onSelectComponent={setActiveComponent} 
            />
          </div>
          
          {/* 3D Viewer */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            <ModelCanvas 
              viewerState={viewerState}
              onZoom={handleZoom}
              onRotate={handleRotate}
              onToggleDetails={toggleDetails}
              isLoading={isLoading}
            />
          </div>
          
          {/* Details Panel */}
          <div className="lg:col-span-1 order-3">
            <SpecificationsPanel 
              activeComponent={viewerState.activeComponent}
              showDetails={viewerState.showDetails}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default DigitalTwinViewer;
