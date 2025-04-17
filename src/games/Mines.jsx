import React, { useState } from "react";
import "./Mines.css"; 

const generateBoard = (size, numMines) => {
  const board = Array(size)
    .fill(null)
    .map(() =>
      Array(size).fill().map(() => ({
        mine: false,
        revealed: false,
        adjacentMines: 0,
      }))
    );

  let minesPlaced = 0;
  while (minesPlaced < numMines) {
    const x = Math.floor(Math.random() * size);
    const y = Math.floor(Math.random() * size);
    if (!board[x][y].mine) {
      board[x][y].mine = true;
      minesPlaced++;
    }
  }

  const directions = [
    [-1, -1], [-1, 0], [-1, 1],
    [0, -1],          [0, 1],
    [1, -1],  [1, 0], [1, 1],
  ];

  for (let x = 0; x < size; x++) {
    for (let y = 0; y < size; y++) {
      if (board[x][y].mine) continue;
      let count = 0;
      directions.forEach(([dx, dy]) => {
        const nx = x + dx, ny = y + dy;
        if (nx >= 0 && nx < size && ny >= 0 && ny < size && board[nx][ny].mine) {
          count++;
        }
      });
      board[x][y].adjacentMines = count;
    }
  }

  return board;
};

const Mines = () => {
  const size = 8;
  const numMines = 10;

  const [board, setBoard] = useState(generateBoard(size, numMines));
  const [gameOver, setGameOver] = useState(false);
  const [gameWon, setGameWon] = useState(false);

  const revealCell = (x, y, boardCopy = null) => {
    const newBoard = boardCopy ? boardCopy : board.map(row => row.map(cell => ({ ...cell })));

    if (newBoard[x][y].revealed || newBoard[x][y].mine) return newBoard;

    newBoard[x][y].revealed = true;

    if (newBoard[x][y].adjacentMines === 0) {
      const directions = [
        [-1, -1], [-1, 0], [-1, 1],
        [0, -1],          [0, 1],
        [1, -1],  [1, 0], [1, 1],
      ];
      directions.forEach(([dx, dy]) => {
        const nx = x + dx, ny = y + dy;
        if (nx >= 0 && nx < size && ny >= 0 && ny < size && !newBoard[nx][ny].revealed) {
          newBoard = revealCell(nx, ny, newBoard);
        }
      });
    }

    return newBoard;
  };

  const handleClick = (x, y) => {
    if (gameOver || gameWon) return;

    const cell = board[x][y];

    if (cell.mine) {
      const revealedAll = board.map(row => row.map(cell => ({ ...cell, revealed: true })));
      setBoard(revealedAll);
      setGameOver(true);
      return;
    }

    const newBoard = revealCell(x, y);
    setBoard(newBoard);

    const won = newBoard.flat().every(cell => cell.revealed || cell.mine);
    if (won) setGameWon(true);
  };

  const resetGame = () => {
    setBoard(generateBoard(size, numMines));
    setGameOver(false);
    setGameWon(false);
  };

  return (
    <div className="mines-container">
      <h2 className="mines-title">Démineur</h2>
      {gameOver && <p className="status-message lost">Perdu !</p>}
      {gameWon && <p className="status-message won">Gagné !</p>}
      
      <div className="mines-board">
        {board.map((row, x) =>
          row.map((cell, y) => (
            <div
              key={`${x}-${y}`}
              onClick={() => handleClick(x, y)}
              className={`mines-cell ${cell.revealed ? 'revealed' : 'unrevealed'}`}
            >
              {cell.revealed && cell.mine && "💣"}
              {cell.revealed && !cell.mine && cell.adjacentMines > 0 && (
                <span className={`number-${cell.adjacentMines}`}>
                  {cell.adjacentMines}
                </span>
              )}
            </div>
          ))
        )}
      </div>
      
      <button onClick={resetGame} className="reset-button">
        Recommencer
      </button>
    </div>
  );
};

export default Mines;