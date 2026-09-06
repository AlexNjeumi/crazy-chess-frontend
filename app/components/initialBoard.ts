// initialBoard.ts
export interface Piece {
  piece_type: string;      // Matches your SVG icon names: "pawn", "rook", "knight", "bishop", "queen", "king"
  team: 'white' | 'black';
  piece_effects: string[];
}

export interface Square {
  piece_type: string | null;
  square_effects: string[];
  piece_effects: string[];
  team: string | null;
  row: number;
  col: number;
}

// 8x8 Starting Board Matrix
export const initialBoard: Square[][] = [
  // Row 0: Black Major Pieces
  [
     { piece_type: 'rook', team: 'black', piece_effects: [] , square_effects: [], row: 0, col: 0},
     { piece_type: 'knight', team: 'black', piece_effects: [] , square_effects: [], row: 0, col: 1},
     { piece_type: 'bishop', team: 'black', piece_effects: [] , square_effects: [], row: 0, col: 2},
     { piece_type: 'queen', team: 'black', piece_effects: [] , square_effects: [], row: 0, col: 3},
     { piece_type: 'king', team: 'black', piece_effects: [] , square_effects: [], row: 0, col: 4},
     { piece_type: 'bishop', team: 'black', piece_effects: [] , square_effects: [], row: 0, col: 5},
     { piece_type: 'knight', team: 'black', piece_effects: [] , square_effects: [], row: 0, col: 6},
     { piece_type: 'rook', team: 'black', piece_effects: [] , square_effects: [], row: 0, col: 7},
  ],
// Row 1: Black Pawns
  Array(8).fill(null).map((_, col) => ({
    piece_type: 'pawn',
    team: 'black',
    piece_effects: [],
    square_effects: [],
    row: 1,
    col,
  })),

  // Rows 2-5: Empty Squares
  ...[2, 3, 4, 5].map((row) =>
    Array(8).fill(null).map((_, col) => ({
      piece_type: null,
      team: null,
      piece_effects: [],
      square_effects: [],
      row,
      col,
    }))
  ),

  // Row 6: White Pawns
  Array(8).fill(null).map((_, col) => ({
    piece_type: 'pawn',
    team: 'white',
    piece_effects: [],
    square_effects: [],
    row: 6,
    col,
  })),
  // Row 7: White Major Pieces
  [
    { piece_type: 'rook', team: 'white', piece_effects: [] , square_effects: [], row: 7, col: 0},
    { piece_type: 'knight', team: 'white', piece_effects: [] , square_effects: [], row: 7, col: 1},
    { piece_type: 'bishop', team: 'white', piece_effects: [] , square_effects: [], row: 7, col: 2},
    { piece_type: 'queen', team: 'white', piece_effects: [] , square_effects: [], row: 7, col: 3},
    { piece_type: 'king', team: 'white', piece_effects: [] , square_effects: [], row: 7, col: 4},
    { piece_type: 'bishop', team: 'white', piece_effects: [] , square_effects: [], row: 7, col: 5},
    { piece_type: 'knight', team: 'white', piece_effects: [] , square_effects: [], row: 7, col: 6},
    { piece_type: 'rook', team: 'white', piece_effects: [] , square_effects: [], row: 7, col: 7},
  ],
];