import React, { useEffect, useRef } from 'react';

export const SpatialBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const mouseRef = useRef<{ x: number; y: number; targetX: number; targetY: number }>({
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Initial mouse center
    mouseRef.current.x = width / 2;
    mouseRef.current.y = height / 2;
    mouseRef.current.targetX = width / 2;
    mouseRef.current.targetY = height / 2;

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = e.clientX;
      mouseRef.current.targetY = e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });

    // Generate subtle sparse nodes
    const nodeCount = Math.min(Math.floor((width * height) / 30000), 45);
    const nodes: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      baseAlpha: number;
    }> = [];

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        radius: Math.random() * 1.5 + 0.8,
        baseAlpha: Math.random() * 0.25 + 0.08,
      });
    }

    const render = () => {
      // Smooth lerp for mouse
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      ctx.clearRect(0, 0, width, height);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      const isLight = document.documentElement.classList.contains('light');
      const rgb = isLight ? '15, 23, 42' : '255, 255, 255';

      // Soft ambient cursor specular glow (very gentle, not a bright neon blob)
      const glow = ctx.createRadialGradient(mx, my, 0, mx, my, 420);
      glow.addColorStop(0, isLight ? 'rgba(0, 0, 0, 0.03)' : 'rgba(255, 255, 255, 0.035)');
      glow.addColorStop(0.5, isLight ? 'rgba(8, 145, 178, 0.015)' : 'rgba(56, 189, 248, 0.012)');
      glow.addColorStop(1, 'transparent');
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, width, height);

      // Render nodes and subtle connecting lines
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.x += n.vx;
        n.y += n.vy;

        // Wrap around borders
        if (n.x < 0) n.x = width;
        if (n.x > width) n.x = 0;
        if (n.y < 0) n.y = height;
        if (n.y > height) n.y = 0;

        // Distance to cursor (subtle repulsion)
        const dx = n.x - mx;
        const dy = n.y - my;
        const dist = Math.sqrt(dx * dy + dy * dy);
        if (dist < 140 && dist > 0) {
          const force = (140 - dist) / 140;
          n.x += (dx / dist) * force * 0.6;
          n.y += (dy / dist) * force * 0.6;
        }

        // Draw node
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rgb}, ${n.baseAlpha})`;
        ctx.fill();

        // Connect nearby nodes with faint hairline
        for (let j = i + 1; j < nodes.length; j++) {
          const n2 = nodes[j];
          const distNodes = Math.hypot(n.x - n2.x, n.y - n2.y);
          if (distNodes < 110) {
            const lineAlpha = (1 - distNodes / 110) * 0.06;
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(n2.x, n2.y);
            ctx.strokeStyle = `rgba(${rgb}, ${lineAlpha})`;
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none">
      {/* Structural Hairline Grid */}
      <div className="absolute inset-0 bg-spatial-grid opacity-60" />

      {/* Interactive Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
    </div>
  );
};
