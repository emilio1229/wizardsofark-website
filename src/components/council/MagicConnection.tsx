import { motion } from 'framer-motion';
import { alpha } from '@mui/material/styles';

type Point = { x: number; y: number };

type MagicConnectionProps = {
  from: Point;
  to: Point;
  colour: string;
  preview?: boolean;
  reducedMotion?: boolean;
  viewBoxSize: number;
};

export function MagicConnection({
  from,
  to,
  colour,
  preview = false,
  reducedMotion = false,
  viewBoxSize,
}: MagicConnectionProps): JSX.Element {
  const midX = (from.x + to.x) / 2;
  const midY = (from.y + to.y) / 2;
  // Slight curve for a more magical arc
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const ctrlX = midX - dy * 0.12;
  const ctrlY = midY + dx * 0.12;
  const path = `M ${from.x} ${from.y} Q ${ctrlX} ${ctrlY} ${to.x} ${to.y}`;

  const duration = reducedMotion ? 0 : preview ? 0.22 : 0.55;
  const opacity = preview ? 0.35 : 0.95;

  return (
    <svg
      width="100%"
      height="100%"
      viewBox={`0 0 ${viewBoxSize} ${viewBoxSize}`}
      style={{ position: 'absolute', inset: 0, overflow: 'visible', pointerEvents: 'none' }}
      aria-hidden
    >
      <defs>
        <filter id={`woa-beam-glow-${preview ? 'preview' : 'active'}`} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation={preview ? 2 : 3.5} result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Base line */}
      <motion.path
        d={path}
        fill="none"
        stroke={alpha(colour, preview ? 0.25 : 0.35)}
        strokeWidth={preview ? 1.5 : 2.5}
        strokeLinecap="round"
        initial={reducedMotion ? false : { pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity }}
        transition={{ duration, ease: 'easeOut' }}
      />

      {/* Bright energy highlight */}
      {!preview ? (
        <motion.path
          d={path}
          fill="none"
          stroke={colour}
          strokeWidth={2}
          strokeLinecap="round"
          strokeDasharray="10 16"
          filter={`url(#woa-beam-glow-active)`}
          initial={reducedMotion ? false : { pathLength: 0, opacity: 0 }}
          animate={{
            pathLength: 1,
            opacity: 1,
            strokeDashoffset: reducedMotion ? 0 : [0, -52],
          }}
          transition={{
            pathLength: { duration, ease: 'easeOut' },
            opacity: { duration: duration * 0.6 },
            strokeDashoffset: reducedMotion
              ? { duration: 0 }
              : { duration: 1.4, repeat: Infinity, ease: 'linear' },
          }}
          style={{ filter: `drop-shadow(0 0 6px ${colour})` }}
        />
      ) : null}

      {/* Endpoint pulse */}
      <motion.circle
        cx={to.x}
        cy={to.y}
        r={preview ? 4 : 7}
        fill={alpha(colour, preview ? 0.35 : 0.55)}
        initial={reducedMotion ? false : { scale: 0.4, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: duration * 0.8, delay: reducedMotion ? 0 : duration * 0.45 }}
      />
      {!preview ? (
        <motion.circle
          cx={to.x}
          cy={to.y}
          r={12}
          fill="none"
          stroke={colour}
          strokeWidth={1.5}
          initial={reducedMotion ? false : { scale: 0.5, opacity: 0.8 }}
          animate={{ scale: 1.4, opacity: 0 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
        />
      ) : null}
    </svg>
  );
}

export default MagicConnection;
