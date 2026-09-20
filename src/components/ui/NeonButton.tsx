import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface NeonButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'elevated';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
  showArrow?: boolean;
  children: React.ReactNode;
}

export const NeonButton: React.FC<NeonButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  showArrow = false,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs rounded-lg gap-1.5 font-medium tracking-tight',
    md: 'px-4 py-2 text-xs sm:text-sm rounded-lg gap-2 font-medium tracking-tight',
    lg: 'px-6 py-3 text-sm sm:text-base font-semibold rounded-xl gap-2.5 tracking-tight',
  }[size];

  // Luxury / Editorial software styling (VisionOS / Linear / Teenage Engineering inspired)
  const variantStyles = {
    primary:
      'btn-neon-primary bg-neutral-900 text-white dark:bg-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-100 border border-neutral-800 dark:border-white/90 shadow-md font-semibold',
    secondary:
      'bg-neutral-200/80 hover:bg-neutral-200 dark:bg-[#121318] dark:hover:bg-[#171920] text-neutral-800 dark:text-neutral-200 border border-neutral-300 dark:border-white/[0.09] shadow-sm',
    elevated:
      'bg-white hover:bg-neutral-50 dark:bg-[#191b22] dark:hover:bg-[#20232c] text-neutral-900 dark:text-white border border-neutral-300 dark:border-white/[0.14] shadow-md',
    ghost:
      'bg-transparent hover:bg-black/[0.05] dark:hover:bg-white/[0.05] text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white border border-transparent',
  }[variant];

  return (
    <motion.button
      whileHover={disabled || isLoading ? undefined : { scale: 1.015, y: -0.5 }}
      whileTap={disabled || isLoading ? undefined : { scale: 0.985, y: 0 }}
      transition={{ type: 'spring', stiffness: 450, damping: 25 }}
      disabled={disabled || isLoading}
      className={`group/btn relative inline-flex items-center justify-center transition-all duration-200 select-none disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer ${sizeClasses} ${variantStyles} ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-3.5 h-3.5 animate-spin text-current" />
          <span className="font-mono text-xs">PROCESSING...</span>
        </>
      ) : (
        <>
          {icon && <span className="flex items-center">{icon}</span>}
          <span>{children}</span>
          {showArrow && (
            <span className="relative flex items-center justify-center w-3.5 h-3.5 ml-1 transition-transform duration-200 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5">
              <span className="transition-opacity duration-150 group-hover/btn:opacity-0">→</span>
              <span className="absolute inset-0 transition-opacity duration-150 opacity-0 group-hover/btn:opacity-100">↗</span>
            </span>
          )}
        </>
      )}
    </motion.button>
  );
};
