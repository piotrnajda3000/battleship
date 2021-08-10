import "normalize.css";
import "../styles/style.css";
import game from "./game";
import { renderPlayerBoard, renderAttackBoard } from "./dom";

const [humanPlayer, computerPlayer] = game.init();

const humanBoard = humanPlayer.gameboard.getBoard();
const humanBoardDiv = document.querySelector("#playerBoard");

const computerBoard = computerPlayer.gameboard.getBoard();
const attackBoardDiv = document.querySelector("#attackBoard");

renderPlayerBoard(humanBoard, humanBoardDiv);
renderAttackBoard(computerBoard, attackBoardDiv);

// When I click on a square in the enemy's board, it registers a hit there,
// revealing whether it was a hit or a miss.
