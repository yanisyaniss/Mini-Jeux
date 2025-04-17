import React, { useState } from "react";
import "./RockPaperScissors.css"; 

const options = ["Pierre", "Papier", "Ciseaux"];

const getResult = (player, bot) => {
  if (player === bot) return "Égalité !";
  if (
    (player === "Pierre" && bot === "Ciseaux") ||
    (player === "Papier" && bot === "Pierre") ||
    (player === "Ciseaux" && bot === "Papier")
  ) {
    return "Tu gagnes 🎉";
  }
  return "Tu perds 😢";
};

const RockPaperScissors = () => {
  const [playerChoice, setPlayerChoice] = useState(null);
  const [botChoice, setBotChoice] = useState(null);
  const [result, setResult] = useState("");

  const play = (choice) => {
    const bot = options[Math.floor(Math.random() * options.length)];
    setPlayerChoice(choice);
    setBotChoice(bot);
    setResult(getResult(choice, bot));
  };

  return (
    <div className="rps-container">
      <h1 className="rps-title">✊✋✌️ Pierre-Papier-Ciseaux</h1>

      <div className="rps-buttons">
        {options.map((opt) => (
          <button key={opt} onClick={() => play(opt)} className="rps-button">
            {opt}
          </button>
        ))}
      </div>

      {playerChoice && (
        <div className="rps-result-box">
          <p><strong>Tu as choisi :</strong> {playerChoice}</p>
          <p><strong>L'ordi a choisi :</strong> {botChoice}</p>
          <p className="rps-result">{result}</p>
        </div>
      )}
    </div>
  );
};

export default RockPaperScissors;
