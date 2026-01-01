/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useRef } from "react";

const FireworksParticles = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<any[]>([]);
  const rocketsRef = useRef<any[]>([]);
  const animationRef = useRef<number | null>(null);

  class Rocket {
    x: number;
    y: number;
    targetY: number;
    vx: number;
    vy: number;
    hue: number;
    trail: any[];

    constructor(x: number, targetY: number) {
      this.x = x;
      this.y = window.innerHeight;
      this.targetY = targetY;
      this.vx = (Math.random() - 0.5) * 2;
      this.vy = -9;
      this.hue = Math.random() * 360;
      this.trail = [];
    }

    update() {
      this.trail.push({ x: this.x, y: this.y, alpha: 1 });
      if (this.trail.length > 8) this.trail.shift();
      this.trail.forEach((t) => (t.alpha -= 0.12));

      this.vy += 0.15;
      this.x += this.vx;
      this.y += this.vy;

      return this.vy >= 0 || this.y <= this.targetY;
    }

    draw(ctx: CanvasRenderingContext2D) {
      this.trail.forEach((t) => {
        ctx.beginPath();
        ctx.arc(t.x, t.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${this.hue},100%,60%,${t.alpha})`;
        ctx.fill();
      });

      ctx.beginPath();
      ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
      ctx.fillStyle = `hsl(${this.hue},100%,60%)`;
      ctx.shadowBlur = 10;
      ctx.shadowColor = `hsl(${this.hue},100%,50%)`;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
  }

  class Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    alpha: number;
    hue: number;
    size: number;

    constructor(x: number, y: number, hue: number) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 6 + 2;
      this.x = x;
      this.y = y;
      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed;
      this.alpha = 1;
      this.hue = hue + (Math.random() * 40 - 20);
      this.size = Math.random() * 2 + 1.5;
    }

    update() {
      this.vx *= 0.96;
      this.vy *= 0.96;
      this.vy += 0.08;
      this.x += this.vx;
      this.y += this.vy;
      this.alpha -= 0.015;
    }

    draw(ctx: CanvasRenderingContext2D) {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsl(${this.hue},100%,60%)`;
      ctx.fill();
      ctx.restore();
    }
  }

  const explode = (x: number, y: number) => {
    const hue = Math.random() * 360;
    for (let i = 0; i < 80; i++) {
      particlesRef.current.push(new Particle(x, y, hue));
    }
  };

  const launchRocket = () => {
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight * 0.4 + 80;
    rocketsRef.current.push(new Rocket(x, y));
  };

  const animate = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    // 🔑 TRANSPARENT BACKGROUND
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    rocketsRef.current = rocketsRef.current.filter((r) => {
      r.draw(ctx);
      if (r.update()) {
        explode(r.x, r.y);
        return false;
      }
      return true;
    });

    particlesRef.current = particlesRef.current.filter((p) => {
      if (p.alpha > 0) {
        p.update();
        p.draw(ctx);
        return true;
      }
      return false;
    });

    animationRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    animate();
    const interval = setInterval(launchRocket, 700);

    const stop = setTimeout(() => {
      clearInterval(interval);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      canvas.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height);
    }, 7000);

    return () => {
      window.removeEventListener("resize", resize);
      clearInterval(interval);
      clearTimeout(stop);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
    />
  );
};

export default FireworksParticles;
