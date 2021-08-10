import Gameboard from "./gameboard";

const Player = ({ who }) => {
  const gameboard = Gameboard();

  const attack = (x, y) => {
    return enemyGb.receiveAttack(x, y);
  };

  let enemyGb = null;

  const setEnemyBoard = (enemyBoard) => {
    enemyGb = enemyBoard;
  };

  const randomAttack = () => {
    let move;
    do {
      let [randomX, randomY] = getRandomCoords();
      move = enemyGb.receiveAttack(randomX, randomY);
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

const getRandomNumInRange = (min, max) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const getRandomCoords = () => [
  getRandomNumInRange(0, 9),
  getRandomNumInRange(0, 9),
];

export default Player;
