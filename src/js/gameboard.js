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

  const getField = (x, y) => {
    return gameboard[y][x];
  };

  const setField = (x, y, value) => {
    gameboard[y][x] = value;
    return { x, y, value };
  };

  const placeShip = (x, y) => {
    return function (shipLength) {
      const ship = Ship(shipLength);
      shipsOnBoard.push(ship);
      for (let i = 0; i < shipLength; i++) {
        setField(x + i, y, { ship, shipHitMapPos: i });
      }
      return ship;
    };
  };

  const receiveAttack = (x, y) => {
    let field = getField(x, y);
    if (field !== "" && field !== "missed") {
      const ship = field.ship;
      const hitMapPos = field.shipHitMapPos;
      return ship.hit(hitMapPos);
    } else if (field !== "missed") {
      return setField(x, y, "missed");
    }
  };

  const areAllSunk = () => {
    return shipsOnBoard.every((ship) => ship.isSunk());
  };

  return {
    getBoard,
    getField,
    placeShip,
    receiveAttack,
    areAllSunk,
  };
}
