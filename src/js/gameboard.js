import Ship from "./ship";
import isEqual from "lodash.isequal";
import { getRandomNumInRange } from "./math";

export default function Gameboard() {
  // 10x10 2D Array
  const gameboard = Array(10)
    .fill([])
    .map(() => Array(10).fill(""));

  const shipsOnBoard = [];

  const getBoard = () => gameboard;

  const getSquare = (x, y) => {
    return gameboard[y][x];
  };

  const setSquare = (x, y, value) => {
    gameboard[y][x] = value;
    return { x, y, value };
  };

  // placeShip helpers

  const isShipOnBoard = (ship) =>
    shipsOnBoard.some((shipOnBoard) => isEqual(ship, shipOnBoard));

  const referenceTie = (toWhat, toTie) => {
    const objectIdx = toWhat.findIndex((objToTieTo) =>
      isEqual(toTie, objToTieTo)
    );
    toWhat[objectIdx] = toTie;
  };

  const placeShip = (x, y) => {
    return function (shipLength) {
      const ship = Ship(shipLength);

      if (!isShipOnBoard(ship)) {
        shipsOnBoard.push(ship);
      } else {
        referenceTie(shipsOnBoard, ship);
      }

      for (let i = 0; i < shipLength; i++) {
        setSquare(+x + i, +y, {
          ship,
          shipHitMapPos: i,
        });
      }
      return ship;
    };
  };

  function deleteShip(ship) {
    for (const [y, row] of this.getBoard().entries()) {
      for (const [x, column] of row.entries()) {
        if (column.ship == ship) {
          setSquare(x, y, "");
        }
      }
    }
  }

  function moveShip(ship, toX, toY) {
    this.deleteShip(ship);
    return this.placeShip(toX, toY)(ship.info.length);
  }

  const receiveAttack = (x, y) => {
    let square = getSquare(x, y);
    if (square != undefined) {
      if (square.ship) {
        square.ship.hit(square.shipHitMapPos);
        return setSquare(x, y, "hit");
      } else if (square == "") {
        return setSquare(x, y, "missed");
      } else {
        return undefined;
      }
    } else {
      return undefined;
    }
  };

  const areAllSunk = () => shipsOnBoard.every((ship) => ship.isSunk());

  const getShipID = (ship) => shipsOnBoard.indexOf(ship);

  const possibleMovesFrom = (x, y) => {
    let possibleMoves = [];

    if (getSquare(x - 1, y) != undefined) {
      possibleMoves.push(-1);
    }

    if (getSquare(x + 1, y) != undefined) {
      possibleMoves.push(1);
    }

    if (possibleMoves.length > 0) {
      return possibleMoves;
    } else {
      return false;
    }
  };

  /* Helper math methods */

  const getRandomCoords = () => [
    getRandomNumInRange(0, 9),
    getRandomNumInRange(0, 9),
  ];

  return {
    possibleMovesFrom,
    getBoard,
    getSquare,
    getShipID,
    setSquare,
    shipsOnBoard,
    placeShip,
    deleteShip,
    receiveAttack,
    areAllSunk,
    moveShip,
    getRandomCoords,
  };
}
