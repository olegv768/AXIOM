import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export const CustomCursor: React.FC = () => {
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isClicking, setIsClicking] = useState(false);

  useEffect(() => {
    // Only enable on desktop pointer devices
    if (typeof window === 'undefined' || window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    const onMouseMove = (e: MouseEvent) => {
      setPos({ x: e.clientX, y: e.clientY });
      if (!isVisible) setIsVisible(true);

      // Check if target is interactive
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const isInteractive = Boolean(
        target.closest('button, a, input, textarea, select, [role="button"], .interactive-node')
      );
      setIsHovered(isInteractive);
    };

    const onMouseDown = () => setIsClicking(true);
    const onMouseUp = () => setIsClicking(false);
    const onMouseLeave = () => setIsVisible(false);

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.documentElement.addEventListener('mouseleave', onMouseLeave);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.documentElement.removeEventListener('mouseleave', onMouseLeave);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  const isLight = typeof document !== 'undefined' && document.documentElement.classList.contains('light');

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden hidden md:block select-none">
      {/* Precision Core Dot */}
      <motion.div
        className={`fixed w-1.5 h-1.5 rounded-full -translate-x-1/2 -translate-y-1/2 ${
          isLight
            ? 'bg-neutral-900 shadow-[0_0_6px_rgba(0,0,0,0.4)]'
            : 'bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]'
        }`}
        animate={{
          x: pos.x,
          y: pos.y,
          scale: isClicking ? 0.6 : isHovered ? 1.5 : 1,
        }}
        transition={{
          type: 'spring',
          stiffness: 1200,
          damping: 50,
          mass: 0.1,
        }}
      />

      {/* Trailing Outer Ring */}
      <motion.div
        className="fixed rounded-full -translate-x-1/2 -translate-y-1/2"
        animate={{
          x: pos.x,
          y: pos.y,
          width: isHovered ? 38 : 22,
          height: isHovered ? 38 : 22,
          opacity: isHovered ? 0.8 : 0.35,
          borderColor: isLight
            ? isHovered ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.25)'
            : isHovered ? 'rgba(255, 255, 255, 0.7)' : 'rgba(255, 255, 255, 0.25)',
          backgroundColor: isLight
            ? isHovered ? 'rgba(0, 0, 0, 0.05)' : 'transparent'
            : isHovered ? 'rgba(255, 255, 255, 0.04)' : 'transparent',
          borderWidth: 1,
          borderStyle: 'solid',
        }}
        transition={{
          type: 'spring',
          stiffness: 350,
          damping: 26,
          mass: 0.2,
        }}
      />
    </div>
  );
};
