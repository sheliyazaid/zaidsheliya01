import { useEffect, useRef, useCallback } from "react";

// Pure RAF-based cursor — zero lag, GPU-accelerated, buttery smooth
export default function CursorFollower() {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: -100, y: -100 });
  const outer = useRef({ x: -100, y: -100 });
  const inner = useRef({ x: -100, y: -100 });
  const trail = useRef({ x: -100, y: -100 });
  const isHovering = useRef(false);
  const isClicking = useRef(false);
  const raf = useRef<number>(0);

  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

  const animate = useCallback(() => {
    // Inner dot — fastest, barely any lag
    inner.current.x = lerp(inner.current.x, mouse.current.x, 0.35);
    inner.current.y = lerp(inner.current.y, mouse.current.y, 0.35);

    // Outer ring — smooth follow
    outer.current.x = lerp(outer.current.x, mouse.current.x, 0.12);
    outer.current.y = lerp(outer.current.y, mouse.current.y, 0.12);

    // Trail glow — slowest, creates depth
    trail.current.x = lerp(trail.current.x, mouse.current.x, 0.06);
    trail.current.y = lerp(trail.current.y, mouse.current.y, 0.06);

    const outerSize = isHovering.current ? 64 : isClicking.current ? 20 : 40;
    const innerSize = isHovering.current ? 8 : 5;
    const trailSize = isHovering.current ? 120 : 80;

    if (outerRef.current) {
      outerRef.current.style.transform = `translate3d(${outer.current.x - outerSize / 2}px, ${outer.current.y - outerSize / 2}px, 0)`;
      outerRef.current.style.width = `${outerSize}px`;
      outerRef.current.style.height = `${outerSize}px`;
      outerRef.current.style.opacity = isClicking.current ? "0.4" : "0.7";
    }

    if (innerRef.current) {
      innerRef.current.style.transform = `translate3d(${inner.current.x - innerSize / 2}px, ${inner.current.y - innerSize / 2}px, 0)`;
      innerRef.current.style.width = `${innerSize}px`;
      innerRef.current.style.height = `${innerSize}px`;
      innerRef.current.style.opacity = isClicking.current ? "0" : "1";
    }

    if (trailRef.current) {
      trailRef.current.style.transform = `translate3d(${trail.current.x - trailSize / 2}px, ${trail.current.y - trailSize / 2}px, 0)`;
      trailRef.current.style.width = `${trailSize}px`;
      trailRef.current.style.height = `${trailSize}px`;
      trailRef.current.style.opacity = isHovering.current ? "0.12" : "0.06";
    }

    raf.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
    };
    const onOver = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest("a, button, input, textarea, [role='button'], .magnetic-wrap")) {
        isHovering.current = true;
      }
    };
    const onOut = () => { isHovering.current = false; };
    const onDown = () => { isClicking.current = true; };
    const onUp = () => { isClicking.current = false; };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    window.addEventListener("mouseout", onOut, { passive: true });
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);

    raf.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("mouseout", onOut);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
    };
  }, [animate]);

  return (
    <>
      {/* Trail glow — atmospheric depth */}
      <div
        ref={trailRef}
        className="fixed top-0 left-0 z-[9997] pointer-events-none hidden md:block rounded-full will-change-transform"
        style={{
          background: "radial-gradient(circle, hsla(40 70% 50% / 0.15) 0%, hsla(40 70% 50% / 0.05) 40%, transparent 70%)",
          filter: "blur(2px)",
          transition: "width 0.4s, height 0.4s, opacity 0.4s",
        }}
      />
      {/* Outer ring */}
      <div
        ref={outerRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none mix-blend-difference hidden md:block rounded-full will-change-transform"
        style={{
          border: "1.5px solid hsl(0 0% 95%)",
          transition: "width 0.3s cubic-bezier(0.16,1,0.3,1), height 0.3s cubic-bezier(0.16,1,0.3,1), opacity 0.2s",
        }}
      />
      {/* Inner dot */}
      <div
        ref={innerRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none hidden md:block rounded-full bg-foreground will-change-transform"
        style={{
          transition: "width 0.2s, height 0.2s, opacity 0.15s",
        }}
      />
    </>
  );
}
