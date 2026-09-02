// lib/api.ts
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/crazy-chess';

export interface Piece {
  type: string;
  team: string;
  effects: string[];
}

export interface Square {
  piece: Piece | null;
  effects: string[];
}

export interface NewGameParams {
  rows: number;
  columns: number;
  num_effects: number;
  effects: string[];
}

export interface NewGameResponse {
  game_id: number;
  board_state: Square[][];
  effects: string[];
}

export const chessApi = {
  // POST: Form payload sent via body
async createNewGame(params: NewGameParams): Promise<NewGameResponse> {
    const res = await fetch(`${BASE_URL}/new-game`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        rows: Number(params.rows),
        columns: Number(params.columns),
        num_effects: Number(params.num_effects),
        effects: params.effects,
      }),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      console.error('API Error Response:', errorData);
      throw new Error('Failed to create new game');
    }

    return res.json();
  },

  // GET: URL Query parameter
  async getEffects(gameId: number): Promise<string[]> {
const res = await fetch(`${BASE_URL}/get-effects/${gameId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },

    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      console.error('API Error Response:', errorData);
      throw new Error('Failed to get effects');
    }

// const data = await res.json();
  
  // return data.effects ?? data;
  return res.json();

  },

async getLegalMoves(gameId: number, row: number, col: number): Promise<{ legal_moves: [number, number][] }> {
  const query = new URLSearchParams({
    game_id: gameId.toString(),
    row: row.toString(),
    col: col.toString(),
  }).toString();

  const res = await fetch(`${BASE_URL}/legal-moves?${query}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    console.error('API Error Response:', errorData);
    throw new Error(`Failed to fetch legal moves for piece at (${row}, ${col})`);
  }

  return res.json();
},

  // GET: URL Query parameter
  async getBoardState(gameId: number): Promise<{ board_state: Square[][] }> {
    const res = await fetch(`${BASE_URL}/get-board-state/${gameId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },

    });
    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      console.error('API Error Response:', errorData);
      throw new Error('Failed to create new game');
    }

    return res.json();
  }}