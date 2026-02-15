import React, { useState, useCallback, useMemo, useRef } from 'react';
import type { StomachItemShape } from '../../data/labCases';
import { TurtleSVG } from '../shared/TurtleSVG';
import { Microscope } from './Microscope';
import styles from './Stage3.module.css';

// ---------------------------------------------------------------------------
// Types that mirror the labCases data shape
// ---------------------------------------------------------------------------

interface SubTaskItem {
  id: string;
  label: string;
  isTarget: boolean;
  shape?: StomachItemShape;
}

interface SubTask {
  id: string;
  type: 'microscope' | 'stomach' | 'bloodGas' | 'necropsy';
  description: string;
  items?: (SubTaskItem & { x?: number; y?: number })[];
  options?: string[];
  correctAnswer: string;
  points: number;
  explanation: string;
}

export interface LabCaseType {
  id: string;
  species: string;
  patientHistory: string;
  subTasks: SubTask[];
}

interface SubTaskResult {
  correct: boolean;
  points: number;
}

interface LabCaseProps {
  case_: LabCaseType;
  currentSubTask: number;
  onSubTaskComplete: (subTaskId: string, answer: string) => void;
  results: Map<string, SubTaskResult>;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Deterministically assign x/y positions to items that lack them. */
function ensurePositions(
  items: (SubTaskItem & { x?: number; y?: number })[],
): (SubTaskItem & { x: number; y: number })[] {
  return items.map((item, i) => ({
    ...item,
    x: item.x ?? 15 + ((i * 37 + 13) % 70),
    y: item.y ?? 15 + ((i * 53 + 7) % 70),
  }));
}

// ---------------------------------------------------------------------------
// Sub-task renderers
// ---------------------------------------------------------------------------

function MicroscopeSubTask({
  subTask,
  onComplete,
  disabled,
}: {
  subTask: SubTask;
  onComplete: (answer: string) => void;
  disabled: boolean;
}) {
  const [tappedItems, setTappedItems] = useState<Set<string>>(new Set());

  const positioned = useMemo(
    () => ensurePositions(subTask.items ?? []),
    [subTask.items],
  );

  const targetIds = useMemo(
    () => new Set(positioned.filter((i) => i.isTarget).map((i) => i.id)),
    [positioned],
  );

  const foundCount = useMemo(
    () => [...tappedItems].filter((id) => targetIds.has(id)).length,
    [tappedItems, targetIds],
  );

  const allFound = foundCount === targetIds.size && targetIds.size > 0;

  const handleTap = useCallback(
    (itemId: string) => {
      setTappedItems((prev) => {
        const next = new Set(prev);
        next.add(itemId);

        // Check if all targets found after this tap
        const newFoundCount = [...next].filter((id) => targetIds.has(id)).length;
        if (newFoundCount === targetIds.size && targetIds.size > 0) {
          // small delay so the user sees the green flash before we advance
          setTimeout(() => onComplete(subTask.correctAnswer), 500);
        }

        return next;
      });
    },
    [targetIds, onComplete, subTask.correctAnswer],
  );

  return (
    <>
      <p className={styles.subTaskInstruction}>{subTask.description}</p>

      <Microscope
        items={positioned}
        onTap={handleTap}
        disabled={disabled || allFound}
        tappedItems={tappedItems}
      />

      <div className={styles.microscopeCount}>
        Found:{' '}
        <span className={styles.microscopeCountHighlight}>
          {foundCount}/{targetIds.size}
        </span>
      </div>

      {!allFound && !disabled && (
        <button
          className={styles.giveUpButton}
          onClick={() => onComplete('gave_up')}
        >
          Skip (0 pts)
        </button>
      )}
    </>
  );
}

/** Inline SVG icons for stomach content items (~30px). */
function StomachItemSVG({ shape }: { shape: StomachItemShape }) {
  const s = 30;
  const common = { width: s, height: s, viewBox: '0 0 30 30', xmlns: 'http://www.w3.org/2000/svg' } as const;

  switch (shape) {
    case 'plasticBag':
      return (
        <svg {...common}>
          <path d="M8 6 Q6 6 6 8 L5 22 Q5 25 8 25 L22 25 Q25 25 25 22 L24 8 Q24 6 22 6 Z" fill="rgba(100,180,240,0.5)" stroke="rgba(60,130,200,0.7)" strokeWidth="0.8" />
          <path d="M10 6 L12 3 M20 6 L18 3" stroke="rgba(60,130,200,0.6)" strokeWidth="0.8" fill="none" />
          <path d="M9 12 Q15 14 21 11 M8 18 Q14 20 22 17" stroke="rgba(60,130,200,0.3)" strokeWidth="0.6" fill="none" />
        </svg>
      );
    case 'penCap':
      return (
        <svg {...common}>
          <rect x="10" y="4" width="7" height="20" rx="1.5" fill="#3a5a8a" stroke="#2a4060" strokeWidth="0.8" />
          <rect x="12" y="24" width="3" height="3" rx="0.5" fill="#3a5a8a" stroke="#2a4060" strokeWidth="0.6" />
          <rect x="7" y="7" width="3" height="6" rx="1" fill="#3a5a8a" stroke="#2a4060" strokeWidth="0.6" />
          <line x1="12" y1="6" x2="12" y2="22" stroke="rgba(255,255,255,0.2)" strokeWidth="0.6" />
        </svg>
      );
    case 'balloon':
      return (
        <svg {...common}>
          <ellipse cx="15" cy="12" rx="8" ry="10" fill="#e05070" stroke="#b03050" strokeWidth="0.8" opacity="0.8" />
          <ellipse cx="13" cy="9" rx="2" ry="3" fill="rgba(255,255,255,0.25)" />
          <path d="M15 22 L14 23 L16 23 Z" fill="#b03050" />
          <path d="M15 23 Q12 26 14 28 Q13 29 15 29" stroke="#b03050" strokeWidth="0.8" fill="none" />
        </svg>
      );
    case 'fishingLine':
      return (
        <svg {...common}>
          <path d="M4 8 Q10 4 14 12 Q18 20 24 10 Q28 4 26 14 Q24 22 18 18 Q12 14 8 22" stroke="rgba(200,200,210,0.9)" strokeWidth="1" fill="none" />
          <path d="M8 22 Q6 26 10 26 Q14 24 12 20" stroke="rgba(200,200,210,0.9)" strokeWidth="1" fill="none" />
        </svg>
      );
    case 'polystyrene':
      return (
        <svg {...common}>
          {[
            [8, 10], [14, 7], [20, 11], [11, 16], [17, 15],
            [22, 19], [8, 22], [15, 22], [21, 24], [12, 12],
          ].map(([cx, cy], i) => (
            <circle key={i} cx={cx} cy={cy} r={2.2} fill="#f0f0f0" stroke="#c8c8c8" strokeWidth="0.5" />
          ))}
        </svg>
      );
    case 'rubberBand':
      return (
        <svg {...common}>
          <ellipse cx="15" cy="15" rx="10" ry="7" fill="none" stroke="#c48040" strokeWidth="2.5" opacity="0.85" />
          <ellipse cx="15" cy="15" rx="10" ry="7" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="0.8" />
        </svg>
      );
    case 'crab':
      return (
        <svg {...common}>
          <ellipse cx="15" cy="16" rx="7" ry="5" fill="#b86840" stroke="#8a4a28" strokeWidth="0.8" />
          <circle cx="11" cy="11" r="1.5" fill="#b86840" stroke="#8a4a28" strokeWidth="0.6" />
          <circle cx="19" cy="11" r="1.5" fill="#b86840" stroke="#8a4a28" strokeWidth="0.6" />
          <path d="M8 16 Q4 13 3 10 M22 16 Q26 13 27 10" stroke="#8a4a28" strokeWidth="1.2" fill="none" />
          <path d="M10 20 L8 24 M13 21 L12 25 M17 21 L18 25 M20 20 L22 24" stroke="#8a4a28" strokeWidth="0.8" fill="none" />
        </svg>
      );
    case 'shrimp':
      return (
        <svg {...common}>
          <path d="M22 8 Q20 6 18 8 Q14 12 10 14 Q7 16 6 20 Q5 23 8 24 Q11 24 14 22 Q16 20 18 18" fill="#d4907a" stroke="#a06850" strokeWidth="0.8" />
          <path d="M8 24 L6 26 M9 24 L8 27" stroke="#a06850" strokeWidth="0.6" fill="none" />
          <line x1="22" y1="8" x2="26" y2="5" stroke="#a06850" strokeWidth="0.6" />
          <line x1="22" y1="8" x2="27" y2="7" stroke="#a06850" strokeWidth="0.6" />
        </svg>
      );
    case 'seagrass':
      return (
        <svg {...common}>
          <path d="M10 28 Q9 20 11 14 Q13 8 10 3" stroke="#5a8a40" strokeWidth="1.5" fill="none" />
          <path d="M15 28 Q14 18 16 12 Q18 6 15 2" stroke="#6a9a50" strokeWidth="1.5" fill="none" />
          <path d="M20 28 Q19 22 21 16 Q23 10 20 5" stroke="#4a7a35" strokeWidth="1.5" fill="none" />
        </svg>
      );
    case 'mollusk':
      return (
        <svg {...common}>
          <path d="M15 5 Q22 8 24 15 Q25 22 20 26 Q15 28 10 26 Q5 22 6 15 Q7 8 15 5 Z" fill="#c8b8a0" stroke="#9a8a70" strokeWidth="0.8" />
          <path d="M15 5 Q16 12 15 20 Q14 25 13 26" stroke="#9a8a70" strokeWidth="0.6" fill="none" />
          <path d="M10 10 Q14 12 18 10 M8 16 Q14 18 22 15 M9 22 Q14 23 20 21" stroke="rgba(154,138,112,0.4)" strokeWidth="0.5" fill="none" />
        </svg>
      );
  }
}

const STOMACH_CORRECT_PTS = 25;
const STOMACH_WRONG_PTS = 15;

interface TapFeedback {
  key: number;
  points: number;
  x: number;
  y: number;
}

function StomachSubTask({
  subTask,
  onComplete,
  disabled,
}: {
  subTask: SubTask;
  onComplete: (answer: string) => void;
  disabled: boolean;
}) {
  const [tappedItems, setTappedItems] = useState<Set<string>>(new Set());
  const [tapScore, setTapScore] = useState(0);
  const [tapFeedback, setTapFeedback] = useState<TapFeedback[]>([]);
  const feedbackKeyRef = useRef(0);

  const positioned = useMemo(
    () => ensurePositions(subTask.items ?? []),
    [subTask.items],
  );

  const targetIds = useMemo(
    () => new Set(positioned.filter((i) => i.isTarget).map((i) => i.id)),
    [positioned],
  );

  const foundCount = useMemo(
    () => [...tappedItems].filter((id) => targetIds.has(id)).length,
    [tappedItems, targetIds],
  );

  const allFound = foundCount === targetIds.size && targetIds.size > 0;

  const handleTap = useCallback(
    (itemId: string, x: number, y: number) => {
      const isTarget = targetIds.has(itemId);
      const pts = isTarget ? STOMACH_CORRECT_PTS : -STOMACH_WRONG_PTS;

      setTapScore((prev) => prev + pts);

      // Floating point feedback
      const key = feedbackKeyRef.current++;
      setTapFeedback((prev) => [...prev, { key, points: pts, x, y }]);
      setTimeout(() => {
        setTapFeedback((prev) => prev.filter((f) => f.key !== key));
      }, 800);

      setTappedItems((prev) => {
        const next = new Set(prev);
        next.add(itemId);

        const newFoundCount = [...next].filter((id) => targetIds.has(id)).length;
        if (newFoundCount === targetIds.size && targetIds.size > 0) {
          // Submit ALL tapped items for per-tap server scoring
          const allTapped = [...next].join(',');
          setTimeout(() => onComplete(allTapped), 500);
        }

        return next;
      });
    },
    [targetIds, onComplete],
  );

  return (
    <>
      <p className={styles.subTaskInstruction}>{subTask.description}</p>

      <div className={styles.stomachWrapper}>
        <div className={styles.stomachViewport}>
          <div className={styles.stomachLabel}>Stomach Contents</div>

          {positioned.map((item) => {
            const isTapped = tappedItems.has(item.id);
            const wasCorrect = isTapped && item.isTarget;
            const wasWrong = isTapped && !item.isTarget;

            const itemClasses = [
              styles.stomachItem,
              item.isTarget ? styles.stomachItemPlastic : styles.stomachItemNatural,
              isTapped ? styles.itemTapped : '',
              wasCorrect ? styles.stomachItemTappedCorrect : '',
              wasWrong ? styles.stomachItemTappedWrong : '',
              disabled || allFound ? styles.itemDisabled : '',
            ]
              .filter(Boolean)
              .join(' ');

            return (
              <div
                key={item.id}
                className={itemClasses}
                style={{ left: `${item.x}%`, top: `${item.y}%` }}
                onClick={() => {
                  if (!disabled && !allFound && !isTapped) handleTap(item.id, item.x, item.y);
                }}
                role="button"
                tabIndex={disabled || allFound || isTapped ? -1 : 0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    if (!disabled && !allFound && !isTapped) handleTap(item.id, item.x, item.y);
                  }
                }}
                aria-label={isTapped ? `${item.label} (identified)` : 'Stomach content'}
              >
                {item.shape && <StomachItemSVG shape={item.shape} />}
              </div>
            );
          })}

