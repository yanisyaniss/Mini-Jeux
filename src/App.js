import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import TicTacToe from "./games/TicTacToe";
import RockPaperScissors from "./games/RockPaperScissors";
import Mines from "./games/Mines";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/tic-tac-toe" element={<TicTacToe />} />
      <Route path="/rock-paper-scissors" element={<RockPaperScissors />} />
      <Route path="/mines" element={<Mines />} />
    </Routes>
  );
}

export default App;
