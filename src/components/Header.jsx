import React from 'react';
import { useScore } from './ScoreContext';

const Header = () => {
  const { scores } = useScore();

  return (
    <header className="header">
      <h1>Mini-Jeux</h1>
      <div className="scores">
        <h2>Scores</h2>
        <ul>
          {Object.entries(scores).map(([game, score]) => (
            <li key={game}>
              {game}: {score}
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
};

export default Header;
