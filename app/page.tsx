"use client"; // <--- Add this exact string as line 1
import { Icon } from './components/Icon';
import { chessApi, Square } from './api/api';
import React, { useState } from 'react';
import {Grid, Typography, Stack, Button, Accordion, Modal, CircularProgress, TextField} from '@mui/material';
import { initialBoard } from './components/initialBoard';
import { useRouter, useParams, useSearchParams } from "next/navigation";
import MatchModal, { Match } from './components/MatchesModal';
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


export default function Page() {
 
  const router = useRouter();
    const [numRows, setNumRows] = React.useState<number>(8);
    const [numColumns, setNumColumns] = React.useState<number>(8);
    const [numEffects, setNumEffects] = React.useState<number>(3);
    const [open, setOpen] = React.useState<boolean>(false);
    const [openMatchesModal, setOpenMatchesModal] = React.useState<boolean>(false);

  const [gameId, setGameId] = useState<number | null>(null);
  const [player1, setPlayer1] = useState<string>('');
  const [player2, setPlayer2] = useState<string>('');
  const [boardState, setBoardState] = useState<Square[][]>([]);
  const [activeEffects, setActiveEffects] = useState<string[]>([]);
  const [legalMoves, setLegalMoves] = useState<[number, number][]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const handleStartGame = async () => {
    setLoading(true);
    try {
      const data = await chessApi.createNewGame({
        rows: numRows,
        columns: numColumns,
        num_effects: numEffects,
        effects: ['freeze', 'double_jump', 'teleport'],
        player1: player1,
        player2: player2
      });

      router.push(`/${data.game_id}`); 

      setOpen(false);
    } catch (err) {
      console.error('Error creating new game:', err);
    } finally {
      setLoading(false);
    }
  };

const handleOpenMatches = async () => {
    setLoading(true);
    try {
      const data = await chessApi.getMatches();
      setMatches(data);
      setOpenMatchesModal(true);
    } catch (error) {
      console.error('Failed to load matches:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectMatch = (matchId: number) => {
    router.push(`/${matchId}`); 
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
      <Button variant="contained" onClick={() => setOpen(true)}>New Game</Button>
      <Button variant="contained">View powerups</Button>
      <Button variant="contained">View Leaderboard</Button>
      <Button 
        variant="contained" 
        onClick={handleOpenMatches}
        disabled={loading}
      >
        {loading ? 'Loading...' : 'View Matches'}
      </Button>
      </Stack>

      <Modal open={open} onClose={() => setOpen(false)} style={{left: '40%', top: '25%', position: 'absolute'}}> 
        <Stack style={{ width: '30%', height: '400px', backgroundColor: 'white', padding: '20px'}}>
          <Typography className="text-2xl font-bold text-black mb-4">New Game Settings</Typography>
          <Stack direction="column" spacing={2}>
            <TextField
        label="Player 1 Name (White)"
        variant="outlined"
        size="small"
        fullWidth
        value={player1}
        onChange={(e) => setPlayer1(e.target.value)}
      />

      <TextField
        label="Player 2 Name (Black)"
        variant="outlined"
        size="small"
        fullWidth
        value={player2}
        onChange={(e) => setPlayer2(e.target.value)}
      />
            <label>
              Number of Rows:
              <input type="number" value={numRows} onChange={(e) => setNumRows(Number(e.target.value))} />
            </label>
            <label>
              Number of Columns:
              <input type="number" value={numColumns} onChange={(e) => setNumColumns(Number(e.target.value))} />
            </label>
            <label>
              Number of Effects:
              <input type="number" value={numEffects} onChange={(e) => setNumEffects(Number(e.target.value))} />
            </label>
      <Button variant="contained" onClick={handleStartGame} disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Start Game'}
      </Button>

          </Stack>
        </Stack>
      </Modal>


      <MatchModal
        open={openMatchesModal}
        onClose={() => setOpenMatchesModal(false)}
        matches={matches}
        onSelectMatch={handleSelectMatch}
      />
        



    </Stack>
  );
}
