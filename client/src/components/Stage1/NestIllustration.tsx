import React from 'react';
import type { NestType } from '../../data/nests';
import styles from './Stage1.module.css';

interface NestIllustrationProps {
  correctAnswer: NestType;
  nestIndex: number;
}

/**
 * Renders a detailed SVG illustration of a nest site on the beach sand.
 * Each nest type has rich, organic artwork that matches the field report clues.
 */
export function NestIllustration({ correctAnswer, nestIndex }: NestIllustrationProps) {
  const hash = ((nestIndex * 2654435761) >>> 0) / 4294967296;
  const nudge = -3 + hash * 6;

  return (
    <div className={styles.nestIllustration} style={{ marginLeft: `${nudge}%` }}>
      <svg viewBox="0 0 700 250" className={styles.nestSvg}>
        <defs>
          {/* Sand grain texture filter — fine, organic noise */}
          <filter id="sandGrain" x="-5%" y="-5%" width="110%" height="110%">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="5" seed="3" result="noise" />
            <feColorMatrix type="saturate" values="0" in="noise" result="grayNoise" />
            <feBlend in="SourceGraphic" in2="grayNoise" mode="multiply" />
          </filter>
          {/* Soft shadow for raised elements */}
          <filter id="softShadow">
            <feGaussianBlur in="SourceAlpha" stdDeviation="5" />
            <feOffset dx="0" dy="4" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.35" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {/* Inner depression shadow — for pits and cavities */}
          <filter id="depthShadow">
            <feGaussianBlur in="SourceAlpha" stdDeviation="6" />
            <feOffset dx="0" dy="2" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.45" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          {/* Subtle displacement for sandy textures */}
          <filter id="sandTexture" x="-2%" y="-2%" width="104%" height="104%">
            <feTurbulence type="fractalNoise" baseFrequency="1.2" numOctaves="3" seed="7" result="tex" />
            <feDisplacementMap in="SourceGraphic" in2="tex" scale="2" xChannelSelector="R" yChannelSelector="G" />
          </filter>
          {/* Body pit gradient — deep, multi-stop depression */}
          <radialGradient id="bodyPitGrad" cx="50%" cy="42%" r="52%">
            <stop offset="0%" stopColor="#6a5428" stopOpacity="0.7" />
            <stop offset="30%" stopColor="#7a6438" stopOpacity="0.55" />
            <stop offset="60%" stopColor="#8a7448" stopOpacity="0.35" />
            <stop offset="85%" stopColor="#9a8458" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#a89060" stopOpacity="0.05" />
          </radialGradient>
          {/* Ambient occlusion ring around disturbances */}
          <radialGradient id="ambientOcclusion" cx="50%" cy="50%" r="50%">
            <stop offset="60%" stopColor="#7a6840" stopOpacity="0" />
            <stop offset="80%" stopColor="#8a7850" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#9a8860" stopOpacity="0.12" />
          </radialGradient>
          {/* Egg mound gradient — raised, sunlit sand */}
          <radialGradient id="moundGrad" cx="42%" cy="38%" r="52%">
            <stop offset="0%" stopColor="#ecdcb4" stopOpacity="0.95" />
            <stop offset="25%" stopColor="#e0ccA0" stopOpacity="0.85" />
            <stop offset="55%" stopColor="#d4bc88" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#c4a870" stopOpacity="0.35" />
          </radialGradient>
          {/* Mound top highlight — sunlight hitting the raised dome */}
          <radialGradient id="moundHighlight" cx="32%" cy="28%" r="42%">
            <stop offset="0%" stopColor="#faf0d8" stopOpacity="0.7" />
            <stop offset="50%" stopColor="#f0e0c0" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#e4cca0" stopOpacity="0" />
          </radialGradient>
          {/* Sand berm gradient — pushed-up sand along tracks */}
          <linearGradient id="bermGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#c8b480" stopOpacity="0.5" />
            <stop offset="50%" stopColor="#b8a470" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#a89460" stopOpacity="0.1" />
          </linearGradient>
          {/* Water gradient for washed over */}
          <radialGradient id="waterPool" cx="48%" cy="42%" r="52%">
            <stop offset="0%" stopColor="#4a90a8" stopOpacity="0.5" />
            <stop offset="30%" stopColor="#5a9ab0" stopOpacity="0.4" />
            <stop offset="60%" stopColor="#4a8aa0" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#3a7a90" stopOpacity="0.08" />
          </radialGradient>
          {/* Wet sand gradient */}
          <radialGradient id="wetSand" cx="50%" cy="48%" r="55%">
            <stop offset="0%" stopColor="#4a3a20" stopOpacity="0.6" />
            <stop offset="40%" stopColor="#5a4a30" stopOpacity="0.45" />
            <stop offset="70%" stopColor="#6a5a3a" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#7a6a4a" stopOpacity="0" />
          </radialGradient>
          {/* Water shimmer — reflective highlights */}
          <linearGradient id="waterShimmer" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8ac8e0" stopOpacity="0" />
            <stop offset="30%" stopColor="#a0d8f0" stopOpacity="0.3" />
            <stop offset="50%" stopColor="#b0e0f8" stopOpacity="0.45" />
            <stop offset="70%" stopColor="#a0d8f0" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#8ac8e0" stopOpacity="0" />
          </linearGradient>
          {/* Cavity gradient — deep, dark excavation */}
          <radialGradient id="cavityGrad" cx="50%" cy="45%" r="50%">
            <stop offset="0%" stopColor="#3a2810" stopOpacity="0.7" />
            <stop offset="40%" stopColor="#4a3818" stopOpacity="0.55" />
            <stop offset="70%" stopColor="#5a4820" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#6a5830" stopOpacity="0.2" />
          </radialGradient>
        </defs>
        {correctAnswer === 'Live Nest' && <LiveNestSVG />}
        {correctAnswer === 'False Crawl' && <FalseCrawlSVG />}
        {correctAnswer === 'Predator-Raided' && <PredatorRaidedSVG />}
        {correctAnswer === 'Hatched (old)' && <HatchedSVG />}
        {correctAnswer === 'Washed Over' && <WashedOverSVG />}
      </svg>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════════════════
   LIVE NEST — Incoming track, body pit, egg mound, outgoing track
   ═══════════════════════════════════════════════════════════════════════ */
function LiveNestSVG() {
  return (
    <g>
      {/* ── Outermost ambient sand disturbance ── */}
      <ellipse cx="350" cy="108" rx="150" ry="75" fill="#a89060" opacity="0.06" />
      <ellipse cx="350" cy="108" rx="130" ry="65" fill="url(#ambientOcclusion)" />

      {/* ── Sand disturbance halo around body pit ── */}
      <ellipse cx="350" cy="105" rx="110" ry="60" fill="#a89060" opacity="0.18" />
      <ellipse cx="350" cy="105" rx="90" ry="50" fill="#9a8458" opacity="0.14" />
      <ellipse cx="350" cy="105" rx="70" ry="40" fill="#8a7448" opacity="0.08" />

      {/* ── Incoming crawl track (from left / water direction) ── */}
      {/* Sand berm — pushed-up sand along track edges */}
      <path
        d="M10,75 Q45,68 80,72 Q120,78 160,70 Q200,64 240,72 Q270,78 305,74"
        stroke="#c0a870" strokeWidth="38" fill="none" opacity="0.12" strokeLinecap="round"
      />
      {/* Main track impression — wide, organic sweep */}
      <path
        d="M10,78 Q45,72 80,76 Q120,82 160,74 Q200,68 240,76 Q270,82 305,78"
        stroke="#8a7650" strokeWidth="36" fill="none" opacity="0.45" strokeLinecap="round"
      />
      {/* Track center drag — belly groove */}
      <path
        d="M15,78 Q50,73 85,77 Q125,82 165,75 Q205,69 245,77 Q275,82 308,78"
        stroke="#6a5430" strokeWidth="12" fill="none" opacity="0.22" strokeLinecap="round"
      />
      {/* Sand ridges along track edges — displaced sand berms */}
      <path
        d="M20,60 Q55,55 90,59 Q130,64 170,57 Q210,51 250,59 Q280,64 312,60"
        stroke="#c8b080" strokeWidth="4" fill="none" opacity="0.3" strokeLinecap="round"
      />
      <path
        d="M20,96 Q55,92 90,95 Q130,100 170,93 Q210,87 250,95 Q280,100 312,96"
        stroke="#c8b080" strokeWidth="4" fill="none" opacity="0.3" strokeLinecap="round"
      />
      {/* Fine sand texture lines within track */}
      <path
        d="M30,72 Q70,68 110,73 Q150,78 190,71 Q230,66 270,74"
        stroke="#9a8660" strokeWidth="1.5" fill="none" opacity="0.15" strokeLinecap="round"
      />
      <path
        d="M30,84 Q70,80 110,83 Q150,88 190,81 Q230,76 270,84"
        stroke="#9a8660" strokeWidth="1.5" fill="none" opacity="0.15" strokeLinecap="round"
      />

      {/* Flipper marks — alternating left/right, angled asymmetrically */}
      {[40, 70, 100, 130, 160, 190, 220, 250, 275].map((x, i) => {
        const yOff = Math.sin(x * 0.04) * 4;
        const depth = 0.5 - i * 0.012;
        return (
          <g key={`fin-${x}`}>
            {/* Left flipper stroke — main */}
            <path
              d={`M${x},${62 + yOff} Q${x + 5},${55 + yOff} ${x + 12},${48 + yOff}`}
              stroke="#7a6840" strokeWidth="3" fill="none" opacity={depth}
              strokeLinecap="round"
            />
            {/* Left flipper — secondary drag */}
            <path
              d={`M${x + 3},${63 + yOff} Q${x + 7},${57 + yOff} ${x + 14},${51 + yOff}`}
              stroke="#8a7850" strokeWidth="1.8" fill="none" opacity={depth * 0.5}
              strokeLinecap="round"
            />
            {/* Left flipper — sand displaced outward */}
            <path
              d={`M${x + 10},${50 + yOff} Q${x + 14},${46 + yOff} ${x + 16},${44 + yOff}`}
              stroke="#b8a070" strokeWidth="1.2" fill="none" opacity={depth * 0.3}
              strokeLinecap="round"
            />
            {/* Right flipper stroke — main */}
            <path
              d={`M${x + 5},${94 + yOff} Q${x + 10},${101 + yOff} ${x + 16},${108 + yOff}`}
              stroke="#7a6840" strokeWidth="3" fill="none" opacity={depth}
              strokeLinecap="round"
            />
            {/* Right flipper — secondary drag */}
            <path
              d={`M${x + 8},${94 + yOff} Q${x + 12},${100 + yOff} ${x + 18},${106 + yOff}`}
              stroke="#8a7850" strokeWidth="1.8" fill="none" opacity={depth * 0.5}
              strokeLinecap="round"
            />
          </g>
        );
      })}

      {/* ── Body pit — deep, multi-layered oval depression ── */}
      <g filter="url(#depthShadow)">
        <ellipse cx="350" cy="102" rx="78" ry="50" fill="url(#bodyPitGrad)" />
      </g>
      {/* Pit floor layers (progressively darker center) */}
      <ellipse cx="348" cy="104" rx="62" ry="38" fill="#8a7448" opacity="0.3" />
      <ellipse cx="347" cy="106" rx="48" ry="28" fill="#7a6438" opacity="0.2" />
      {/* Rim shadow on upper edge — steep pit wall */}
      <path
        d="M278,88 Q305,66 350,60 Q395,66 422,88"
        stroke="#6a5430" strokeWidth="3.5" fill="none" opacity="0.3" strokeLinecap="round"
      />
      {/* Secondary rim line */}
      <path
        d="M285,92 Q310,72 350,66 Q390,72 415,92"
        stroke="#7a6438" strokeWidth="2" fill="none" opacity="0.18" strokeLinecap="round"
      />
      {/* Pit floor texture — uneven sand */}
      <path d="M305,108 Q325,102 345,106 Q365,110 385,104 Q400,100 410,104"
        stroke="#7a6440" strokeWidth="1.5" fill="none" opacity="0.15" />
      <path d="M310,114 Q330,110 355,113 Q375,116 395,112"
        stroke="#7a6440" strokeWidth="1" fill="none" opacity="0.12" />

      {/* Scattered sand grains and debris around pit */}
      {[
        [270, 72], [280, 128], [420, 76], [430, 120],
        [265, 98], [435, 96], [290, 55], [405, 52],
        [275, 110], [425, 108], [260, 85], [440, 82],
        [295, 140], [405, 138], [310, 148], [390, 145],
      ].map(([cx, cy], i) => (
        <circle key={`grain-${i}`} cx={cx} cy={cy} r={1 + (i % 4) * 0.6}
          fill={i % 3 === 0 ? '#c8b080' : '#b8a070'} opacity={0.2 + (i % 3) * 0.1} />
      ))}
      {/* Small sand clumps thrown from pit */}
      {[
        [260, 70, 12, -15], [440, 74, 10, 12],
        [255, 115, 11, 8], [445, 118, 10, -10],
      ].map(([x, y, w, r], i) => (
        <ellipse key={`clump-${i}`} cx={x} cy={y} rx={w} ry={5}
          fill="#b8a070" opacity="0.1"
          transform={`rotate(${r},${x},${y})`} />
      ))}

      {/* ── Egg chamber mound — smooth, raised, with highlight and shadow ── */}
      <g filter="url(#softShadow)">
        <ellipse cx="355" cy="98" rx="44" ry="28" fill="url(#moundGrad)" />
      </g>
      {/* Mound body — mid layer */}
      <ellipse cx="353" cy="95" rx="36" ry="22" fill="#dcc898" opacity="0.55" />
      {/* Inner core — brightest raised area */}
      <ellipse cx="350" cy="92" rx="26" ry="16" fill="#e4d0a0" opacity="0.4" />
      {/* Top highlight — light hitting the raised mound */}
      <ellipse cx="342" cy="86" rx="20" ry="11" fill="url(#moundHighlight)" />
      {/* Specular highlight — bright point of light */}
      <ellipse cx="338" cy="84" rx="8" ry="4" fill="#faf0d8" opacity="0.3" />
      {/* Subtle texture lines on mound surface */}
      <path d="M322,98 Q335,93 355,95 Q370,97 385,94" stroke="#c8b078" strokeWidth="1" fill="none" opacity="0.25" />
      <path d="M328,104 Q345,100 365,102 Q380,104 392,101" stroke="#c8b078" strokeWidth="0.8" fill="none" opacity="0.2" />
      <path d="M335,108 Q350,106 370,108" stroke="#c8b078" strokeWidth="0.6" fill="none" opacity="0.15" />
      {/* Shadow on lower edge of mound */}
      <path d="M318,112 Q340,118 365,116 Q385,114 395,110" stroke="#8a7448" strokeWidth="1.5" fill="none" opacity="0.15" />

      {/* ── Outgoing crawl track (going right / back to water) ── */}
      {/* Sand berm */}
      <path
        d="M398,74 Q440,66 480,72 Q520,80 560,70 Q600,64 640,68 Q665,70 695,72"
        stroke="#c0a870" strokeWidth="32" fill="none" opacity="0.1" strokeLinecap="round"
      />
      {/* Main track */}
      <path
        d="M400,76 Q440,68 480,74 Q520,82 560,72 Q600,66 640,70 Q665,72 695,74"
        stroke="#8a7650" strokeWidth="28" fill="none" opacity="0.35" strokeLinecap="round"
      />
      {/* Belly drag */}
      <path
        d="M405,76 Q445,69 485,75 Q525,82 565,73 Q605,67 645,71 Q668,73 695,74"
        stroke="#6a5430" strokeWidth="9" fill="none" opacity="0.18" strokeLinecap="round"
      />
      {/* Track edge ridges */}
      <path
        d="M408,60 Q445,54 485,60 Q525,66 565,57 Q605,52 645,56 Q668,58 695,58"
        stroke="#c8b080" strokeWidth="2.5" fill="none" opacity="0.2" strokeLinecap="round"
      />
      <path
        d="M408,92 Q445,88 485,91 Q525,96 565,88 Q605,83 645,87"
        stroke="#c8b080" strokeWidth="2.5" fill="none" opacity="0.2" strokeLinecap="round"
      />

      {/* Outgoing flipper marks — lighter (track fading) */}
      {[430, 470, 510, 550, 590, 635].map((x, i) => {
        const yOff = Math.sin(x * 0.03) * 3;
        const depth = 0.35 - i * 0.03;
        return (
          <g key={`fout-${x}`}>
            <path
              d={`M${x},${58 + yOff} Q${x + 5},${52 + yOff} ${x + 11},${46 + yOff}`}
              stroke="#7a6840" strokeWidth="2.5" fill="none" opacity={depth}
              strokeLinecap="round"
            />
            <path
              d={`M${x + 4},${90 + yOff} Q${x + 9},${97 + yOff} ${x + 14},${103 + yOff}`}
              stroke="#7a6840" strokeWidth="2.5" fill="none" opacity={depth}
              strokeLinecap="round"
            />
          </g>
        );
      })}

      {/* ── Label ── */}
      <text x="350" y="190" textAnchor="middle" fontSize="13" fill="#6a5a38" opacity="0.55" fontStyle="italic">
        Body pit + egg mound
      </text>
    </g>
  );
}


/* ═══════════════════════════════════════════════════════════════════════
   FALSE CRAWL — U-shaped track, no nest, turtle turned back
   ═══════════════════════════════════════════════════════════════════════ */
function FalseCrawlSVG() {
  return (
    <g>
      {/* ── Ambient disturbance around turn point ── */}
      <ellipse cx="375" cy="118" rx="60" ry="40" fill="#9a8458" opacity="0.08" />

      {/* ── Main U-shaped crawl track ── */}
      {/* Incoming leg — sand berm */}
      <path
        d="M10,52 Q60,48 110,54 Q170,62 230,58 Q280,54 320,68 Q350,82 375,105"
        stroke="#c0a870" strokeWidth="36" fill="none" opacity="0.1" strokeLinecap="round"
      />
      {/* Incoming leg — main track */}
      <path
        d="M10,55 Q60,50 110,56 Q170,64 230,60 Q280,56 320,70 Q352,85 375,108"
        stroke="#8a7650" strokeWidth="34" fill="none" opacity="0.45" strokeLinecap="round"
      />
      {/* Belly drag on incoming leg */}
      <path
        d="M15,55 Q65,51 115,57 Q175,64 235,61 Q285,57 325,71 Q355,86 377,108"
        stroke="#6a5430" strokeWidth="10" fill="none" opacity="0.2" strokeLinecap="round"
      />
      {/* Sand ridges along incoming track */}
      <path
        d="M20,38 Q65,34 115,40 Q175,47 235,44 Q285,40 320,52 Q345,64 365,88"
        stroke="#c8b080" strokeWidth="3" fill="none" opacity="0.25" strokeLinecap="round"
      />
      <path
        d="M20,72 Q65,68 115,73 Q175,80 235,77 Q285,73 330,86 Q358,98 380,120"
        stroke="#c8b080" strokeWidth="3" fill="none" opacity="0.25" strokeLinecap="round"
      />

      {/* Turn point — multi-layered churned sand */}
      <ellipse cx="378" cy="115" rx="48" ry="32" fill="#8a7650" opacity="0.15" />
      <ellipse cx="378" cy="116" rx="38" ry="25" fill="#8a7650" opacity="0.2" />
      <ellipse cx="378" cy="118" rx="28" ry="18" fill="#7a6440" opacity="0.18" />
      <ellipse cx="378" cy="119" rx="18" ry="12" fill="#6a5430" opacity="0.12" />
      {/* Churned sand texture */}
      <path d="M355,110 Q370,106 385,112 Q395,118 400,115"
        stroke="#7a6440" strokeWidth="1.5" fill="none" opacity="0.15" />
      <path d="M360,122 Q375,118 390,124"
        stroke="#7a6440" strokeWidth="1" fill="none" opacity="0.12" />
      {/* Scattered sand grains at turn */}
      {[
        [340, 98], [416, 100], [348, 135], [408, 138],
        [332, 112], [424, 116], [355, 140], [400, 95],
        [345, 105], [415, 108], [365, 142], [392, 92],
      ].map(([cx, cy], i) => (
        <circle key={`t-${i}`} cx={cx} cy={cy} r={1 + (i % 3) * 0.5}
          fill={i % 2 === 0 ? '#b8a070' : '#a89060'} opacity={0.25 + (i % 3) * 0.1} />
      ))}

      {/* Return leg — sand berm */}
      <path
        d="M385,105 Q405,82 435,68 Q475,54 535,58 Q595,62 645,54 Q675,50 700,52"
        stroke="#c0a870" strokeWidth="34" fill="none" opacity="0.08" strokeLinecap="round"
      />
      {/* Return leg — main track */}
      <path
        d="M385,108 Q408,84 438,70 Q478,56 538,60 Q598,64 648,56 Q678,52 700,54"
        stroke="#8a7650" strokeWidth="30" fill="none" opacity="0.4" strokeLinecap="round"
      />
      <path
        d="M388,108 Q410,85 440,71 Q480,57 540,61 Q600,65 650,57 Q678,53 700,55"
        stroke="#6a5430" strokeWidth="9" fill="none" opacity="0.17" strokeLinecap="round"
      />
      {/* Return leg sand ridges */}
      <path
        d="M400,88 Q425,68 455,54 Q495,40 555,44 Q615,48 665,40 Q688,38 700,40"
        stroke="#c8b080" strokeWidth="2.5" fill="none" opacity="0.2" strokeLinecap="round"
      />

      {/* Flipper marks — incoming leg */}
      {[50, 105, 160, 215, 265].map((x, i) => {
        const yOff = Math.sin(x * 0.035) * 3;
        return (
          <g key={`fl-${x}`}>
            <path d={`M${x},${38 + yOff} Q${x + 5},${32 + yOff} ${x + 11},${26 + yOff}`}
              stroke="#7a6840" strokeWidth="2.8" fill="none" opacity={0.45} strokeLinecap="round" />
            <path d={`M${x + 3},${38 + yOff} Q${x + 7},${33 + yOff} ${x + 13},${29 + yOff}`}
              stroke="#8a7850" strokeWidth="1.5" fill="none" opacity={0.2} strokeLinecap="round" />
            <path d={`M${x + 4},${72 + yOff} Q${x + 8},${78 + yOff} ${x + 13},${84 + yOff}`}
              stroke="#7a6840" strokeWidth="2.8" fill="none" opacity={0.45} strokeLinecap="round" />
            <path d={`M${x + 7},${72 + yOff} Q${x + 10},${77 + yOff} ${x + 15},${82 + yOff}`}
              stroke="#8a7850" strokeWidth="1.5" fill="none" opacity={0.2} strokeLinecap="round" />
          </g>
        );
      })}

      {/* Flipper marks — return leg */}
      {[445, 510, 575, 635].map((x, i) => {
        const yOff = Math.sin(x * 0.035) * 3;
        return (
          <g key={`fr-${x}`}>
            <path d={`M${x},${38 + yOff} Q${x + 4},${32 + yOff} ${x + 10},${26 + yOff}`}
              stroke="#7a6840" strokeWidth="2.5" fill="none" opacity={0.38} strokeLinecap="round" />
            <path d={`M${x + 4},${72 + yOff} Q${x + 8},${78 + yOff} ${x + 12},${84 + yOff}`}
              stroke="#7a6840" strokeWidth="2.5" fill="none" opacity={0.38} strokeLinecap="round" />
          </g>
        );
      })}

      {/* Flipper marks at turn point — chaotic */}
      {[
        { x: 350, y: 92, a: -45 }, { x: 395, y: 95, a: 30 },
        { x: 360, y: 130, a: -60 }, { x: 405, y: 128, a: 50 },
      ].map((m, i) => (
        <path key={`ft-${i}`}
          d={`M${m.x},${m.y} Q${m.x + 5},${m.y - 4} ${m.x + 10},${m.y - 8}`}
          stroke="#7a6840" strokeWidth="2" fill="none" opacity="0.3"
          transform={`rotate(${m.a},${m.x},${m.y})`} strokeLinecap="round" />
      ))}

      {/* ── "No nest" indicator — dashed oval ── */}
      <ellipse cx="378" cy="116" rx="55" ry="32" fill="none" stroke="#8a7650"
        strokeWidth="2.5" opacity="0.25" strokeDasharray="10 7" />

      {/* Annotation X marks — "nothing deposited here" */}
      <g opacity="0.18">
        <line x1="366" y1="108" x2="390" y2="126" stroke="#6a5830" strokeWidth="2.5" />
        <line x1="390" y1="108" x2="366" y2="126" stroke="#6a5830" strokeWidth="2.5" />
      </g>

      {/* ── Loggerhead turtle returning to water (top-down view) ── */}
      <g transform="translate(655, 50) rotate(-2)">
        {/* Shadow on sand beneath turtle */}
        <ellipse cx="2" cy="5" rx="42" ry="32" fill="#5a4a30" opacity="0.22" />

        {/* ── Rear flippers (drawn first, behind shell) ── */}
        <path d="M-26,-9 Q-40,-20 -44,-12 Q-42,-6 -30,-7Z" fill="#a06830" stroke="#7a4e20" strokeWidth="0.8" />
        <path d="M-26,11 Q-40,22 -44,14 Q-42,8 -30,9Z" fill="#a06830" stroke="#7a4e20" strokeWidth="0.8" />
        {/* Rear flipper scales */}
        <line x1="-30" y1="-8" x2="-38" y2="-15" stroke="#7a4e20" strokeWidth="0.5" opacity="0.4" />
        <line x1="-32" y1="-7" x2="-40" y2="-12" stroke="#7a4e20" strokeWidth="0.4" opacity="0.3" />
        <line x1="-30" y1="10" x2="-38" y2="17" stroke="#7a4e20" strokeWidth="0.5" opacity="0.4" />
        <line x1="-32" y1="9" x2="-40" y2="14" stroke="#7a4e20" strokeWidth="0.4" opacity="0.3" />

        {/* ── Tail ── */}
        <path d="M-32,0 Q-42,-1 -46,0 Q-42,1 -32,0" fill="#9a6028" stroke="#7a4e20" strokeWidth="0.6" />

        {/* ── Front flippers (broad, paddle-shaped) ── */}
        {/* Upper front flipper */}
        <path
          d="M14,-16 Q24,-28 38,-38 Q44,-40 46,-36 Q44,-28 38,-24 Q28,-18 20,-14Z"
          fill="#b07035" stroke="#7a4e20" strokeWidth="1" />
        <path d="M30,-34 Q38,-37 42,-36 Q40,-30 32,-26" fill="#e8c99b" opacity="0.35" />
        <line x1="20" y1="-20" x2="38" y2="-32" stroke="#7a4e20" strokeWidth="0.6" opacity="0.35" />
        <line x1="18" y1="-18" x2="34" y2="-28" stroke="#7a4e20" strokeWidth="0.5" opacity="0.25" />
        <line x1="16" y1="-16" x2="28" y2="-24" stroke="#7a4e20" strokeWidth="0.4" opacity="0.2" />
        {/* Claw marks */}
        <line x1="44" y1="-37" x2="47" y2="-39" stroke="#5a3a18" strokeWidth="0.8" opacity="0.5" />
        <line x1="42" y1="-39" x2="45" y2="-41" stroke="#5a3a18" strokeWidth="0.7" opacity="0.4" />

        {/* Lower front flipper */}
        <path
          d="M14,16 Q24,28 38,38 Q44,40 46,36 Q44,28 38,24 Q28,18 20,14Z"
          fill="#b07035" stroke="#7a4e20" strokeWidth="1" />
        <path d="M30,34 Q38,37 42,36 Q40,30 32,26" fill="#e8c99b" opacity="0.35" />
        <line x1="20" y1="20" x2="38" y2="32" stroke="#7a4e20" strokeWidth="0.6" opacity="0.35" />
        <line x1="18" y1="18" x2="34" y2="28" stroke="#7a4e20" strokeWidth="0.5" opacity="0.25" />
        <line x1="44" y1="37" x2="47" y2="39" stroke="#5a3a18" strokeWidth="0.8" opacity="0.5" />
        <line x1="42" y1="39" x2="45" y2="41" stroke="#5a3a18" strokeWidth="0.7" opacity="0.4" />

        {/* ── Carapace (shell) — heart/teardrop shape from above ── */}
        <path
          d="M-28,0 Q-30,-18 -18,-24 Q-4,-28 10,-28 Q20,-26 26,-20 Q30,-12 30,0 Q30,12 26,20 Q20,26 10,28 Q-4,28 -18,24 Q-30,18 -28,0Z"
          fill="#c07838" stroke="#7a4820" strokeWidth="1.5" />

        {/* Shell color gradient — lighter center, darker edges */}
        <path
          d="M-22,0 Q-24,-14 -14,-20 Q0,-24 12,-22 Q22,-18 24,0 Q22,18 12,22 Q0,24 -14,20 Q-24,14 -22,0Z"
          fill="#d08848" opacity="0.5" />

        {/* ── Vertebral scutes (central plates) ── */}
        <path d="M-20,0 L-16,-4.5 L-8,-4.5 L-4,0 L-8,4.5 L-16,4.5Z" fill="none" stroke="#8a5428" strokeWidth="1" opacity="0.55" />
        <path d="M-4,0 L0,-5 L10,-5 L14,0 L10,5 L0,5Z" fill="none" stroke="#8a5428" strokeWidth="1" opacity="0.55" />
        <path d="M14,0 L17,-4 L24,-3.5 L27,0 L24,3.5 L17,4Z" fill="none" stroke="#8a5428" strokeWidth="1" opacity="0.5" />
        <path d="M-24,0 L-22,-3.5 L-18,-3.5 L-16,0 L-18,3.5 L-22,3.5Z" fill="none" stroke="#8a5428" strokeWidth="0.8" opacity="0.4" />

        {/* ── Costal scutes (paired plates) ── */}
        <path d="M-18,-4.5 Q-14,-12 -4,-16 Q-2,-10 -8,-4.5Z" fill="none" stroke="#8a5428" strokeWidth="0.8" opacity="0.4" />
        <path d="M-8,-4.5 Q0,-16 10,-20 Q12,-12 0,-5Z" fill="none" stroke="#8a5428" strokeWidth="0.8" opacity="0.4" />
        <path d="M0,-5 Q10,-18 20,-20 Q22,-12 10,-5Z" fill="none" stroke="#8a5428" strokeWidth="0.8" opacity="0.4" />
        <path d="M10,-5 Q20,-16 26,-14 Q26,-8 17,-4Z" fill="none" stroke="#8a5428" strokeWidth="0.8" opacity="0.35" />
        <path d="M-18,4.5 Q-14,12 -4,16 Q-2,10 -8,4.5Z" fill="none" stroke="#8a5428" strokeWidth="0.8" opacity="0.4" />
        <path d="M-8,4.5 Q0,16 10,20 Q12,12 0,5Z" fill="none" stroke="#8a5428" strokeWidth="0.8" opacity="0.4" />
        <path d="M0,5 Q10,18 20,20 Q22,12 10,5Z" fill="none" stroke="#8a5428" strokeWidth="0.8" opacity="0.4" />
        <path d="M10,5 Q20,16 26,14 Q26,8 17,4Z" fill="none" stroke="#8a5428" strokeWidth="0.8" opacity="0.35" />

        {/* ── Marginal scutes ── */}
        {[-24, -18, -12, -4, 4, 10, 16, 22].map((x, i) => {
          const ry = 28 - Math.abs(x) * 0.4;
          return (
            <g key={`marg-${i}`}>
              <circle cx={x < 0 ? x * 0.8 - 2 : x * 0.7 + 6} cy={-ry + 2} r="2.2" fill="none" stroke="#8a5428" strokeWidth="0.5" opacity="0.3" />
              <circle cx={x < 0 ? x * 0.8 - 2 : x * 0.7 + 6} cy={ry - 2} r="2.2" fill="none" stroke="#8a5428" strokeWidth="0.5" opacity="0.3" />
            </g>
          );
        })}

        {/* Shell highlight — light reflection on dome */}
        <ellipse cx="4" cy="-5" rx="14" ry="7" fill="#e8b868" opacity="0.2" />
        <ellipse cx="2" cy="-6" rx="6" ry="3" fill="#f0c878" opacity="0.15" />

        {/* ── Head — loggerheads have distinctively LARGE heads ── */}
        <ellipse cx="36" cy="0" rx="14" ry="12" fill="#b87038" stroke="#7a4820" strokeWidth="1.2" />
        <ellipse cx="38" cy="-1" rx="11" ry="9" fill="#c47840" opacity="0.6" />
        {/* Snout */}
        <ellipse cx="47" cy="0" rx="7" ry="8" fill="#b87038" stroke="#7a4820" strokeWidth="1" />
        <ellipse cx="49" cy="0" rx="5" ry="6" fill="#c88848" opacity="0.4" />

        {/* Head scales/plates pattern */}
        <path d="M32,-3 Q36,-8 40,-6" stroke="#8a5428" strokeWidth="0.6" fill="none" opacity="0.35" />
        <path d="M32,3 Q36,8 40,6" stroke="#8a5428" strokeWidth="0.6" fill="none" opacity="0.35" />
        <path d="M36,-1 Q40,-4 44,-1" stroke="#8a5428" strokeWidth="0.5" fill="none" opacity="0.3" />
        <path d="M36,1 Q40,4 44,1" stroke="#8a5428" strokeWidth="0.5" fill="none" opacity="0.3" />

        {/* Eyes */}
        <g>
          <ellipse cx="40" cy="-8" rx="3.8" ry="3.2" fill="#2a1a0a" />
          <ellipse cx="40" cy="-8" rx="2.8" ry="2.2" fill="#5a3a1a" />
          <circle cx="41" cy="-8.5" r="1" fill="white" opacity="0.8" />
        </g>
        <g>
          <ellipse cx="40" cy="8" rx="3.8" ry="3.2" fill="#2a1a0a" />
          <ellipse cx="40" cy="8" rx="2.8" ry="2.2" fill="#5a3a1a" />
          <circle cx="41" cy="7.5" r="1" fill="white" opacity="0.8" />
        </g>

        {/* Nostrils */}
        <circle cx="52" cy="-2.5" r="1.1" fill="#5a3818" opacity="0.6" />
        <circle cx="52" cy="2.5" r="1.1" fill="#5a3818" opacity="0.6" />

        {/* Jaw/beak line */}
        <path d="M44,-6 Q52,-3 54,0 Q52,3 44,6" stroke="#7a4820" strokeWidth="1" fill="none" opacity="0.5" />
      </g>

      {/* ── Label ── */}
      <text x="378" y="190" textAnchor="middle" fontSize="13" fill="#6a5a38" opacity="0.55" fontStyle="italic">
        No body pit or egg chamber
      </text>
    </g>
  );
}


/* ═══════════════════════════════════════════════════════════════════════
   PREDATOR-RAIDED — Excavated cavity, scattered shells, paw prints
   ═══════════════════════════════════════════════════════════════════════ */
function PredatorRaidedSVG() {
  return (
    <g>
      {/* ── Outermost disturbed area ── */}
      <ellipse cx="350" cy="95" rx="170" ry="80" fill="#9a8458" opacity="0.06" />
      <ellipse cx="350" cy="95" rx="148" ry="70" fill="url(#ambientOcclusion)" />

      {/* ── Disturbed sand halo ── */}
      <ellipse cx="350" cy="95" rx="130" ry="65" fill="#9a8458" opacity="0.12" />
      <ellipse cx="350" cy="95" rx="115" ry="58" fill="none" stroke="#8a7650"
        strokeWidth="1.8" opacity="0.18" strokeDasharray="6 5" />

      {/* ── Thrown/displaced sand spray ── */}
      {[
        { x: 210, y: 35, w: 35, r: -22 },
        { x: 490, y: 32, w: 32, r: 18 },
        { x: 190, y: 125, w: 30, r: 12 },
        { x: 510, y: 120, w: 28, r: -10 },
        { x: 240, y: 148, w: 22, r: 5 },
        { x: 460, y: 145, w: 24, r: -6 },
      ].map((sp, i) => (
        <ellipse key={`spray-${i}`} cx={sp.x} cy={sp.y} rx={sp.w} ry={9}
          fill="#b8a070" opacity="0.12" transform={`rotate(${sp.r},${sp.x},${sp.y})`} />
      ))}

      {/* ── Excavated nest cavity — deep, dark, rough-edged ── */}
      <g filter="url(#depthShadow)">
        <ellipse cx="350" cy="92" rx="68" ry="46" fill="url(#cavityGrad)" />
      </g>
      <ellipse cx="350" cy="94" rx="56" ry="38" fill="#4a3818" opacity="0.45" />
      <ellipse cx="350" cy="96" rx="42" ry="28" fill="#3a2810" opacity="0.25" />
      {/* Cavity rim — irregular, rough edge */}
      <path
        d="M286,78 Q300,58 330,50 Q355,46 375,48 Q400,52 415,62 Q425,72 418,82"
        stroke="#6a5830" strokeWidth="3.5" fill="none" opacity="0.35" strokeLinecap="round"
      />
      <path
        d="M290,82 Q305,64 335,56 Q355,52 375,54 Q398,58 412,68"
        stroke="#7a6838" strokeWidth="2" fill="none" opacity="0.2" strokeLinecap="round"
      />
      {/* Loose sand in cavity */}
      <path d="M308,98 Q328,90 350,94 Q372,98 392,92" stroke="#7a6838" strokeWidth="1.8" fill="none" opacity="0.22" />
      <path d="M315,105 Q340,100 365,103 Q382,106 395,102" stroke="#7a6838" strokeWidth="1.2" fill="none" opacity="0.15" />
      {/* Cavity floor sand grains */}
      {[
        [325, 88], [370, 92], [340, 102], [360, 98], [330, 95], [375, 100],
      ].map(([cx, cy], i) => (
        <circle key={`cg-${i}`} cx={cx} cy={cy} r={0.8 + (i % 3) * 0.3}
          fill="#8a7850" opacity="0.2" />
      ))}

      {/* ── Scattered broken eggshells — organic shapes ── */}
      {[
        { x: 185, y: 48, r: 15, s: 1.6 },
        { x: 520, y: 52, r: -28, s: 1.5 },
        { x: 200, y: 128, r: 42, s: 1.4 },
        { x: 505, y: 122, r: -52, s: 1.5 },
        { x: 165, y: 82, r: 68, s: 1.2 },
        { x: 540, y: 86, r: -62, s: 1.3 },
        { x: 245, y: 28, r: 22, s: 1.1 },
        { x: 455, y: 24, r: -12, s: 1.2 },
        { x: 225, y: 148, r: 38, s: 1.0 },
        { x: 475, y: 142, r: -38, s: 1.1 },
        { x: 290, y: 36, r: 8, s: 0.9 },
        { x: 410, y: 32, r: -10, s: 0.95 },
        { x: 180, y: 105, r: 55, s: 0.85 },
        { x: 530, y: 100, r: -48, s: 0.9 },
      ].map((shell, i) => (
        <g key={`sh-${i}`} transform={`translate(${shell.x},${shell.y}) rotate(${shell.r}) scale(${shell.s})`}>
          {/* Curved shell fragment */}
          <path d="M-7,-4 Q-3,-9 3,-7 Q7,-3 5,1 Q2,4 -4,3 Q-8,0 -7,-4Z"
            fill="#f0e8d0" stroke="#c8b888" strokeWidth="0.7" opacity="0.85" />
          {/* Inner membrane shading */}
          <path d="M-4,-3 Q0,-6 4,-4 Q3,0 -1,1Z" fill="#e8dcc0" opacity="0.4" />
          {/* Shell thickness edge */}
          <path d="M-6,-3 Q-4,-7 1,-6" stroke="#d8c8a0" strokeWidth="0.4" fill="none" opacity="0.3" />
        </g>
      ))}

      {/* ── Punctured/crushed eggs in cavity ── */}
      {[
        { x: 325, y: 80, r: -10 },
        { x: 368, y: 98, r: 14 },
        { x: 332, y: 105, r: -18 },
        { x: 362, y: 78, r: 6 },
        { x: 345, y: 110, r: 25 },
      ].map((egg, i) => (
        <g key={`pegg-${i}`} transform={`rotate(${egg.r},${egg.x},${egg.y})`}>
          <ellipse cx={egg.x} cy={egg.y} rx="11" ry="8" fill="#f0e8d0" stroke="#b8a878" strokeWidth="0.8" opacity="0.8" />
          {/* Puncture/crack marks */}
          <path d={`M${egg.x - 4},${egg.y - 3} L${egg.x + 1},${egg.y} L${egg.x - 3},${egg.y + 3}`}
            stroke="#6a5830" strokeWidth="1.3" fill="none" opacity="0.6" />
          <path d={`M${egg.x + 2},${egg.y - 2} L${egg.x},${egg.y + 2} L${egg.x + 4},${egg.y + 4}`}
            stroke="#6a5830" strokeWidth="1" fill="none" opacity="0.5" />
          {/* Secondary crack */}
          <path d={`M${egg.x - 5},${egg.y} L${egg.x - 2},${egg.y - 1}`}
            stroke="#8a7850" strokeWidth="0.6" fill="none" opacity="0.35" />
          {/* Yolk residue */}
          <ellipse cx={egg.x + 1} cy={egg.y + 1} rx="3.5" ry="2.5" fill="#d4a030" opacity="0.22" />
          {/* Membrane fragment */}
          <path d={`M${egg.x + 3},${egg.y - 3} Q${egg.x + 5},${egg.y - 5} ${egg.x + 6},${egg.y - 3}`}
            stroke="#e8dcc0" strokeWidth="0.5" fill="none" opacity="0.3" />
        </g>
      ))}

      {/* ── Raccoon paw prints — detailed with claws ── */}
      {[
        { x: 175, y: 68, s: 1.0, r: -28 },
        { x: 155, y: 38, s: 0.9, r: -22 },
        { x: 530, y: 62, s: 0.95, r: 20 },
        { x: 550, y: 32, s: 0.85, r: 28 },
        { x: 260, y: 22, s: 0.8, r: -10 },
        { x: 440, y: 18, s: 0.8, r: 14 },
        { x: 195, y: 140, s: 0.75, r: -32 },
        { x: 500, y: 135, s: 0.75, r: 30 },
        { x: 140, y: 55, s: 0.7, r: -18 },
        { x: 560, y: 50, s: 0.7, r: 16 },
      ].map((paw, i) => (
        <g key={`paw-${i}`} transform={`translate(${paw.x},${paw.y}) scale(${paw.s}) rotate(${paw.r})`}>
          {/* Palm pad — main */}
          <ellipse cx="0" cy="5" rx="7" ry="6" fill="#6a5830" opacity="0.45" />
          {/* Palm pad — inner highlight */}
          <ellipse cx="-1" cy="4" rx="4" ry="3.5" fill="#7a6840" opacity="0.15" />
          {/* Toe pads — 5 digits */}
          <ellipse cx="-8" cy="-3" rx="3.2" ry="2.8" fill="#6a5830" opacity="0.4" transform="rotate(-12,-8,-3)" />
          <ellipse cx="-4" cy="-7.5" rx="3" ry="2.5" fill="#6a5830" opacity="0.4" />
          <ellipse cx="0" cy="-8" rx="2.8" ry="2.3" fill="#6a5830" opacity="0.38" />
          <ellipse cx="4" cy="-7.5" rx="3" ry="2.5" fill="#6a5830" opacity="0.4" />
          <ellipse cx="8" cy="-3" rx="3.2" ry="2.8" fill="#6a5830" opacity="0.4" transform="rotate(12,8,-3)" />
          {/* Claw marks — sharp, radiating */}
          <line x1="-9" y1="-5" x2="-12" y2="-9" stroke="#5a4820" strokeWidth="1.2" opacity="0.3" strokeLinecap="round" />
          <line x1="-4" y1="-9.5" x2="-5" y2="-13" stroke="#5a4820" strokeWidth="1.2" opacity="0.3" strokeLinecap="round" />
          <line x1="0" y1="-10" x2="0" y2="-14" stroke="#5a4820" strokeWidth="1.1" opacity="0.28" strokeLinecap="round" />
          <line x1="4" y1="-9.5" x2="5" y2="-13" stroke="#5a4820" strokeWidth="1.2" opacity="0.3" strokeLinecap="round" />
          <line x1="9" y1="-5" x2="12" y2="-9" stroke="#5a4820" strokeWidth="1.2" opacity="0.3" strokeLinecap="round" />
        </g>
      ))}

      {/* Dig marks — claw scrapes in sand */}
      {[
        { x: 272, y: 62, r: -32, w: 24 },
        { x: 428, y: 58, r: 28, w: 22 },
        { x: 282, y: 120, r: 18, w: 20 },
        { x: 418, y: 118, r: -22, w: 20 },
        { x: 260, y: 90, r: -40, w: 18 },
        { x: 440, y: 88, r: 35, w: 18 },
      ].map((dig, i) => (
        <g key={`dig-${i}`} transform={`translate(${dig.x},${dig.y}) rotate(${dig.r})`}>
          <line x1="0" y1="0" x2={dig.w} y2={-3} stroke="#7a6838" strokeWidth="1.8" opacity="0.25" strokeLinecap="round" />
          <line x1="0" y1="4" x2={dig.w - 2} y2="1" stroke="#7a6838" strokeWidth="1.4" opacity="0.2" strokeLinecap="round" />
          <line x1="0" y1="8" x2={dig.w - 4} y2="5" stroke="#7a6838" strokeWidth="1.1" opacity="0.15" strokeLinecap="round" />
          <line x1="0" y1="12" x2={dig.w - 6} y2="9" stroke="#7a6838" strokeWidth="0.8" opacity="0.1" strokeLinecap="round" />
        </g>
      ))}

      {/* ── Label ── */}
      <text x="350" y="195" textAnchor="middle" fontSize="13" fill="#6a5a38" opacity="0.55" fontStyle="italic">
        Excavated cavity + scattered shells
      </text>
    </g>
  );
}


/* ═══════════════════════════════════════════════════════════════════════
   HATCHED (OLD) — Collapsed chamber, shell fragments, hatchling tracks
   ═══════════════════════════════════════════════════════════════════════ */
function HatchedSVG() {
  return (
    <g>
      {/* ── Ambient disturbance around collapsed area ── */}
      <ellipse cx="350" cy="118" rx="85" ry="55" fill="#9a8860" opacity="0.08" />
      <ellipse cx="350" cy="118" rx="75" ry="48" fill="url(#ambientOcclusion)" />

      {/* ── Collapsed egg chamber depression — concentric rings ── */}
      <ellipse cx="350" cy="118" rx="65" ry="42" fill="#8a7850" opacity="0.35" />
      <ellipse cx="350" cy="120" rx="55" ry="35" fill="#7a6840" opacity="0.3" />
      <ellipse cx="350" cy="122" rx="42" ry="26" fill="#6a5830" opacity="0.2" />
      <ellipse cx="350" cy="123" rx="30" ry="18" fill="#5a4820" opacity="0.12" />
      {/* Rim shadow — collapsed edge */}
      <path
        d="M292,106 Q315,88 350,84 Q385,88 408,106"
        stroke="#6a5830" strokeWidth="2.5" fill="none" opacity="0.25" strokeLinecap="round"
      />
      <path
        d="M298,110 Q318,94 350,90 Q382,94 402,110"
        stroke="#7a6840" strokeWidth="1.5" fill="none" opacity="0.15" strokeLinecap="round"
      />
      {/* Subsidence cracks radiating from center */}
      <path d="M330,108 Q325,100 322,92" stroke="#6a5830" strokeWidth="1" fill="none" opacity="0.15" />
      <path d="M370,106 Q378,98 382,90" stroke="#6a5830" strokeWidth="1" fill="none" opacity="0.15" />
      <path d="M340,130 Q338,138 335,144" stroke="#6a5830" strokeWidth="0.8" fill="none" opacity="0.1" />
      <path d="M360,128 Q364,136 368,142" stroke="#6a5830" strokeWidth="0.8" fill="none" opacity="0.1" />

      {/* Sandy debris around the collapsed area */}
      {[
        [280, 100], [420, 98], [275, 130], [425, 128],
        [290, 88], [410, 86], [300, 142], [400, 140],
        [268, 115], [432, 112],
      ].map(([cx, cy], i) => (
        <circle key={`cd-${i}`} cx={cx} cy={cy} r={1 + (i % 3) * 0.5}
          fill="#b8a070" opacity={0.2 + (i % 2) * 0.08} />
      ))}

      {/* ── Papery shell fragments — thin, curled, translucent ── */}
      {[
        { x: 328, y: 108, r: 18, w: 9, h: 5.5 },
        { x: 368, y: 112, r: -28, w: 8, h: 4.5 },
        { x: 342, y: 125, r: 48, w: 10, h: 5.5 },
        { x: 318, y: 116, r: -12, w: 7, h: 4 },
        { x: 382, y: 118, r: 62, w: 8, h: 3.5 },
        { x: 352, y: 102, r: -42, w: 9, h: 4.5 },
        { x: 334, y: 132, r: 22, w: 7, h: 3.5 },
        { x: 365, y: 128, r: -58, w: 8, h: 4.5 },
        { x: 324, y: 110, r: 72, w: 6, h: 3 },
        { x: 376, y: 108, r: -18, w: 7, h: 3.5 },
        { x: 338, y: 120, r: 38, w: 6, h: 3 },
        { x: 360, y: 122, r: -68, w: 7, h: 4 },
        { x: 346, y: 135, r: 5, w: 5, h: 2.5 },
        { x: 358, y: 100, r: -30, w: 6, h: 3 },
      ].map((f, i) => (
        <g key={`frag-${i}`} transform={`translate(${f.x},${f.y}) rotate(${f.r})`}>
          {/* Curled shell fragment */}
          <path
            d={`M${-f.w / 2},0 Q${-f.w / 4},${-f.h} ${0},${-f.h * 0.5} Q${f.w / 4},${-f.h * 0.8} ${f.w / 2},${-f.h * 0.2}`}
            fill="#f5f0e0" stroke="#d8d0b8" strokeWidth="0.5" opacity="0.8"
          />
          <path
            d={`M${-f.w / 3},${-f.h * 0.2} Q0,${-f.h * 0.6} ${f.w / 3},${-f.h * 0.3}`}
            fill="#ebe4d0" opacity="0.35"
          />
          {/* Shell fragment highlight */}
          <path
            d={`M${-f.w / 4},${-f.h * 0.1} Q0,${-f.h * 0.4} ${f.w / 5},${-f.h * 0.15}`}
            fill="#faf5e8" opacity="0.15"
          />
        </g>
      ))}

      {/* ── Hatchling tracks — tiny paired flipper prints fanning toward water ── */}
      {[
        { angle: -82, len: 155 },
        { angle: -68, len: 135 },
        { angle: -54, len: 145 },
        { angle: -40, len: 125 },
        { angle: -26, len: 118 },
        { angle: -14, len: 108 },
        { angle: -2, len: 100 },
        { angle: 10, len: 105 },
        { angle: 22, len: 115 },
        { angle: 34, len: 125 },
        { angle: 46, len: 140 },
        { angle: 58, len: 130 },
        { angle: 72, len: 150 },
        { angle: 82, len: 135 },
        { angle: -48, len: 112 },
        { angle: 0, len: 95 },
        { angle: 38, len: 118 },
        { angle: 68, len: 122 },
        { angle: -74, len: 120 },
        { angle: 52, len: 108 },
      ].map((track, i) => {
        const rad = (track.angle * Math.PI) / 180;
        const sx = 350;
        const sy = 108;
        const ex = sx + Math.sin(rad) * track.len;
        const ey = sy - Math.cos(rad) * track.len * 0.35;
        const mx = (sx + ex) / 2 + Math.cos(rad) * 10;
        const my = (sy + ey) / 2 - Math.sin(rad) * 5;
        return (
          <g key={`ht-${i}`}>
            {/* Main track line */}
            <path
              d={`M${sx},${sy} Q${mx},${my} ${ex},${ey}`}
              stroke="#6a5a3a" strokeWidth="1.4" fill="none"
              opacity={0.3 + (i % 4) * 0.04}
              strokeDasharray="2.5 4"
              strokeLinecap="round"
            />
            {/* Paired flipper impressions along track */}
            {[0.3, 0.5, 0.7, 0.85].map((t, j) => {
              const px = sx + (ex - sx) * t;
              const py = sy + (ey - sy) * t;
              const perp = Math.atan2(ey - sy, ex - sx) + Math.PI / 2;
              return (
                <g key={`hp-${i}-${j}`}>
                  <circle cx={px + Math.cos(perp) * 2} cy={py + Math.sin(perp) * 2}
                    r="0.8" fill="#6a5a3a" opacity={0.2 + (j % 2) * 0.08} />
                  <circle cx={px - Math.cos(perp) * 2} cy={py - Math.sin(perp) * 2}
                    r="0.8" fill="#6a5a3a" opacity={0.2 + (j % 2) * 0.08} />
                </g>
              );
            })}
          </g>
        );
      })}

      {/* ── Tiny hatchling silhouettes — detailed ── */}
      {[
        { x: 200, y: 52, r: -76, s: 1.1 },
        { x: 350, y: 22, r: 0, s: 1.0 },
        { x: 500, y: 52, r: 72, s: 1.1 },
        { x: 268, y: 35, r: -44, s: 0.9 },
        { x: 432, y: 38, r: 48, s: 0.95 },
        { x: 310, y: 28, r: -22, s: 0.85 },
        { x: 390, y: 26, r: 18, s: 0.85 },
      ].map((h, i) => (
        <g key={`baby-${i}`} transform={`translate(${h.x},${h.y}) rotate(${h.r}) scale(${h.s})`}>
          {/* Shadow */}
          <ellipse cx="0" cy="1" rx="6" ry="4.5" fill="#4a3a20" opacity="0.12" />
          {/* Shell */}
          <ellipse cx="0" cy="0" rx="5.5" ry="4.5" fill="#4a3a20" opacity="0.5" />
          {/* Shell ridge */}
          <path d="M-3,0 Q0,-2 3,0" stroke="#3a2a10" strokeWidth="0.5" fill="none" opacity="0.3" />
          {/* Head */}
          <ellipse cx="0" cy="-5.5" rx="2.2" ry="2.5" fill="#4a3a20" opacity="0.45" />
          {/* Eyes */}
          <circle cx="-1" cy="-5.8" r="0.5" fill="#2a1a0a" opacity="0.4" />
          <circle cx="1" cy="-5.8" r="0.5" fill="#2a1a0a" opacity="0.4" />
          {/* Front flippers — spread wide */}
          <path d="M-4,-2 Q-8,-3.5 -9,-6" stroke="#4a3a20" strokeWidth="1.4" fill="none" opacity="0.4" strokeLinecap="round" />
          <path d="M4,-2 Q8,-3.5 9,-6" stroke="#4a3a20" strokeWidth="1.4" fill="none" opacity="0.4" strokeLinecap="round" />
          {/* Rear flippers */}
          <path d="M-3.5,2.5 Q-5.5,4.5 -5,6" stroke="#4a3a20" strokeWidth="0.9" fill="none" opacity="0.3" strokeLinecap="round" />
          <path d="M3.5,2.5 Q5.5,4.5 5,6" stroke="#4a3a20" strokeWidth="0.9" fill="none" opacity="0.3" strokeLinecap="round" />
          {/* Tail */}
          <line x1="0" y1="4.5" x2="0" y2="7" stroke="#4a3a20" strokeWidth="0.6" opacity="0.25" />
        </g>
      ))}

      {/* ── Label ── */}
      <text x="350" y="192" textAnchor="middle" fontSize="13" fill="#6a5a38" opacity="0.55" fontStyle="italic">
        Hatchling tracks fanning to surf
      </text>
    </g>
  );
}


/* ═══════════════════════════════════════════════════════════════════════
   WASHED OVER — Storm damage, waterlogged sand, exposed eggs, wrack
   ═══════════════════════════════════════════════════════════════════════ */
function WashedOverSVG() {
  return (
    <g>
      {/* ── Wet/saturated sand area — large dark waterlogged zone ── */}
      <ellipse cx="350" cy="98" rx="165" ry="78" fill="url(#wetSand)" />
      {/* Wet sand transition ring */}
      <ellipse cx="350" cy="98" rx="155" ry="72" fill="none" stroke="#5a4a30"
        strokeWidth="6" opacity="0.06" />
      {/* Wet sand surface texture — darker streaks */}
      <path d="M195,78 Q270,70 350,76 Q430,82 505,74" stroke="#5a4a30" strokeWidth="2" fill="none" opacity="0.18" />
      <path d="M210,105 Q290,112 370,106 Q450,100 520,108" stroke="#5a4a30" strokeWidth="1.5" fill="none" opacity="0.14" />
      <path d="M225,90 Q300,85 360,88 Q420,92 490,86" stroke="#4a3a20" strokeWidth="1" fill="none" opacity="0.1" />

      {/* ── Standing water in depression — reflective ── */}
      <ellipse cx="350" cy="100" rx="100" ry="48" fill="url(#waterPool)" />
      <ellipse cx="340" cy="92" rx="72" ry="34" fill="#5a9ab0" opacity="0.16" />

      {/* Water surface reflections / glints */}
      <ellipse cx="305" cy="85" rx="28" ry="6" fill="url(#waterShimmer)" />
      <ellipse cx="375" cy="96" rx="22" ry="5" fill="url(#waterShimmer)" />
      <ellipse cx="340" cy="108" rx="16" ry="3.5" fill="#8ac0d8" opacity="0.15" />
      <ellipse cx="390" cy="88" rx="12" ry="3" fill="#90c8e0" opacity="0.12" />
      {/* Ripple lines */}
      <path d="M270,88 Q305,82 340,88 Q375,94 410,86" stroke="#7ab8d0" strokeWidth="1" fill="none" opacity="0.2" />
      <path d="M290,100 Q325,95 360,100 Q395,105 420,98" stroke="#7ab8d0" strokeWidth="0.8" fill="none" opacity="0.16" />
      <path d="M310,110 Q340,106 365,110 Q390,114 405,108" stroke="#7ab8d0" strokeWidth="0.6" fill="none" opacity="0.12" />
      {/* Subtle water foam bubbles */}
      {[
        [280, 84], [320, 88], [360, 82], [400, 90],
        [300, 104], [350, 108], [380, 102],
      ].map(([cx, cy], i) => (
        <circle key={`bub-${i}`} cx={cx} cy={cy} r={1.5 + (i % 3) * 0.5}
          fill="none" stroke="#a0d0e8" strokeWidth="0.5" opacity={0.15 + (i % 2) * 0.08} />
      ))}

      {/* ── Exposed eggs at surface — partially buried, wet ── */}
      {[
        { x: 295, y: 78, buried: 0.3 },
        { x: 335, y: 88, buried: 0.5 },
        { x: 385, y: 80, buried: 0.2 },
        { x: 312, y: 108, buried: 0.6 },
        { x: 355, y: 112, buried: 0.4 },
        { x: 402, y: 98, buried: 0.5 },
        { x: 280, y: 95, buried: 0.35 },
        { x: 375, y: 102, buried: 0.45 },
        { x: 418, y: 88, buried: 0.55 },
        { x: 330, y: 100, buried: 0.3 },
      ].map((egg, i) => (
        <g key={`wegg-${i}`}>
          {/* Shadow under egg */}
          <ellipse cx={egg.x + 1} cy={egg.y + 3.5} rx="11" ry="5.5" fill="#3a5a6a" opacity="0.1" />
          {/* Egg body */}
          <ellipse cx={egg.x} cy={egg.y} rx="11" ry="8" fill="#f0e8d0" stroke="#c8b888" strokeWidth="0.8" opacity="0.88" />
          {/* Wet shine highlight — primary */}
          <ellipse cx={egg.x - 2.5} cy={egg.y - 2.5} rx="4.5" ry="2.8" fill="white" opacity="0.35" />
          {/* Wet shine — specular point */}
          <ellipse cx={egg.x - 1.5} cy={egg.y - 3.5} rx="2" ry="1" fill="white" opacity="0.3" />
          {/* Secondary wet sheen */}
          <ellipse cx={egg.x + 2} cy={egg.y + 1} rx="3" ry="1.5" fill="#c8e0f0" opacity="0.1" />
          {/* Sand coverage (partial burial) */}
          <ellipse cx={egg.x} cy={egg.y + 5.5} rx={12} ry={4.5 + egg.buried * 4.5}
            fill="#8a7a58" opacity={0.3 + egg.buried * 0.2} />
        </g>
      ))}

      {/* ── Wrack line debris — seaweed, shell bits, organic matter ── */}
      {[
        { x: 120, y: 42, w: 38 },
        { x: 200, y: 38, w: 32 },
        { x: 300, y: 40, w: 44 },
        { x: 415, y: 36, w: 36 },
        { x: 510, y: 42, w: 30 },
        { x: 160, y: 48, w: 26 },
        { x: 365, y: 44, w: 28 },
        { x: 468, y: 40, w: 34 },
        { x: 560, y: 44, w: 24 },
        { x: 245, y: 46, w: 22 },
      ].map((wr, i) => (
        <g key={`wrack-${i}`}>
          {/* Main seaweed strand */}
          <path
            d={`M${wr.x},${wr.y} q${wr.w * 0.25},${-4 + (i % 3) * 2} ${wr.w * 0.5},${(i % 2) * 3} q${wr.w * 0.15},${2 - (i % 2) * 3} ${wr.w * 0.5},${-1 + (i % 2) * 2}`}
            stroke="#3a5a2a" strokeWidth="3" fill="none" opacity="0.4" strokeLinecap="round"
          />
          {/* Seaweed frond details */}
          <path
            d={`M${wr.x + wr.w * 0.3},${wr.y - 1} q3,-6 1,-11`}
            stroke="#4a6a3a" strokeWidth="1.2" fill="none" opacity="0.22" strokeLinecap="round"
          />
          {/* Secondary strand */}
          <path
            d={`M${wr.x + wr.w * 0.6},${wr.y + 1} q2,-4 0,-8`}
            stroke="#4a6a3a" strokeWidth="0.8" fill="none" opacity="0.15" strokeLinecap="round"
          />
          {/* Attached bubble/bladder */}
          {i % 3 === 0 && (
            <circle cx={wr.x + wr.w * 0.45} cy={wr.y - 2} r="2" fill="#5a7a4a" opacity="0.2" />
          )}
        </g>
      ))}
      {/* Small shell debris in wrack */}
      {[
        [145, 44], [280, 42], [340, 38], [490, 44], [548, 46],
      ].map(([cx, cy], i) => (
        <ellipse key={`wd-${i}`} cx={cx} cy={cy} rx={2 + (i % 2)} ry={1.5}
          fill="#d8d0c0" opacity="0.2" transform={`rotate(${i * 25},${cx},${cy})`} />
      ))}

      {/* ── Tilted nest stakes (driven askew by storm) ── */}
      {/* Left stake */}
      <g>
        <line x1="218" y1="46" x2="230" y2="140" stroke="#6a5a38" strokeWidth="5.5" opacity="0.55" strokeLinecap="round" />
        <line x1="218" y1="46" x2="230" y2="140" stroke="#8a7a50" strokeWidth="2.5" opacity="0.3" strokeLinecap="round" />
        {/* Wood grain lines */}
        <line x1="220" y1="55" x2="228" y2="130" stroke="#5a4a28" strokeWidth="0.6" opacity="0.15" />
        {/* Red tape/flag */}
        <path d="M221,50 Q232,45 237,53 Q230,57 224,54Z" fill="#d04030" opacity="0.55" />
        <path d="M225,52 Q230,49 233,52" stroke="#b02020" strokeWidth="0.5" fill="none" opacity="0.3" />
      </g>
      {/* Right stake */}
      <g>
        <line x1="488" y1="43" x2="476" y2="138" stroke="#6a5a38" strokeWidth="5.5" opacity="0.55" strokeLinecap="round" />
        <line x1="488" y1="43" x2="476" y2="138" stroke="#8a7a50" strokeWidth="2.5" opacity="0.3" strokeLinecap="round" />
        <line x1="486" y1="52" x2="478" y2="128" stroke="#5a4a28" strokeWidth="0.6" opacity="0.15" />
        <path d="M485,46 Q476,42 472,50 Q478,54 484,50Z" fill="#d04030" opacity="0.55" />
        <path d="M480,48 Q476,46 474,49" stroke="#b02020" strokeWidth="0.5" fill="none" opacity="0.3" />
      </g>

      {/* ── Beach scarp edge — sand cliff from erosion ── */}
      <path
        d="M140,58 Q195,52 255,56 Q320,62 380,54 Q445,48 505,56 Q555,62 590,58"
        stroke="#8a7a58" strokeWidth="3.5" fill="none" opacity="0.35" strokeLinecap="round"
      />
      <path
        d="M145,62 Q200,56 260,60 Q325,66 385,58 Q450,52 510,60 Q560,66 590,62"
        stroke="#6a5a38" strokeWidth="2" fill="none" opacity="0.2" strokeLinecap="round"
      />
      {/* Scarp shadow — undercut */}
      <path
        d="M148,65 Q205,59 265,63 Q330,69 390,61 Q455,55 515,63 Q560,68 588,65"
        stroke="#5a4a30" strokeWidth="1.2" fill="none" opacity="0.12" strokeLinecap="round"
      />

      {/* ── Label ── */}
      <text x="350" y="190" textAnchor="middle" fontSize="13" fill="#6a5a38" opacity="0.55" fontStyle="italic">
        Storm surge — eggs exposed
      </text>
    </g>
  );
}
