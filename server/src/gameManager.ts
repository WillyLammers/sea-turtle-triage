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
  // Stage 3 — Release (location + season keyed separately for split validation)
  'r1-location': 'Warm waters off the coast of central Florida',
  'r1-season': 'Spring',
  'r2-location': 'Indian River Lagoon, FL (original capture location)',
  'r2-season': 'Spring',
  'r3-location': 'Nearshore waters off Topsail Beach, NC (original stranding location)',
  'r3-season': 'Summer',
  'r4-location': 'Warm offshore waters in the Gulf Stream south of Cape Hatteras',
  'r4-season': 'Fall',
  'r5-location': 'Coral reef habitat in the Florida Keys (near original stranding site)',
  'r5-season': 'Summer',
  'r6-location': 'Nearshore waters off Mustang Island, TX (original stranding site)',
  'r6-season': 'Spring',
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

    const isCorrect = correctAnswer
      ? data.answer === correctAnswer
      : true; // fallback for unregistered dynamic questions

    let points = 0;
    let speedBonus = 0;
    let streakBonus = 0;

    const stageKey = `stage${data.stageId}` as keyof typeof player.scores;

    if (data.stageId === 1) {
      // Nest Identification
      if (isCorrect) {
        points = 100;
        const elapsed = (Date.now() - data.timestamp) / 1000;
        if (elapsed < 10) speedBonus = Math.round(50 * (1 - elapsed / 10));
      } else {
        points = -25;
      }
    } else if (data.stageId === 2) {
      // Surge Triage
      const streak = this.playerStreaks.get(socketId) || 0;
      if (isCorrect) {
        points = 75;
        const elapsed = (Date.now() - data.timestamp) / 1000;
        if (elapsed < 10) speedBonus = Math.round(30 * (1 - elapsed / 10));
        this.playerStreaks.set(socketId, streak + 1);
        if (streak + 1 >= STREAK_THRESHOLD) {
          streakBonus = Math.round((points + speedBonus) * (STREAK_MULTIPLIER - 1));
        }
      } else {
        points = -20;
        this.playerStreaks.set(socketId, 0);
      }
    } else if (data.stageId === 3) {
      // Release — client sends "location|season" combined answer
      // Split and validate each part separately
      const parts = data.answer.split('|');
      const submittedLocation = parts[0] || '';
      const submittedSeason = parts[1] || '';
      const correctLocation = CORRECT_ANSWERS[`${data.questionId}-location`];
      const correctSeason = CORRECT_ANSWERS[`${data.questionId}-season`];
      const locCorrect = correctLocation ? submittedLocation === correctLocation : false;
      const sznCorrect = correctSeason ? submittedSeason === correctSeason : false;
      if (locCorrect) points += 100;
      if (sznCorrect) points += 50;
      if (locCorrect && sznCorrect) points += 75; // bonus for both
      // Override isCorrect for the result — consider "correct" if at least location is right
      const releaseCorrect = locCorrect && sznCorrect;
      const totalPoints = points + speedBonus + streakBonus;
      player.scores[stageKey] += totalPoints;
      player.currentQuestion++;
      return {
        correct: releaseCorrect,
        points,
        speedBonus: 0,
        streakBonus: 0,
        correctAnswer: `${correctLocation || ''}|${correctSeason || ''}`,
      };
    } else if (data.stageId === 4) {
      // Lab Analysis — accuracy only
      if (isCorrect) {
        points = 150;
      } else {
        points = 0; // partial credit handled client-side
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
