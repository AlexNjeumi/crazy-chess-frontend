// initialBoard.ts
export interface Piece {
  type: string;      // Matches your SVG icon names: "pawn", "rook", "knight", "bishop", "queen", "king"
  team: 'white' | 'black';
  effects: string[];
}

export interface Square {
  piece: Piece | null;
  effects: string[];
}

// 8x8 Starting Board Matrix
export const initialBoard: Square[][] = [
  // Row 0: Black Major Pieces
  [
    { piece: { type: 'rook', team: 'black', effects: [] }, effects: [] },
    { piece: { type: 'knight', team: 'black', effects: [] }, effects: [] },
    { piece: { type: 'bishop', team: 'black', effects: [] }, effects: [] },
    { piece: { type: 'queen', team: 'black', effects: [] }, effects: [] },
    { piece: { type: 'king', team: 'black', effects: [] }, effects: [] },
    { piece: { type: 'bishop', team: 'black', effects: [] }, effects: [] },
    { piece: { type: 'knight', team: 'black', effects: [] }, effects: [] },
    { piece: { type: 'rook', team: 'black', effects: [] }, effects: [] },
  ],
  // Row 1: Black Pawns
  Array(8).fill(null).map(() => ({
    piece: { type: 'pawn', team: 'black', effects: [] },
    effects: [],
  })),
  // Rows 2-5: Empty Squares
  ...Array(4).fill(null).map(() =>
    Array(8).fill(null).map(() => ({ piece: null, effects: [] }))
  ),
  // Row 6: White Pawns
  Array(8).fill(null).map(() => ({
    piece: { type: 'pawn', team: 'white', effects: [] },
    effects: [],
  })),
  // Row 7: White Major Pieces
  [
    { piece: { type: 'rook', team: 'white', effects: [] }, effects: [] },
    { piece: { type: 'knight', team: 'white', effects: [] }, effects: [] },
    { piece: { type: 'bishop', team: 'white', effects: [] }, effects: [] },
    { piece: { type: 'queen', team: 'white', effects: [] }, effects: [] },
    { piece: { type: 'king', team: 'white', effects: [] }, effects: [] },
    { piece: { type: 'bishop', team: 'white', effects: [] }, effects: [] },
    { piece: { type: 'knight', team: 'white', effects: [] }, effects: [] },
    { piece: { type: 'rook', team: 'white', effects: [] }, effects: [] },
  ],
];