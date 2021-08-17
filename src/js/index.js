import "normalize.css";
import "../styles/style.css";
import game from "./game";
import dom from "./dom";
import events from "./events";

// Init game's players and gameboards

const [humanPlayer, computerPlayer] = game.init();

// Subscribe to display events

events.subscribe("Render player board", ({ hover } = false) => {
  // Grabs data from gameboard and displays it
  dom.renderPlayerBoard(humanPlayer);
  if (!hover) {
    // Click on a ship and hover it to a selected adjacent square
    // Activates the hover branch of logic if clicked on a ship
    dom.addClickAndMove(humanPlayer);
  } else if (hover) {
    // Extend the hover to any square on the board
    dom.extendHover(humanPlayer, hover);
  }
});

events.subscribe("Render computer's board", () => {
  dom.renderComputerBoard(computerPlayer);
  dom.addFightFunctionality();
});

// Init game display

events.publish("Render player board");
events.publish("Render computer's board");
