
import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import GlassMorphism from './GlassMorphism';
import { cn } from '@/lib/utils';
import { ArrowRight, ChevronDown } from 'lucide-react';

export function Hero() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  
  // Animation for the tech background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    let animationFrameId: number;
    let particles: {x: number, y: number, size: number, speedX: number, speedY: number, opacity: number}[] = [];
    
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles();
    };
    
    const initParticles = () => {
      particles = [];
      const particleCount = Math.min(Math.floor(window.innerWidth / 10), 100);
      
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 2 + 1,
          speedX: (Math.random() - 0.5) * 0.5,
          speedY: (Math.random() - 0.5) * 0.5,
          opacity: Math.random() * 0.5 + 0.1
        });
      }
    };
    
    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw particles
      particles.forEach(particle => {
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0, 102, 204, ${particle.opacity})`;
        ctx.fill();
        
        // Move particles
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        // Wrap around edges
        if (particle.x < 0) particle.x = canvas.width;
        if (particle.x > canvas.width) particle.x = 0;
        if (particle.y < 0) particle.y = canvas.height;
        if (particle.y > canvas.height) particle.y = 0;
      });
      
      // Draw connections between close particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(0, 102, 204, ${0.1 * (1 - distance / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      
      animationFrameId = requestAnimationFrame(drawParticles);
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    drawParticles();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-16 overflow-hidden">
      {/* Animated Background */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 z-0"
      ></canvas>
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent to-white z-10"></div>
      
      <div className="container px-6 md:px-10 max-w-7xl mx-auto relative z-20">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <div className="text-left order-2 md:order-1 animate-fade-in-right">
            <div className="inline-block px-3 py-1 mb-6 rounded-full bg-blue/10 border border-blue/20 text-blue text-sm font-medium">
              Digital Twin Technology
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
              Transform Real-World Data into Digital Intelligence
            </h1>
            <p className="text-lg text-gray-dark mb-8 max-w-lg">
              Our Digital Twin Converter bridges the physical and digital worlds, enabling real-time monitoring, predictive analytics, and intelligent decision-making.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="bg-blue hover:bg-blue-dark text-white px-6 font-medium text-sm h-12 transition-all duration-300 group">
                <span>Get Started</span>
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="outline" className="text-sm font-medium h-12">
                Watch Demo
              </Button>
            </div>
            
            <div className="mt-10 flex items-center text-sm text-gray-dark">
              <div className="flex -space-x-2 mr-3">
                {[1, 2, 3, 4].map((i) => (
                  <div 
                    key={i} 
                    className={cn(
                      "w-8 h-8 rounded-full border-2 border-white",
                      i === 1 && "bg-blue",
                      i === 2 && "bg-success",
                      i === 3 && "bg-warning",
                      i === 4 && "bg-[#8B5CF6]"
                    )}
                  ></div>
                ))}
              </div>
              <span>Join <strong>2,500+</strong> companies already using our platform</span>
            </div>
          </div>
          
          <div className="order-1 md:order-2 animate-fade-in">
            <GlassMorphism 
              className="p-6 md:p-8 w-full max-w-lg mx-auto"
              opacity="medium"
              blur="lg"
              hoverEffect
            >
              <div className="rounded-lg bg-blue overflow-hidden mb-4">
                <div className="p-4 flex items-center justify-between bg-gradient-to-r from-blue to-blue-dark text-white">
                  <h3 className="font-medium">Machine Status</h3>
                  <span className="px-2 py-1 rounded-full bg-success text-white text-xs">Active</span>
                </div>
                <div className="h-60 bg-blue-dark flex items-center justify-center">
                  <div className="relative w-40 h-40 rounded-full border-8 border-white/20 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full border-t-8 border-success animate-spin" style={{ animationDuration: '3s' }}></div>
                    <div className="text-white text-center">
                      <div className="text-2xl font-bold">96%</div>
                      <div className="text-xs text-white/80">Efficiency</div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="p-4 rounded-lg bg-white border border-gray-light/80">
                  <div className="text-sm text-gray-dark mb-1">Temperature</div>
                  <div className="text-xl font-semibold">27.5°C</div>
                  <div className="w-full h-1 bg-gray-light/50 rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-blue rounded-full" style={{ width: '65%' }}></div>
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-white border border-gray-light/80">
                  <div className="text-sm text-gray-dark mb-1">Pressure</div>
                  <div className="text-xl font-semibold">1.2 MPa</div>
                  <div className="w-full h-1 bg-gray-light/50 rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-success rounded-full" style={{ width: '42%' }}></div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-white border border-gray-light/80">
                  <div className="text-sm text-gray-dark mb-1">Vibration</div>
                  <div className="text-xl font-semibold">0.3 mm/s</div>
                  <div className="w-full h-1 bg-gray-light/50 rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-warning rounded-full" style={{ width: '23%' }}></div>
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-white border border-gray-light/80">
                  <div className="text-sm text-gray-dark mb-1">Energy</div>
                  <div className="text-xl font-semibold">42 kWh</div>
                  <div className="w-full h-1 bg-gray-light/50 rounded-full mt-2 overflow-hidden">
                    <div className="h-full bg-blue rounded-full" style={{ width: '78%' }}></div>
                  </div>
                </div>
              </div>
            </GlassMorphism>
          </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce">
          <ChevronDown className="h-6 w-6 text-blue" />
          <span className="text-xs text-gray-dark">Scroll to explore</span>
        </div>
      </div>
    </section>
  );
}

export default Hero;
