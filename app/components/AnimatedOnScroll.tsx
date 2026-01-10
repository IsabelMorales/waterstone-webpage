'use client';

import { useEffect, useRef, useState } from 'react';

interface AnimatedOnScrollProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export default function AnimatedOnScroll({
  children,
  delay = 0,
  className = '',
}: AnimatedOnScrollProps) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasBeenAnimated = useRef(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || typeof window === 'undefined') return;

    // Inicializar lastScrollY en el cliente
    lastScrollY.current = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollingDown = currentScrollY > lastScrollY.current;
      lastScrollY.current = currentScrollY;

      const rect = element.getBoundingClientRect();
      const isInViewport = rect.top < window.innerHeight && rect.bottom > 0;
      // Verificar que el elemento esté completamente abajo del viewport (salido por abajo)
      const isBelowViewport = rect.top > window.innerHeight;

      // Si el elemento ya fue animado
      if (hasBeenAnimated.current) {
        // Solo resetear si sale completamente por abajo Y estamos haciendo scroll hacia arriba
        // (esto permite reanimación cuando vuelva a entrar desde abajo con scroll hacia abajo)
        if (isBelowViewport && !scrollingDown) {
          hasBeenAnimated.current = false;
          setIsVisible(false);
        } else {
          // En todos los demás casos, mantener visible (incluyendo scroll hacia arriba)
          setIsVisible(true);
        }
        return;
      }

      // Solo animar si:
      // 1. El elemento está en viewport
      // 2. Estamos haciendo scroll hacia abajo
      // 3. El elemento está entrando desde arriba (top del viewport)
      // 4. No ha sido animado todavía
      if (
        isInViewport &&
        scrollingDown &&
        rect.top < window.innerHeight * 0.8 &&
        !hasBeenAnimated.current
      ) {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
          setIsVisible(true);
          hasBeenAnimated.current = true;
        }, delay);
      }
    };

    // Intersection Observer para detectar cuando entra en viewport
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const currentScrollY = window.scrollY;
          const scrollingDown = currentScrollY > lastScrollY.current;
          lastScrollY.current = currentScrollY;

          const rect = entry.boundingClientRect;
          const isBelowViewport = rect.top > window.innerHeight;

          // Si el elemento ya fue animado
          if (hasBeenAnimated.current) {
            // Solo resetear si sale completamente por abajo Y estamos haciendo scroll hacia arriba
            if (isBelowViewport && !scrollingDown) {
              hasBeenAnimated.current = false;
              setIsVisible(false);
            } else {
              // En todos los demás casos, mantener visible
              setIsVisible(true);
            }
            return;
          }

          // Solo animar si:
          // 1. Entra en viewport
          // 2. Estamos haciendo scroll hacia abajo
          // 3. El elemento está entrando desde arriba
          // 4. No ha sido animado todavía
          if (
            entry.isIntersecting &&
            scrollingDown &&
            rect.top < window.innerHeight * 0.8 &&
            !hasBeenAnimated.current
          ) {
            if (timeoutRef.current) {
              clearTimeout(timeoutRef.current);
            }
            timeoutRef.current = setTimeout(() => {
              setIsVisible(true);
              hasBeenAnimated.current = true;
            }, delay);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -20% 0px',
      }
    );

    observer.observe(element);
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [delay]);

  return (
    <div
      ref={elementRef}
      className={`transition-all duration-700 ease-out ${
        isVisible
          ? 'opacity-100 translate-y-0'
          : 'opacity-0 translate-y-8'
      } ${className}`}
      style={{
        willChange: isVisible ? 'auto' : 'transform, opacity',
      }}
    >
      {children}
    </div>
  );
}

