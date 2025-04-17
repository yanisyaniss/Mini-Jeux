import { useEffect, useRef, useState } from 'react';

const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 400;
const PADDLE_HEIGHT = 100;
const PADDLE_WIDTH = 10;
const BALL_SIZE = 10;
const BALL_SPEED = 5;
const PADDLE_SPEED = 8;

function PongGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState({ player: 0, ai: 0 });
  const [gameOver, setGameOver] = useState(false);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let ballX = CANVAS_WIDTH / 2;
    let ballY = CANVAS_HEIGHT / 2;
    let ballSpeedX = BALL_SPEED;
    let ballSpeedY = BALL_SPEED;

    let playerY = CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2;
    let aiY = CANVAS_HEIGHT / 2 - PADDLE_HEIGHT / 2;

    let upPressed = false;
    let downPressed = false;

    const saveHighScore = () => {
      const savedScores = JSON.parse(localStorage.getItem('highScores') || '[]');
      savedScores.push({
        game: 'Pong',
        score: score.player,
        date: new Date().toISOString(),
      });
      localStorage.setItem('highScores', JSON.stringify(savedScores));
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') upPressed = true;
      if (e.key === 'ArrowDown') downPressed = true;
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp') upPressed = false;
      if (e.key === 'ArrowDown') downPressed = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    const updateGame = () => {
      
      if (upPressed && playerY > 0) playerY -= PADDLE_SPEED;
      if (downPressed && playerY < CANVAS_HEIGHT - PADDLE_HEIGHT) playerY += PADDLE_SPEED;

      
      const aiCenter = aiY + PADDLE_HEIGHT / 2;
      const ballCenter = ballY;
      if (aiCenter < ballCenter - 35) {
        aiY += PADDLE_SPEED * 0.7;
      } else if (aiCenter > ballCenter + 35) {
        aiY -= PADDLE_SPEED * 0.7;
      }

      
      ballX += ballSpeedX;
      ballY += ballSpeedY;

      
      if (ballY <= 0 || ballY >= CANVAS_HEIGHT - BALL_SIZE) {
        ballSpeedY = -ballSpeedY;
      }

      
      if (
        ballX <= PADDLE_WIDTH &&
        ballY >= playerY &&
        ballY <= playerY + PADDLE_HEIGHT
      ) {
        ballSpeedX = -ballSpeedX;
        ballSpeedX *= 1.1; 
      }

      if (
        ballX >= CANVAS_WIDTH - PADDLE_WIDTH - BALL_SIZE &&
        ballY >= aiY &&
        ballY <= aiY + PADDLE_HEIGHT
      ) {
        ballSpeedX = -ballSpeedX;
        ballSpeedX *= 1.1; 
      }

      
      if (ballX <= 0) {
        setScore(prev => ({ ...prev, ai: prev.ai + 1 }));
        ballX = CANVAS_WIDTH / 2;
        ballY = CANVAS_HEIGHT / 2;
        ballSpeedX = BALL_SPEED;
        ballSpeedY = BALL_SPEED;
      }

      if (ballX >= CANVAS_WIDTH) {
        setScore(prev => ({ ...prev, player: prev.player + 1 }));
        ballX = CANVAS_WIDTH / 2;
        ballY = CANVAS_HEIGHT / 2;
        ballSpeedX = -BALL_SPEED;
        ballSpeedY = BALL_SPEED;
      }

      
      if (score.player >= 5 || score.ai >= 5) {
        setGameOver(true);
        saveHighScore();
        return;
      }

      
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      
      ctx.strokeStyle = 'white';
      ctx.setLineDash([5, 15]);
      ctx.beginPath();
      ctx.moveTo(CANVAS_WIDTH / 2, 0);
      ctx.lineTo(CANVAS_WIDTH / 2, CANVAS_HEIGHT);
      ctx.stroke();

      
      ctx.fillStyle = 'white';
      ctx.fillRect(0, playerY, PADDLE_WIDTH, PADDLE_HEIGHT);
      ctx.fillRect(
        CANVAS_WIDTH - PADDLE_WIDTH,
        aiY,
        PADDLE_WIDTH,
        PADDLE_HEIGHT
      );

      
      ctx.fillRect(ballX, ballY, BALL_SIZE, BALL_SIZE);

      
      ctx.font = '32px Arial';
      ctx.fillText(score.player.toString(), CANVAS_WIDTH / 4, 50);
      ctx.fillText(score.ai.toString(), (3 * CANVAS_WIDTH) / 4, 50);
    };

    const gameLoop = setInterval(updateGame, 1000 / 60);

    return () => {
      clearInterval(gameLoop);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [score, gameOver]);

  const resetGame = () => {
    setScore({ player: 0, ai: 0 });
    setGameOver(false);
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-8">Pong</h1>
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="border-2 border-gray-300 rounded"
      />
      {gameOver && (
        <div className="text-center mt-4">
          <p className="text-xl mb-4">
            Game Over! {score.player > score.ai ? 'Vous avez gagné!' : 'L\'AI a gagné!'}
          </p>
          <button onClick={resetGame} className="btn-primary">
            Nouvelle partie
          </button>
        </div>
      )}
    </div>
  );
}

export default PongGame;