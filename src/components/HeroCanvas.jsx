import React, { useEffect, useRef } from 'react';

const HeroCanvas = () => {
  const canvasRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: false }); // alpha: false for performance if background is solid
    
    let animationFrameId;
    let particles = [];
    let width = window.innerWidth;
    let height = window.innerHeight;
    
    // Config
    const PARTICLE_COUNT = Math.min(Math.floor((width * height) / 10000), 150); // Scale with screen size
    const CONNECTION_RADIUS = 150;
    const MOUSE_RADIUS = 250;
    const PARTICLE_SPEED = 0.5;
    
    let mouse = { x: -1000, y: -1000 };
    
    const initCanvas = () => {
      canvas.width = width;
      canvas.height = height;
      
      particles = [];
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * PARTICLE_SPEED,
          vy: (Math.random() - 0.5) * PARTICLE_SPEED,
          radius: Math.random() * 1.5 + 0.5
        });
      }
    };
    
    initCanvas();
    
    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      initCanvas();
    };
    
    const handleMouseMove = (e) => {
      // Offset by scroll position if necessary, but Hero is usually 100vh and fixed/absolute
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    
    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };
    
    window.addEventListener('resize', handleResize);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    
    const draw = () => {
      // Background (Obsidian)
      ctx.fillStyle = '#121620';
      ctx.fillRect(0, 0, width, height);
      
      // Draw cinematic radial light acting as cursor glow
      if (mouse.x > 0 && mouse.y > 0) {
        const gradient = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, MOUSE_RADIUS * 2);
        gradient.addColorStop(0, 'rgba(16, 185, 129, 0.08)'); // emerald accent
        gradient.addColorStop(1, 'rgba(18, 22, 32, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
      }
      
      // Update & Draw Particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        
        // Movement
        p.x += p.vx;
        p.y += p.vy;
        
        // Bounce off edges
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;
        
        // Mouse interaction (Repulsion)
        const dxMouse = mouse.x - p.x;
        const dyMouse = mouse.y - p.y;
        const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
        
        if (distMouse < MOUSE_RADIUS) {
           const force = (MOUSE_RADIUS - distMouse) / MOUSE_RADIUS;
           p.x -= dxMouse * force * 0.02;
           p.y -= dyMouse * force * 0.02;
           
           // Draw connection to mouse
           ctx.beginPath();
           ctx.moveTo(p.x, p.y);
           ctx.lineTo(mouse.x, mouse.y);
           ctx.strokeStyle = `rgba(16, 185, 129, ${force * 0.2})`; // Emerald thread
           ctx.lineWidth = 1;
           ctx.stroke();
        }
        
        // Connections
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          
          if (dist < CONNECTION_RADIUS) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            const opacity = 1 - (dist / CONNECTION_RADIUS);
            ctx.strokeStyle = `rgba(248, 250, 252, ${opacity * 0.15})`; // White/Slate lines
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
        
        // Draw Particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(16, 185, 129, ${Math.min(1, (mouse.x > 0 && distMouse < MOUSE_RADIUS) ? 0.8 : 0.3)})`;
        ctx.fill();
      }
      
      // Additional subtle technical overlay drawing (like crosshairs or data points)
      if (mouse.x > 0 && mouse.y > 0) {
         ctx.beginPath();
         ctx.moveTo(mouse.x - 10, mouse.y);
         ctx.lineTo(mouse.x + 10, mouse.y);
         ctx.moveTo(mouse.x, mouse.y - 10);
         ctx.lineTo(mouse.x, mouse.y + 10);
         ctx.strokeStyle = 'rgba(16, 185, 129, 0.4)';
         ctx.lineWidth = 1;
         ctx.stroke();
      }
      
      animationFrameId = requestAnimationFrame(draw);
    };
    
    draw();
    
    return () => {
      window.removeEventListener('resize', handleResize);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 z-0 pointer-events-auto"
      style={{ width: '100%', height: '100%', display: 'block' }}
    />
  );
};

export default HeroCanvas;
