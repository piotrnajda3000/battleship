import Ship from "../js/ship";

const newShip = Ship(3);

test("Given length, instantiates properly", () => {
  expect(newShip.info).toEqual({
    length: 3,
    hitMap: [false, false, false],
  });
});

test("Hits ship at provided position", () => {
  newShip.hit(0);
  expect(newShip.info.hitMap).toEqual([true, false, false]);
});

test("Given a not sunk ship, displays that it's not sunk", () => {
  expect(newShip.isSunk()).toEqual(false);
});

test("Given a sunk ship, displays that it's sunk", () => {
  newShip.hit(0);
  newShip.hit(1);
  newShip.hit(2);
  expect(newShip.isSunk()).toEqual(true);
});
