import React, { useState, useRef, useCallback } from 'react';

interface Card3DProps {
  children: React.ReactNode;
  className?: string;
  depth?: number;
  interactive?: boolean;
  onClick?: () => void;
}

export const Card3D: React.FC<Card3DProps> = ({
  children,
  className = '',
  depth = 3.5,
  interactive = true,
  onClick,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [coords, setCoords] = useState<{ x: number; y: number }>({ x: 50, y: 50 });
  const [rotate, setRotate] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!interactive || !cardRef.current) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const percentX = (x / rect.width) * 100;
      const percentY = (y / rect.height) * 100;

      // Subtle tilt angle strictly calibrated to 2-4 degrees
      const maxTilt = Math.min(depth, 3.5);
      const rotX = ((rect.height / 2 - y) / (rect.height / 2)) * maxTilt;
      const rotY = ((x - rect.width / 2) / (rect.width / 2)) * maxTilt;

      setCoords({ x: percentX, y: percentY });
      setRotate({ x: rotX, y: rotY });
    },
    [interactive, depth]
  );

  const handleMouseEnter = () => {
    if (!interactive) return;
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    if (!interactive) return;
    setIsHovered(false);
    setRotate({ x: 0, y: 0 });
    setCoords({ x: 50, y: 50 });
  };

  return (
    <div
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative w-full [perspective:1000px] transition-transform duration-200 ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      <div
        style={{
          transform: isHovered
            ? `rotateX(${rotate.x.toFixed(2)}deg) rotateY(${rotate.y.toFixed(2)}deg) translateZ(4px)`
            : 'rotateX(0deg) rotateY(0deg) translateZ(0px)',
          transition: isHovered ? 'transform 0.08s ease-out' : 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        className={`relative overflow-hidden rounded-xl border border-white/[0.08] hover:border-white/[0.18] bg-[#0c0e14] shadow-[0_4px_24px_-8px_rgba(0,0,0,0.7)] transition-colors duration-300 ${className}`}
      >
        {/* Dynamic cursor specular glare spotlight */}
        {interactive && (
          <div
            className="pointer-events-none absolute inset-0 transition-opacity duration-300 z-20"
            style={{
              opacity: isHovered ? 1 : 0,
              background: `radial-gradient(400px circle at ${coords.x}% ${coords.y}%, rgba(255, 255, 255, 0.05), transparent 60%)`,
            }}
          />
        )}

        {/* Subtle top edge specular highlight */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/[0.15] to-transparent z-20" />

        <div className="relative z-10 w-full">
          {children}
        </div>
      </div>
    </div>
  );
};
