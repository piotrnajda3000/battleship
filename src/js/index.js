import "normalize.css";
import "../styles/style.css";
import game from "./game";
import dom from "./dom";
import events from "./events";

const [humanPlayer, computerPlayer] = game.init();

events.subscribe("Render player board", () => {
  if (!game.gameOver) {
    dom.renderPlayerBoard(humanPlayer);
  }
});

events.subscribe("Render computer's board", () => {
  if (!game.gameOver) {
    dom.renderAttackBoard(computerPlayer);
  }
});

// Init
events.publish("Render player board");
events.publish("Render computer's board");
