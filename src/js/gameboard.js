/*
Note that we have not yet created any User Interface. 
We should know our code is coming together by running the tests. 
You shouldn’t be relying on 
console.logs or DOM methods 
to make sure your code is doing what you expect it to.
*/

/* 
Place ships at specific coordinates, 
by calling the ship factory function
*/

import Ship from "./ship";

export default function Gameboard() {
  const gameboard = [];

  // gameboard = 10x10 2D Array
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
      shipsOnBoard.push(ship);
      for (let i = 0; i < shipLength; i++) {
        setSquare(parseInt(x, 10) + parseInt(i, 10), parseInt(y, 10), {
          ship,
          shipHitMapPos: i,
        });
      }
      return ship;
    };
  };

  function deleteShip(ship) {
    // Delete from the board
    for (const [y, row] of this.getBoard().entries()) {
      for (const [x, column] of row.entries()) {
        if (column.ship == ship) {
          setSquare(x, y, "");
        }
      }
    }
    // Delete from the shipsOnBoard
    shipsOnBoard.splice(shipsOnBoard.indexOf(ship), 1);
  }

  const receiveAttack = (x, y) => {
    let square = getSquare(x, y);
    if (square !== "" && square !== "missed") {
      const ship = square.ship;
      const hitMapPos = square.shipHitMapPos;
      ship.hit(hitMapPos);
      return setSquare(x, y, "hit");
    } else if (square !== "missed") {
      return setSquare(x, y, "missed");
    }
  };

  const areAllSunk = () => {
    return shipsOnBoard.every((ship) => ship.isSunk());
  };

  return {
    getBoard,
    shipsOnBoard,
    getSquare,
    setSquare,
    placeShip,
    deleteShip,
    receiveAttack,
    areAllSunk,
  };
}
