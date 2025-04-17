import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

type Score = {
  game: string;
  score: number;
  date: string;
};

function Scoreboard() {
  const [scores, setScores] = useState<Score[]>([]);
  const location = useLocation();

  useEffect(() => {
    const loadScores = () => {
      const savedScores = localStorage.getItem('highScores');
      if (savedScores) {
        setScores(JSON.parse(savedScores));
      }
    };

    loadScores();
    window.addEventListener('storage', loadScores);
    
    const handleScoreUpdate = () => loadScores();
    window.addEventListener('scoreUpdate', handleScoreUpdate);

    return () => {
      window.removeEventListener('storage', loadScores);
      window.removeEventListener('scoreUpdate', handleScoreUpdate);
    };
  }, [location]);

  const getTopScoresByGame = () => {
    const gameScores: { [key: string]: Score } = {};
    scores.forEach(score => {
      if (!gameScores[score.game] || gameScores[score.game].score < score.score) {
        gameScores[score.game] = score;
      }
    });
    return Object.values(gameScores);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-center mb-4">Meilleurs Scores</h2>
      <div className="grid grid-cols-3 gap-4">
        {getTopScoresByGame().map((score, index) => (
          <div key={index} className="text-center p-2 bg-gray-50 rounded">
            <div className="font-semibold">{score.game}</div>
            <div className="text-xl text-game-primary">{score.score}</div>
            <div className="text-sm text-gray-500">
              {new Date(score.date).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Scoreboard;