import Gameboard from "./gameboard";

const Player = (who) => (extendWith) => {
  return Object.assign(
    {
      gameboard: Gameboard(),
      enemyGameboard: null,
      setEnemyBoard(enemyBoard) {
        this.enemyGameboard = enemyBoard;
      },
      attack(x, y) {
        return this.enemyGameboard.receiveAttack(x, y);
      },
    },
    who,
    extendWith
  );
};

const ComputerAttack = () => {
  let lastHitField = {};
  let currentAttack = [];

  const clearAttack = () => {
    currentAttack = [];
    lastHitField = {};
  };

  const isAttackPossible = (field) => {
    if (!isNaN(field.x) && field.possibleMoves.length > 0) {
      return true;
    } else {
      return false;
    }
  };

  const findFieldToAttack = function findFieldWithPossibleAttackMove(i = 0) {
    const checkedField = currentAttack.length - 1 - i;

    const field = currentAttack[checkedField];

    if (field == undefined) {
      return false;
    } else if (isAttackPossible(field)) {
      return field;
    } else {
      return findFieldToAttack(i + 1);
    }
  };

  const getRandomDirection = (possibleDirections) => {
    return Math.floor(Math.random() * possibleDirections.length);
  };

  function attack() {
    let madeMove = {
      x: null,
      y: null,
    };
    do {
      let tryMove = {
        x: null,
        y: null,
      };

      if (!isAttackPossible(lastHitField)) {
        if (currentAttack.length > 1) {
          const fieldToAttack = findFieldToAttack();
          if (fieldToAttack) {
            lastHitField = fieldToAttack;
          } else {
            clearAttack();
          }
        }
      }

      if (isAttackPossible(lastHitField)) {
        const randomDirection = getRandomDirection(lastHitField.possibleMoves);
        tryMove.x =
          lastHitField.x + lastHitField.possibleMoves[randomDirection];
        tryMove.y = lastHitField.y;
        lastHitField.possibleMoves.splice(randomDirection, 1);
      } else {
        [tryMove.x, tryMove.y] = this.gameboard.getRandomCoords();
      }

      madeMove = this.enemyGameboard.receiveAttack(tryMove.x, tryMove.y);
    } while (madeMove === undefined);

    if (madeMove.value == "hit") {
      lastHitField = {
        x: madeMove.x,
        y: madeMove.y,
        possibleMoves: this.enemyGameboard.possibleMovesFrom(
          madeMove.x,
          madeMove.y
        ),
      };
      currentAttack.push(lastHitField);
    }

    return madeMove;
  }

  return {
    attack,
  };
};

const HumanPlayer = () => Player({ who: "Human" })({});
const ComputerPlayer = () => Player({ who: "Computer" })(ComputerAttack());

export { HumanPlayer, ComputerPlayer };
