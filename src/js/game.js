import events from "./events";
import { HumanPlayer, ComputerPlayer } from "./player";

const game = (() => {
  const init = () => {
    const humanPlayer = HumanPlayer();
    const computerPlayer = ComputerPlayer();

    humanPlayer.setEnemyBoard(computerPlayer.gameboard);
    computerPlayer.setEnemyBoard(humanPlayer.gameboard);

    console.log(computerPlayer);

    // Subscribe to events

    events.subscribe("Check if game over", () => {
      if (computerPlayer.gameboard.areAllSunk()) {
        events.publish("Display game over", "You won");
      } else if (humanPlayer.gameboard.areAllSunk()) {
        events.publish("Display game over", "Computer won");
      }
    });

    events.subscribe("Player attacks", ({ x, y }) => {
      computerPlayer.gameboard.receiveAttack(x, y);
      events.publish("Render computer board after game started");
    });

    events.subscribe("Play computer's turn", () => {
      computerPlayer.attack();
      events.publish("Render player board after game started");
      events.publish("Check if game over");
    });

    return [humanPlayer, computerPlayer];
  };

  return {
    init,
  };
})();

export default game;
