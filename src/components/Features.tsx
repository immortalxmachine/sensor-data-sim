
import React from 'react';
import { cn } from '@/lib/utils';
import { useInView } from '@/utils/animations';
import { 
  Database, 
  BarChart, 
  Gauge, 
  Cpu, 
  Signal, 
  Zap,
  LineChart,
  Activity
} from 'lucide-react';
import AnimatedCounter from './AnimatedCounter';

const FEATURES = [
  {
    title: 'Data Integration',
    description: 'Seamlessly connect to IoT sensors, databases, and third-party APIs to collect real-time data.',
    icon: Database,
    color: 'bg-blue/10 text-blue'
  },
  {
    title: 'Real-time Monitoring',
    description: 'Track the status and performance of your physical assets with millisecond precision.',
    icon: Gauge,
    color: 'bg-success/10 text-success'
  },
  {
    title: 'Digital Twin Modeling',
    description: 'Create high-fidelity virtual replicas of your physical systems with accurate behavior models.',
    icon: Cpu,
    color: 'bg-warning/10 text-warning'
  },
  {
    title: 'Predictive Analytics',
    description: 'Leverage AI and machine learning to forecast potential issues before they occur.',
    icon: BarChart,
    color: 'bg-[#8B5CF6]/10 text-[#8B5CF6]'
  },
  {
    title: 'Simulation Engine',
    description: 'Test scenarios and simulate conditions to optimize performance and predict outcomes.',
    icon: Activity,
    color: 'bg-error/10 text-error'
  },
  {
    title: 'Remote Management',
    description: 'Control and adjust physical systems through their digital twin interface from anywhere.',
    icon: Signal,
    color: 'bg-blue-dark/10 text-blue-dark'
  },
  {
    title: 'Performance Optimization',
    description: 'Identify inefficiencies and implement improvements based on data-driven insights.',
    icon: LineChart,
    color: 'bg-[#10B981]/10 text-[#10B981]'
  },
  {
    title: 'Efficiency Boosting',
    description: 'Reduce downtime and improve operational efficiency with proactive maintenance.',
    icon: Zap,
    color: 'bg-[#F59E0B]/10 text-[#F59E0B]'
  }
];

const METRICS = [
  { label: 'Operational Efficiency', value: 38, suffix: '%', description: 'Average improvement' },
  { label: 'Downtime Reduction', value: 72, suffix: '%', description: 'For maintenance' },
  { label: 'ROI Increase', value: 2.4, suffix: 'x', description: 'Typical return' },
  { label: 'Defect Reduction', value: 57, suffix: '%', description: 'In production' }
];

export function Features() {
  const [ref, isInView] = useInView({ threshold: 0.1, triggerOnce: true });
  
  return (
    <section 
      id="features" 
      className="py-24 bg-white relative overflow-hidden"
      ref={ref as React.RefObject<HTMLElement>}
    >
      {/* Background patterns */}
      <div className="absolute inset-0 grid-pattern-bg opacity-50 animate-grid-background z-0"></div>
      
      <div className="container px-6 md:px-10 max-w-7xl mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block px-3 py-1 mb-6 rounded-full bg-blue/10 border border-blue/20 text-blue text-sm font-medium">
            Powerful Features
          </div>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
            Transform Physical Assets into Intelligent Digital Twins
          </h2>
          <p className="text-lg text-gray-dark">
            Our comprehensive platform provides everything you need to create, monitor, and optimize your digital twin ecosystem.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {METRICS.map((metric, index) => (
            <div 
              key={index}
              className={cn(
                "p-6 rounded-xl bg-white border border-gray-light/80 text-center shadow-card",
                isInView ? "animate-fade-in-up" : "opacity-0"
              )}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <AnimatedCounter
                end={metric.value}
                suffix={metric.suffix}
                delay={index * 200}
                className="mb-2"
              />
              <h3 className="font-semibold text-gray-darker">{metric.label}</h3>
              <p className="text-sm text-gray mt-1">{metric.description}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {FEATURES.map((feature, index) => (
            <div 
              key={index}
              className={cn(
                "feature-card group",
                isInView ? "animate-fade-in-up" : "opacity-0"
              )}
              style={{ animationDelay: `${200 + index * 100}ms` }}
            >
              <div className={cn(
                "w-12 h-12 rounded-lg flex items-center justify-center mb-4",
                feature.color
              )}>
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold mb-2 group-hover:text-blue transition-colors duration-300">{feature.title}</h3>
              <p className="text-gray-dark">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Features;
