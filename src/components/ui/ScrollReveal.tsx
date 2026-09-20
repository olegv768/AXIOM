import React, { useRef, useEffect, useState, useCallback } from 'react';

export type RevealVariant =
  | 'fade-up'
  | 'fade-down'
  | 'fade-in'
  | 'fade-left'
  | 'fade-right'
  | 'scale-up'
  | 'scale-in'
  | 'blur-in'
  | 'slide-up'
  | 'slide-rotate';

interface ScrollRevealProps {
  children: React.ReactNode;
  variant?: RevealVariant;
  /** Delay in ms before animation starts after element is visible */
  delay?: number;
  /** Animation duration in ms */
  duration?: number;
  /** IntersectionObserver threshold (0 to 1) */
  threshold?: number;
  /** Extra CSS class */
  className?: string;
  /** Whether to only animate once (default true) */
  once?: boolean;
  /** Custom easing */
  easing?: string;
  /** Stagger index for sequential reveals in a group */
  staggerIndex?: number;
  /** Base stagger delay per item in ms */
  staggerDelay?: number;
  /** HTML tag to render */
  as?: keyof JSX.IntrinsicElements;
  /** Style overrides */
  style?: React.CSSProperties;
}

const VARIANT_STYLES: Record<RevealVariant, { from: React.CSSProperties; to: React.CSSProperties }> = {
  'fade-up': {
    from: { opacity: 0, transform: 'translateY(40px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
  },
  'fade-down': {
    from: { opacity: 0, transform: 'translateY(-30px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
  },
  'fade-in': {
    from: { opacity: 0 },
    to: { opacity: 1 },
  },
  'fade-left': {
    from: { opacity: 0, transform: 'translateX(50px)' },
    to: { opacity: 1, transform: 'translateX(0)' },
  },
  'fade-right': {
    from: { opacity: 0, transform: 'translateX(-50px)' },
    to: { opacity: 1, transform: 'translateX(0)' },
  },
  'scale-up': {
    from: { opacity: 0, transform: 'scale(0.92) translateY(20px)' },
    to: { opacity: 1, transform: 'scale(1) translateY(0)' },
  },
  'scale-in': {
    from: { opacity: 0, transform: 'scale(0.85)' },
    to: { opacity: 1, transform: 'scale(1)' },
  },
  'blur-in': {
    from: { opacity: 0, filter: 'blur(12px)', transform: 'translateY(16px)' },
    to: { opacity: 1, filter: 'blur(0px)', transform: 'translateY(0)' },
  },
  'slide-up': {
    from: { opacity: 0, transform: 'translateY(60px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
  },
  'slide-rotate': {
    from: { opacity: 0, transform: 'translateY(30px) rotate(2deg)' },
    to: { opacity: 1, transform: 'translateY(0) rotate(0deg)' },
  },
};

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  variant = 'fade-up',
  delay = 0,
  duration = 700,
  threshold = 0.15,
  className = '',
  once = true,
  easing = 'cubic-bezier(0.16, 1, 0.3, 1)',
  staggerIndex = 0,
  staggerDelay = 80,
  as: Tag = 'div',
  style = {},
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (once && hasAnimated.current) return;
          setIsVisible(true);
          hasAnimated.current = true;
          if (once) observer.unobserve(el);
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, once]);

  const variantConfig = VARIANT_STYLES[variant];
  const totalDelay = delay + staggerIndex * staggerDelay;

  const currentStyle: React.CSSProperties = isVisible
    ? {
        ...variantConfig.to,
        transition: `opacity ${duration}ms ${easing} ${totalDelay}ms, transform ${duration}ms ${easing} ${totalDelay}ms, filter ${duration}ms ${easing} ${totalDelay}ms`,
        willChange: 'opacity, transform, filter',
      }
    : {
        ...variantConfig.from,
        transition: 'none',
        willChange: 'opacity, transform, filter',
      };

  const Component = Tag as any;

  return (
    <Component
      ref={ref}
      className={className}
      style={{ ...currentStyle, ...style }}
    >
      {children}
    </Component>
  );
};

/**
 * Hook for manual scroll reveal control.
 * Returns [ref, isVisible] — attach ref to the element.
 */
export function useScrollReveal(options?: {
  threshold?: number;
  once?: boolean;
  rootMargin?: string;
}): [React.RefObject<HTMLDivElement | null>, boolean] {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const hasAnimated = useRef(false);
  const { threshold = 0.15, once = true, rootMargin = '0px 0px -40px 0px' } = options ?? {};

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (once && hasAnimated.current) return;
          setIsVisible(true);
          hasAnimated.current = true;
          if (once) observer.unobserve(el);
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, once, rootMargin]);

  return [ref, isVisible];
}

export default ScrollReveal;
