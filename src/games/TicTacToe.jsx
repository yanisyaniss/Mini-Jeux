import React, { useState, useEffect } from "react";
import "./TicTacToe.css";

const TicTacToe = () => {
  const [cases, setCases] = useState(Array(9).fill(""));
  const [tourX, setTourX] = useState(true);
  const [gameOver, setGameOver] = useState(false);

  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];

  const checkWinner = (squares) => {
    for (let combo of winningCombinations) {
      const [a, b, c] = combo;
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const reset = () => {
    setCases(Array(9).fill(""));
    setTourX(true);
    setGameOver(false);
  };

  const findBestMove = (board, player) => {
    for (let combo of winningCombinations) {
      const [a, b, c] = combo;
      const values = [board[a], board[b], board[c]];
      if (values.filter(v => v === player).length === 2 && values.includes("")) {
        return combo[values.indexOf("")];
      }
    }
    return null;
  };

  const robotPlay = () => {
    let move = findBestMove(cases, "O");
    if (move === null) move = findBestMove(cases, "X");
    if (move === null) {
      const availableMoves = cases
        .map((val, index) => (val === "" ? index : null))
        .filter(val => val !== null);
      move = availableMoves[Math.floor(Math.random() * availableMoves.length)];
    }

    if (move !== null) {
      const copie = [...cases];
      copie[move] = "O";
      setCases(copie);
      setTourX(true);

      const winner = checkWinner(copie);
      if (winner) {
        setGameOver(true);
        setTimeout(() => alert(`${winner} gagne !`), 100);
      }
    }
  };

  const handleClick = (index) => {
    if (cases[index] !== "" || gameOver || !tourX) return;

    const copie = [...cases];
    copie[index] = "X";
    setCases(copie);
    setTourX(false);

    const winner = checkWinner(copie);
    if (winner) {
      setGameOver(true);
      setTimeout(() => alert(`${winner} gagne !`), 100);
    }
  };

  useEffect(() => {
    if (!tourX && !gameOver) {
      const timeout = setTimeout(() => robotPlay(), 500);
      return () => clearTimeout(timeout);
    }
  }, [tourX]);

  return (
    <div className="tic-tac-toe-container">
      <h2 className="tic-tac-toe-title">Tic-Tac-Toe</h2>
      <p className="tic-tac-toe-turn">Tour : {tourX ? "X (Vous)" : "O (Robot)"}</p>
      <div className="tic-tac-toe-grid">
        {cases.map((val, index) => (
          <div
            key={index}
            onClick={() => handleClick(index)}
            className={`tic-tac-toe-cell ${val} ${gameOver || !tourX || val !== "" ? "disabled" : ""}`}
          >
            {val}
          </div>
        ))}
      </div>
      {gameOver && (
        <button className="tic-tac-toe-reset-btn" onClick={reset}>
          Recommencer
        </button>
      )}
    </div>
  );
};

export default TicTacToe;
