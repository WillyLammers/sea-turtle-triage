import { Server } from 'socket.io';
import { RoomManager } from './roomManager.js';

interface EmergencyScenario {
  id: string;
  description: string;
  options: string[];
  correctAnswer: string;
}

const EMERGENCY_SCENARIOS: EmergencyScenario[] = [
  {
    id: 'e1',
    description: 'A juvenile leatherback is entangled in a shark net 2 miles offshore. Fishing vessel reports turtle is still moving. What do you do?',
    options: [
      'Dispatch disentanglement team by boat immediately',
      'Wait for the turtle to free itself',
      'Ask the fishing vessel to cut the net',
      'Radio the vessel to keep the turtle submerged until help arrives',
    ],
    correctAnswer: 'Dispatch disentanglement team by boat immediately',
  },
  {
    id: 'e2',
    description: 'Cold front approaching — water temps dropping to 8°C. Reports of 40+ cold-stunned green turtles washing ashore on a 3-mile stretch. What is the priority action?',
    options: [
      'Set up triage stations along the beach with warming supplies',
      'Wait until the cold front passes to collect turtles',
      'Release all turtles back into the water immediately',
      'Transport turtles directly to a warm-water power plant outflow',
    ],
    correctAnswer: 'Set up triage stations along the beach with warming supplies',
  },
  {
    id: 'e3',
    description: 'Red tide bloom detected near a major nesting beach. Three adult loggerheads found lethargic in the surf zone. What is the correct response?',
    options: [
      'Transport turtles to rehab facility for brevetoxin treatment',
      'Push the turtles back out to deeper water',
      'Administer activated charcoal on the beach and monitor overnight',
      'Relocate the turtles to a beach outside the bloom zone',
    ],
    correctAnswer: 'Transport turtles to rehab facility for brevetoxin treatment',
  },
  {
    id: 'e4',
    description: 'A nesting hawksbill was struck by a vehicle on a coastal road while crossing to her nesting beach. She has a cracked carapace with minor bleeding but is alert. What is the immediate action?',
    options: [
      'Stabilize the turtle, control bleeding, and transport to a veterinary rehab facility',
      'Apply epoxy to the carapace crack on-site and release her to nest',
      'Move her to the beach so she can complete nesting before treatment',
      'Administer antibiotics in the field and schedule a follow-up in 48 hours',
    ],
    correctAnswer: 'Stabilize the turtle, control bleeding, and transport to a veterinary rehab facility',
  },
  {
    id: 'e5',
    description: 'A shrimp trawler reports an unconscious olive ridley caught in its net during a legal trawl with a faulty TED (Turtle Excluder Device). The turtle is not breathing. What should you instruct the crew to do?',
    options: [
      'Place the turtle on its plastron with hindquarters elevated and perform resuscitation — do not return to water until breathing resumes',
      'Return the turtle to the water immediately so it can recover on its own',
      'Keep the turtle on deck in a shaded container and wait for the nearest port',
      'Submerge the turtle in a deck tank of seawater to stimulate breathing',
    ],
    correctAnswer: 'Place the turtle on its plastron with hindquarters elevated and perform resuscitation — do not return to water until breathing resumes',
  },
  {
    id: 'e6',
    description: 'An oil spill has reached a green turtle foraging ground. Survey teams find 12 oiled turtles, some with satellite tags from an ongoing research project. What is the priority?',
    options: [
      'Capture and transport all oiled turtles for decontamination — record satellite tag IDs for researchers',
      'Only capture the satellite-tagged turtles to protect the research investment',
      'Leave the turtles in place and let the oil weather naturally to avoid capture stress',
      'Apply dispersant directly to the turtles in the water to break down the oil',
    ],
    correctAnswer: 'Capture and transport all oiled turtles for decontamination — record satellite tag IDs for researchers',
  },
];

const EMERGENCY_INTERVAL = 180_000; // 3 minutes
const EMERGENCY_JITTER = 30_000; // ±30 seconds
const EMERGENCY_DURATION = 15_000; // 15 seconds to respond

/** Fisher-Yates shuffle (in-place). */
function shuffleArray<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

