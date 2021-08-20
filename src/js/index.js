import game from "./game";
import dom from "./dom";
import events from "./events";

// CSS
import "normalize.css";
import "../styles/style.css";
import "../styles/squares.css";
import "../styles/boards.css";
import "../styles/playerBoard.css";
import "../styles/attackBoard.css";

// Subscribe to display events
events.subscribe(
  "Render player board with click & drop ability",
  (data = false) => {
    dom.renderPlayerBoard(humanPlayer, {
      showStartButton: true,
      showRestrictedArea: true,
    });

    if (!data.hover) {
      dom.addClickAndMove(humanPlayer);
    } else if (data.hover) {
      dom.extendHover(humanPlayer, data);
    }
  }
);

events.subscribe("Render player board", () => {
  dom.renderPlayerBoard(humanPlayer);
});

events.subscribe("Render computer's board", () => {
  dom.renderComputerBoard(computerPlayer);
  dom.addFightFunctionality();
});

// Init game's players and gameboards
const [humanPlayer, computerPlayer] = game.init();

// Init game display
events.publish("Render player board with click & drop ability");
