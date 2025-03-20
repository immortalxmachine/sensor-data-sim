
import React from 'react';
import { cn } from '@/lib/utils';

interface GlassMorphismProps extends React.HTMLAttributes<HTMLDivElement> {
  blur?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  opacity?: 'light' | 'medium' | 'heavy';
  border?: boolean;
  hoverEffect?: boolean;
  className?: string;
  children: React.ReactNode;
}

const blurValues = {
  xs: 'backdrop-blur-xs',
  sm: 'backdrop-blur-sm',
  md: 'backdrop-blur-md',
  lg: 'backdrop-blur-lg',
  xl: 'backdrop-blur-xl',
};

const opacityValues = {
  light: 'bg-white/30 dark:bg-gray-darkest/30',
  medium: 'bg-white/50 dark:bg-gray-darkest/50',
  heavy: 'bg-white/80 dark:bg-gray-darkest/80',
};

export function GlassMorphism({
  blur = 'md',
  opacity = 'medium',
  border = true,
  hoverEffect = false,
  className,
  children,
  ...props
}: GlassMorphismProps) {
  return (
    <div
      className={cn(
        blurValues[blur],
        opacityValues[opacity],
        border && 'border border-white/50 dark:border-white/10',
        hoverEffect && 'transition-all duration-300 hover:shadow-glass-hover',
        'shadow-glass rounded-2xl',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export default GlassMorphism;
