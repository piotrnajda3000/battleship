import Player from "../js/player";

// can take turns?????

const humanPlayer = Player({ who: "Human" });
const computerPlayer = Player({ who: "Computer" });

humanPlayer.setEnemyBoard(computerPlayer.gameboard);
computerPlayer.setEnemyBoard(humanPlayer.gameboard);

describe("Human player", () => {
  describe("Attacking an enemy gameboard", () => {
    test("Can attack", () => {
      expect(humanPlayer.attack(0, 0)).toEqual({ x: 0, y: 0, value: "missed" });
    });
  });
});

describe("Computer player", () => {
  describe("Attacking an enemy gameboard", () => {
    test("Makes a legal random attack", () => {
      expect(computerPlayer.randomAttack()).not.toBe(undefined);
    });
  });
});
