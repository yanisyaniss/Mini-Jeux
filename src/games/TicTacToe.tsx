import { useState, useEffect } from 'react';

type Square = 'X' | 'O' | null;
type GameState = 'playing' | 'won' | 'draw';

function TicTacToe() {
  const [squares, setSquares] = useState<Square[]>(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [gameState, setGameState] = useState<GameState>('playing');
  const [playerScore, setPlayerScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);

  const calculateWinner = (squares: Square[]): Square => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], 
      [0, 3, 6], [1, 4, 7], [2, 5, 8], 
      [0, 4, 8], [2, 4, 6] 
    ];

    for (const [a, b, c] of lines) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const getEmptySquares = (board: Square[]): number[] => {
    return board.reduce<number[]>((acc, square, index) => {
      if (!square) acc.push(index);
      return acc;
    }, []);
  };

  const minimax = (board: Square[], depth: number, isMaximizing: boolean): number => {
    const winner = calculateWinner(board);
    if (winner === 'O') return 10 - depth;
    if (winner === 'X') return depth - 10;
    if (getEmptySquares(board).length === 0) return 0;

    if (isMaximizing) {
      let bestScore = -Infinity;
      getEmptySquares(board).forEach(move => {
        board[move] = 'O';
        bestScore = Math.max(bestScore, minimax(board, depth + 1, false));
        board[move] = null;
      });
      return bestScore;
    } else {
      let bestScore = Infinity;
      getEmptySquares(board).forEach(move => {
        board[move] = 'X';
        bestScore = Math.min(bestScore, minimax(board, depth + 1, true));
        board[move] = null;
      });
      return bestScore;
    }
  };

  const findBestMove = (board: Square[]): number => {
    let bestScore = -Infinity;
    let bestMove = -1;

    getEmptySquares(board).forEach(move => {
      board[move] = 'O';
      const score = minimax(board, 0, false);
      board[move] = null;

      if (score > bestScore) {
        bestScore = score;
        bestMove = move;
      }
    });

    return bestMove;
  };

  const saveScore = () => {
    const savedScores = JSON.parse(localStorage.getItem('highScores') || '[]');
    savedScores.push({
      game: 'Morpion',
      score: playerScore,
      date: new Date().toISOString(),
    });
    localStorage.setItem('highScores', JSON.stringify(savedScores));
    
    window.dispatchEvent(new Event('scoreUpdate'));
  };

  const handleClick = (i: number) => {
    if (!isPlayerTurn || squares[i] || gameState !== 'playing') return;

    const newSquares = squares.slice();
    newSquares[i] = 'X';
    setSquares(newSquares);
    setIsPlayerTurn(false);
  };

  useEffect(() => {
    const checkGameState = () => {
      const winner = calculateWinner(squares);
      if (winner) {
        setGameState('won');
        if (winner === 'X') {
          setPlayerScore(prev => prev + 1);
        } else {
          setAiScore(prev => prev + 1);
        }
        saveScore();
      } else if (getEmptySquares(squares).length === 0) {
        setGameState('draw');
      }
    };

    checkGameState();

    
    if (!isPlayerTurn && gameState === 'playing') {
      const timer = setTimeout(() => {
        const bestMove = findBestMove(squares);
        if (bestMove !== -1) {
          const newSquares = squares.slice();
          newSquares[bestMove] = 'O';
          setSquares(newSquares);
          setIsPlayerTurn(true);
        }
      }, 500); 

      return () => clearTimeout(timer);
    }
  }, [squares, isPlayerTurn, gameState]);

  const resetGame = () => {
    setSquares(Array(9).fill(null));
    setIsPlayerTurn(true);
    setGameState('playing');
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-8">Morpion</h1>
      <div className="mb-4 text-xl flex gap-8">
        <div>Joueur: {playerScore}</div>
        <div>IA: {aiScore}</div>
      </div>
      <div className="mb-4 text-xl">
        {gameState === 'won' 
          ? `Gagnant : ${!isPlayerTurn ? 'Joueur' : 'IA'}`
          : gameState === 'draw'
          ? 'Match nul !'
          : `Tour : ${isPlayerTurn ? 'Joueur' : 'IA'}`}
      </div>
      <div className="grid grid-cols-3 gap-2 mb-6">
        {squares.map((square, i) => (
          <button
            key={i}
            className={`w-20 h-20 text-3xl font-bold rounded transition-colors duration-200 ${
              square 
                ? 'bg-game-primary text-white' 
                : 'bg-white hover:bg-gray-100'
            }`}
            onClick={() => handleClick(i)}
          >
            {square}
          </button>
        ))}
      </div>
      <button onClick={resetGame} className="btn-primary">
        Nouvelle partie
      </button>
    </div>
  );
}

export default TicTacToe;