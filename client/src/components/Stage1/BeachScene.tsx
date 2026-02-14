import React, { useMemo } from 'react';
import styles from './Stage1.module.css';

interface BeachSceneProps {
  timeOfDay: 'morning' | 'night';
  children: React.ReactNode;
}

function generateStars(count: number) {
  const stars: { x: number; y: number; size: number; twinkle: boolean; delay: string }[] = [];
  let seed = 42;
  const rand = () => {
    seed = (seed * 16807 + 0) % 2147483647;
    return (seed - 1) / 2147483646;
  };
  for (let i = 0; i < count; i++) {
    stars.push({
      x: rand() * 100,
      y: rand() * 65,
      size: 1 + rand() * 2,
      twinkle: rand() > 0.6,
      delay: `${(rand() * 3).toFixed(1)}s`,
    });
  }
  return stars;
}

const WaveSVG: React.FC<{ fill: string }> = ({ fill }) => (
  <svg viewBox="0 0 1200 40" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: '100%' }}>
    <path
      d="M0,20 C100,35 200,5 300,20 C400,35 500,5 600,20 C700,35 800,5 900,20 C1000,35 1100,5 1200,20 L1200,40 L0,40Z"
      fill={fill}
    />
  </svg>
);

/* ── Clouds ── */
const Cloud: React.FC<{ x: number; y: number; scale: number; opacity: number; morning: boolean; variant?: number; className?: string }> = ({
  x, y, scale, opacity, morning, variant = 0, className,
}) => {
  const fill = morning ? `rgba(255,255,255,${opacity})` : `rgba(40,50,70,${opacity * 0.5})`;
  const highlight = morning ? `rgba(255,255,255,${opacity * 1.2})` : `rgba(60,70,90,${opacity * 0.4})`;
  // Different cloud shapes
  if (variant === 1) {
    return (
      <svg className={className} style={{ position: 'absolute', left: `${x}%`, top: `${y}%`, width: `${140 * scale}px`, height: `${55 * scale}px` }} viewBox="0 0 140 55">
        <ellipse cx="45" cy="35" rx="40" ry="18" fill={fill} />
        <ellipse cx="70" cy="22" rx="32" ry="22" fill={fill} />
        <ellipse cx="100" cy="32" rx="35" ry="16" fill={fill} />
        <ellipse cx="65" cy="25" rx="24" ry="14" fill={highlight} />
      </svg>
    );
  }
  if (variant === 2) {
    return (
      <svg className={className} style={{ position: 'absolute', left: `${x}%`, top: `${y}%`, width: `${160 * scale}px`, height: `${50 * scale}px` }} viewBox="0 0 160 50">
        <ellipse cx="50" cy="32" rx="44" ry="16" fill={fill} />
        <ellipse cx="80" cy="20" rx="36" ry="20" fill={fill} />
        <ellipse cx="115" cy="30" rx="38" ry="14" fill={fill} />
        <ellipse cx="40" cy="28" rx="20" ry="10" fill={highlight} />
        <ellipse cx="90" cy="22" rx="18" ry="10" fill={highlight} />
      </svg>
    );
  }
  return (
    <svg className={className} style={{ position: 'absolute', left: `${x}%`, top: `${y}%`, width: `${120 * scale}px`, height: `${50 * scale}px` }} viewBox="0 0 120 50">
      <ellipse cx="35" cy="32" rx="30" ry="14" fill={fill} />
      <ellipse cx="55" cy="20" rx="28" ry="18" fill={fill} />
      <ellipse cx="80" cy="30" rx="32" ry="15" fill={fill} />
      <ellipse cx="50" cy="22" rx="18" ry="12" fill={highlight} />
    </svg>
  );
};

