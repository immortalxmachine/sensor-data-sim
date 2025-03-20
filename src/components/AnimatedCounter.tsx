
import React from 'react';
import { useCountUp } from '@/utils/animations';
import { cn } from '@/lib/utils';

interface AnimatedCounterProps {
  end: number;
  start?: number;
  duration?: number;
  delay?: number;
  prefix?: string;
  suffix?: string;
  formatter?: (value: number) => string;
  className?: string;
  labelClassName?: string;
  label?: string;
}

export function AnimatedCounter({
  end,
  start = 0,
  duration = 2000,
  delay = 0,
  prefix = '',
  suffix = '',
  formatter,
  className,
  labelClassName,
  label
}: AnimatedCounterProps) {
  const value = useCountUp(end, start, duration, delay, formatter);

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <span className="text-4xl font-bold tracking-tight">
        {prefix}{value}{suffix}
      </span>
      {label && <span className={cn("text-sm text-gray-dark mt-2", labelClassName)}>{label}</span>}
    </div>
  );
}

export default AnimatedCounter;
