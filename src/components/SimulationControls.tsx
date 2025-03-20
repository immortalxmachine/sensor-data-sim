
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import GlassMorphism from './GlassMorphism';
import { cn } from '@/lib/utils';
import { Play, Pause, RotateCcw, Save, AlertTriangle, ChevronRight, ChevronDown } from 'lucide-react';
import { useInView } from '@/utils/animations';
import { Badge } from '@/components/ui/badge';

interface SimulationState {
  running: boolean;
  temperature: number;
  pressure: number;
  load: number;
  speed: number;
  flowRate: number;
  elapsedTime: number;
  showWarning: boolean;
}

export function SimulationControls() {
  const [simulationState, setSimulationState] = useState<SimulationState>({
    running: false,
    temperature: 25,
    pressure: 1.0,
    load: 50,
    speed: 60,
    flowRate: 0,
    elapsedTime: 0,
    showWarning: false
  });
  
  const [expandedSections, setExpandedSections] = useState({
    parameters: true,
    results: true
  });
  
  const [ref, isInView] = useInView({ threshold: 0.1, triggerOnce: true });
  
  // Simulation timer effect
  useEffect(() => {
    let intervalId: number;
    
    if (simulationState.running) {
      intervalId = window.setInterval(() => {
        setSimulationState(prev => {
          // Calculate new flow rate based on speed and pressure
          const newFlowRate = (prev.speed / 100) * (prev.pressure * 0.8) * (prev.load / 50);
          
          // Check if temperature is getting too high
          const showWarning = prev.temperature > 35 || prev.pressure > 2.0;
          
          return {
            ...prev,
            flowRate: parseFloat(newFlowRate.toFixed(2)),
            temperature: Math.min(65, prev.temperature + (prev.load > 70 ? 0.5 : 0.1)),
            elapsedTime: prev.elapsedTime + 1,
            showWarning
          };
        });
      }, 1000);
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [simulationState.running]);
  
  const toggleSimulation = () => {
    setSimulationState(prev => ({
      ...prev,
      running: !prev.running
    }));
  };
  
  const resetSimulation = () => {
    setSimulationState({
      running: false,
      temperature: 25,
      pressure: 1.0,
      load: 50,
      speed: 60,
      flowRate: 0,
      elapsedTime: 0,
      showWarning: false
    });
  };
  
  const handleParameterChange = (
    param: 'temperature' | 'pressure' | 'load' | 'speed',
    value: number | number[]
  ) => {
    const newValue = Array.isArray(value) ? value[0] : value;
    
    setSimulationState(prev => ({
      ...prev,
      [param]: newValue
    }));
  };
  
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const toggleSection = (section: 'parameters' | 'results') => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  
  return (
    <section 
      id="simulate" 
      className="py-24 bg-gray-lightest relative"
      ref={ref as React.RefObject<HTMLElement>}
    >
      <div className="container px-6 md:px-10 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block px-3 py-1 mb-6 rounded-full bg-blue/10 border border-blue/20 text-blue text-sm font-medium">
            Simulate
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
            Run What-If Scenarios and Test Conditions
          </h2>
          <p className="text-lg text-gray-dark">
            Experiment with different parameters to predict outcomes and optimize performance without affecting physical systems.
          </p>
        </div>
        
        <div className="grid md:grid-cols-5 gap-8">
          {/* Simulation Controls */}
          <div className="md:col-span-2">
            <GlassMorphism className="p-6 md:p-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">Simulation Controls</h3>
                <div className="flex items-center">
                  <Badge variant="outline" className={cn(
                    "mr-2",
                    simulationState.running ? "border-success text-success" : "text-gray-dark"
                  )}>
                    {simulationState.running ? "Running" : "Ready"}
                  </Badge>
                  <span className="font-mono text-sm">
                    {formatTime(simulationState.elapsedTime)}
                  </span>
                </div>
              </div>
              
              <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium flex items-center cursor-pointer" onClick={() => toggleSection('parameters')}>
                    {expandedSections.parameters ? (
                      <ChevronDown className="h-4 w-4 mr-1" />
                    ) : (
                      <ChevronRight className="h-4 w-4 mr-1" />
                    )}
                    Parameters
                  </h4>
                </div>
                
                {expandedSections.parameters && (
                  <div className="space-y-8 mt-4">
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-sm text-gray-dark">Ambient Temperature (°C)</label>
                        <span className="text-sm font-medium">{simulationState.temperature}°C</span>
                      </div>
                      <Slider
                        value={[simulationState.temperature]}
                        min={-10}
                        max={50}
                        step={1}
                        onValueChange={(value) => handleParameterChange('temperature', value)}
                        disabled={simulationState.running}
                        className="py-2"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-sm text-gray-dark">System Pressure (MPa)</label>
                        <span className="text-sm font-medium">{simulationState.pressure} MPa</span>
                      </div>
                      <Slider
                        value={[simulationState.pressure]}
                        min={0.1}
                        max={2.5}
                        step={0.1}
                        onValueChange={(value) => handleParameterChange('pressure', value)}
                        disabled={simulationState.running}
                        className="py-2"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-sm text-gray-dark">Load Factor (%)</label>
                        <span className="text-sm font-medium">{simulationState.load}%</span>
                      </div>
                      <Slider
                        value={[simulationState.load]}
                        min={10}
                        max={100}
                        step={5}
                        onValueChange={(value) => handleParameterChange('load', value)}
                        className="py-2"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <label className="text-sm text-gray-dark">Motor Speed (%)</label>
                        <span className="text-sm font-medium">{simulationState.speed}%</span>
                      </div>
                      <Slider
                        value={[simulationState.speed]}
                        min={20}
                        max={100}
                        step={5}
                        onValueChange={(value) => handleParameterChange('speed', value)}
                        className="py-2"
                      />
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium flex items-center cursor-pointer" onClick={() => toggleSection('results')}>
                    {expandedSections.results ? (
                      <ChevronDown className="h-4 w-4 mr-1" />
                    ) : (
                      <ChevronRight className="h-4 w-4 mr-1" />
                    )}
                    Simulation Results
                  </h4>
                </div>
                
                {expandedSections.results && (
                  <div className="space-y-4 mt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white rounded-lg p-3 border border-gray-light/60">
                        <div className="text-sm text-gray-dark mb-1">Operating Temp</div>
                        <div className={cn(
                          "text-lg font-semibold flex items-center",
                          simulationState.temperature > 35 ? "text-warning" : "text-gray-darkest"
                        )}>
                          {simulationState.temperature}°C
                          {simulationState.temperature > 35 && (
                            <AlertTriangle className="h-4 w-4 ml-1 text-warning" />
                          )}
                        </div>
                      </div>
                      
                      <div className="bg-white rounded-lg p-3 border border-gray-light/60">
                        <div className="text-sm text-gray-dark mb-1">Flow Rate</div>
                        <div className="text-lg font-semibold">
                          {simulationState.flowRate} m³/h
                        </div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white rounded-lg p-3 border border-gray-light/60">
                        <div className="text-sm text-gray-dark mb-1">Efficiency</div>
                        <div className="text-lg font-semibold">
                          {Math.max(0, 90 - (simulationState.temperature - 25) * 2).toFixed(1)}%
                        </div>
                      </div>
                      
                      <div className="bg-white rounded-lg p-3 border border-gray-light/60">
                        <div className="text-sm text-gray-dark mb-1">Power Draw</div>
                        <div className="text-lg font-semibold">
                          {Math.round(simulationState.load * simulationState.speed / 100)} kW
                        </div>
                      </div>
                    </div>
                    
                    {simulationState.showWarning && (
                      <div className="bg-warning/10 border border-warning/30 rounded-lg p-4 text-sm text-warning flex items-start">
                        <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0 mt-0.5" />
                        <div>
                          <strong className="font-medium">Warning:</strong> Current parameters may lead to overheating and reduced component lifespan. Consider reducing load or increasing cooling.
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
              
              <div className="flex space-x-2 pt-2">
                <Button 
                  className={cn(
                    "flex-1",
                    simulationState.running 
                      ? "bg-gray-dark hover:bg-gray-darker" 
                      : "bg-blue hover:bg-blue-dark"
                  )}
                  onClick={toggleSimulation}
                >
                  {simulationState.running ? (
                    <>
                      <Pause className="h-4 w-4 mr-2" />
                      Pause
                    </>
                  ) : (
                    <>
                      <Play className="h-4 w-4 mr-2" />
                      Run Simulation
                    </>
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={resetSimulation}
                >
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Reset
                </Button>
                <Button 
                  variant="outline" 
                  className="px-3"
                >
                  <Save className="h-4 w-4" />
                </Button>
              </div>
            </GlassMorphism>
          </div>
          
          {/* Simulation Visualization */}
          <div className="md:col-span-3">
            <GlassMorphism className="p-6 md:p-8 h-full">
              <h3 className="text-xl font-semibold mb-6">Simulation Visualization</h3>
              
              <div className="bg-white rounded-xl border border-gray-light/60 p-6 h-[400px] flex items-center justify-center relative overflow-hidden">
                {/* Dynamic Simulation Visualization */}
                <div className="w-full h-full relative">
                  {/* System diagram */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-3/4 h-3/4 relative">
                      {/* Motor */}
                      <div className="absolute top-1/2 left-0 transform -translate-y-1/2 w-32 h-24 rounded-lg bg-blue flex items-center justify-center border-2 border-white">
                        <div className="text-white text-sm font-medium">Motor</div>
                        <div className={cn(
                          "absolute -right-6 top-1/2 transform -translate-y-1/2 w-4 h-4 rounded-full",
                          simulationState.running ? "bg-success animate-pulse-subtle" : "bg-gray"
                        )} />
                      </div>
                      
                      {/* Pump */}
                      <div className="absolute top-1/2 left-1/3 transform -translate-y-1/2 w-24 h-24 rounded-full bg-blue-dark flex items-center justify-center border-2 border-white">
                        <div className="text-white text-xs font-medium">Pump</div>
                        <div 
                          className="absolute inset-4 rounded-full border-4 border-white border-t-transparent"
                          style={{
                            animation: simulationState.running 
                              ? `spin ${Math.max(0.3, 1 - simulationState.speed/150)}s linear infinite` 
                              : 'none'
                          }}
                        ></div>
                      </div>
                      
                      {/* Pipes */}
                      <div className="absolute top-1/4 left-1/2 right-0 h-4 bg-blue rounded-full"></div>
                      <div className="absolute bottom-1/4 left-1/2 right-0 h-4 bg-blue rounded-full"></div>
                      
                      {/* Flow direction indicators */}
                      {simulationState.running && (
                        <>
                          <div className="absolute top-1/4 left-2/3 transform -translate-y-1/2 right-8">
                            <div className="relative h-2">
                              <div className="absolute left-0 w-4 h-2 bg-white rounded-full animate-pulse-subtle" 
                                style={{
                                  animation: `moveRight ${3 - simulationState.speed/50}s infinite linear`,
                                  opacity: simulationState.speed / 100
                                }}
                              ></div>
                              <div className="absolute left-1/4 w-4 h-2 bg-white rounded-full animate-pulse-subtle" 
                                style={{
                                  animation: `moveRight ${3 - simulationState.speed/50}s infinite linear`,
                                  animationDelay: '0.7s',
                                  opacity: simulationState.speed / 100
                                }}
                              ></div>
                              <div className="absolute left-2/4 w-4 h-2 bg-white rounded-full animate-pulse-subtle" 
                                style={{
                                  animation: `moveRight ${3 - simulationState.speed/50}s infinite linear`,
                                  animationDelay: '1.4s',
                                  opacity: simulationState.speed / 100
                                }}
                              ></div>
                            </div>
                          </div>
                          <div className="absolute bottom-1/4 right-2/3 transform translate-y-1/2 left-8">
                            <div className="relative h-2">
                              <div className="absolute right-0 w-4 h-2 bg-white rounded-full animate-pulse-subtle" 
                                style={{
                                  animation: `moveLeft ${3 - simulationState.speed/50}s infinite linear`,
                                  opacity: simulationState.speed / 100
                                }}
                              ></div>
                              <div className="absolute right-1/4 w-4 h-2 bg-white rounded-full animate-pulse-subtle" 
                                style={{
                                  animation: `moveLeft ${3 - simulationState.speed/50}s infinite linear`,
                                  animationDelay: '0.7s',
                                  opacity: simulationState.speed / 100
                                }}
                              ></div>
                              <div className="absolute right-2/4 w-4 h-2 bg-white rounded-full animate-pulse-subtle" 
                                style={{
                                  animation: `moveLeft ${3 - simulationState.speed/50}s infinite linear`,
                                  animationDelay: '1.4s',
                                  opacity: simulationState.speed / 100
                                }}
                              ></div>
                            </div>
                          </div>
                        </>
                      )}
                      
                      {/* Temperature indicator */}
                      <div className="absolute top-0 left-1/4 transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                        <div className="text-xs text-gray-dark mb-1">Temp</div>
                        <div 
                          className={cn(
                            "w-12 h-12 rounded-full flex items-center justify-center border-2",
                            simulationState.temperature > 40 
                              ? "border-error bg-error/20 text-error" 
                              : simulationState.temperature > 30 
                                ? "border-warning bg-warning/20 text-warning"
                                : "border-success bg-success/20 text-success" 
                          )}
                        >
                          <span className="text-sm font-bold">{Math.round(simulationState.temperature)}°</span>
                        </div>
                      </div>
                      
                      {/* Flow rate indicator */}
                      <div className="absolute bottom-0 right-1/4 transform translate-x-1/2 translate-y-1/2">
                        <div className="text-xs text-gray-dark mb-1">Flow Rate</div>
                        <div className="text-sm font-bold">
                          {simulationState.flowRate} m³/h
                        </div>
                      </div>
                      
                      {/* Heat effect visualization */}
                      {simulationState.temperature > 30 && (
                        <div 
                          className="absolute top-1/3 left-1/4 w-16 h-16 rounded-full bg-red-500 opacity-20 animate-pulse-subtle"
                          style={{
                            transform: `scale(${(simulationState.temperature - 25) / 10})`,
                            animationDuration: '2s'
                          }}
                        ></div>
                      )}
                    </div>
                  </div>
                  
                  {/* Status overlay */}
                  <div className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm rounded-lg px-3 py-2 text-sm border border-gray-light/60">
                    <div className="flex items-center">
                      <div className={cn(
                        "w-2 h-2 rounded-full mr-2",
                        simulationState.running ? "bg-success" : "bg-gray"
                      )}></div>
                      <span className="font-medium">
                        {simulationState.running ? "Simulation Running" : "Simulation Ready"}
                      </span>
                    </div>
                  </div>
                </div>
                
                <style jsx>{`
                  @keyframes moveRight {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(100%); }
                  }
                  
                  @keyframes moveLeft {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-100%); }
                  }
                `}</style>
              </div>
              
              <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 bg-white rounded-lg border border-gray-light/60">
                  <div className="text-xs text-gray-dark mb-1">Power Consumption</div>
                  <div className="flex items-end justify-between">
                    <div className="text-lg font-semibold">
                      {Math.round(simulationState.load * simulationState.speed / 100)} kW
                    </div>
                    <div className="text-xs text-gray-dark">
                      {simulationState.running ? "Active" : "Standby"}
                    </div>
                  </div>
                </div>
                
                <div className="p-3 bg-white rounded-lg border border-gray-light/60">
                  <div className="text-xs text-gray-dark mb-1">Estimated Maintenance</div>
                  <div className="flex items-end justify-between">
                    <div className="text-lg font-semibold">
                      {Math.max(0, 120 - Math.floor(simulationState.elapsedTime / 6) - 
                        (simulationState.temperature > 35 ? 20 : 0))} days
                    </div>
                    <div className="text-xs text-gray-dark">
                      Until next
                    </div>
                  </div>
                </div>
                
                <div className="p-3 bg-white rounded-lg border border-gray-light/60">
                  <div className="text-xs text-gray-dark mb-1">Efficiency Rating</div>
                  <div className="flex items-end justify-between">
                    <div className="text-lg font-semibold">
                      {Math.max(0, 90 - (simulationState.temperature - 25) * 2).toFixed(1)}%
                    </div>
                    <div className="text-xs text-gray-dark">
                      Current
                    </div>
                  </div>
                </div>
                
                <div className="p-3 bg-white rounded-lg border border-gray-light/60">
                  <div className="text-xs text-gray-dark mb-1">System Status</div>
                  <div className="flex items-end justify-between">
                    <div className={cn(
                      "text-lg font-semibold",
                      simulationState.showWarning ? "text-warning" : "text-success"
                    )}>
                      {simulationState.showWarning ? "Warning" : "Normal"}
                    </div>
                    <div className="text-xs text-gray-dark">
                      Operations
                    </div>
                  </div>
                </div>
              </div>
            </GlassMorphism>
          </div>
        </div>
      </div>
    </section>
  );
}

export default SimulationControls;
