export interface Player {
  id: string;
  name: string;
  scores: { stage1: number; stage2: number; stage3: number; stage4: number; emergency: number };
  currentQuestion: number;
  ready: boolean;
  completedStages: Set<number>;
}

export interface Room {
  code: string;
  host: string;
  players: Map<string, Player>;
  currentStage: number;
  emergencyTimer: ReturnType<typeof setInterval> | null;
  gameStartTime: number;
}

export class RoomManager {
  private rooms: Map<string, Room> = new Map();
  private playerToRoom: Map<string, string> = new Map();

  private generateCode(): string {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let code = '';
    for (let i = 0; i < 4; i++) {
      code += chars[Math.floor(Math.random() * chars.length)];
    }
    if (this.rooms.has(code)) return this.generateCode();
    return code;
  }

  createRoom(socketId: string, playerName: string): Room {
    const code = this.generateCode();
    const player: Player = {
      id: socketId,
      name: playerName,
      scores: { stage1: 0, stage2: 0, stage3: 0, stage4: 0, emergency: 0 },
      currentQuestion: 0,
      ready: false,
      completedStages: new Set(),
    };

    const room: Room = {
      code,
      host: socketId,
      players: new Map([[socketId, player]]),
      currentStage: 0,
      emergencyTimer: null,
      gameStartTime: 0,
    };

    this.rooms.set(code, room);
    this.playerToRoom.set(socketId, code);
    return room;
  }

  joinRoom(code: string, socketId: string, playerName: string): { error?: string } {
    const room = this.rooms.get(code);
    if (!room) return { error: 'Room not found' };
    if (room.currentStage !== 0) return { error: 'Game already in progress' };
    if (room.players.size >= 15) return { error: 'Room is full' };

    const player: Player = {
      id: socketId,
      name: playerName,
      scores: { stage1: 0, stage2: 0, stage3: 0, stage4: 0, emergency: 0 },
      currentQuestion: 0,
      ready: false,
      completedStages: new Set(),
    };

    room.players.set(socketId, player);
    this.playerToRoom.set(socketId, code);
    return {};
  }

  setPlayerReady(socketId: string): string | null {
    const code = this.playerToRoom.get(socketId);
    if (!code) return null;
    const room = this.rooms.get(code);
    if (!room) return null;
    const player = room.players.get(socketId);
    if (player) player.ready = !player.ready;
    return code;
  }

  getRoom(code: string): Room | undefined {
    return this.rooms.get(code);
  }

  getRoomCodeByPlayer(socketId: string): string | undefined {
    return this.playerToRoom.get(socketId);
  }

  getPlayer(socketId: string): Player | undefined {
    const code = this.playerToRoom.get(socketId);
    if (!code) return undefined;
    return this.rooms.get(code)?.players.get(socketId);
  }

  getPlayerList(code: string): Array<{ id: string; name: string; ready: boolean; scores: Player['scores'] }> {
    const room = this.rooms.get(code);
    if (!room) return [];
    return Array.from(room.players.values()).map((p) => ({
      id: p.id,
      name: p.name,
      ready: p.ready,
      scores: p.scores,
    }));
  }

  setPlayerStageComplete(socketId: string, stageId: number): void {
    const player = this.getPlayer(socketId);
    if (player) {
      player.completedStages.add(stageId);
    }
  }

  allPlayersCompletedStage(code: string, stageId: number): boolean {
    const room = this.rooms.get(code);
    if (!room) return false;
    for (const player of room.players.values()) {
      if (!player.completedStages.has(stageId)) return false;
    }
    return true;
  }

  advanceStage(code: string, nextStage: number): void {
    const room = this.rooms.get(code);
    if (room) {
      room.currentStage = nextStage;
      for (const player of room.players.values()) {
        player.currentQuestion = 0;
      }
    }
  }

  removePlayer(socketId: string): void {
    const code = this.playerToRoom.get(socketId);
    if (!code) return;
    const room = this.rooms.get(code);
    if (room) {
      const wasHost = room.host === socketId;
      room.players.delete(socketId);
      if (wasHost && room.players.size > 0) {
        room.host = room.players.keys().next().value!;
      }
    }
    this.playerToRoom.delete(socketId);
  }

  deleteRoom(code: string): void {
    this.rooms.delete(code);
  }
}
