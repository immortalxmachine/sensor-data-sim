
import { useEffect, useState, useRef } from 'react';

// Animation for counting up numbers
export const useCountUp = (
  end: number, 
  start = 0, 
  duration = 2000, 
  delay = 0,
  formatter = (value: number) => Math.floor(value).toString()
) => {
  const [count, setCount] = useState(start);
  const countRef = useRef<number>(start);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    const startTime = Date.now() + delay;
    const endTime = startTime + duration;

    const updateCount = () => {
      const now = Date.now();
      
      if (now < startTime) {
        timerRef.current = window.requestAnimationFrame(updateCount);
        return;
      }
      
      if (now >= endTime) {
        setCount(end);
        countRef.current = end;
        return;
      }
      
      const elapsed = now - startTime;
      const progress = elapsed / duration;
      const value = start + (end - start) * progress;
      
      setCount(value);
      countRef.current = value;
      timerRef.current = window.requestAnimationFrame(updateCount);
    };

    timerRef.current = window.requestAnimationFrame(updateCount);

    return () => {
      if (timerRef.current !== null) {
        window.cancelAnimationFrame(timerRef.current);
      }
    };
  }, [start, end, duration, delay]);

  return formatter(count);
};

// Intersection Observer hook for triggering animations
export const useInView = (
  options = { threshold: 0.1, triggerOnce: true }
) => {
  const [isInView, setIsInView] = useState(false);
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const currentRef = ref.current;
    if (!currentRef) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          if (options.triggerOnce) {
            observer.disconnect();
          }
        } else if (!options.triggerOnce) {
          setIsInView(false);
        }
      },
      { threshold: options.threshold }
    );

    observer.observe(currentRef);

    return () => {
      if (currentRef) observer.unobserve(currentRef);
    };
  }, [options.threshold, options.triggerOnce]);

  return [ref, isInView] as const;
};

// Parallax effect for smooth scroll animations
export const useParallax = (
  speed: number = 0.1
) => {
  const [offset, setOffset] = useState(0);
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;
      const elementTop = ref.current.getBoundingClientRect().top;
      const parentTop = ref.current.parentElement?.getBoundingClientRect().top || 0;
      const relativeTop = elementTop - parentTop;
      
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      
      // Calculate position relative to viewport 
      const offsetY = (scrollY + windowHeight - relativeTop) * speed;
      
      setOffset(offsetY);
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initialize on mount

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [speed]);

  return [ref, { transform: `translateY(${offset}px)` }] as const;
};

// Type for staggered animation
export type StaggerConfig = {
  index: number;
  staggerDelay: number;
  baseDelay?: number;
  fadeDirection?: 'up' | 'down' | 'left' | 'right' | 'none';
}

// Calculate styles for staggered animations
export const getStaggeredAnimationStyles = ({
  index,
  staggerDelay,
  baseDelay = 0,
  fadeDirection = 'up'
}: StaggerConfig) => {
  const delay = baseDelay + index * staggerDelay;
  
  let transform = 'translate3d(0, 0, 0)';
  let initialTransform = 'translate3d(0, 0, 0)';
  
  if (fadeDirection === 'up') {
    initialTransform = 'translate3d(0, 20px, 0)';
  } else if (fadeDirection === 'down') {
    initialTransform = 'translate3d(0, -20px, 0)';
  } else if (fadeDirection === 'left') {
    initialTransform = 'translate3d(20px, 0, 0)';
  } else if (fadeDirection === 'right') {
    initialTransform = 'translate3d(-20px, 0, 0)';
  }
  
  return {
    opacity: 0,
    transform: initialTransform,
    animation: `fade-in 0.6s ease-out forwards ${delay}ms, transform 0.6s ease-out forwards ${delay}ms`,
    transitionProperty: 'opacity, transform',
    transitionDuration: '600ms',
    transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
    transitionDelay: `${delay}ms`,
    animationFillMode: 'forwards',
    willChange: 'opacity, transform'
  };
};
