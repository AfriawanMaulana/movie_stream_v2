"use client";
import { useEffect, useState } from "react";
// import FireworksParticles from "./FireworkParticles";

interface Particle {
  id: number;
  left: number;
  animationDuration: number;
  animationDelay: number;
  size: number;
  type: string;
}

const Particles = () => {
  const [particles, setParticles] = useState<Particle[]>([]);
  const [show, setShow] = useState(true);

  useEffect(() => {
    const newParticles = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      animationDuration: 2 + Math.random() * 4,
      animationDelay: Math.random() * 2,
      size: 15 + Math.random() * 20,
      type: ["💖", "💝", "🌺", "🌷"][Math.floor(Math.random() * 5)],
    }));

    setParticles(newParticles);

    const maxDuration = Math.max(
      ...newParticles.map((p) => p.animationDuration + p.animationDelay)
    );

    const timer = setTimeout(() => {
      setShow(false);
    }, maxDuration * 1000);

    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-50 bg-gradient-to-b from-pink-500/30 via-white/0 to-white/0">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="absolute animate-fall-once"
          style={{
            left: `${particle.left}%`,
            fontSize: `${particle.size}px`,
            animationDuration: `${particle.animationDuration}s`,
            animationDelay: `${particle.animationDelay}s`,
            top: "-50px",
          }}
        >
          {particle.type}
        </div>
      ))}
      <style jsx>{`
        @keyframes fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(360deg);
            opacity: 0.3;
          }
        }
        .animate-fall-once {
          animation: fall linear forwards; /* forwards agar tetap di posisi akhir */
        }
      `}</style>
    </div>
  );
};

export default function ParticlesDemo() {
  return (
    <div className="min-h-screen absolute">
      {/* <FireworksParticles /> */}
      <Particles />
    </div>
  );
}