/* ── Seabirds — more detailed ── */
const Seabird: React.FC<{ x: number; y: number; size: number; delay: string; flip?: boolean }> = ({
  x, y, size, delay, flip,
}) => (
  <svg
    className={styles.seabird}
    style={{
      position: 'absolute',
      left: `${x}%`,
      top: `${y}%`,
      width: `${size}px`,
      height: `${size * 0.5}px`,
      animationDelay: delay,
      transform: flip ? 'scaleX(-1)' : undefined,
    }}
    viewBox="0 0 50 24"
    fill="none"
  >
    {/* Wing shape with body mass */}
    <path d="M25,16 Q18,6 4,10" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" fill="none" />
    <path d="M25,16 Q32,6 46,10" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" fill="none" />
    {/* Body */}
    <ellipse cx="25" cy="16" rx="3" ry="1.8" fill="currentColor" opacity="0.6" />
  </svg>
);

/* ── Dune Grass — lusher, fuller clumps ── */
const DuneGrass: React.FC<{ x: number; morning: boolean; size?: number }> = ({ x, morning, size = 1 }) => {
  const c1 = morning ? '#5a7a34' : '#2e3e1e';
  const c2 = morning ? '#7a9a44' : '#3e4e2a';
  const c3 = morning ? '#8aaa54' : '#4a5e3a';
  const w = 48 * size;
  const h = 56 * size;
  return (
    <svg
      className={styles.duneGrass}
      style={{ position: 'absolute', bottom: '46.5%', left: `${x}%`, transform: 'translateX(-50%)' }}
      width={w}
      height={h}
      viewBox="0 0 48 56"
    >
      {/* Main blades - thicker, more numerous */}
      <path d="M24,56 Q22,36 8,6" stroke={c1} strokeWidth="2" fill="none" />
      <path d="M24,56 Q26,32 38,4" stroke={c2} strokeWidth="2" fill="none" />
      <path d="M24,56 Q20,40 4,16" stroke={c1} strokeWidth="1.5" fill="none" opacity="0.7" />
      <path d="M24,56 Q28,36 42,10" stroke={c2} strokeWidth="1.5" fill="none" opacity="0.7" />
      <path d="M24,56 Q24,34 18,4" stroke={c3} strokeWidth="1.8" fill="none" />
      <path d="M24,56 Q23,38 12,12" stroke={c2} strokeWidth="1.2" fill="none" opacity="0.5" />
      <path d="M24,56 Q25,34 34,8" stroke={c1} strokeWidth="1.2" fill="none" opacity="0.5" />
      {/* Seed heads at tips */}
      <ellipse cx="8" cy="5" rx="2" ry="4" fill={c2} opacity="0.5" transform="rotate(-15,8,5)" />
      <ellipse cx="38" cy="3" rx="2" ry="4" fill={c1} opacity="0.5" transform="rotate(12,38,3)" />
      <ellipse cx="18" cy="3" rx="1.5" ry="3.5" fill={c3} opacity="0.4" transform="rotate(-5,18,3)" />
    </svg>
  );
};

/* ── Tiny sand shells ── */
const SandShell: React.FC<{ x: number; y: number; size: number; rot: number; morning: boolean }> = ({ x, y, size, rot, morning }) => {
  const fill = morning ? 'rgba(220,200,170,0.5)' : 'rgba(100,90,70,0.35)';
  const stroke = morning ? 'rgba(180,160,120,0.4)' : 'rgba(70,60,45,0.3)';
  return (
    <svg style={{ position: 'absolute', left: `${x}%`, bottom: `${y}%`, width: `${size}px`, height: `${size}px`, pointerEvents: 'none', zIndex: 1 }} viewBox="0 0 12 12">
      <path d="M6,1 Q10,3 10,7 Q8,11 6,11 Q4,11 2,7 Q2,3 6,1Z" fill={fill} stroke={stroke} strokeWidth="0.5" transform={`rotate(${rot},6,6)`} />
      <line x1="6" y1="2" x2="6" y2="10" stroke={stroke} strokeWidth="0.3" transform={`rotate(${rot},6,6)`} />
    </svg>
  );
};

