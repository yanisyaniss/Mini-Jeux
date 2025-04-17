import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import TicTacToe from './games/TicTacToe';
import RockPaperScissors from './games/RockPaperScissors';


function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">

        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tic-tac-toe" element={<TicTacToe />} />
            <Route path="/RockPaperScissors" element={<RockPaperScissors />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;