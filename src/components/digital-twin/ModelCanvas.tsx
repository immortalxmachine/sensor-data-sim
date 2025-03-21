
import React, { useEffect, useRef } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ZoomIn, ZoomOut, RotateCw, PanelLeft, PanelRight } from 'lucide-react';
import { ViewerState } from './types';
import { toast } from '@/hooks/use-toast';

interface ModelCanvasProps {
  viewerState: ViewerState;
  onZoom: (delta: number) => void;
  onRotate: (delta: number) => void;
  onToggleDetails: () => void;
  isLoading: boolean;
}

const ModelCanvas: React.FC<ModelCanvasProps> = ({
  viewerState,
  onZoom,
  onRotate,
  onToggleDetails,
  isLoading
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasContainerRef = useRef<HTMLDivElement | null>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = canvasContainerRef.current;
    
    if (!canvas || !container) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Set proper canvas dimensions based on the container
    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      
      // Force redraw after resize
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      draw();
    };
    
    // Simulated 3D model drawing
    const draw = () => {
      if (!ctx || !canvas) return;
      
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
      
      // Continue animation
      animationRef.current = requestAnimationFrame(draw);
    };
    
    // Initial setup
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    // Start the animation
    animationRef.current = requestAnimationFrame(draw);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [viewerState]);

  return (
    <div 
      ref={canvasContainerRef}
      className="relative h-[500px] rounded-2xl overflow-hidden border border-gray-light/60 bg-white shadow-card"
    >
      {isLoading ? (
        <div className="absolute inset-0 flex items-center justify-center bg-white">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-blue border-t-transparent rounded-full animate-spin mb-3"></div>
            <p className="text-sm text-gray-dark">Loading 3D model...</p>
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
                onClick={() => onZoom(0.1)}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8 bg-white/80"
                onClick={() => onZoom(-0.1)}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                className="h-8 w-8 bg-white/80"
                onClick={() => onRotate(45)}
              >
                <RotateCw className="h-4 w-4" />
              </Button>
            </div>
            
            <Button 
              variant="outline" 
              size="icon" 
              className="h-8 w-8 bg-white/80"
              onClick={onToggleDetails}
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
  );
};

export default ModelCanvas;
