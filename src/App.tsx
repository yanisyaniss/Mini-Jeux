import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Scoreboard from './components/Scoreboard';
import Home from './pages/Home';
import TicTacToe from './games/TicTacToe';
import MemoryGame from './games/MemoryGame';
import SnakeGame from './games/SnakeGame';
import TetrisGame from './games/TetrisGame';
import PongGame from './games/PongGame';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <Scoreboard />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tictactoe" element={<TicTacToe />} />
            <Route path="/memory" element={<MemoryGame />} />
            <Route path="/snake" element={<SnakeGame />} />
            <Route path="/tetris" element={<TetrisGame />} />
            <Route path="/pong" element={<PongGame />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;