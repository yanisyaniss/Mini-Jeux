import React from "react";
import { Link } from "react-router-dom";
import "../index.css"; 

const games = [
  {
    title: "Tic-Tac-Toe",
    path: "/tic-tac-toe",
    description: "Aligne 3 symboles pour gagner !",
    emoji: "❌⭕",
  },
  {
    title: "Pierre-Papier-Ciseaux",
    path: "/rock-paper-scissors",
    description: "Défie moi au classique duel.",
    emoji: "✊✋✌️",
  },
  {
    title: "Démineur",
    path: "/mines",
    description: "Évite les mines et découvre le terrain.",
    emoji: "💣",
  },
];

const Home = () => {
  return (
    <div className="home-container">
      <h1 className="page-title">
        🎮 GAME-HUB
      </h1>

      <div className="games-grid">
        {games.map((game) => (
          <Link
            key={game.title}
            to={game.path}
            className="game-card"
          >
            <div className="game-emoji">{game.emoji}</div>
            <h2 className="game-title">
              {game.title}
            </h2>
            <p className="game-description">
              {game.description}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Home;