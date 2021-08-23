import Gameboard from "./gameboard";

const Player = (who) => (extendWith) => {
  const proto = {
    setEnemyBoard(enemyBoard) {
      this.enemyGameboard = enemyBoard;
    },
    attack(x, y) {
      return this.enemyGameboard.receiveAttack(x, y);
    },
  };

  return Object.assign(
    { gameboard: Gameboard(), enemyGameboard: null },
    proto,
    who,
    extendWith
  );
};

const computerFunctionality = () => {
  let lastHitField = {};
  let hitFields = [];

  const isMovePossible = (field) => {
    return field.possibleMoves.length > 0 ? true : false;
  };
  const getPossibleMoves = function searchForFieldWithPossibleMoves(i = 0) {
    const checkedField = hitFields.length - 2 - i;

    const field = hitFields[checkedField];

    if (field == undefined) {
      return false;
    } else if (isMovePossible(field)) {
      return field;
    } else {
      return getPossibleMoves(i - 1);
    }
  };

  function attack() {
    let move;
    do {
      let randomX, randomY;

      /* On the next attack, see if there are any possible moves from that field.
          If there are none, recursively check fields before that and stop at one that has possible moves. */
      if (!isNaN(lastHitField.x) && isMovePossible(lastHitField) == false) {
        if (hitFields.length > 1) {
          lastHitField = getPossibleMoves();
        }
        // If there are none, we're out of options, go make a random move.
        if (lastHitField == false) {
          lastHitField = {};
          hitFields = [];
        }
      }
      // If there are, make move from that field, remove that move as possible.
      if (!isNaN(lastHitField.x) && isMovePossible(lastHitField) == true) {
        const whichWay = Math.floor(
          Math.random() * lastHitField.possibleMoves.length
        );
        randomX = lastHitField.x + lastHitField.possibleMoves[whichWay];
        // Remove that move as possible for this hit
        lastHitField.possibleMoves.splice(whichWay, 1);
        randomY = lastHitField.y;
      } else {
        const randomCoords = this.gameboard.getRandomCoords();
        randomX = randomCoords[0];
        randomY = randomCoords[1];
      }

      move = this.enemyGameboard.receiveAttack(randomX, randomY);
    } while (move === undefined);

    /* When I finally hit a field, i register the x and y of that field. 
        From that field, I calculate which ways can I go, so that I make a move within the bounds of the gameboard. */

    if (move.value == "hit") {
      lastHitField = {
        x: move.x,
        y: move.y,
        possibleMoves: this.enemyGameboard.possibleMovesFrom(move.x, move.y),
      };
      // I add that field to the current attack sequence.
      hitFields.push(lastHitField);
    }

    return move;
  }

  return {
    attack,
  };
};

const HumanPlayer = () => Player({ who: "Human" })({});
const ComputerPlayer = () =>
  Player({ who: "Computer" })(computerFunctionality());

export { HumanPlayer, ComputerPlayer };
