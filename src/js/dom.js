import events from "./events";
import gameOver from "./game";

const dom = (() => {
  // Cache dom
  const humanBoardDiv = document.querySelector("#playerBoard");
  const computerBoardDiv = document.querySelector("#attackBoard");

  const renderPlayerBoard = (player) => {
    resetDynamicContent(humanBoardDiv);

    // Parse and display rows and columns
    for (const [y, row] of player.gameboard.getBoard().entries()) {
      const rowDiv = document.createElement("div");
      rowDiv.classList.add("row");
      for (const [x, column] of row.entries()) {
        let square;
        if (column.ship !== undefined) {
          square = createSquare(x, y, `${column.ship.info.length}`);
          square.classList.add("ship");
        } else if (column == "missed") {
          square = createSquare(x, y, `-`);
          square.classList.add("miss");
        } else if (column == "hit") {
          square = createSquare(x, y, `+`);
          square.classList.add("hit");
        } else {
          // Empty squares
          square = createSquare(x, y, `?`);
          square.classList.add("water");
        }
        rowDiv.append(square);
      }
      humanBoardDiv.append(rowDiv);
    }
    humanBoardDiv.append(title("Your board"));
  };

  const renderAttackBoard = (computer) => {
    resetDynamicContent(computerBoardDiv);

    // Parse and display rows and columns
    for (const [y, row] of computer.gameboard.getBoard().entries()) {
      const rowDiv = document.createElement("div");
      rowDiv.classList.add("row");
      for (const [x, column] of row.entries()) {
        let square;
        if (column.ship || column == "") {
          // Don't show ships of the enemy's board
          square = createSquare(x, y, `?`);
          square.classList.add("water");
        } else if (column == "missed") {
          square = createSquare(x, y, `-`);
          square.classList.add("miss");
        } else if (column == "hit") {
          square = createSquare(x, y, `+`);
          square.classList.add("hit");
        }
        rowDiv.append(square);
      }
      computerBoardDiv.append(rowDiv);
    }
    computerBoardDiv.append(title("Opponent's board"));

    // Player can attack
    const squares = [...computerBoardDiv.querySelectorAll(".square")];
    squares.forEach((square) =>
      square.addEventListener("click", (e) => {
        const x = e.target.getAttribute("data-x");
        const y = e.target.getAttribute("data-y");
        events.publish("Player attacks", { x, y });
        events.publish("Render computer's board");
        events.publish("Check if game over");
        events.publish("Play computer's turn");
      })
    );
  };

  const resetDynamicContent = (boardDiv) => {
    boardDiv.innerHTML = "";
  };

  events.subscribe("Display game over", (text) => {
    const boardsWrapper = document.querySelector("#boardsWrapper");

    boardsWrapper.classList.add("hidden");

    boardsWrapper.addEventListener("transitionend", () => {
      boardsWrapper.innerHTML = "";
      const message = title(text);
      boardsWrapper.append(message);
      boardsWrapper.classList.remove("hidden");
    });
  });

  const createSquare = (x, y, text) => {
    const square = document.createElement("div");
    square.classList.add("square");
    square.setAttribute("data-x", x);
    square.setAttribute("data-y", y);
    square.textContent = text;
    return square;
  };

  const title = (title) => {
    const h2 = document.createElement("h2");
    h2.textContent = title;
    return h2;
  };

  return {
    renderAttackBoard,
    renderPlayerBoard,
  };
})();

export default dom;
