import Gameboard from "./gameboard";
import { getRandomNumInRange } from "./math";

const Player = ({ who }) => {
  const gameboard = Gameboard();

  let enemyGameboard = null;

  const setEnemyBoard = (enemyBoard) => {
    enemyGameboard = enemyBoard;
  };

  const attack = (x, y) => {
    return enemyGameboard.receiveAttack(x, y);
  };

  // Computer attack

  const getFieldWithPossibleMoves = (i = 0) => {
    const checkedField = currentAttack.length - 2 - i;
    if (currentAttack[checkedField] == undefined) {
      return false;
    } else if (currentAttack[checkedField].possibleMoves.length > 0) {
      return currentAttack[checkedField];
    } else {
      return getFieldWithPossibleMoves(i - 1);
    }
  };

  let lastHitField = {};
  let currentAttack = [];

  const randomAttack = () => {
    let move;

    do {
      let randomX, randomY;

      /* On the next attack, see if there are any possible moves from that field.
      If there are none, recursively check fields before that and stop at one that has possible moves. */
      if (!isNaN(lastHitField.x) && lastHitField.possibleMoves.length == 0) {
        if (currentAttack.length > 1) {
          lastHitField = getFieldWithPossibleMoves();
        }
        // If there are none, we're out of options, go make a random move.
        if (lastHitField == false) {
          lastHitField = {};
          currentAttack = [];
        }
      }
      // If there are, make move from that field, remove that move as possible.
      if (!isNaN(lastHitField.x) && lastHitField.possibleMoves.length > 0) {
        const whichWay = Math.floor(
          Math.random() * lastHitField.possibleMoves.length
        );
        randomX = lastHitField.x + lastHitField.possibleMoves[whichWay];
        // Remove that move as possible for this hit
        lastHitField.possibleMoves.splice(whichWay, 1);
        randomY = lastHitField.y;
      } else {
        const randomCoords = gameboard.getRandomCoords();
        randomX = randomCoords[0];
        randomY = randomCoords[1];
      }

      move = enemyGameboard.receiveAttack(randomX, randomY);
    } while (move === undefined);

    /* When I finally hit a field, i register the x and y of that field. 
    From that field, I calculate which ways can I go, so that I make a move within the bounds of the gameboard. */
    if (move.value == "hit") {
      lastHitField = {
        x: move.x,
        y: move.y,
        possibleMoves: enemyGameboard.possibleMovesFrom(move.x, move.y),
      };
      // I add that field to the current attack sequence.
      currentAttack.push(lastHitField);
    }

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

export default Player;
