"use client"; // <--- Add this exact string as line 1
import { Icon } from './components/Icon';

import React, { useState } from 'react';
import {Grid, Typography, Stack, Button, Accordion} from '@mui/material';
import { initialBoard } from './components/initialBoard';

interface Piece {
    type: string;
    team: string;
    effects: string[];
}

interface Square {
    piece: Piece | null;
    effects: string[];
}

// interface Board {
//     squares: Square[][];
// }
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

interface Task {
  id: number;
  title: string;
  isDone: boolean;
}


export default function Page() {
  return (
    <Stack direction='row'>
      
      {/* Container enforcing square dimensions for the 8x8 grid */}
      
      <Stack style={{ width: '600px', height: '600px' }}>
      <Typography className="text-2xl font-bold text-white mb-4">Crazy Chess</Typography>

        <DrawBoard squares={initialBoard} />
      </Stack>
      <Stack direction="column" style={{  alignItems: "flex-start", marginLeft: "20px" }} spacing={2}>
      <Button variant="contained" >New Game</Button>
      <Button variant="contained">View powerups</Button>
      <Button variant="contained">View Leaderboard</Button>
      </Stack>

    </Stack>
  );
}

// const App: React.FC = () => {
//   const [tasks, setTasks] = useState<Task[]>([
//     { id: 1, title: 'Take out the trash', isDone: false },
//     { id: 2, title: 'Do the dishes', isDone: false },
//   ]);
//   const [newTaskTitle, setNewTaskTitle] = useState<string>('');

//   const handleCheckboxClick = (id: number) => {
//     setTasks(
//       tasks.map(task => {
//         if (task.id === id) {
//           return { ...task, isDone: !task.isDone };
//         }
//         return task;
//       }),
//     );
//   };

//   const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     setNewTaskTitle(event.target.value);
//   };

//   const handleAddTask = () => {
//     setTasks([...tasks, { id: tasks.length + 1, title: newTaskTitle, isDone: false }]);
//     setNewTaskTitle('');
//   };

//   const handleDeleteTask = (id: number) => {
//     setTasks(tasks.filter(task => task.id !== id));
//   };

//   interface IconProps {
//   color?: string;
//   size?: number;
// }


//   return (
//     <div>
//       <h1>My To-Do List</h1>
//       <ul>
//         {tasks.map(task => (
//           <li key={task.id}>
//             <input
//               type="checkbox"
//               checked={task.isDone}
//               onChange={() => handleCheckboxClick(task.id)}
//             />
//             <span style={{ textDecoration: task.isDone ? 'line-through' : 'none' }}>
//               {task.title}
//             </span>
//             <button onClick={() => handleDeleteTask(task.id)}>Delete</button>
//           </li>
//         ))}
//       </ul>
//       <div>
//         <input type="text" value={newTaskTitle} onChange={handleInputChange} />
//         <button onClick={handleAddTask}>Add Task</button>
//       </div>
//       <Icon name="queen" size={800} className="invert"/>
//       <Icon name="queen" className="drop-shadow-[0_0_0_rgba(255,0,0,1)]" />
 
    
//     </div>
//   );
// };



