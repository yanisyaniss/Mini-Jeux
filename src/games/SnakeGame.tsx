import { useEffect, useRef, useState } from 'react';

const GRID_SIZE = 20;
const CELL_SIZE = 20;
const INITIAL_SNAKE = [{ x: 10, y: 10 }];
const INITIAL_DIRECTION = { x: 1, y: 0 };
const INITIAL_SPEED = 150;

type Position = { x: number; y: number };
type PowerUp = { position: Position; type: 'speed' | 'points' | 'slow' };
type Obstacle = Position;

function SnakeGame() {
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [direction, setDirection] = useState(INITIAL_DIRECTION);
  const [food, setFood] = useState({ x: 15, y: 15 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [speed, setSpeed] = useState(INITIAL_SPEED);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const [powerUps, setPowerUps] = useState<PowerUp[]>([]);
  const gameLoop = useRef<number>();

  const generateRandomPosition = (): Position => {
    const position = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };

     
    const isOverlapping = [...snake, ...obstacles, ...powerUps.map(p => p.position)]
      .some(item => item.x === position.x && item.y === position.y);

    return isOverlapping ? generateRandomPosition() : position;
  };

  const generateObstacles = () => {
    const newObstacles: Obstacle[] = [];
    for (let i = 0; i < 5; i++) {
      newObstacles.push(generateRandomPosition());
    }
    setObstacles(newObstacles);
  };

  const generatePowerUp = () => {
    const types: PowerUp['type'][] = ['speed', 'points', 'slow'];
    const newPowerUp: PowerUp = {
      position: generateRandomPosition(),
      type: types[Math.floor(Math.random() * types.length)],
    };
    setPowerUps([...powerUps, newPowerUp]);
  };

  const saveHighScore = () => {
    const savedScores = JSON.parse(localStorage.getItem('highScores') || '[]');
    savedScores.push({
      game: 'Snake',
      score,
      date: new Date().toISOString(),
    });
    localStorage.setItem('highScores', JSON.stringify(savedScores));
  };

  const resetGame = () => {
    setSnake(INITIAL_SNAKE);
    setDirection(INITIAL_DIRECTION);
    setFood(generateRandomPosition());
    setGameOver(false);
    setScore(0);
    setSpeed(INITIAL_SPEED);
    generateObstacles();
    setPowerUps([]);
  };

  const handlePowerUp = (powerUp: PowerUp) => {
    switch (powerUp.type) {
      case 'speed':
        setSpeed(prev => prev * 0.8);
        break;
      case 'points':
        setScore(prev => prev + 50);
        break;
      case 'slow':
        setSpeed(prev => prev * 1.2);
        break;
    }
    setPowerUps(powerUps.filter(p => p !== powerUp));
  };

  const moveSnake = () => {
    if (gameOver) return;

    const newSnake = [...snake];
    const head = {
      x: (newSnake[0].x + direction.x + GRID_SIZE) % GRID_SIZE,
      y: (newSnake[0].y + direction.y + GRID_SIZE) % GRID_SIZE,
    };

    
    if (obstacles.some(obs => obs.x === head.x && obs.y === head.y)) {
      setGameOver(true);
      saveHighScore();
      return;
    }

    if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
      setGameOver(true);
      saveHighScore();
      return;
    }

    newSnake.unshift(head);

    
    const powerUp = powerUps.find(p => p.position.x === head.x && p.position.y === head.y);
    if (powerUp) {
      handlePowerUp(powerUp);
    }

    if (head.x === food.x && head.y === food.y) {
      setFood(generateRandomPosition());
      setScore(score + 10);
      if (Math.random() < 0.3) { 
        generatePowerUp();
      }
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
  };

  useEffect(() => {
    generateObstacles();
  }, []);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp':
          if (direction.y !== 1) setDirection({ x: 0, y: -1 });
          break;
        case 'ArrowDown':
          if (direction.y !== -1) setDirection({ x: 0, y: 1 });
          break;
        case 'ArrowLeft':
          if (direction.x !== 1) setDirection({ x: -1, y: 0 });
          break;
        case 'ArrowRight':
          if (direction.x !== -1) setDirection({ x: 1, y: 0 });
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    gameLoop.current = setInterval(moveSnake, speed);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
      if (gameLoop.current) clearInterval(gameLoop.current);
    };
  }, [direction, gameOver, speed]);

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-8">Snake</h1>
      <div className="mb-4">Score : {score}</div>
      <div 
        className="relative bg-white border-2 border-gray-300 rounded"
        style={{
          width: GRID_SIZE * CELL_SIZE,
          height: GRID_SIZE * CELL_SIZE
        }}
      >
        {/* Render obstacles */}
        {obstacles.map((obstacle, i) => (
          <div
            key={`obstacle-${i}`}
            className="absolute bg-gray-800 rounded"
            style={{
              width: CELL_SIZE - 2,
              height: CELL_SIZE - 2,
              left: obstacle.x * CELL_SIZE,
              top: obstacle.y * CELL_SIZE
            }}
          />
        ))}

        {/* Render power-ups */}
        {powerUps.map((powerUp, i) => (
          <div
            key={`powerup-${i}`}
            className={`absolute rounded ${
              powerUp.type === 'speed' ? 'bg-yellow-400' :
              powerUp.type === 'points' ? 'bg-green-400' :
              'bg-blue-400'
            }`}
            style={{
              width: CELL_SIZE - 2,
              height: CELL_SIZE - 2,
              left: powerUp.position.x * CELL_SIZE,
              top: powerUp.position.y * CELL_SIZE
            }}
          />
        ))}

        {/* Render snake */}
        {snake.map((segment, i) => (
          <div
            key={i}
            className="absolute bg-game-primary rounded"
            style={{
              width: CELL_SIZE - 2,
              height: CELL_SIZE - 2,
              left: segment.x * CELL_SIZE,
              top: segment.y * CELL_SIZE
            }}
          />
        ))}

        {/* Render food */}
        <div
          className="absolute bg-red-500 rounded"
          style={{
            width: CELL_SIZE - 2,
            height: CELL_SIZE - 2,
            left: food.x * CELL_SIZE,
            top: food.y * CELL_SIZE
          }}
        />
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

export default SnakeGame;