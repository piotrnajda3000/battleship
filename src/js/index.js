import game from "./game";
import events from "./events";

// CSS
import "normalize.css";
import "../styles/style.css";
import "../styles/squares.css";
import "../styles/boards.css";
import "../styles/playerBoard.css";
import "../styles/attackBoard.css";

const [humanPlayer, computerPlayer] = game.init();

const playerGameboard = humanPlayer.gameboard;
const computerGameboard = computerPlayer.gameboard;

events.publish("Render player board with click & drop ability", {
  randomlyPlaceShips: true,
});

export { playerGameboard, computerGameboard };
