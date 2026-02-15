import { Server } from 'socket.io';
import { RoomManager } from './roomManager.js';

interface AnswerData {
  stageId: number;
  questionId: string;
  answer: string;
  timestamp: number;
}

interface AnswerResult {
  correct: boolean;
  points: number;
  speedBonus: number;
  streakBonus: number;
  correctAnswer: string;
}

// Correct answers for every question, keyed by questionId
const CORRECT_ANSWERS: Record<string, string> = {
  // Stage 1 — Nest Identification
  n1: 'Live Nest',
  n2: 'False Crawl',
  n3: 'Predator-Raided',
  n4: 'Hatched (old)',
  n5: 'Washed Over',
  // Stage 2 — Stranding Triage
  s1: 'CC0',
  s2: 'CC1',
  s3: 'CC2',
  s4: 'CC3',
  s5: 'CC4',
  // Stage 4 — Lab Analysis subtasks
  'lab1-st1': 'lab1-m1,lab1-m3,lab1-m5,lab1-m8',
  'lab1-st2': 'Spirorchid cardiovascular fluke egg embolization to the brain',
  'lab1-st3': 'Regenerative anemia from chronic blood loss due to vascular flukes',
  'lab3-st1': 'lab3-s1,lab3-s3,lab3-s5,lab3-s6,lab3-s8,lab3-s10',
  'lab3-st2': 'Intestinal impaction with secondary necrosis and perforation from plastic debris',
  'lab3-st3': 'Severe metabolic acidosis with lactic acidemia and hyperkalemia — consistent with tissue necrosis and sepsis',
  'lab4-st1': 'Mixed respiratory and metabolic acidosis — consistent with cold stunning',
  'lab4-st2': 'Stress hyperglycemia, dehydration, muscle damage, and immune suppression — all consistent with cold-stunning syndrome',
  'lab4-st3': 'Warm slowly — no more than 3-5 degrees C per day — to prevent reperfusion injury and cardiac arrhythmias',
  // Stage 3 — Release (location + checklist keyed separately for split validation)
  'r1-location': 'Warm waters off the coast of central Florida',
  'r1-checklist': 'r1-c1,r1-c2,r1-c3',
  'r2-location': 'Indian River Lagoon, FL (original capture location)',
  'r2-checklist': 'r2-c1,r2-c2,r2-c3',
  'r3-location': 'Nearshore waters off Topsail Beach, NC (original stranding location)',
  'r3-checklist': 'r3-c1,r3-c2,r3-c3',
  'r4-location': 'Warm offshore waters in the Gulf Stream south of Cape Hatteras',
  'r4-checklist': 'r4-c1,r4-c2,r4-c3',
  'r5-location': 'Coral reef habitat in the Florida Keys (near original stranding site)',
  'r5-checklist': 'r5-c1,r5-c2,r5-c3',
  'r6-location': 'Nearshore waters off Mustang Island, TX (original stranding site)',
  'r6-checklist': 'r6-c1,r6-c2,r6-c3',
};

const STREAK_THRESHOLD = 3;
const STREAK_MULTIPLIER = 1.5;

export class GameManager {
  private roomManager: RoomManager;
  private io: Server;
  // Track answer keys per room (loaded when game starts)
  private answerKeys: Map<string, Map<string, string>> = new Map();
  // Track streaks per player for stage 2
  private playerStreaks: Map<string, number> = new Map();

  constructor(roomManager: RoomManager, io: Server) {
    this.roomManager = roomManager;
    this.io = io;
  }

  startGame(roomCode: string): void {
    const room = this.roomManager.getRoom(roomCode);
    if (!room) return;
    room.currentStage = 1;
    room.gameStartTime = Date.now();

    // Initialize answer key for this room
    this.answerKeys.set(roomCode, new Map());

    for (const player of room.players.values()) {
      player.currentQuestion = 0;
      player.scores = { stage1: 0, stage2: 0, stage3: 0, stage4: 0, emergency: 0 };
      player.completedStages = new Set();
      this.playerStreaks.set(player.id, 0);
    }
  }

  registerAnswers(roomCode: string, answers: Array<{ questionId: string; correctAnswer: string }>): void {
    const keyMap = this.answerKeys.get(roomCode) || new Map();
    for (const a of answers) {
      keyMap.set(a.questionId, a.correctAnswer);
    }
    this.answerKeys.set(roomCode, keyMap);
  }

