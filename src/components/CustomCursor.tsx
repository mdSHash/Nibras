import React, { useEffect, useRef, useState, useCallback } from "react";
import { useCanHover } from "../hooks/useMatchMedia";

/**
 * CustomCursor - A JavaScript-based cursor follower with Islamic-inspired design.
 * Renders an 8-pointed star (Rub el Hizb) that follows the mouse with smooth interpolation.
 * Works everywhere including over Leaflet maps since it uses pointer-events: none.
 * Only renders on devices with hover capability (desktop with mouse).
 */
export default function CustomCursor() {
  const canHover = useCanHover();
  if (!canHover) return null;
  return <CustomCursorImpl />;
}

function CustomCursorImpl() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const trail1Ref = useRef<HTMLDivElement>(null);
  const trail2Ref = useRef<HTMLDivElement>(null);
  const trail3Ref = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: -100, y: -100 });
  const targetRef = useRef({ x: -100, y: -100 });
  const trail1PosRef = useRef({ x: -100, y: -100 });
  const trail2PosRef = useRef({ x: -100, y: -100 });
  const trail3PosRef = useRef({ x: -100, y: -100 });
  const rafRef = useRef<number>(0);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const lerp = (start: number, end: number, factor: number) =>
    start + (end - start) * factor;

  const animate = useCallback(() => {
    // Smooth interpolation for main cursor
    posRef.current.x = lerp(posRef.current.x, targetRef.current.x, 0.15);
    posRef.current.y = lerp(posRef.current.y, targetRef.current.y, 0.15);

    // Trail follows with increasing delay
    trail1PosRef.current.x = lerp(trail1PosRef.current.x, posRef.current.x, 0.1);
    trail1PosRef.current.y = lerp(trail1PosRef.current.y, posRef.current.y, 0.1);

    trail2PosRef.current.x = lerp(trail2PosRef.current.x, trail1PosRef.current.x, 0.08);
    trail2PosRef.current.y = lerp(trail2PosRef.current.y, trail1PosRef.current.y, 0.08);

    trail3PosRef.current.x = lerp(trail3PosRef.current.x, trail2PosRef.current.x, 0.06);
    trail3PosRef.current.y = lerp(trail3PosRef.current.y, trail2PosRef.current.y, 0.06);

    // Apply transforms
    if (cursorRef.current) {
      cursorRef.current.style.transform = `translate(${posRef.current.x}px, ${posRef.current.y}px) translate(-50%, -50%)`;
    }
    if (trail1Ref.current) {
      trail1Ref.current.style.transform = `translate(${trail1PosRef.current.x}px, ${trail1PosRef.current.y}px) translate(-50%, -50%)`;
    }
    if (trail2Ref.current) {
      trail2Ref.current.style.transform = `translate(${trail2PosRef.current.x}px, ${trail2PosRef.current.y}px) translate(-50%, -50%)`;
    }
    if (trail3Ref.current) {
      trail3Ref.current.style.transform = `translate(${trail3PosRef.current.x}px, ${trail3PosRef.current.y}px) translate(-50%, -50%)`;
    }

    rafRef.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    // Only show on devices with hover capability
    const hasHover = window.matchMedia("(hover: hover)").matches;
    if (!hasHover) return;

    setIsVisible(true);

    // Hide native cursor only AFTER custom cursor is mounted and tracking
    document.documentElement.classList.add("custom-cursor-active");

    const handleMouseMove = (e: MouseEvent) => {
      targetRef.current.x = e.clientX;
      targetRef.current.y = e.clientY;
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isInteractive =
        target.closest("button") ||
        target.closest("a") ||
        target.closest("[role='button']") ||
        target.closest("input") ||
        target.closest("textarea") ||
        target.closest("select") ||
        target.closest("[data-clickable]") ||
        target.closest(".cursor-pointer") ||
        (target.style && target.style.cursor === "pointer") ||
        window.getComputedStyle(target).cursor === "pointer";
      setIsHovering(!!isInteractive);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mousedown", handleMouseDown);
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mouseover", handleMouseOver);

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      document.documentElement.classList.remove("custom-cursor-active");
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mousedown", handleMouseDown);
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mouseover", handleMouseOver);
      cancelAnimationFrame(rafRef.current);
    };
  }, [animate]);

  if (!isVisible) return null;

  return (
    <div aria-hidden="true" className="custom-cursor-container">
      {/* Trail dot 3 (smallest, most delayed) */}
      <div
        ref={trail3Ref}
        className="fixed top-0 left-0 pointer-events-none"
        style={{
          zIndex: 9996,
          width: "3px",
          height: "3px",
          borderRadius: "50%",
          backgroundColor: "rgba(212, 168, 83, 0.2)",
          border: "1px solid rgba(0, 0, 0, 0.3)",
          willChange: "transform",
        }}
      />
      {/* Trail dot 2 */}
      <div
        ref={trail2Ref}
        className="fixed top-0 left-0 pointer-events-none"
        style={{
          zIndex: 9997,
          width: "4px",
          height: "4px",
          borderRadius: "50%",
          backgroundColor: "rgba(212, 168, 83, 0.4)",
          border: "1px solid rgba(0, 0, 0, 0.4)",
          willChange: "transform",
        }}
      />
      {/* Trail dot 1 (closest to cursor) */}
      <div
        ref={trail1Ref}
        className="fixed top-0 left-0 pointer-events-none"
        style={{
          zIndex: 9998,
          width: "6px",
          height: "6px",
          borderRadius: "50%",
          backgroundColor: "rgba(212, 168, 83, 0.6)",
          border: "1px solid rgba(0, 0, 0, 0.5)",
          willChange: "transform",
        }}
      />
      {/* Main cursor - 8-pointed Islamic star */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none"
        style={{
          zIndex: 9999,
          willChange: "transform",
          transition: "width 0.2s, height 0.2s, opacity 0.2s",
        }}
      >
        <div
          className="cursor-glow-pulse"
          style={{
            width: isHovering ? "28px" : "16px",
            height: isHovering ? "28px" : "16px",
            transition: "width 0.2s ease, height 0.2s ease, box-shadow 0.2s ease, transform 0.15s ease",
            // 45° rotation gives the 8-pointed star a windmill orientation
            // (points facing the cardinal directions instead of diagonals).
            // The hover state stays unrotated so the circle reads cleanly.
            transform: isHovering
              ? (isClicking ? "scale(0.75)" : "scale(1)")
              : (isClicking ? "rotate(45deg) scale(0.75)" : "rotate(45deg) scale(1)"),
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: isHovering ? "50%" : "0",
            border: isHovering ? "2px solid #D4A853" : "none",
            outline: isHovering ? "2px solid rgba(0, 0, 0, 0.6)" : "none",
            outlineOffset: "0px",
            boxShadow: isHovering
              ? "0 0 12px rgba(212, 168, 83, 0.8), inset 0 0 6px rgba(212, 168, 83, 0.3), 0 0 2px rgba(0,0,0,0.8)"
              : "0 0 8px rgba(212, 168, 83, 0.6)",
          }}
        >
          {!isHovering && (
            <svg
              width="16"
              height="16"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ filter: "drop-shadow(0 0 2px rgba(0,0,0,0.8)) drop-shadow(0 0 1px rgba(0,0,0,0.5)) drop-shadow(0 0 4px rgba(212, 168, 83, 0.6))" }}
            >
              {/* 8-pointed star (Rub el Hizb) */}
              <path
                d="M16 0 L19.5 12.5 L32 16 L19.5 19.5 L16 32 L12.5 19.5 L0 16 L12.5 12.5 Z"
                fill="#D4A853"
                stroke="#1a1a2e"
                strokeWidth="2"
              />
              <path
                d="M16 4 L20 12 L28 16 L20 20 L16 28 L12 20 L4 16 L12 12 Z"
                fill="#E8C872"
                opacity="0.6"
              />
            </svg>
          )}
        </div>
      </div>
    </div>
  );
}
