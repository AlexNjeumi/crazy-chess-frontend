'use client';

import {

  Button,
  Modal,
  Typography,
  Chip,
  Box,
} from '@mui/material';

export interface Match {
  game_id: number;
  player1: string;
  player2: string;
  status: string;
  winner: string | null;
  date: string;
}

interface MatchModalProps {
  open: boolean;
  onClose: () => void;
  matches: Match[];
  onSelectMatch?: (matchId: number) => void;
}

export default function MatchModal({
  open,
  onClose,
  matches,
  onSelectMatch,
}: MatchModalProps) {
  
  const getStatusChipColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'finished':
        return 'success';
      case 'ongoing':
        return 'primary';
      case 'abandoned':
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ p: 4, bg: 'background.paper', maxWidth: 600, mx: 'auto', mt: '10vh', maxHeight: '80vh', overflowY: 'auto'  , backgroundColor: '#ffffff' }}>
        {matches.length > 0 ? (
          matches.map((match) => (
            <Box key={match.game_id} sx={{ mb: 2, p: 2, border: '1px solid #ccc', borderRadius: '8px'}}>
              <Typography variant="h6">Match ID: {match.game_id}</Typography>
              <Typography variant="body1">Players: {match.player1} vs {match.player2}</Typography>
              <Chip label={match.status} color={getStatusChipColor(match.status)} sx={{ mt: 1 }} />
              {match.winner && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Winner: {match.winner}
                </Typography>
              )}
              <Typography variant="body2" sx={{ mt: 1 }}>
                Date: {new Date(match.date).toLocaleString()}
              </Typography>
              {onSelectMatch && (
                <Button
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2 }}
                  onClick={() => onSelectMatch(match.game_id)}
                >
                  View Match
                </Button>
              )}
            </Box>
          ))
        ) : (
          <Typography variant="body1">No matches available.</Typography>
        )}
      </Box>
    </Modal>
  );


}