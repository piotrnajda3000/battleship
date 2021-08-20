import Gameboard from "../js/gameboard";

const newGameboard = Gameboard();
const newShip = newGameboard.placeShip(0, 0)(3);
const newShip2 = newGameboard.placeShip(1, 1)(2);

test("(1) Given coordinates and a ship length, places a ship on the gameboard", () => {
  expect(newGameboard.getSquare(0, 0).ship).toEqual(newShip);
  expect(newGameboard.getSquare(1, 0).ship).toEqual(newShip);
  expect(newGameboard.getSquare(2, 0).ship).toEqual(newShip);
});

test("(2) Given coordinates and a ship length, places a ship on the gameboard ", () => {
  expect(newGameboard.getSquare(1, 1).ship).toEqual(newShip2);
  expect(newGameboard.getSquare(2, 1).ship).toEqual(newShip2);
});

describe("receiveAttack function", () => {
  test("After hitting a ship, it correctly registers the hit", () => {
    newGameboard.receiveAttack(1, 0);
    expect(newShip.info.hitMap[1]).toEqual(true);
  });

  describe("behaviour when shot missed", () => {
    test("After NOT hitting a ship, it returns coordinates of the x shot", () => {
      expect(newGameboard.receiveAttack(0, 3)).toEqual({
        x: 0,
        y: 3,
        value: "missed",
      });
    });

    test("After NOT hitting a ship, it correctly registers that spot as a missed shot", () => {
      newGameboard.receiveAttack(0, 3);
      expect(newGameboard.getSquare(0, 3)).toEqual("missed");
    });
  });
});

describe("areAllSunk function", () => {
  test("Not all ships sunk", () => {
    expect(newGameboard.areAllSunk()).toEqual(false);
  });
  test("All ships sunk", () => {
    const newGameboard3 = Gameboard();
    const newShip3 = newGameboard3.placeShip(0, 0)(2);
    newShip3.hit(0).hit(1);
    const newShip4 = newGameboard3.placeShip(0, 1)(3);
    newShip4.hit(0).hit(1).hit(2);
    expect(newGameboard3.areAllSunk()).toEqual(true);
  });
});
