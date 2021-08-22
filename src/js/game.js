import dom from "./dom";
import events from "./events";
import Player from "./player";
import { getRandomNumInRange } from "./math";

const game = (() => {
  const init = () => {
    const humanPlayer = Player({ who: "Human" });
    const computerPlayer = Player({ who: "Computer" });

    humanPlayer.setEnemyBoard(computerPlayer.gameboard);
    computerPlayer.setEnemyBoard(humanPlayer.gameboard);

    // Subscribe to events

    events.subscribe("Check if game over", () => {
      if (computerPlayer.gameboard.areAllSunk()) {
        events.publish("Display game over", "You won");
      } else if (humanPlayer.gameboard.areAllSunk()) {
        events.publish("Display game over", "You won");
      }
    });

    events.subscribe("Player attacks", ({ x, y }) => {
      computerPlayer.gameboard.receiveAttack(x, y);
      events.publish("Render computer board after game started");
    });

    events.subscribe("Play computer's turn", () => {
      computerPlayer.randomAttack();
      events.publish("Render player board");
    });

    return [humanPlayer, computerPlayer];
  };

  return {
    init,
  };
})();

export default game;
