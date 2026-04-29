import { type MissionProps } from './ui/Mission';
import Mission from './ui/Mission';
import { useEffect, useRef } from 'react';

const colors = ['#c18257', '#e4afb3', '#5ba170', '#edb94c', '#6578b6', '#b42413', '#fff'];

// Simple confetti component that renders random falling particles.
const Confetti: React.FC<{ count?: number }> = ({ count = 200 }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;
    const particles: HTMLDivElement[] = [];

    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      const size = Math.random() * 8 + 4; // 4-12px
      const left = Math.random() * 100; // percent
      const delay = Math.random() * 2; // seconds
      const duration = Math.random() * 3 + 2; // 2-5s
      particle.style.position = 'absolute';
      particle.style.width = `${size}px`;
      particle.style.height = `${size * 1.5}px`;
      particle.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      particle.style.left = `${left}%`;
      particle.style.top = '-20px';
      particle.style.opacity = '0.8';
      particle.style.transform = `rotate(${Math.random() * 360}deg)`;
      particle.style.pointerEvents = 'none';

      // animation via CSS keyframes defined in global styles.
      particle.style.animationName = 'confetti-fall';
      particle.style.animationDuration = `${duration}s`;
      particle.style.animationTimingFunction = 'linear';
      particle.style.animationDelay = `${delay}s`;
      particle.style.animationIterationCount = 'infinite';

      container.appendChild(particle);
      particles.push(particle);
    }

    return () => {
      // cleanup
      particles.forEach((p) => container.removeChild(p));
    };
  }, [count]);

  return <div ref={containerRef} style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', zIndex: 9999 }} />;
};

export const RecordScreen: React.FC<MissionProps> = ({ buttonLabel, onNavigate, ...props }) => (
  <>
    <Confetti count={300} />
    <Mission
      {...props}
      buttonLabel={buttonLabel || 'RECOMEÇAR'}
      onNavigate={onNavigate}
    />
  </>
);