          {/* Floating per-tap point feedback */}
          {tapFeedback.map((fb) => (
            <div
              key={fb.key}
              className={`${styles.tapFeedback} ${fb.points > 0 ? styles.tapFeedbackPositive : styles.tapFeedbackNegative}`}
              style={{ left: `${fb.x}%`, top: `${fb.y}%` }}
            >
              {fb.points > 0 ? '+' : ''}{fb.points}
            </div>
          ))}
        </div>
      </div>

      <div className={styles.microscopeCount}>
        Plastic found:{' '}
        <span className={styles.microscopeCountHighlight}>
          {foundCount}/{targetIds.size}
        </span>
        <span className={`${styles.stomachScore} ${tapScore >= 0 ? styles.stomachScorePositive : styles.stomachScoreNegative}`}>
          {tapScore >= 0 ? '+' : ''}{tapScore} pts
        </span>
      </div>

      {!allFound && !disabled && (
        <button
          className={styles.giveUpButton}
          onClick={() => onComplete([...tappedItems].join(',') || 'gave_up')}
        >
          Skip ({tapScore >= 0 ? '+' : ''}{tapScore} pts)
        </button>
      )}
    </>
  );
}

function BloodGasSubTask({
  subTask,
  onComplete,
  disabled,
}: {
  subTask: SubTask;
  onComplete: (answer: string) => void;
  disabled: boolean;
}) {
  // Parse the description to extract blood-gas values.
  // Expected format: "pH: 7.18 | pCO2: 62 mmHg | HCO3: 14 mEq/L | Lactate: 8.5 mmol/L"
  // Falls back to showing the raw description if parsing fails.
  const readings = useMemo(() => {
    const pairs = subTask.description.split('|').map((s) => s.trim());
    if (pairs.length < 2) return null;
    return pairs.map((pair) => {
      const [label, ...rest] = pair.split(':');
      return { label: label?.trim() ?? '', value: rest.join(':').trim() };
    });
  }, [subTask.description]);

  return (
    <>
      <p className={styles.subTaskInstruction}>Interpret the blood gas results:</p>

      {readings ? (
        <table className={styles.bloodGasTable}>
          <thead>
            <tr>
              <th>Parameter</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {readings.map((r) => (
              <tr key={r.label}>
                <td>{r.label}</td>
                <td className={styles.bloodGasValue}>{r.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className={styles.necropsyBox}>
          <p className={styles.necropsyText}>{subTask.description}</p>
        </div>
      )}

      <div className={styles.optionsGrid}>
        {(subTask.options ?? []).map((opt) => (
          <button
            key={opt}
            className={styles.optionButton}
            disabled={disabled}
            onClick={() => onComplete(opt)}
          >
            {opt}
          </button>
        ))}
      </div>
    </>
  );
}

function NecropsySubTask({
  subTask,
  onComplete,
  disabled,
}: {
  subTask: SubTask;
  onComplete: (answer: string) => void;
  disabled: boolean;
}) {
  return (
    <>
      <p className={styles.subTaskInstruction}>Determine the cause of death:</p>

      <div className={styles.necropsyBox}>
        <div className={styles.necropsyTitle}>Necropsy Findings</div>
        <p className={styles.necropsyText}>{subTask.description}</p>
      </div>

      <div className={styles.optionsGrid}>
        {(subTask.options ?? []).map((opt) => (
          <button
            key={opt}
            className={styles.optionButton}
            disabled={disabled}
            onClick={() => onComplete(opt)}
          >
            {opt}
          </button>
        ))}
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// LabCase component
// ---------------------------------------------------------------------------

export function LabCase({
  case_,
  currentSubTask,
  onSubTaskComplete,
  results,
}: LabCaseProps) {
  const [showResult, setShowResult] = useState(false);
  const [lastSubTaskId, setLastSubTaskId] = useState<string | null>(null);

  const subTask = case_.subTasks[currentSubTask] as SubTask | undefined;

  const handleComplete = useCallback(
    (answer: string) => {
      if (!subTask) return;
      setLastSubTaskId(subTask.id);
      setShowResult(true);
      onSubTaskComplete(subTask.id, answer);
    },
    [subTask, onSubTaskComplete],
  );

  const handleNext = useCallback(() => {
    setShowResult(false);
    setLastSubTaskId(null);
  }, []);

  // Determine the result to display
  const currentResult = lastSubTaskId ? results.get(lastSubTaskId) : undefined;
  const currentExplanation = lastSubTaskId
    ? case_.subTasks.find((s) => s.id === lastSubTaskId)?.explanation
    : undefined;

  const isLastSubTask = currentSubTask >= case_.subTasks.length;
  const disabled = showResult;

  return (
    <div className={styles.caseCard}>
      {/* Patient header */}
      <div className={styles.caseHeader}>
        <TurtleSVG species={case_.species as any} size={64} />
        <div className={styles.caseHeaderInfo}>
          <div className={styles.caseSpecies}>{case_.species}</div>
          <div className={styles.caseHistory}>{case_.patientHistory}</div>
        </div>
      </div>

      {/* Sub-task body */}
      <div className={styles.subTaskBody}>
        {showResult && currentResult ? (
          <div
            className={`${styles.resultOverlay} ${
              currentResult.correct ? styles.resultCorrect : styles.resultWrong
            }`}
          >
            <div
              className={`${styles.resultLabel} ${
                currentResult.correct
                  ? styles.resultLabelCorrect
                  : styles.resultLabelWrong
              }`}
            >
              {currentResult.correct ? 'Correct!' : 'Incorrect'}
            </div>
            <div className={styles.resultPoints}>
              {currentResult.points >= 0 ? '+' : ''}{currentResult.points} pts
            </div>
            {currentExplanation && (
              <div className={styles.resultExplanation}>
                {currentExplanation}
              </div>
            )}
            {!isLastSubTask && (
              <button className={styles.nextButton} onClick={handleNext}>
                Next
              </button>
            )}
            {isLastSubTask && (
              <button className={styles.nextButton} onClick={handleNext}>
                Continue
              </button>
            )}
          </div>
        ) : subTask ? (
          <>
            {subTask.type === 'microscope' && (
              <MicroscopeSubTask
                key={subTask.id}
                subTask={subTask}
                onComplete={handleComplete}
                disabled={disabled}
              />
            )}
            {subTask.type === 'stomach' && (
              <StomachSubTask
                key={subTask.id}
                subTask={subTask}
                onComplete={handleComplete}
                disabled={disabled}
              />
            )}
            {subTask.type === 'bloodGas' && (
              <BloodGasSubTask
                key={subTask.id}
                subTask={subTask}
                onComplete={handleComplete}
                disabled={disabled}
              />
            )}
            {subTask.type === 'necropsy' && (
              <NecropsySubTask
                key={subTask.id}
                subTask={subTask}
                onComplete={handleComplete}
                disabled={disabled}
              />
            )}
          </>
        ) : null}
      </div>

      {/* Sub-task progress dots */}
      <div className={styles.subTaskDots}>
        {case_.subTasks.map((st, idx) => {
          const result = results.get(st.id);
          let dotClass = styles.dot;
          if (result) {
            dotClass += ` ${result.correct ? styles.dotCompleted : styles.dotWrong}`;
          } else if (idx === currentSubTask) {
            dotClass += ` ${styles.dotCurrent}`;
          }
          return <div key={st.id} className={dotClass} />;
        })}
      </div>
    </div>
  );
}
