"use client"; // <--- Add this exact string as line 1
import { Icon } from '../components/Icon';
import { chessApi, Square } from '../api/api';
import React, { useState, useEffect } from 'react';
import {Grid, Typography, Stack, Button, Accordion, Modal, CircularProgress, Box} from '@mui/material';
import { initialBoard } from '../components/initialBoard';
import { useRouter, useParams, useSearchParams } from "next/navigation";


export function DrawBoard({
  squares,
  rows = 8,
  columns = 8,
  selectedSquare,
  legalMoves = [],
  onSquareClick,
}: {
  squares: Square[][];
  rows?: number;
  columns?: number;
  selectedSquare: { row: number; col: number } | null;
  legalMoves?: [number, number][];
  onSquareClick: (row: number, col: number) => void;
}) {
  return (
    <div
      style={{
        display: 'grid',
        // Dynamically create exact N columns and M rows
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gridTemplateRows: `repeat(${rows}, 1fr)`,
        width: '100%',
        aspectRatio: `${columns} / ${rows}`, // Maintains proper board proportions for any grid size
        border: '2px solid #b58863',
      }}
    >
      {squares.map((row, rowIndex) =>
        row.map((square, colIndex) => {
          const isLightSquare = (rowIndex + colIndex) % 2 === 0;

          // Check if this square is currently selected
          const isSelected = selectedSquare?.row === rowIndex && selectedSquare?.col === colIndex;
          
          // Check if this square is a valid move target
          const isLegalMove = legalMoves.some(([r, c]) => r === rowIndex && c === colIndex);

          // Priority background color: Selected > Legal Move > Default Board Color
          let backgroundColor = isLightSquare ? '#f0d9b5' : '#b58863';
          if (isSelected) {
            backgroundColor = '#baca44'; // Yellow-green highlight for selected piece
          } else if (isLegalMove) {
            backgroundColor = isLightSquare ? '#ced670' : '#aaa23a'; // Highlight for target squares
          }

          return (
            <div
              key={`${rowIndex}-${colIndex}`}
              onClick={() => onSquareClick(rowIndex, colIndex)}
              style={{
                aspectRatio: '1 / 1', // Forces every square to be perfectly 1:1 identical ratio
                backgroundColor: isLightSquare ? '#f0d9b5' : '#b58863',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                userSelect: 'none',
              }}
            >
              {/* Piece Icon (if present) */}
              {square.piece_type ? (
                <Icon name={square.piece_type} size={40} />
              ) : null}

              {/* Coordinate label placed in the corner */}
              <Typography
                variant="caption"
                style={{
                  position: 'absolute',
                  bottom: 2,
                  right: 4,
                  fontSize: '0.65rem',
                  fontWeight: 'bold',
                  color: isLightSquare ? '#b58863' : '#f0d9b5',
                }}
              >
                {String.fromCharCode(97 + colIndex)}{rows - rowIndex}
              </Typography>
            </div>
          );
        })
      )}
    </div>
  );
}


// needs to load the board when directed here, 
// update the board when a piece is moved, and show the legal moves and effects when a piece is clicked.
// update the board when an effect is used

// function NewGamePanel({})
// New Game Panel needs to popup. Needs to set the number of rows, columns, what effects to choose from and how many.


export default function Page() {
 
  const router = useRouter();
  
  const [oldYPos, setOldYPos] = React.useState<number | null>(null);
  const [oldXPos, setOldXPos] = React.useState<number | null>(null);
  const [newYPos, setNewYPos] = React.useState<number | null>(null);
  const [newXPos, setNewXPos] = React.useState<number | null>(null);
  const [selectedEffect, setSelectedEffect] = React.useState<string>("");
  const [activeEffects, setActiveEffects] = useState<string[]>([]);
  const [legalMoves, setLegalMoves] = useState<[number, number][]>([]);

  const params = useParams();
  const gameId = Number(params.id);

  const [boardState, setBoardState] = useState<Square[][]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!gameId || isNaN(gameId)) return;

    async function loadInitialBoard() {
      try {
        setLoading(true);
        const data = await chessApi.getBoardState(gameId);
        setBoardState(data.board_state);
      } catch (err) {
        console.error('Failed to load board state:', err);
        setError('Could not load game session.');
      } finally {
        setLoading(false);
      }
    }

    loadInitialBoard();
  }, [gameId]); 

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  const handleExitGame = async () => {
      router.push(`/`); 

  };

  const handleRefreshBoard = async () => {
    if (!gameId) return;
    try {
      const data = await chessApi.getBoardState(gameId);
      setBoardState(data.board_state);
    } catch (err) {
      console.error('Error fetching board state:', err);
    }
  };

const handleSquareClick = async (row: number, col: number) => {
    // 1. FIRST CLICK: Select piece and fetch legal moves
    if (oldXPos === null || oldYPos === null) {
      const clickedSquare = boardState[row]?.[col];
      
      // Only select if there is a piece on the square
      if (!clickedSquare || !clickedSquare.piece_type) return;

      setOldXPos(col);
      setOldYPos(row);

      if (gameId) {
        try {
          const data = await chessApi.getLegalMoves(gameId, row, col);
          setLegalMoves(data.legal_moves);
        } catch (err) {
          console.error('Error fetching legal moves:', err);
        }
      }
      return;
    }

    // 2. DESELECT: Clicking the same square again resets the selection
    if (oldXPos === col && oldYPos === row) {
      resetSelection();
      return;
    }

    // 3. SECOND CLICK: Set new positions and attempt the move
    setNewXPos(col);
    setNewYPos(row);

    // TODO: Trigger backend move API here using (oldYPos, oldXPos) -> (row, col)
    console.log(`Move attempt from [${oldYPos}, ${oldXPos}] to [${row}, ${col}]`);

    // Reset coordinates for the next move cycle
    resetSelection();
  };

  const resetSelection = () => {
    setOldXPos(null);
    setOldYPos(null);
    setNewXPos(null);
    setNewYPos(null);
    setLegalMoves([]);
  };

  return (
    <Stack direction='row'>
      <Stack style={{ width: '600px', height: '600px' }}>
        <Typography className="text-2xl font-bold text-white mb-4">Crazy Chess</Typography>
        
        <DrawBoard 
          squares={boardState} 
          selectedSquare={oldYPos !== null && oldXPos !== null ? { row: oldYPos, col: oldXPos } : null}
          legalMoves={legalMoves}
          onSquareClick={handleSquareClick}
        />
      </Stack>

      <Stack direction="column" style={{ alignItems: "flex-start", marginLeft: "20px" }} spacing={2}>
        <Button variant="contained" onClick={handleExitGame}>Exit Game</Button>
        <Button variant="contained" onClick={resetSelection}>Deselect</Button>
      </Stack>
    </Stack>
  );
}