export class EmergencyManager {
  private roomManager: RoomManager;
  private io: Server;
  private timers: Map<string, ReturnType<typeof setTimeout>> = new Map();
  private activeEmergencies: Map<string, { scenario: EmergencyScenario; startTime: number }> = new Map();
  private usedScenarios: Map<string, Set<string>> = new Map();
  private responseTracker: Map<string, Set<string>> = new Map(); // roomCode -> set of playerIds who responded

  constructor(roomManager: RoomManager, io: Server) {
    this.roomManager = roomManager;
    this.io = io;
  }

  startEmergencyTimer(roomCode: string): void {
    this.usedScenarios.set(roomCode, new Set());
    this.scheduleNext(roomCode);
  }

  private scheduleNext(roomCode: string): void {
    const jitter = (Math.random() - 0.5) * 2 * EMERGENCY_JITTER;
    const delay = EMERGENCY_INTERVAL + jitter;

    const timer = setTimeout(() => {
      this.triggerEmergency(roomCode);
    }, delay);

    this.timers.set(roomCode, timer);
  }

  private triggerEmergency(roomCode: string): void {
    const room = this.roomManager.getRoom(roomCode);
    if (!room || room.currentStage === 0 || room.currentStage >= 4) return;

    const used = this.usedScenarios.get(roomCode) || new Set();
    const available = EMERGENCY_SCENARIOS.filter((s) => !used.has(s.id));
    if (available.length === 0) return; // all scenarios used

    const scenario = available[Math.floor(Math.random() * available.length)];
    used.add(scenario.id);

    this.activeEmergencies.set(roomCode, { scenario, startTime: Date.now() });
    this.responseTracker.set(roomCode, new Set());

    // Shuffle options so the correct answer isn't always in the same position
    const shuffledOptions = shuffleArray([...scenario.options]);

    this.io.to(roomCode).emit('emergency-alert', {
      emergencyId: scenario.id,
      scenario: {
        description: scenario.description,
        options: shuffledOptions,
      },
    });

    // End emergency after duration
    setTimeout(() => {
      this.endEmergency(roomCode, scenario.id);
    }, EMERGENCY_DURATION);
  }

  private endEmergency(roomCode: string, emergencyId: string): void {
    const room = this.roomManager.getRoom(roomCode);
    if (!room) return;

    const responded = this.responseTracker.get(roomCode) || new Set();

    // Apply penalty to non-responders
    for (const player of room.players.values()) {
      if (!responded.has(player.id)) {
        player.scores.emergency -= 75;
      }
    }

    this.activeEmergencies.delete(roomCode);

    this.io.to(roomCode).emit('emergency-end', {
      emergencyId,
      results: {
        respondedCount: responded.size,
        totalPlayers: room.players.size,
      },
    });

    // Schedule next emergency
    this.scheduleNext(roomCode);
  }

  processResponse(socketId: string, data: { emergencyId: string; answer: string; timestamp: number }): { correct: boolean; points: number } | null {
    const roomCode = this.roomManager.getRoomCodeByPlayer(socketId);
    if (!roomCode) return null;

    const active = this.activeEmergencies.get(roomCode);
    if (!active || active.scenario.id !== data.emergencyId) return null;

    const responded = this.responseTracker.get(roomCode);
    if (!responded || responded.has(socketId)) return null; // already responded
    responded.add(socketId);

    const player = this.roomManager.getPlayer(socketId);
    if (!player) return null;

    const isCorrect = data.answer === active.scenario.correctAnswer;
    let points = 0;

    if (isCorrect) {
      points = 200;
      const elapsed = (Date.now() - active.startTime) / 1000;
      if (elapsed < 15) {
        points += Math.round(100 * (1 - elapsed / 15));
      }
    } else {
      points = -75;
    }

    player.scores.emergency += points;

    return { correct: isCorrect, points };
  }

  stopEmergencyTimer(roomCode: string): void {
    const timer = this.timers.get(roomCode);
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(roomCode);
    }
    this.activeEmergencies.delete(roomCode);
    this.usedScenarios.delete(roomCode);
    this.responseTracker.delete(roomCode);
  }
}
