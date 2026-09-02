"use client"; // <--- Add this exact string as line 1
import { Icon } from '../components/Icon';
import { chessApi, Square } from '../api/api';
import React, { useState } from 'react';
import {Grid, Typography, Stack, Button, Accordion, Modal, CircularProgress} from '@mui/material';
import { initialBoard } from '../components/initialBoard';
import { useRouter, useParams, useSearchParams } from "next/navigation";


export function DrawBoard({
  squares,
  rows = 8,
  columns = 8,
}: {
  squares: Square[][];
  rows?: number;
  columns?: number;
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

          return (
            <div
              key={`${rowIndex}-${colIndex}`}
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
              {square.piece ? (
                <Icon name={square.piece.type} size={40} />
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
  
  const [oldYPos, setOldYPos] = React.useState<number>(8);
  const [newYPos, setNewYPos] = React.useState<number>(8);
  const [oldXPos, setOldXPos] = React.useState<number>(8);
  const [newXPos, setNewXPos] = React.useState<number>(8);
  const [selectedEffect, setSelectedEffect] = React.useState<string>("");
  const [gameId, setGameId] = useState<number | null>(null);
  const [boardState, setBoardState] = useState<Square[][]>([]);
  const [activeEffects, setActiveEffects] = useState<string[]>([]);
  const [legalMoves, setLegalMoves] = useState<[number, number][]>([]);

  const [loading, setLoading] = useState<boolean>(false);

  const handleExitGame = async () => {
      router.push(`/`); 

  };

  const handleSquareClick = async (row: number, col: number) => {
    if (!gameId) return;
    try {
      const data = await chessApi.getLegalMoves(gameId, row, col);
      setLegalMoves(data.legal_moves);
    } catch (err) {
      console.error('Error fetching legal moves:', err);
    }
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
    // need to fetch the effects from the backend

  return (
    <Stack direction='row'>
      
      {/* Container enforcing square dimensions for the 8x8 grid */}
      
      <Stack style={{ width: '600px', height: '600px' }}>
      <Typography className="text-2xl font-bold text-white mb-4">Crazy Chess</Typography>

        <DrawBoard squares={initialBoard} />
      </Stack>
      <Stack direction="column" style={{  alignItems: "flex-start", marginLeft: "20px" }} spacing={2}>
      <Button variant="contained" onClick={handleExitGame}>Exit Game</Button>
      <Button variant="contained">View powerups</Button>
      </Stack>



    </Stack>
  );
}
