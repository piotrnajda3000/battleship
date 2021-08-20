import Ship from "./ship";

import isEqual from "lodash.isequal";

import { getRandomNumInRange } from "./math";

export default function Gameboard() {
  // gameboard = 10x10 2D Array
  const gameboard = [];
  for (let y = 0; y < 10; y++) {
    const row = [];
    for (let x = 0; x < 10; x++) {
      // Create empty columns
      row.push("");
    }
    gameboard.push(row);
  }
  const shipsOnBoard = [];

  const getBoard = () => gameboard;

  const getSquare = (x, y) => {
    return gameboard[y][x];
  };

  const setSquare = (x, y, value) => {
    gameboard[y][x] = value;
    return { x, y, value };
  };

  const placeShip = (x, y) => {
    return function (shipLength) {
      const ship = Ship(shipLength);

      if (
        // If the ship isn't in shipsOnBoard yet
        shipsOnBoard.some((shipOnBoard) => isEqual(ship, shipOnBoard)) == false
      ) {
        shipsOnBoard.push(ship);
      } else {
        /* After deleting a ship to re-render it on hover,
        it loses it's reference to the shipOnBoard   
        */
        const shipIdx = shipsOnBoard.findIndex((shipOnBoard) =>
          isEqual(ship, shipOnBoard)
        );
        shipsOnBoard[shipIdx] = ship;
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

  const receiveAttack = (x, y) => {
    let square = getSquare(x, y);
    if (square !== "" && square !== "missed" && square !== "hit") {
      square.ship.hit(square.shipHitMapPos);
      return setSquare(x, y, "hit");
    } else if (square !== "missed") {
      return setSquare(x, y, "missed");
    }
  };

  const areAllSunk = () => {
    return shipsOnBoard.every((ship) => ship.isSunk());
  };

  const getShipID = (ship) => {
    return shipsOnBoard.indexOf(ship);
  };

  function moveShip(ship, toX, toY) {
    this.deleteShip(ship);
    return this.placeShip(toX, toY)(ship.info.length);
  }

  /* Helper math methods */

  const getRandomCoords = () => [
    getRandomNumInRange(0, 9),
    getRandomNumInRange(0, 9),
  ];

  return {
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
