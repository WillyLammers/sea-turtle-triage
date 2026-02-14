import React, { useCallback, useEffect, useRef, useState } from 'react';
import styles from './Stage1.module.css';

interface FlashlightProps {
  active: boolean;
  onFoundNest: () => void;
  nestPosition: { x: number; y: number };
}

const BEAM_RADIUS = 100;
const FIND_DISTANCE = 70;
const NEAR_DISTANCE = 150; // distance at which "warm" proximity effect starts
const FIND_DELAY = 1200; // ms of hovering over nest before triggering

export function Flashlight({ active, onFoundNest, nestPosition }: FlashlightProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  // Smoothed cursor position (with slight lag)
  const [pos, setPos] = useState({ x: 50, y: 50 }); // percentages
  const targetPos = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 }); // pixels
  const currentPos = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 }); // pixels
  const animFrame = useRef<number>(0);
  const hoverTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const hoverStart = useRef<number>(0);
  const [found, setFound] = useState(false);
  const [isNearNest, setIsNearNest] = useState(false);
  const [hoverProgress, setHoverProgress] = useState(0); // 0..1 progress ring
  // Don't check for nest proximity until the user has actually moved their cursor
  const hasMoved = useRef(false);

  // Smoothly interpolate cursor position for lag effect
  const animate = useCallback(() => {
    const lerp = 0.12;
    currentPos.current.x += (targetPos.current.x - currentPos.current.x) * lerp;
    currentPos.current.y += (targetPos.current.y - currentPos.current.y) * lerp;

    const pctX = (currentPos.current.x / window.innerWidth) * 100;
    const pctY = (currentPos.current.y / window.innerHeight) * 100;
    setPos({ x: pctX, y: pctY });

    animFrame.current = requestAnimationFrame(animate);
  }, []);

  useEffect(() => {
    if (!active) return;
    animFrame.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animFrame.current);
  }, [active, animate]);

  // Check if flashlight overlaps the nest marker
  useEffect(() => {
    if (!active || found || !hasMoved.current) return;

    const nestPx = {
      x: (nestPosition.x / 100) * window.innerWidth,
      y: (nestPosition.y / 100) * window.innerHeight,
    };

    const dx = currentPos.current.x - nestPx.x;
    const dy = currentPos.current.y - nestPx.y;
    const dist = Math.sqrt(dx * dx + dy * dy);

    // Proximity warmth effect
    setIsNearNest(dist < NEAR_DISTANCE);

    if (dist < FIND_DISTANCE) {
      if (!hoverTimer.current) {
        hoverStart.current = Date.now();
        hoverTimer.current = setTimeout(() => {
          setHoverProgress(1);
          setFound(true);
          onFoundNest();
        }, FIND_DELAY);
      }
      // Update progress ring
      const elapsed = Date.now() - hoverStart.current;
      setHoverProgress(Math.min(elapsed / FIND_DELAY, 1));
    } else {
      if (hoverTimer.current) {
        clearTimeout(hoverTimer.current);
        hoverTimer.current = null;
        hoverStart.current = 0;
      }
      setHoverProgress(0);
    }
  });

  // Mouse/touch handlers
  const handlePointerMove = useCallback(
    (e: React.PointerEvent | React.TouchEvent) => {
      if (!active) return;
      let clientX: number, clientY: number;
      if ('touches' in e) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
      } else {
        clientX = (e as React.PointerEvent).clientX;
        clientY = (e as React.PointerEvent).clientY;
      }
      targetPos.current = { x: clientX, y: clientY };
      hasMoved.current = true;
    },
    [active],
  );

  if (!active) return null;

  // SVG progress ring: circle circumference for a 30px radius
  const ringRadius = 30;
  const ringCircumference = 2 * Math.PI * ringRadius;
  const ringOffset = ringCircumference * (1 - hoverProgress);

  return (
    <div
      ref={overlayRef}
      className={styles.flashlightOverlay}
      onPointerMove={handlePointerMove}
      onTouchMove={handlePointerMove}
    >
      {/* Dark overlay with flashlight cutout via radial gradient */}
      <div
        className={styles.flashlightDark}
        style={{
          background: `radial-gradient(circle ${BEAM_RADIUS}px at ${pos.x}% ${pos.y}%, transparent 0%, transparent 60%, rgba(0,0,0,0.7) 80%, rgba(0,0,0,0.95) 100%)`,
        }}
      />

      {/* Nest marker: multi-layered glow */}
      <div
        className={`${styles.nestMarker} ${styles.nestMarkerGlow} ${isNearNest ? styles.nestMarkerNear : ''} ${found ? styles.nestMarkerFound : ''}`}
        style={{
          left: `${nestPosition.x}%`,
          top: `${nestPosition.y}%`,
        }}
      />

      {/* Outer ripple ring */}
      {!found && (
        <div
          className={`${styles.nestMarkerRipple} ${isNearNest ? styles.nestMarkerRippleNear : ''}`}
          style={{
            left: `${nestPosition.x}%`,
            top: `${nestPosition.y}%`,
          }}
        />
      )}

      {/* Progress ring SVG when hovering over nest */}
      {hoverProgress > 0 && !found && (
        <svg
          className={styles.nestProgressRing}
          style={{
            left: `${nestPosition.x}%`,
            top: `${nestPosition.y}%`,
          }}
          width="68"
          height="68"
          viewBox="0 0 68 68"
        >
          {/* Track */}
          <circle cx="34" cy="34" r={ringRadius} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="4" />
          {/* Progress */}
          <circle
            cx="34"
            cy="34"
            r={ringRadius}
            fill="none"
            stroke="#ffd93d"
            strokeWidth="4"
            strokeLinecap="round"
            strokeDasharray={ringCircumference}
            strokeDashoffset={ringOffset}
            transform="rotate(-90, 34, 34)"
            style={{ transition: 'stroke-dashoffset 0.1s linear' }}
          />
        </svg>
      )}

      {/* Hint text */}
      {!found && (
        <div className={styles.flashlightHint}>
          Move your flashlight to find the nest on the beach
        </div>
      )}

      {/* Found feedback — dramatic reveal */}
      {found && (
        <>
          <div
            className={styles.flashlightRevealBurst}
            style={{
              left: `${nestPosition.x}%`,
              top: `${nestPosition.y}%`,
            }}
          />
          <div className={styles.flashlightFound}>
            Nest Found!
          </div>
        </>
      )}
    </div>
  );
}
