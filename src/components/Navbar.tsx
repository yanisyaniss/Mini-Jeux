import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-2xl font-bold text-game-primary">
            Mini-Jeux
          </Link>
          <div className="flex space-x-4">
            <Link to="/tictactoe" className="text-gray-600 hover:text-game-primary">
              Morpion
            </Link>
            <Link to="/memory" className="text-gray-600 hover:text-game-primary">
              Memory
            </Link>
            <Link to="/snake" className="text-gray-600 hover:text-game-primary">
              Snake
            </Link>
            <Link to="/tetris" className="text-gray-600 hover:text-game-primary">
              Tetris
            </Link>
            <Link to="/pong" className="text-gray-600 hover:text-game-primary">
              Pong
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;