  processAnswer(socketId: string, data: AnswerData): AnswerResult | null {
    const player = this.roomManager.getPlayer(socketId);
    if (!player) return null;

    const roomCode = this.roomManager.getRoomCodeByPlayer(socketId);
    if (!roomCode) return null;

    const room = this.roomManager.getRoom(roomCode);
    if (!room) return null;

    const answerKey = this.answerKeys.get(roomCode);
    const correctAnswer = answerKey?.get(data.questionId) || CORRECT_ANSWERS[data.questionId];

    let isCorrect = correctAnswer
      ? data.answer === correctAnswer
      : true; // fallback for unregistered dynamic questions

    let points = 0;
    let speedBonus = 0;
    let streakBonus = 0;

    const stageKey = `stage${data.stageId}` as keyof typeof player.scores;

    const elapsed = (Date.now() - data.timestamp) / 1000;

    if (data.stageId === 1) {
      // Nest Identification — quick visual ID, reward speed in tiers
      if (isCorrect) {
        points = 100;
        if (elapsed < 3) speedBonus = 75;
        else if (elapsed < 7) speedBonus = 50;
        else if (elapsed < 12) speedBonus = 25;
      } else {
        points = -25;
      }
    } else if (data.stageId === 2) {
      // Surge Triage — categorization under pressure
      const streak = this.playerStreaks.get(socketId) || 0;
      if (isCorrect) {
        points = 75;
        if (elapsed < 4) speedBonus = 50;
        else if (elapsed < 8) speedBonus = 30;
        else if (elapsed < 12) speedBonus = 10;
        this.playerStreaks.set(socketId, streak + 1);
        if (streak + 1 >= STREAK_THRESHOLD) {
          streakBonus = Math.round((points + speedBonus) * (STREAK_MULTIPLIER - 1));
        }
      } else {
        points = -20;
        this.playerStreaks.set(socketId, 0);
      }
    } else if (data.stageId === 3) {
      // Release — client sends "location|id1,id2,id3" combined answer
      const parts = data.answer.split('|');
      const submittedLocation = parts[0] || '';
      const submittedChecklistStr = parts[1] || '';
      const correctLocation = CORRECT_ANSWERS[`${data.questionId}-location`];
      const correctChecklistStr = CORRECT_ANSWERS[`${data.questionId}-checklist`];
      const locCorrect = correctLocation ? submittedLocation === correctLocation : false;

      // Checklist set comparison
      const correctSet = new Set(correctChecklistStr ? correctChecklistStr.split(',') : []);
      const submittedSet = new Set(submittedChecklistStr ? submittedChecklistStr.split(',').filter(Boolean) : []);

      let checklistCorrect = 0;
      let checklistWrong = 0;
      for (const id of submittedSet) {
        if (correctSet.has(id)) {
          checklistCorrect++;
        } else {
          checklistWrong++;
        }
      }
      const perfectChecklist = checklistCorrect === correctSet.size && checklistWrong === 0;

      // Same scoring as client: location=100, each correct=25, each wrong=-15, perfect bonus=50
      if (locCorrect) points += 100;
      points += checklistCorrect * 25;
      points += checklistWrong * -15;
      if (perfectChecklist) points += 50;

      const releaseCorrect = locCorrect && perfectChecklist;
      // Release speed bonus — requires more thought, so generous time windows
      if (releaseCorrect) {
        if (elapsed < 10) speedBonus = 75;
        else if (elapsed < 20) speedBonus = 50;
        else if (elapsed < 30) speedBonus = 25;
      }
      const totalPoints = points + speedBonus + streakBonus;
      player.scores[stageKey] += totalPoints;
      player.currentQuestion++;
      return {
        correct: releaseCorrect,
        points,
        speedBonus,
        streakBonus: 0,
        correctAnswer: `${correctLocation || ''}|${correctChecklistStr || ''}`,
      };
    } else if (data.stageId === 4) {
      // Lab Analysis
      // Check if this is an item-finding subtask (stomach / microscope)
      const correctItems = correctAnswer?.split(',') ?? [];
      const isItemFinding = correctItems.length > 1 && correctItems[0]?.includes('-');

      if (isItemFinding && data.answer !== 'gave_up') {
        // Per-tap scoring: +25 per correct item, -15 per wrong item
        const correctSet = new Set(correctItems);
        const tappedItems = data.answer.split(',').filter(Boolean);
        points = 0;
        for (const item of tappedItems) {
          if (correctSet.has(item)) {
            points += 25;
          } else {
            points -= 15;
          }
        }
        const foundCorrect = tappedItems.filter((id: string) => correctSet.has(id)).length;
        isCorrect = foundCorrect === correctSet.size;
        // Item-finding speed bonus — more items to find, so wider time windows
        if (isCorrect) {
          if (elapsed < 15) speedBonus = 50;
          else if (elapsed < 25) speedBonus = 30;
          else if (elapsed < 40) speedBonus = 15;
        }
      } else {
        // Regular multiple-choice subtask scoring
        if (isCorrect) {
          points = 150;
          if (elapsed < 8) speedBonus = 75;
          else if (elapsed < 15) speedBonus = 40;
          else if (elapsed < 25) speedBonus = 15;
        } else {
          points = -50;
        }
      }
    }

    const totalPoints = points + speedBonus + streakBonus;
    player.scores[stageKey] += totalPoints;
    player.currentQuestion++;

    return {
      correct: isCorrect,
      points,
      speedBonus,
      streakBonus,
      correctAnswer: correctAnswer || data.answer,
    };
  }

  getRankings(roomCode: string): Array<{ id: string; name: string; total: number; scores: Record<string, number> }> {
    const room = this.roomManager.getRoom(roomCode);
    if (!room) return [];

    const rankings = Array.from(room.players.values()).map((p) => ({
      id: p.id,
      name: p.name,
      total: p.scores.stage1 + p.scores.stage2 + p.scores.stage3 + p.scores.stage4 + p.scores.emergency,
      scores: { ...p.scores },
    }));

    rankings.sort((a, b) => b.total - a.total);
    return rankings;
  }

  getStageResults(roomCode: string, stageId: number): Array<{ name: string; stageScore: number }> {
    const room = this.roomManager.getRoom(roomCode);
    if (!room) return [];

    const stageKey = `stage${stageId}` as 'stage1' | 'stage2' | 'stage3' | 'stage4';
    return Array.from(room.players.values())
      .map((p) => ({ name: p.name, stageScore: p.scores[stageKey] }))
      .sort((a, b) => b.stageScore - a.stageScore);
  }

  getFinalResults(roomCode: string) {
    const rankings = this.getRankings(roomCode);
    return {
      rankings,
      topScorer: rankings[0] || null,
    };
  }
}
