import { useEffect } from 'react';
import confetti from 'canvas-confetti';

export default function ConfettiFireworks({ trigger }) {
  useEffect(() => {
    if (!trigger) return;

    const duration = 8000;
    const end = Date.now() + duration;

    const interval = setInterval(() => {
      if (Date.now() > end) {
        clearInterval(interval);
        return;
      }

      confetti({
        particleCount: 6,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#00d4aa', '#6366f1', '#f472b6', '#f59e0b']
      });

      confetti({
        particleCount: 6,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#6366f1', '#00d4aa', '#10b981', '#f472b6']
      });
    }, 180);

    setTimeout(() => {
      confetti({
        particleCount: 400,
        spread: 140,
        startVelocity: 50,
        origin: { y: 0.6 },
        colors: ['#00d4aa', '#6366f1', '#f472b6', '#f59e0b', '#10b981']
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [trigger]);

  return null;
}
