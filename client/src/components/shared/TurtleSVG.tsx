import React, { useId } from 'react';

type Species = 'Green' | 'Loggerhead' | 'Leatherback' | 'Hawksbill' | 'Kemps Ridley';

interface TurtleSVGProps {
  species: Species;
  size?: number;
  className?: string;
}

const PALETTES: Record<
  Species,
  {
    body: string;
    bodyDark: string;
    shell: string;
    shellDark: string;
    shellLight: string;
    shellHighlight: string;
    belly: string;
    eye: string;
    scute: string;
    scuteFill: string;
    skin: string;
    skinLight: string;
  }
> = {
  Green: {
    body: '#2d7f4e',
    bodyDark: '#1a5a35',
    shell: '#3a9e63',
    shellDark: '#2a7a48',
    shellLight: '#5aba80',
    shellHighlight: '#80d4a0',
    belly: '#8fd4a8',
    eye: '#1a3d2a',
    scute: '#2a7a48',
    scuteFill: '#34905a',
    skin: '#358a52',
    skinLight: '#4aaa68',
  },
  Loggerhead: {
    body: '#b87333',
    bodyDark: '#8a5520',
    shell: '#cd853f',
    shellDark: '#a06828',
    shellLight: '#daa060',
    shellHighlight: '#e8c088',
    belly: '#e8c99b',
    eye: '#5a3a1a',
    scute: '#a06828',
    scuteFill: '#ba7a35',
    skin: '#c08040',
    skinLight: '#d4a060',
  },
  Leatherback: {
    body: '#2f4f4f',
    bodyDark: '#1a3030',
    shell: '#3d6363',
    shellDark: '#2a4a4a',
    shellLight: '#508080',
    shellHighlight: '#6a9a9a',
    belly: '#7a9e9e',
    eye: '#1a2e2e',
    scute: '#2a4a4a',
    scuteFill: '#345858',
    skin: '#3a5858',
    skinLight: '#4a6e6e',
  },
  Hawksbill: {
    body: '#d2691e',
    bodyDark: '#a04a10',
    shell: '#daa520',
    shellDark: '#b08018',
    shellLight: '#e8c040',
    shellHighlight: '#f0d868',
    belly: '#f0d080',
    eye: '#6b350f',
    scute: '#b08018',
    scuteFill: '#c89420',
    skin: '#c87828',
    skinLight: '#da9038',
  },
  'Kemps Ridley': {
    body: '#708090',
    bodyDark: '#506070',
    shell: '#8fbc8f',
    shellDark: '#6a9a6a',
    shellLight: '#a8d4a8',
    shellHighlight: '#c0e8c0',
    belly: '#b8d4b8',
    eye: '#3a4550',
    scute: '#6a9a6a',
    scuteFill: '#7aaa7a',
    skin: '#7a9a80',
    skinLight: '#90b090',
  },
};

/* Shell size varies by species */
function shellSize(species: Species) {
  switch (species) {
    case 'Leatherback':
      return { rx: 62, ry: 44 }; // largest
    case 'Kemps Ridley':
      return { rx: 50, ry: 38 }; // smallest, rounder
    case 'Hawksbill':
      return { rx: 52, ry: 38 };
    default:
      return { rx: 56, ry: 40 };
  }
}

/* Head size varies by species — loggerheads have distinctively large heads */
function headSize(species: Species) {
  switch (species) {
    case 'Loggerhead':
      return { rx: 24, ry: 20 }; // noticeably larger
    case 'Hawksbill':
      return { rx: 17, ry: 14 }; // smaller, more pointed
    case 'Leatherback':
      return { rx: 20, ry: 17 };
    case 'Kemps Ridley':
      return { rx: 17, ry: 14 };
    default:
      return { rx: 20, ry: 16 };
  }
}

