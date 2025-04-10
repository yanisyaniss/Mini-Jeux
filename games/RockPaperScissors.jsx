import React, { useState } from "react";

const options = ["Pierre", "Papier", "Ciseaux"];

const getResult = (player, bot) => {
  if (player == bot) return "Égalité !";
  if (
    (player == "Pierre" && bot == "Ciseaux") ||
    (player == "Papier" && bot == "Pierre") ||
    (player == "Ciseaux" && bot == "Papier")
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
    <div className="p-4 text-center">
      <h1 className="text-2xl font-bold mb-4">Pierre-Papier-Ciseaux</h1>
      <div className="flex justify-center gap-4 mb-6">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => play(opt)}
            className="px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-700 transition"
          >
            {opt}
          </button>
        ))}
      </div>
      {playerChoice && (
        <div className="text-lg">
          <p>Tu as choisi : <strong>{playerChoice}</strong></p>
          <p>L'ordi a choisi : <strong>{botChoice}</strong></p>
          <p className="mt-2 font-semibold">{result}</p>
        </div>
      )}
    </div>
  );
};

export default RockPaperScissors;
