import React from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface NeonButtonProps extends HTMLMotionProps<'button'> {
  variant?: 'primary' | 'secondary' | 'emerald' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export const NeonButton: React.FC<NeonButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs rounded-lg gap-1.5 font-medium',
    md: 'px-4 py-2 text-sm rounded-lg gap-2 font-medium',
    lg: 'px-6 py-2.5 text-sm sm:text-base font-semibold rounded-xl gap-2.5',
  }[size];

  // Refined precision styling (Linear / Apple Pro style instead of cheap neon)
  const variantStyles = {
    primary: 'bg-white text-neutral-950 hover:bg-neutral-100 border border-white/80 shadow-[0_1px_2px_rgba(0,0,0,0.1),0_0_0_1px_rgba(255,255,255,0.2)]',
    secondary: 'bg-[#141722] hover:bg-[#1a1e2b] text-neutral-200 border border-white/[0.09] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]',
    emerald: 'bg-[#0f1f1a] hover:bg-[#132821] text-emerald-300 border border-emerald-500/30 shadow-[inset_0_1px_0_rgba(16,185,129,0.2)]',
    ghost: 'bg-transparent hover:bg-white/[0.04] text-neutral-400 hover:text-white border border-transparent',
  }[variant];

  return (
    <motion.button
      whileHover={disabled || isLoading ? undefined : { scale: 1.01, y: -0.5 }}
      whileTap={disabled || isLoading ? undefined : { scale: 0.985, y: 0 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      disabled={disabled || isLoading}
      className={`relative inline-flex items-center justify-center transition-all duration-150 select-none disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer tracking-tight ${sizeClasses} ${variantStyles} ${className}`}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-3.5 h-3.5 animate-spin text-current" />
          <span>Обработка...</span>
        </>
      ) : (
        <>
          {icon && <span className="flex items-center">{icon}</span>}
          <span>{children}</span>
        </>
      )}
    </motion.button>
  );
};
