import React, { useState, useCallback, useMemo } from 'react';
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

        const newFoundCount = [...next].filter((id) => targetIds.has(id)).length;
        if (newFoundCount === targetIds.size && targetIds.size > 0) {
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
                  if (!disabled && !allFound && !isTapped) handleTap(item.id);
                }}
                role="button"
                tabIndex={disabled || allFound || isTapped ? -1 : 0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    if (!disabled && !allFound && !isTapped) handleTap(item.id);
                  }
                }}
                aria-label={isTapped ? `${item.label} (identified)` : 'Stomach content'}
              />
            );
          })}
        </div>
      </div>

      <div className={styles.microscopeCount}>
        Plastic found:{' '}
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
              +{currentResult.points} pts
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
