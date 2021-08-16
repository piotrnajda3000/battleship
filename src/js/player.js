import Gameboard from "./gameboard";

const Player = ({ who }) => {
  const gameboard = Gameboard();

  let enemyGameboard = null;

  const setEnemyBoard = (enemyBoard) => {
    enemyGameboard = enemyBoard;
  };

  const attack = (x, y) => {
    return enemyGameboard.receiveAttack(x, y);
  };

  const randomAttack = () => {
    let move;
    do {
      let [randomX, randomY] = getRandomCoords();
      move = enemyGameboard.receiveAttack(randomX, randomY);
    } while (move === undefined);
    return move;
  };

  if (who == "Computer") {
    return {
      gameboard,
      who,
      randomAttack,
      setEnemyBoard,
    };
  } else {
    return {
      gameboard,
      who,
      setEnemyBoard,
      attack,
    };
  }
};

/* Helper math methods */

const getRandomNumInRange = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const getRandomCoords = () => [
  getRandomNumInRange(0, 9),
  getRandomNumInRange(0, 9),
];

export default Player;
