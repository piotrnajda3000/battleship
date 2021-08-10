import Player from "./player";

const game = (() => {
  const init = () => {
    const humanPlayer = Player({ who: "Human" });
    const computerPlayer = Player({ who: "Computer" });

    humanPlayer.setEnemyBoard(computerPlayer.gameboard);
    computerPlayer.setEnemyBoard(humanPlayer.gameboard);

    // Place ships on the board
    humanPlayer.gameboard.placeShip(0, 0)(5);
    humanPlayer.gameboard.placeShip(0, 1)(4);
    humanPlayer.gameboard.placeShip(0, 2)(3);
    humanPlayer.gameboard.placeShip(0, 3)(3);
    humanPlayer.gameboard.placeShip(0, 4)(2);

    computerPlayer.gameboard.placeShip(0, 9)(5);
    computerPlayer.gameboard.placeShip(0, 8)(4);
    computerPlayer.gameboard.placeShip(0, 7)(3);
    computerPlayer.gameboard.placeShip(0, 6)(3);
    computerPlayer.gameboard.placeShip(0, 5)(2);

    return [humanPlayer, computerPlayer];
  };

  return {
    init,
  };
})();

export default game;