export function TurtleSVG({ species, size = 120, className }: TurtleSVGProps) {
  const p = PALETTES[species];
  const uid = useId().replace(/:/g, '');
  const sh = shellSize(species);
  const hd = headSize(species);
  const isLeatherback = species === 'Leatherback';
  const isHawksbill = species === 'Hawksbill';
  const isLoggerhead = species === 'Loggerhead';
  const isKemps = species === 'Kemps Ridley';

  // Shell center
  const cx = 96;
  const cy = 72;

  // Head x-position depends on shell size
  const headX = cx + sh.rx + hd.rx - 8;
  const headY = cy - 4;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 200 160"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* 3D shell dome gradient */}
        <radialGradient id={`shellGrad-${uid}`} cx="40%" cy="35%" r="60%">
          <stop offset="0%" stopColor={p.shellHighlight} stopOpacity="0.9" />
          <stop offset="35%" stopColor={p.shellLight} stopOpacity="0.8" />
          <stop offset="70%" stopColor={p.shell} />
          <stop offset="100%" stopColor={p.shellDark} />
        </radialGradient>
        {/* Shell rim shadow */}
        <radialGradient id={`shellRim-${uid}`} cx="50%" cy="50%" r="50%">
          <stop offset="70%" stopColor={p.shell} stopOpacity="0" />
          <stop offset="100%" stopColor={p.bodyDark} stopOpacity="0.4" />
        </radialGradient>
        {/* Skin gradient for head/flippers */}
        <radialGradient id={`skinGrad-${uid}`} cx="40%" cy="35%" r="65%">
          <stop offset="0%" stopColor={p.skinLight} />
          <stop offset="100%" stopColor={p.body} />
        </radialGradient>
      </defs>

      {/* ── TAIL ── */}
      <path
        d={`M${cx - sh.rx + 6},${cy + 2} Q${cx - sh.rx - 12},${cy - 2} ${cx - sh.rx - 20},${cy - 8} Q${cx - sh.rx - 14},${cy} ${cx - sh.rx + 6},${cy + 4}`}
        fill={p.body}
      />
      <path
        d={`M${cx - sh.rx + 6},${cy + 2} Q${cx - sh.rx - 10},${cy} ${cx - sh.rx - 16},${cy - 5}`}
        stroke={p.bodyDark}
        strokeWidth="0.8"
        fill="none"
        opacity="0.4"
      />

      {/* ── BACK FLIPPER (behind shell) ── */}
      <path
        d={`M${cx - sh.rx + 14},${cy + sh.ry - 8}
           Q${cx - sh.rx - 4},${cy + sh.ry + 14}
            ${cx - sh.rx - 14},${cy + sh.ry + 24}
           Q${cx - sh.rx - 6},${cy + sh.ry + 22}
            ${cx - sh.rx + 4},${cy + sh.ry + 14}
           Q${cx - sh.rx + 14},${cy + sh.ry + 4}
            ${cx - sh.rx + 18},${cy + sh.ry - 4}Z`}
        fill={p.body}
        stroke={p.bodyDark}
        strokeWidth="1"
      />
      {/* Back flipper texture */}
      <line
        x1={cx - sh.rx + 10} y1={cy + sh.ry}
        x2={cx - sh.rx - 6} y2={cy + sh.ry + 18}
        stroke={p.belly} strokeWidth="0.8" opacity="0.4"
      />
      <line
        x1={cx - sh.rx + 6} y1={cy + sh.ry + 2}
        x2={cx - sh.rx - 10} y2={cy + sh.ry + 20}
        stroke={p.belly} strokeWidth="0.8" opacity="0.3"
      />

      {/* ── BELLY visible below shell (between flippers) ── */}
      <ellipse cx={cx} cy={cy + sh.ry - 6} rx={sh.rx - 8} ry="12" fill={p.belly} opacity="0.65" />
      {/* Belly plastron lines */}
      <line x1={cx - 20} y1={cy + sh.ry - 6} x2={cx + 30} y2={cy + sh.ry - 6} stroke={p.body} strokeWidth="0.6" opacity="0.2" />
      <line x1={cx - 15} y1={cy + sh.ry - 1} x2={cx + 25} y2={cy + sh.ry - 1} stroke={p.body} strokeWidth="0.5" opacity="0.15" />

      {/* ── SHELL (carapace) — 3D dome ── */}
      {/* Shell shadow on ground */}
      <ellipse cx={cx + 2} cy={cy + sh.ry + 2} rx={sh.rx - 4} ry="6" fill="#000" opacity="0.08" />

      {/* Main shell dome with gradient */}
      <ellipse cx={cx} cy={cy} rx={sh.rx} ry={sh.ry} fill={`url(#shellGrad-${uid})`} />

      {/* Shell rim shadow overlay */}
      <ellipse cx={cx} cy={cy} rx={sh.rx} ry={sh.ry} fill={`url(#shellRim-${uid})`} />

      {/* Shell outline */}
      <ellipse
        cx={cx} cy={cy} rx={sh.rx} ry={sh.ry}
        fill="none" stroke={p.bodyDark} strokeWidth="2.5"
      />

      {/* ── SHELL PATTERNS (species-specific) ── */}
      {isHawksbill ? (
        /* Hawksbill: overlapping imbricate scutes — their defining feature */
        <>
          {/* Row 1 */}
          <path d="M72,50 Q86,40 100,50 Q86,60 72,50Z" fill={p.scuteFill} opacity="0.35" stroke={p.scute} strokeWidth="1.2" />
          <path d="M100,50 Q114,40 128,50 Q114,60 100,50Z" fill={p.scuteFill} opacity="0.35" stroke={p.scute} strokeWidth="1.2" />
          {/* Row 2 */}
          <path d="M64,65 Q82,54 100,65 Q82,76 64,65Z" fill={p.scuteFill} opacity="0.3" stroke={p.scute} strokeWidth="1.2" />
          <path d="M100,65 Q118,54 136,65 Q118,76 100,65Z" fill={p.scuteFill} opacity="0.3" stroke={p.scute} strokeWidth="1.2" />
          {/* Row 3 */}
          <path d="M70,80 Q85,71 100,80 Q85,89 70,80Z" fill={p.scuteFill} opacity="0.25" stroke={p.scute} strokeWidth="1" />
          <path d="M100,80 Q115,71 130,80 Q115,89 100,80Z" fill={p.scuteFill} opacity="0.25" stroke={p.scute} strokeWidth="1" />
          {/* Row 4 (smaller, toward tail) */}
          <path d="M78,92 Q89,86 100,92 Q89,98 78,92Z" fill={p.scuteFill} opacity="0.2" stroke={p.scute} strokeWidth="0.8" />
          <path d="M100,92 Q111,86 122,92 Q111,98 100,92Z" fill={p.scuteFill} opacity="0.2" stroke={p.scute} strokeWidth="0.8" />
          {/* Amber/tortoiseshell color streaks */}
          <path d="M80,48 Q90,55 85,62" stroke="#e8a020" strokeWidth="2" fill="none" opacity="0.2" />
          <path d="M110,45 Q120,52 115,60" stroke="#d08818" strokeWidth="2" fill="none" opacity="0.15" />
          <path d="M75,72 Q82,78 78,85" stroke="#e8a020" strokeWidth="1.5" fill="none" opacity="0.15" />
        </>
      ) : isLeatherback ? (
        /* Leatherback: smooth rubbery shell with 7 longitudinal ridges — NO scutes */
        <>
          {/* Ridges — the key identifying feature */}
          {[-24, -14, -5, 0, 5, 14, 24].map((offset, i) => (
            <path
              key={`ridge-${i}`}
              d={`M${cx + offset},${cy - sh.ry + 4} Q${cx + offset + 1},${cy} ${cx + offset},${cy + sh.ry - 4}`}
              stroke={p.bodyDark}
              strokeWidth={i === 3 ? '3' : '2.2'}
              fill="none"
              opacity={i === 3 ? 0.55 : 0.4}
              strokeLinecap="round"
            />
          ))}
          {/* Ridge highlights (light catching the ridges) */}
          {[-14, -5, 5, 14].map((offset, i) => (
            <path
              key={`rhl-${i}`}
              d={`M${cx + offset - 1},${cy - sh.ry + 10} Q${cx + offset},${cy - 5} ${cx + offset - 1},${cy + sh.ry - 12}`}
              stroke={p.shellHighlight}
              strokeWidth="1"
              fill="none"
              opacity="0.2"
              strokeLinecap="round"
            />
          ))}
          {/* White/pink spot pattern — characteristic of leatherbacks */}
          {[
            { x: -30, y: -18 }, { x: 18, y: -22 }, { x: -20, y: 8 },
            { x: 28, y: 5 }, { x: -8, y: 20 }, { x: 10, y: -12 },
            { x: -35, y: -4 }, { x: 35, y: -10 }, { x: 0, y: 25 },
            { x: -14, y: -28 }, { x: 22, y: 18 },
          ].map((spot, i) => (
            <circle
              key={`spot-${i}`}
              cx={cx + spot.x} cy={cy + spot.y}
              r={1 + (i % 3) * 0.5}
              fill="#c0d8d8"
              opacity={0.3 + (i % 2) * 0.15}
            />
          ))}
          {/* Leathery texture — subtle wrinkle lines */}
          <path d={`M${cx - 32},${cy - 10} Q${cx - 20},${cy - 14} ${cx - 10},${cy - 10}`}
            stroke={p.bodyDark} strokeWidth="0.6" fill="none" opacity="0.2" />
          <path d={`M${cx + 10},${cy + 8} Q${cx + 22},${cy + 4} ${cx + 32},${cy + 8}`}
            stroke={p.bodyDark} strokeWidth="0.6" fill="none" opacity="0.2" />
        </>
      ) : (
        /* Standard scute pattern — Green, Loggerhead, Kemps Ridley */
        <>
          {/* ── Vertebral (central) scutes — filled hexagons ── */}
          <path
            d="M88,44 L100,38 L112,44 L112,56 L100,62 L88,56Z"
            fill={p.scuteFill} opacity="0.25"
            stroke={p.scute} strokeWidth="1.3"
          />
          <path
            d="M88,60 L100,54 L112,60 L112,72 L100,78 L88,72Z"
            fill={p.scuteFill} opacity="0.22"
            stroke={p.scute} strokeWidth="1.3"
          />
          <path
            d="M88,76 L100,70 L112,76 L112,88 L100,94 L88,88Z"
            fill={p.scuteFill} opacity="0.18"
            stroke={p.scute} strokeWidth="1.2"
          />
          {/* Small nuchal scute at top center */}
          <path
            d="M94,36 L100,32 L106,36 L106,40 L100,43 L94,40Z"
            fill={p.scuteFill} opacity="0.2"
            stroke={p.scute} strokeWidth="0.8"
          />

          {/* ── Costal (lateral) scutes — filled leaf shapes ── */}
          {/* Left */}
          <path d="M56,50 Q72,42 88,50 Q72,62 56,56Z" fill={p.scuteFill} opacity="0.2" stroke={p.scute} strokeWidth="1.2" />
          <path d="M52,68 Q70,60 88,68 Q70,80 52,74Z" fill={p.scuteFill} opacity="0.18" stroke={p.scute} strokeWidth="1.2" />
          <path d="M56,86 Q72,78 88,86 Q72,96 56,92Z" fill={p.scuteFill} opacity="0.15" stroke={p.scute} strokeWidth="1" />
          {/* Right */}
          <path d="M112,50 Q128,42 144,50 Q128,62 112,56Z" fill={p.scuteFill} opacity="0.2" stroke={p.scute} strokeWidth="1.2" />
          <path d="M112,68 Q130,60 148,68 Q130,80 112,74Z" fill={p.scuteFill} opacity="0.18" stroke={p.scute} strokeWidth="1.2" />
          <path d="M112,86 Q128,78 144,86 Q128,96 112,92Z" fill={p.scuteFill} opacity="0.15" stroke={p.scute} strokeWidth="1" />

          {/* ── Marginal scutes (small edge plates) ── */}
          {[-32, -20, -8, 8, 20, 32].map((yOff, i) => (
            <g key={`marg-${i}`}>
              <ellipse cx={cx - sh.rx + 3} cy={cy + yOff} rx="5" ry="4"
                fill={p.scuteFill} opacity="0.12" stroke={p.scute} strokeWidth="0.6" />
              <ellipse cx={cx + sh.rx - 3} cy={cy + yOff} rx="5" ry="4"
                fill={p.scuteFill} opacity="0.12" stroke={p.scute} strokeWidth="0.6" />
            </g>
          ))}
        </>
      )}

      {/* ── Shell dome highlight (light reflection) ── */}
      <ellipse
        cx={cx - 10} cy={cy - sh.ry * 0.35}
        rx={sh.rx * 0.35} ry={sh.ry * 0.25}
        fill={p.shellHighlight} opacity="0.2"
      />
      {/* Secondary smaller highlight */}
      <ellipse
        cx={cx - 16} cy={cy - sh.ry * 0.45}
        rx={sh.rx * 0.15} ry={sh.ry * 0.12}
        fill="white" opacity="0.1"
      />

      {/* ── NECK (connecting head to shell) ── */}
      <ellipse cx={headX - hd.rx + 4} cy={headY + 2} rx={hd.rx * 0.6} ry={hd.ry * 0.7}
        fill={p.body} />
      {/* Neck skin folds */}
      <path
        d={`M${headX - hd.rx * 0.8},${headY - 4} Q${headX - hd.rx * 0.5},${headY - 2} ${headX - hd.rx * 0.3},${headY - 4}`}
        stroke={p.bodyDark} strokeWidth="0.6" fill="none" opacity="0.3"
      />

      {/* ── HEAD ── */}
      <ellipse cx={headX} cy={headY} rx={hd.rx} ry={hd.ry} fill={`url(#skinGrad-${uid})`}
        stroke={p.bodyDark} strokeWidth="1.5" />

      {/* Head scale plates — prefrontal scales */}
      <path
        d={`M${headX - hd.rx * 0.3},${headY - hd.ry * 0.6}
           Q${headX},${headY - hd.ry * 0.8}
            ${headX + hd.rx * 0.3},${headY - hd.ry * 0.6}`}
        stroke={p.bodyDark} strokeWidth="0.8" fill="none" opacity="0.35"
      />
      <path
        d={`M${headX - hd.rx * 0.5},${headY - hd.ry * 0.3}
           Q${headX - hd.rx * 0.1},${headY - hd.ry * 0.55}
            ${headX + hd.rx * 0.3},${headY - hd.ry * 0.35}`}
        stroke={p.bodyDark} strokeWidth="0.6" fill="none" opacity="0.25"
      />

      {/* ── SNOUT / BEAK — species-specific ── */}
      {isHawksbill ? (
        /* Hawksbill: sharp, pointed, raptor-like beak */
        <>
          <path
            d={`M${headX + hd.rx - 2},${headY - 4}
               Q${headX + hd.rx + 10},${headY - 3}
                ${headX + hd.rx + 16},${headY}
               Q${headX + hd.rx + 10},${headY + 3}
                ${headX + hd.rx - 2},${headY + 4}`}
            fill={p.body} stroke={p.bodyDark} strokeWidth="1"
          />
          {/* Beak tip — darker, hooked */}
          <path
            d={`M${headX + hd.rx + 12},${headY - 1}
               Q${headX + hd.rx + 16},${headY}
                ${headX + hd.rx + 14},${headY + 2}`}
            fill={p.bodyDark} opacity="0.6"
          />
          {/* Upper jaw line */}
          <path
            d={`M${headX + hd.rx + 2},${headY} L${headX + hd.rx + 14},${headY + 0.5}`}
            stroke={p.eye} strokeWidth="1" opacity="0.4"
          />
        </>
      ) : isLoggerhead ? (
        /* Loggerhead: broad, powerful crushing jaw */
        <>
          <ellipse cx={headX + hd.rx - 2} cy={headY} rx={hd.rx * 0.55} ry={hd.ry * 0.7}
            fill={p.body} stroke={p.bodyDark} strokeWidth="1" />
          {/* Strong jaw lines */}
          <path
            d={`M${headX + hd.rx + 4},${headY + 3}
               Q${headX + hd.rx + 8},${headY + 5}
                ${headX + hd.rx + 4},${headY + 6}`}
            stroke={p.eye} strokeWidth="1.5" fill="none" opacity="0.5"
          />
          {/* Broad snout top */}
          <ellipse cx={headX + hd.rx + 2} cy={headY - 2} rx={4} ry={3}
            fill={p.skinLight} opacity="0.3" />
        </>
      ) : (
        /* Green / Leatherback / Kemps: rounded snout */
        <>
          <ellipse cx={headX + hd.rx - 4} cy={headY} rx={hd.rx * 0.45} ry={hd.ry * 0.65}
            fill={p.body} stroke={p.bodyDark} strokeWidth="0.8" />
          {/* Mouth line */}
          <path
            d={`M${headX + hd.rx},${headY + 2}
               Q${headX + hd.rx + 4},${headY + 4}
                ${headX + hd.rx + 2},${headY + 2}`}
            stroke={p.eye} strokeWidth="1.2" fill="none" opacity="0.4"
          />
          {isKemps && (
            /* Kemps: slight hooked beak */
            <path
              d={`M${headX + hd.rx + 1},${headY - 2}
                 Q${headX + hd.rx + 4},${headY - 1}
                  ${headX + hd.rx + 3},${headY + 1}`}
              fill={p.bodyDark} opacity="0.35"
            />
          )}
        </>
      )}

      {/* ── NOSTRILS ── */}
      <circle cx={headX + hd.rx - 1} cy={headY - hd.ry * 0.25} r="1.3" fill={p.eye} opacity="0.55" />

      {/* ── EYE — detailed with eyelid ── */}
      {/* Eye socket shadow */}
      <ellipse cx={headX + 2} cy={headY - hd.ry * 0.25} rx="7" ry="7.5"
        fill={p.bodyDark} opacity="0.15" />
      {/* Sclera (white) */}
      <ellipse cx={headX + 2} cy={headY - hd.ry * 0.25} rx="5.5" ry="6" fill="white" />
      {/* Iris */}
      <ellipse cx={headX + 3.5} cy={headY - hd.ry * 0.3} rx="3.5" ry="4" fill={p.eye} />
      {/* Pupil */}
      <ellipse cx={headX + 4} cy={headY - hd.ry * 0.3} rx="2" ry="2.5" fill="#0a0a0a" />
      {/* Eye highlight */}
      <circle cx={headX + 5} cy={headY - hd.ry * 0.4} r="1.4" fill="white" opacity="0.85" />
      {/* Upper eyelid */}
      <path
        d={`M${headX - 3},${headY - hd.ry * 0.25}
           Q${headX + 2},${headY - hd.ry * 0.6}
            ${headX + 7},${headY - hd.ry * 0.25}`}
        stroke={p.bodyDark} strokeWidth="1.5" fill="none" opacity="0.4"
      />

      {/* ── Cheek area ── */}
      <ellipse cx={headX - 2} cy={headY + hd.ry * 0.35} rx="5" ry="3.5"
        fill="#e8a0a0" opacity="0.15" />

      {/* ── FRONT FLIPPER — large, paddle-shaped ── */}
      <path
        d={`M${cx + sh.rx - 16},${cy + sh.ry - 8}
           Q${cx + sh.rx + 10},${cy + sh.ry + 10}
            ${cx + sh.rx + 28},${cy + sh.ry + 28}
           Q${cx + sh.rx + 24},${cy + sh.ry + 32}
            ${cx + sh.rx + 14},${cy + sh.ry + 26}
           Q${cx + sh.rx},${cy + sh.ry + 16}
            ${cx + sh.rx - 16},${cy + sh.ry}Z`}
        fill={p.body}
        stroke={p.bodyDark}
        strokeWidth="1.5"
      />
      {/* Flipper gradient overlay — lighter on top */}
      <path
        d={`M${cx + sh.rx - 12},${cy + sh.ry - 4}
           Q${cx + sh.rx + 8},${cy + sh.ry + 8}
            ${cx + sh.rx + 20},${cy + sh.ry + 22}`}
        stroke={p.skinLight} strokeWidth="3" fill="none" opacity="0.25" strokeLinecap="round"
      />
      {/* Flipper texture ridges */}
      <line
        x1={cx + sh.rx - 8} y1={cy + sh.ry}
        x2={cx + sh.rx + 18} y2={cy + sh.ry + 24}
        stroke={p.belly} strokeWidth="0.8" opacity="0.35"
      />
      <line
        x1={cx + sh.rx - 12} y1={cy + sh.ry + 4}
        x2={cx + sh.rx + 12} y2={cy + sh.ry + 26}
        stroke={p.belly} strokeWidth="0.8" opacity="0.25"
      />
      {/* Flipper claw(s) */}
      {!isLeatherback && (
        <>
          <circle cx={cx + sh.rx + 27} cy={cy + sh.ry + 29} r="1.5"
            fill={p.bodyDark} opacity="0.5" />
          {(isHawksbill || isLoggerhead) && (
            <circle cx={cx + sh.rx + 24} cy={cy + sh.ry + 31} r="1.2"
              fill={p.bodyDark} opacity="0.4" />
          )}
        </>
      )}

      {/* ── Scale texture on skin (visible on head and flippers) ── */}
      {/* Tiny scale dots on neck */}
      {[
        { dx: -6, dy: -6 }, { dx: -2, dy: -8 }, { dx: 2, dy: -4 },
        { dx: -8, dy: -2 }, { dx: -4, dy: 4 }, { dx: -10, dy: 2 },
      ].map((s, i) => (
        <circle
          key={`scale-${i}`}
          cx={headX - hd.rx + s.dx} cy={headY + s.dy}
          r="0.8" fill={p.bodyDark} opacity="0.15"
        />
      ))}
    </svg>
  );
}
