import { useState, useEffect, useCallback } from 'react';

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;
const INITIAL_SPEED = 1000;

const TETROMINOS = {
  I: { shape: [[1, 1, 1, 1]], color: 'bg-cyan-500' },
  O: { shape: [[1, 1], [1, 1]], color: 'bg-yellow-500' },
  T: { shape: [[0, 1, 0], [1, 1, 1]], color: 'bg-purple-500' },
  L: { shape: [[1, 0], [1, 0], [1, 1]], color: 'bg-orange-500' },
  J: { shape: [[0, 1], [0, 1], [1, 1]], color: 'bg-blue-500' },
  Z: { shape: [[1, 1, 0], [0, 1, 1]], color: 'bg-red-500' },
  S: { shape: [[0, 1, 1], [1, 1, 0]], color: 'bg-green-500' }
};

function TetrisGame() {
  const [board, setBoard] = useState(createEmptyBoard());
  const [currentPiece, setCurrentPiece] = useState(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameLoop, setGameLoop] = useState(null);

  function createEmptyBoard() {
    return Array(BOARD_HEIGHT).fill(null).map(() => Array(BOARD_WIDTH).fill(null));
  }

  const saveHighScore = () => {
    const savedScores = JSON.parse(localStorage.getItem('highScores') || '[]');
    savedScores.push({
      game: 'Tetris',
      score,
      date: new Date().toISOString(),
    });
    localStorage.setItem('highScores', JSON.stringify(savedScores));
  };

  const spawnNewPiece = useCallback(() => {
    const pieces = Object.keys(TETROMINOS);
    const newPiece = TETROMINOS[pieces[Math.floor(Math.random() * pieces.length)]];
    setCurrentPiece(newPiece);
    setPosition({ x: Math.floor(BOARD_WIDTH / 2) - 1, y: 0 });
  }, []);

  const checkCollision = useCallback((piece, pos) => {
    if (!piece) return false;
    
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x]) {
          const newX = pos.x + x;
          const newY = pos.y + y;
          
          if (
            newX < 0 || 
            newX >= BOARD_WIDTH ||
            newY >= BOARD_HEIGHT ||
            (newY >= 0 && board[newY][newX])
          ) {
            return true;
          }
        }
      }
    }
    return false;
  }, [board]);

  const mergePieceToBoard = useCallback(() => {
    if (!currentPiece) return;

    const newBoard = board.map(row => [...row]);
    currentPiece.shape.forEach((row, y) => {
      row.forEach((value, x) => {
        if (value) {
          const newY = position.y + y;
          if (newY >= 0) {
            newBoard[newY][position.x + x] = currentPiece.color;
          }
        }
      });
    });

    
    let completedLines = 0;
    for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
      if (newBoard[y].every(cell => cell)) {
        completedLines++;
        newBoard.splice(y, 1);
        newBoard.unshift(Array(BOARD_WIDTH).fill(null));
      }
    }

    
    if (completedLines > 0) {
      setScore(score + (completedLines * 100));
    }

    setBoard(newBoard);
    spawnNewPiece();
  }, [currentPiece, position, board, score, spawnNewPiece]);

  const moveDown = useCallback(() => {
    if (gameOver) return;

    const newPos = { ...position, y: position.y + 1 };
    if (checkCollision(currentPiece, newPos)) {
      if (position.y === 0) {
        setGameOver(true);
        saveHighScore();
        return;
      }
      mergePieceToBoard();
    } else {
      setPosition(newPos);
    }
  }, [position, currentPiece, checkCollision, mergePieceToBoard, gameOver]);

  const moveHorizontally = useCallback((direction) => {
    if (gameOver) return;
    
    const newPos = { ...position, x: position.x + direction };
    if (!checkCollision(currentPiece, newPos)) {
      setPosition(newPos);
    }
  }, [position, currentPiece, checkCollision, gameOver]);

  const rotatePiece = useCallback(() => {
    if (!currentPiece || gameOver) return;

    const rotated = {
      ...currentPiece,
      shape: currentPiece.shape[0].map((_, i) =>
        currentPiece.shape.map(row => row[i]).reverse()
      )
    };

    if (!checkCollision(rotated, position)) {
      setCurrentPiece(rotated);
    }
  }, [currentPiece, position, checkCollision, gameOver]);

  const resetGame = () => {
    setBoard(createEmptyBoard());
    setScore(0);
    setGameOver(false);
    spawnNewPiece();
  };

  useEffect(() => {
    if (!currentPiece && !gameOver) {
      spawnNewPiece();
    }
  }, [currentPiece, spawnNewPiece, gameOver]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft':
          moveHorizontally(-1);
          break;
        case 'ArrowRight':
          moveHorizontally(1);
          break;
        case 'ArrowDown':
          moveDown();
          break;
        case 'ArrowUp':
          rotatePiece();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    const interval = setInterval(moveDown, INITIAL_SPEED);
    setGameLoop(interval);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      if (gameLoop) clearInterval(gameLoop);
    };
  }, [moveDown, moveHorizontally, rotatePiece]);

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-8">Tetris</h1>
      <div className="mb-4">Score: {score}</div>
      <div className="bg-gray-800 p-2 rounded">
        {board.map((row, y) => (
          <div key={y} className="flex">
            {row.map((cell, x) => (
              <div
                key={`${x}-${y}`}
                className={`w-6 h-6 border border-gray-700 ${
                  cell || 
                  (currentPiece?.shape[y - position.y]?.[x - position.x] && 
                   y >= position.y && 
                   currentPiece.color)
                  ? cell || currentPiece.color
                  : 'bg-gray-900'
                }`}
              />
            ))}
          </div>
        ))}
      </div>
      {gameOver && (
        <div className="text-center mt-4">
          <p className="text-xl mb-4">Game Over! Score: {score}</p>
          <button onClick={resetGame} className="btn-primary">
            Nouvelle partie
          </button>
        </div>
      )}
    </div>
  );
}

export default TetrisGame;