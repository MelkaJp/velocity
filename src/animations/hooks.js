import { useState, useEffect, useCallback, useRef, useMemo } from 'react';

// ──────────────────────────────────────────
// useScrollAnimation
// Adds CSS animation classes on scroll via IntersectionObserver
// ──────────────────────────────────────────

export function useScrollAnimation(ref, { type = 'fade-in-up', threshold = 0.1, triggerOnce = true } = {}) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('animate-in', `animate-${type}`);
          if (triggerOnce) observer.unobserve(el);
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, type, threshold, triggerOnce]);
}

// ──────────────────────────────────────────
// useParallax
// Translates element based on scroll position
// ──────────────────────────────────────────

export function useParallax(ref, speed = 0.3) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handleScroll = () => {
      const rect = el.getBoundingClientRect();
      const scrolled = window.scrollY - rect.top;
      el.style.transform = `translateY(${scrolled * speed}px)`;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [ref, speed]);
}

// ──────────────────────────────────────────
// useCountUp
// Animates a number from 0 to end value
// ──────────────────────────────────────────

export function useCountUp(end, { duration = 2000, startOnScroll = true, threshold = 0.2 } = {}) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!startOnScroll) {
      setStarted(true);
      return;
    }
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.unobserve(el);
        }
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [startOnScroll, threshold]);

  useEffect(() => {
    if (!started) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, end, duration]);

  return { count, ref };
}

// ──────────────────────────────────────────
// useStaggerAnimation
// Adds animation classes to children with stagger delay
// ──────────────────────────────────────────

export function useStaggerAnimation(containerRef, itemSelector = '.stagger-item', delay = 50) {
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const items = container.querySelectorAll(itemSelector);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          items.forEach((item, i) => {
            setTimeout(() => {
              item.classList.add('animate-in', 'fade-in-up');
            }, i * delay);
          });
          observer.unobserve(container);
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(container);
    return () => observer.disconnect();
  }, [containerRef, itemSelector, delay]);
}

// ──────────────────────────────────────────
// useTextReveal
// Types out text character by character
// ──────────────────────────────────────────

export function useTextReveal(ref, { speed = 30, triggerOnce = true } = {}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          if (triggerOnce) observer.unobserve(el);
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [ref, triggerOnce]);

  return visible;
}

// ──────────────────────────────────────────
// useGradientScroll
// Changes hue based on scroll percentage
// ──────────────────────────────────────────

export function useGradientScroll(ref) {
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handleScroll = () => {
      const rect = el.getBoundingClientRect();
      const scrollPercent = Math.min(Math.max((window.scrollY - rect.top + window.innerHeight) / (rect.height + window.innerHeight), 0), 1);
      const hue = 220 + scrollPercent * 40;
      el.style.background = `linear-gradient(135deg, hsl(${hue}, 30%, 10%), hsl(${hue + 20}, 40%, 5%))`;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [ref]);
}

// ──────────────────────────────────────────
// useMouseParallax
// 3D tilt effect based on mouse position
// ──────────────────────────────────────────

export function useMouseParallax(ref, intensity = 0.5) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    setMousePos({
      x: (e.clientX - centerX) / rect.width,
      y: (e.clientY - centerY) / rect.height
    });
  }, [ref]);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  const style = {
    transform: `perspective(1000px) rotateY(${mousePos.x * intensity}deg) rotateX(${-mousePos.y * intensity}deg)`,
    transition: 'transform 0.2s ease-out'
  };

  return style;
}