/* ── Wrack line debris piece ── */
const WrackBit: React.FC<{ x: number; y: number; w: number; morning: boolean }> = ({ x, y, w, morning }) => {
  const c = morning ? 'rgba(90,70,40,0.3)' : 'rgba(50,40,25,0.25)';
  return (
    <svg style={{ position: 'absolute', left: `${x}%`, bottom: `${y}%`, width: `${w}px`, height: '4px', pointerEvents: 'none', zIndex: 1 }} viewBox="0 0 20 4">
      <path d={`M0,2 Q5,0 10,2 Q15,4 20,2`} stroke={c} strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </svg>
  );
};


export function BeachScene({ timeOfDay, children }: BeachSceneProps) {
  const isMorning = timeOfDay === 'morning';
  const stars = useMemo(() => generateStars(80), []);

  const waveFill = isMorning ? 'rgba(79, 179, 217, 0.45)' : 'rgba(15, 40, 71, 0.6)';
  const waveFill2 = isMorning ? 'rgba(45, 127, 166, 0.35)' : 'rgba(10, 22, 40, 0.5)';
  const waveFill3 = isMorning ? 'rgba(168, 230, 240, 0.3)' : 'rgba(26, 74, 110, 0.3)';
  const birdColor = isMorning ? '#5a6a7a' : '#7a8a9a';

  return (
    <div className={styles.beachScene}>
      {/* Sky */}
      <div className={`${styles.sky} ${isMorning ? styles.skyMorning : styles.skyNight}`} />

      {/* Night-only: Stars and Moon */}
      {!isMorning && (
        <>
          <div className={styles.stars}>
            {stars.map((star, i) => (
              <div
                key={i}
                className={`${styles.star} ${star.twinkle ? styles.starTwinkle : ''}`}
                style={{
                  left: `${star.x}%`,
                  top: `${star.y}%`,
                  width: `${star.size}px`,
                  height: `${star.size}px`,
                  animationDelay: star.delay,
                }}
              />
            ))}
          </div>
          <div className={styles.moon}>
            <div className={styles.moonCrater} style={{ top: '18%', left: '25%', width: '12px', height: '12px' }} />
            <div className={styles.moonCrater} style={{ top: '45%', left: '55%', width: '8px', height: '8px' }} />
            <div className={styles.moonCrater} style={{ top: '60%', left: '30%', width: '6px', height: '6px' }} />
          </div>
        </>
      )}

      {/* Morning-only: Sun */}
      {isMorning && <div className={styles.sun} />}

      {/* Clouds */}
      <Cloud x={5} y={4} scale={1.2} opacity={0.85} morning={isMorning} variant={0} className={styles.cloud} />
      <Cloud x={25} y={12} scale={0.9} opacity={0.6} morning={isMorning} variant={1} className={`${styles.cloud} ${styles.cloud2}`} />
      <Cloud x={50} y={6} scale={1.0} opacity={0.75} morning={isMorning} variant={2} className={`${styles.cloud} ${styles.cloud3}`} />
      <Cloud x={70} y={15} scale={0.7} opacity={0.5} morning={isMorning} variant={0} className={`${styles.cloud} ${styles.cloud4}`} />
      <Cloud x={85} y={8} scale={0.85} opacity={0.65} morning={isMorning} variant={1} className={`${styles.cloud} ${styles.cloud5}`} />

      {/* Seabirds */}
      <div style={{ color: birdColor, pointerEvents: 'none' }}>
        <Seabird x={12} y={10} size={30} delay="0s" />
        <Seabird x={22} y={6} size={24} delay="1.5s" flip />
        <Seabird x={55} y={13} size={26} delay="3s" />
        <Seabird x={72} y={5} size={22} delay="0.8s" flip />
        <Seabird x={42} y={16} size={20} delay="2.5s" />
        <Seabird x={35} y={8} size={18} delay="4s" />
        <Seabird x={62} y={11} size={16} delay="1.2s" flip />
      </div>

      {/* Ocean */}
      <div className={`${styles.ocean} ${isMorning ? styles.oceanMorning : styles.oceanNight}`} />

      {/* Animated waves at shore line */}
      <div className={styles.waves}>
        <div className={`${styles.wave} ${styles.wave1}`}>
          <WaveSVG fill={waveFill} />
          <WaveSVG fill={waveFill} />
        </div>
        <div className={`${styles.wave} ${styles.wave2}`}>
          <WaveSVG fill={waveFill2} />
          <WaveSVG fill={waveFill2} />
        </div>
        <div className={`${styles.wave} ${styles.wave3}`}>
          <WaveSVG fill={waveFill3} />
          <WaveSVG fill={waveFill3} />
        </div>
      </div>

      {/* Shore foam line */}
      <div className={`${styles.shoreFoam} ${isMorning ? styles.shoreFoamMorning : styles.shoreFoamNight}`} />

      {/* Sand */}
      <div className={`${styles.sand} ${isMorning ? styles.sandMorning : styles.sandNight}`} />

      {/* Sand surface details */}
      <div className={styles.sandDetails}>
        {/* Tide line / wrack line */}
        <div className={`${styles.tideLine} ${isMorning ? styles.tideLineMorning : styles.tideLineNight}`} />

        {/* Scattered small shells */}
        <SandShell x={8} y={28} size={8} rot={30} morning={isMorning} />
        <SandShell x={18} y={12} size={6} rot={120} morning={isMorning} />
        <SandShell x={32} y={22} size={7} rot={-45} morning={isMorning} />
        <SandShell x={52} y={8} size={9} rot={80} morning={isMorning} />
        <SandShell x={65} y={30} size={6} rot={200} morning={isMorning} />
        <SandShell x={78} y={18} size={8} rot={-30} morning={isMorning} />
        <SandShell x={88} y={10} size={7} rot={150} morning={isMorning} />
        <SandShell x={44} y={35} size={5} rot={60} morning={isMorning} />
        <SandShell x={92} y={25} size={6} rot={-90} morning={isMorning} />

        {/* Wrack line bits near the tide line */}
        <WrackBit x={5} y={42} w={18} morning={isMorning} />
        <WrackBit x={15} y={41} w={12} morning={isMorning} />
        <WrackBit x={28} y={43} w={22} morning={isMorning} />
        <WrackBit x={42} y={42} w={15} morning={isMorning} />
        <WrackBit x={58} y={41} w={20} morning={isMorning} />
        <WrackBit x={72} y={43} w={14} morning={isMorning} />
        <WrackBit x={85} y={42} w={18} morning={isMorning} />
      </div>

      {/* Dune grass clusters — spread across the full horizon */}
      <DuneGrass x={2} morning={isMorning} size={0.9} />
      <DuneGrass x={6} morning={isMorning} size={1.1} />
      <DuneGrass x={11} morning={isMorning} size={0.8} />
      <DuneGrass x={16} morning={isMorning} size={0.7} />
      <DuneGrass x={22} morning={isMorning} size={0.6} />
      <DuneGrass x={30} morning={isMorning} size={0.5} />
      <DuneGrass x={38} morning={isMorning} size={0.55} />
      <DuneGrass x={48} morning={isMorning} size={0.5} />
      <DuneGrass x={56} morning={isMorning} size={0.6} />
      <DuneGrass x={64} morning={isMorning} size={0.5} />
      <DuneGrass x={72} morning={isMorning} size={0.55} />
      <DuneGrass x={78} morning={isMorning} size={0.7} />
      <DuneGrass x={84} morning={isMorning} size={0.8} />
      <DuneGrass x={89} morning={isMorning} size={1.0} />
      <DuneGrass x={94} morning={isMorning} size={1.1} />
      <DuneGrass x={98} morning={isMorning} size={0.9} />

      {/* Children rendered on top */}
      <div className={styles.beachContent}>{children}</div>
    </div>
  );
}
