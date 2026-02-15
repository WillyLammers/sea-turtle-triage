import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useGame } from '../../context/GameContext';
import { socket } from '../../socket';
import { LAB_CASES } from '../../data/labCases';
import { Timer } from '../shared/Timer';
import { ProgressBar } from '../shared/ProgressBar';
import { LabCase } from './LabCase';
import type { LabCaseType } from './LabCase';
import styles from './Stage3.module.css';

const STAGE_TIME_LIMIT = 360; // 6 minutes

interface SubTaskResult {
  correct: boolean;
  points: number;
}

export function LabAnalysis() {
  const { submitAnswer, completeStage } = useGame();

  const [phase, setPhase] = useState<'intro' | 'playing'>('intro');
  const [currentCaseIdx, setCurrentCaseIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [results, setResults] = useState<Map<string, SubTaskResult>>(new Map());
  const [completed, setCompleted] = useState(false);
  const completedRef = useRef(false);
  const subTaskStartTime = useRef(Date.now());

  const cases = LAB_CASES as LabCaseType[];
  const totalCases = cases.length;
  const currentCase = cases[currentCaseIdx] as LabCaseType | undefined;

  // Listen for authoritative answer-result events from the server
  useEffect(() => {
    const handleResult = (data: { questionId: string; correct: boolean; points: number }) => {
      setResults((prev) => {
        const next = new Map(prev);
        next.set(data.questionId, { correct: data.correct, points: data.points });
        return next;
      });
      setScore((prev) => prev + data.points);
    };

    socket.on('answer-result', handleResult);
    return () => {
      socket.off('answer-result', handleResult);
    };
  }, []);

  // Handle sub-task completion: submit to server and optimistically record result
  const handleSubTaskComplete = useCallback(
    (subTaskId: string, answer: string) => {
      submitAnswer(4, subTaskId, answer, subTaskStartTime.current);

      // Optimistic local result so the UI can advance without waiting for server
      if (currentCase) {
        const subTask = currentCase.subTasks.find((s) => s.id === subTaskId);
        if (subTask) {
          // Check if this is an item-finding subtask (stomach / microscope)
          const correctItems = subTask.correctAnswer.split(',');
          const isItemFinding = correctItems.length > 1 && correctItems[0]?.includes('-');

          let isCorrect: boolean;
          let pts: number;

          if (isItemFinding && answer !== 'gave_up') {
            // Per-tap scoring: +25 per correct, -15 per wrong
            const correctSet = new Set(correctItems);
            const tappedItems = answer.split(',').filter(Boolean);
            pts = 0;
            for (const item of tappedItems) {
              if (correctSet.has(item)) pts += 25;
              else pts -= 15;
            }
            const foundCount = tappedItems.filter((id) => correctSet.has(id)).length;
            isCorrect = foundCount === correctSet.size;
          } else {
            isCorrect = answer === subTask.correctAnswer;
            pts = isCorrect ? subTask.points : 0;
          }

          setResults((prev) => {
            if (prev.has(subTaskId)) return prev;
            const next = new Map(prev);
            next.set(subTaskId, { correct: isCorrect, points: pts });
            return next;
          });
          setScore((prev) => prev + pts);
        }
      }
    },
    [submitAnswer, currentCase],
  );

  // Derive current sub-task index from the results map.
  // The first sub-task without a result is the current one.
  // LabCase manages its own result-overlay lifecycle (showResult state).
  // When the player completes a sub-task:
  //   1. LabCase sets showResult=true and saves lastSubTaskId
  //   2. onSubTaskComplete fires -> result added to map -> this index advances
  //   3. LabCase re-renders with new currentSubTask prop, but showResult is still
  //      true so it continues showing the result overlay for lastSubTaskId
  //   4. Player clicks Next -> showResult=false -> LabCase shows the new sub-task
  const derivedSubTaskIdx = currentCase
    ? currentCase.subTasks.findIndex((st) => !results.has(st.id))
    : 0;

  // -1 means all sub-tasks are done for this case
  const effectiveSubTaskIdx = derivedSubTaskIdx === -1
    ? (currentCase?.subTasks.length ?? 0)
    : derivedSubTaskIdx;

  // Reset subtask start time when the active subtask or case changes
  useEffect(() => {
    subTaskStartTime.current = Date.now();
  }, [effectiveSubTaskIdx, currentCaseIdx]);

  // Advance to the next case when all sub-tasks for the current case are done.
  // effectiveSubTaskIdx >= length means every sub-task has a result.
  // LabCase will show the last result overlay with a "Continue" button.
  // When the user dismisses it, LabCase renders with subTask=undefined (past the end),
  // signalling we should move on.
  useEffect(() => {
    if (!currentCase || completedRef.current) return;
    if (effectiveSubTaskIdx < currentCase.subTasks.length) return;

    const nextCaseIdx = currentCaseIdx + 1;
    if (nextCaseIdx < totalCases) {
      setCurrentCaseIdx(nextCaseIdx);
    } else {
      completedRef.current = true;
      setCompleted(true);
      completeStage(4);
    }
  }, [effectiveSubTaskIdx, currentCase, currentCaseIdx, totalCases, completeStage]);

  // Handle time running out
  const handleTimeUp = useCallback(() => {
    if (completedRef.current) return;
    completedRef.current = true;
    setCompleted(true);
    completeStage(4);
  }, [completeStage]);

  // ---------- Render ----------

  if (phase === 'intro') {
    return (
      <div className={styles.labBackground}>
        <div className={styles.labIntroOverlay}>
          <div className={styles.labIntroIcon}>{'\u{1F52C}'}</div>
          <div className={styles.labIntroTitle}>Stage 4: Lab Analysis</div>
          <p className={styles.labIntroDesc}>
            Analyze tissue samples, interpret blood work, and determine causes of illness
            across multiple clinical cases. Accuracy is critical for each diagnosis.
          </p>
          <div className={styles.labIntroStats}>
            <span className={styles.labIntroChip}>{totalCases} cases to analyze</span>
            <span className={styles.labIntroChip}>{STAGE_TIME_LIMIT / 60}min time limit</span>
          </div>
          <button className={styles.labIntroBtn} onClick={() => setPhase('playing')}>
            Begin Analysis
          </button>
        </div>
      </div>
    );
  }

  if (completed) {
    return (
      <div className={styles.labBackground}>
        <div className={styles.labContent}>
          <div className={styles.completedOverlay}>
            <div className={styles.completedTitle}>Lab Analysis Complete</div>
            <div className={styles.completedScore}>{score} pts</div>
            <div className={styles.completedSub}>
              Waiting for other players...
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.labBackground}>
      <div className={styles.labContent}>
        {/* Header */}
        <div className={styles.labHeader}>
          <div className={styles.labTitle}>Marine Turtle Lab</div>
          <div className={styles.labSubtitle}>Stage 4 -- Lab Analysis</div>
        </div>

        {/* Timer */}
        <div className={styles.timerRow}>
          <Timer seconds={STAGE_TIME_LIMIT} onComplete={handleTimeUp} />
        </div>

        {/* Case progress */}
        <div className={styles.progressRow}>
          <ProgressBar
            current={currentCaseIdx + 1}
            total={totalCases}
            label={`Case ${currentCaseIdx + 1}/${totalCases}`}
          />
        </div>

        {/* Score */}
        <div className={styles.scoreDisplay}>
          Score: <span className={styles.scoreValue}>{score}</span>
        </div>

        {/* Current case */}
        {currentCase && (
          <LabCase
            key={currentCase.id}
            case_={currentCase}
            currentSubTask={effectiveSubTaskIdx}
            onSubTaskComplete={handleSubTaskComplete}
            results={results}
          />
        )}
      </div>
    </div>
  );
}
