
import React, { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import GlassMorphism from './GlassMorphism';
import { Maximize, Minimize, ZoomIn, ZoomOut, RotateCw, PanelLeft, PanelRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface ViewerState {
  zoom: number;
  rotation: number;
  activeComponent: string | null;
  showDetails: boolean;
}

export function DigitalTwinViewer() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [viewerState, setViewerState] = useState<ViewerState>({
    zoom: 1,
    rotation: 0,
    activeComponent: null,
    showDetails: true
  });
  const [isLoading, setIsLoading] = useState(true);

  // Canvas animation for the simulated 3D model
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let animationFrameId: number;
    
    const resizeCanvas = () => {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    };
    
    // Simulated 3D model drawing
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const baseSize = Math.min(canvas.width, canvas.height) * 0.3 * viewerState.zoom;
      
      // Use rotation and zoom from state
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(viewerState.rotation * Math.PI / 180);
      
      // Draw base platform
      ctx.fillStyle = '#E0F2FE';
      ctx.strokeStyle = '#0066CC';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(0, 0, baseSize * 1.2, baseSize * 0.6, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      
      // Draw machine base
      ctx.fillStyle = '#0066CC';
      ctx.beginPath();
      ctx.rect(-baseSize * 0.5, -baseSize * 0.3, baseSize, baseSize * 0.6);
      ctx.fill();
      
      // Draw machine top part
      ctx.fillStyle = viewerState.activeComponent === 'motor' ? '#F59E0B' : '#0066CC';
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.rect(-baseSize * 0.35, -baseSize * 0.7, baseSize * 0.7, baseSize * 0.4);
      ctx.fill();
      ctx.stroke();
      
      // Draw sensor indicators
      // Temperature sensor
      ctx.fillStyle = viewerState.activeComponent === 'temperature' ? '#EF4444' : '#10B981';
      ctx.beginPath();
      ctx.arc(baseSize * 0.4, -baseSize * 0.5, baseSize * 0.1, 0, Math.PI * 2);
      ctx.fill();
      
      // Pressure sensor
      ctx.fillStyle = viewerState.activeComponent === 'pressure' ? '#EF4444' : '#10B981';
      ctx.beginPath();
      ctx.arc(-baseSize * 0.4, -baseSize * 0.5, baseSize * 0.1, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw connecting rods
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 5;
      const time = Date.now() / 1000;
      const movement = Math.sin(time * 3) * 5;
      
      ctx.beginPath();
      ctx.moveTo(-baseSize * 0.2, -baseSize * 0.3);
      ctx.lineTo(-baseSize * 0.2, -baseSize * 0.3 - baseSize * 0.6 + movement);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(baseSize * 0.2, -baseSize * 0.3);
      ctx.lineTo(baseSize * 0.2, -baseSize * 0.3 - baseSize * 0.6 - movement);
      ctx.stroke();
      
      // Draw pulsing indicator for active component
      if (viewerState.activeComponent) {
        ctx.strokeStyle = '#F59E0B';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 3]);
        
        const pulseSize = (Math.sin(Date.now() / 200) + 1) * 10 + baseSize * 0.8;
        ctx.beginPath();
        ctx.ellipse(0, -baseSize * 0.3, pulseSize, pulseSize * 0.5, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.setLineDash([]);
      }
      
      ctx.restore();
      
      animationFrameId = requestAnimationFrame(draw);
    };
    
    // Simulate loading
    setTimeout(() => {
      setIsLoading(false);
      window.addEventListener('resize', resizeCanvas);
      resizeCanvas();
      draw();
    }, 1500);
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [viewerState]);

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
            <GlassMorphism className="p-6">
              <h3 className="text-lg font-semibold mb-4">Components</h3>
              
              <div className="space-y-3">
                <div 
                  className={cn(
                    "p-4 rounded-lg border transition-all duration-200 cursor-pointer",
                    viewerState.activeComponent === 'motor' 
                      ? "border-blue bg-blue/5" 
                      : "border-gray-light hover:border-blue"
                  )}
                  onClick={() => setActiveComponent('motor')}
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
                    viewerState.activeComponent === 'temperature' 
                      ? "border-blue bg-blue/5" 
                      : "border-gray-light hover:border-blue"
                  )}
                  onClick={() => setActiveComponent('temperature')}
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
                    viewerState.activeComponent === 'pressure' 
                      ? "border-blue bg-blue/5" 
                      : "border-gray-light hover:border-blue"
                  )}
                  onClick={() => setActiveComponent('pressure')}
                >
                  <div className="flex items-center mb-2">
                    <div className="w-3 h-3 rounded-full bg-success mr-2"></div>
                    <h4 className="font-medium">Pressure Sensor</h4>
                  </div>
                  <p className="text-sm text-gray-dark">Hydraulic system pressure monitor</p>
                </div>
                
                <div 
                  className="p-4 rounded-lg border border-gray-light hover:border-blue transition-all duration-200 cursor-pointer"
                  onClick={() => setActiveComponent(null)}
                >
                  <div className="flex items-center mb-2">
                    <div className="w-3 h-3 rounded-full bg-gray mr-2"></div>
                    <h4 className="font-medium">View All Components</h4>
                  </div>
                  <p className="text-sm text-gray-dark">Display the complete system overview</p>
                </div>
              </div>
            </GlassMorphism>
          </div>
          
          {/* 3D Viewer */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            <div className="relative h-[500px] rounded-2xl overflow-hidden border border-gray-light/60 bg-white shadow-card">
              {isLoading ? (
                <div className="absolute inset-0 flex items-center justify-center bg-white">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 border-4 border-blue rounded-full border-t-transparent animate-spin mb-3"></div>
                    <span className="text-sm text-gray-dark">Loading 3D model...</span>
                  </div>
                </div>
              ) : (
                <>
                  <canvas 
                    ref={canvasRef} 
                    className="w-full h-full"
                  ></canvas>
                  
                  <div className="absolute top-4 left-4 flex space-x-2">
                    <Badge variant="outline" className="bg-white/80 text-gray-dark">
                      Industrial Pump XL-5000
                    </Badge>
                    {viewerState.activeComponent && (
                      <Badge className="bg-blue text-white">
                        {viewerState.activeComponent === 'motor' && 'Motor Assembly'}
                        {viewerState.activeComponent === 'temperature' && 'Temperature Sensor'}
                        {viewerState.activeComponent === 'pressure' && 'Pressure Sensor'}
                      </Badge>
                    )}
                  </div>
                  
                  <div className="absolute bottom-4 left-4 right-4 flex justify-between">
                    <div className="flex space-x-1">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-8 w-8 bg-white/80"
                        onClick={() => handleZoom(0.1)}
                      >
                        <ZoomIn className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-8 w-8 bg-white/80"
                        onClick={() => handleZoom(-0.1)}
                      >
                        <ZoomOut className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-8 w-8 bg-white/80"
                        onClick={() => handleRotate(45)}
                      >
                        <RotateCw className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-8 w-8 bg-white/80"
                      onClick={toggleDetails}
                    >
                      {viewerState.showDetails ? (
                        <PanelRight className="h-4 w-4" />
                      ) : (
                        <PanelLeft className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
          
          {/* Details Panel */}
          <div className={cn(
            "lg:col-span-1 order-3 transition-all duration-300 transform",
            !viewerState.showDetails && "opacity-50 lg:translate-x-4"
          )}>
            <GlassMorphism className="p-6">
              <h3 className="text-lg font-semibold mb-4">Specifications</h3>
              
              {viewerState.activeComponent ? (
                <div className="space-y-4">
                  {viewerState.activeComponent === 'motor' && (
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
                  
                  {viewerState.activeComponent === 'temperature' && (
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
                  
                  {viewerState.activeComponent === 'pressure' && (
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
        </div>
      </div>
    </section>
  );
}

export default DigitalTwinViewer;
