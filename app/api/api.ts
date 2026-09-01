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
    const formData = new FormData();
    formData.append('rows', params.rows.toString());
    formData.append('columns', params.columns.toString());
    formData.append('num_effects', params.num_effects.toString());
    params.effects.forEach((effect) => formData.append('effects', effect));

    const res = await fetch(`${BASE_URL}/new-game`, {
      method: 'POST',
      body: formData,
    });

    if (!res.ok) throw new Error('Failed to create new game');
    return res.json();
  },

  // GET: URL Query parameter
  async getEffects(gameId: number): Promise<string[]> {
    const url = `${BASE_URL}/get-effects?game_id=${encodeURIComponent(gameId)}`;
    const res = await fetch(url, { method: 'GET' });

    if (!res.ok) throw new Error('Failed to fetch effects');
    return res.json();
  },

  // GET: Tuple passed as query params or JSON array string
  async getLegalMoves(gameId: number, row: number, col: number): Promise<{ legal_moves: [number, number][] }> {
    const url = new URL(`${BASE_URL}/legal-moves`, window.location.origin);
    url.searchParams.append('game_id', gameId.toString());
    // Sends repeated position params to match FastAPI tuple expectation: ?position=0&position=1
    url.searchParams.append('position', row.toString());
    url.searchParams.append('position', col.toString());

    const res = await fetch(url.toString(), { method: 'GET' });

    if (!res.ok) throw new Error('Failed to fetch legal moves');
    return res.json();
  },

  // GET: URL Query parameter
  async getBoardState(gameId: number): Promise<{ board_state: Square[][] }> {
    const url = `${BASE_URL}/get-board-state?game_id=${encodeURIComponent(gameId)}`;
    const res = await fetch(url, { method: 'GET' });

    if (!res.ok) throw new Error('Failed to fetch board state');
    return res.json();
  },
};