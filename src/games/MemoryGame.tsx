import { useState, useEffect } from 'react';

type Card = {
  id: number;
  value: string;
  isFlipped: boolean;
  isMatched: boolean;
};

const CARD_VALUES = ['🎮', '🎲', '🎯', '🎪', '🎨', '🎭', '🎪', '🎯'];

function MemoryGame() {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);

  const initializeGame = () => {
    const shuffledCards = [...CARD_VALUES, ...CARD_VALUES]
      .sort(() => Math.random() - 0.5)
      .map((value, index) => ({
        id: index,
        value,
        isFlipped: false,
        isMatched: false,
      }));
    setCards(shuffledCards);
    setFlippedCards([]);
    setMoves(0);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  const handleCardClick = (id: number) => {
    if (flippedCards.length === 2) return;
    if (cards[id].isMatched || cards[id].isFlipped) return;

    const newCards = [...cards];
    newCards[id].isFlipped = true;
    setCards(newCards);

    const newFlippedCards = [...flippedCards, id];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      setMoves(moves + 1);
      const [firstId, secondId] = newFlippedCards;
      
      if (cards[firstId].value === cards[secondId].value) {
        setTimeout(() => {
          const matchedCards = [...cards];
          matchedCards[firstId].isMatched = true;
          matchedCards[secondId].isMatched = true;
          setCards(matchedCards);
          setFlippedCards([]);
        }, 500);
      } else {
        setTimeout(() => {
          const resetCards = [...cards];
          resetCards[firstId].isFlipped = false;
          resetCards[secondId].isFlipped = false;
          setCards(resetCards);
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  const isGameComplete = cards.length > 0 && cards.every(card => card.isMatched);

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-8">Memory Game</h1>
      <div className="mb-4">Coups : {moves}</div>
      <div className="grid grid-cols-4 gap-4 mb-6">
        {cards.map(card => (
          <button
            key={card.id}
            className={`w-20 h-20 rounded-lg text-3xl flex items-center justify-center transition-all duration-300 ${
              card.isFlipped || card.isMatched
                ? 'bg-game-primary text-white'
                : 'bg-white'
            }`}
            onClick={() => handleCardClick(card.id)}
          >
            {(card.isFlipped || card.isMatched) ? card.value : '?'}
          </button>
        ))}
      </div>
      {isGameComplete && (
        <div className="text-center">
          <p className="text-xl mb-4">Félicitations ! Partie terminée en {moves} coups !</p>
          <button onClick={initializeGame} className="btn-primary">
            Nouvelle partie
          </button>
        </div>
      )}
    </div>
  );
}

export default MemoryGame;