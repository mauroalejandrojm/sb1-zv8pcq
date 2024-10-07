import React, { useRef, useEffect } from 'react';

const HeroAnimation: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    const particles: { x: number; y: number; vx: number; vy: number; radius: number; color: string }[] = [];
    const colors = ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#8B00FF'];
    const maxParticles = 100;

    const addParticle = (x: number, y: number) => {
      const color = colors[Math.floor(Math.random() * colors.length)];
      const radius = Math.random() * 10 + 5;
      particles.push({ x, y, vx: 0, vy: 0, radius, color });
      if (particles.length > maxParticles) particles.shift();
    };

    const updateParticles = (mouseX: number, mouseY: number) => {
      particles.forEach((p) => {
        const dx = mouseX - p.x;
        const dy = mouseY - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          const force = (100 - dist) / 100;
          p.vx += (dx / dist) * force * 0.2;
          p.vy += (dy / dist) * force * 0.2;
        }
        p.x += p.vx;
        p.y += p.vy;
        p.vx *= 0.95;
        p.vy *= 0.95;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      });
    };

    const drawParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = 0.3;
        ctx.fill();
      });
    };

    let animationId: number;
    const animate = () => {
      drawParticles();
      animationId = requestAnimationFrame(animate);
    };

    animate();

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      addParticle(mouseX, mouseY);
      updateParticles(mouseX, mouseY);
    };

    canvas.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      canvas.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full pointer-events-none" />;
};

export default HeroAnimation;