import { Link } from 'react-router-dom';

const games = [
  {
    id: 'tictactoe',
    title: 'Morpion',
    description: 'Le classique jeu du morpion pour 2 joueurs',
    path: '/tictactoe',
  },
  {
    id: 'memory',
    title: 'Memory',
    description: 'Testez votre mémoire en trouvant les paires',
    path: '/memory',
  },
  {
    id: 'snake',
    title: 'Snake',
    description: 'Le célèbre jeu du serpent avec obstacles et bonus',
    path: '/snake',
  },
  {
    id: 'tetris',
    title: 'Tetris',
    description: 'Le jeu de puzzle classique avec des tetrominos',
    path: '/tetris',
  },
  {
    id: 'pong',
    title: 'Pong',
    description: 'Le premier jeu vidéo de l\'histoire',
    path: '/pong',
  },
];

function Home() {
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold text-center mb-8">
        Bienvenue sur la Plateforme de Mini-Jeux
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game) => (
          <Link key={game.id} to={game.path}>
            <div className="game-card">
              <h2 className="text-xl font-semibold mb-2">{game.title}</h2>
              <p className="text-gray-600">{game.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Home;