import events from "./events";

const dom = (() => {
  // Cache dom

  const humanBoardDiv = document.querySelector("#playerBoard");
  const computerBoardDiv = document.querySelector("#attackBoard");

  // Public methods

  const renderPlayerBoard = (player) => {
    console.log("Rerendering user board");

    resetDynamicContent(humanBoardDiv);

    const gameboard = player.gameboard.getBoard();

    // Parse and display rows and columns
    for (const [y, row] of gameboard.entries()) {
      const rowDiv = document.createElement("div");
      rowDiv.classList.add("row");
      for (const [x, column] of row.entries()) {
        let squareDiv;
        if (column.ship !== undefined) {
          squareDiv = createSquare(x, y, `${column.ship.info.length}`, "ship");
        } else if (column == "missed") {
          squareDiv = createSquare(x, y, `-`, "miss");
        } else if (column == "hit") {
          squareDiv = createSquare(x, y, `+`, "hit");
        } else {
          // Empty squares
          squareDiv = createSquare(x, y, `?`, "water");
        }
        rowDiv.append(squareDiv);
      }
      humanBoardDiv.append(rowDiv);
    }
    humanBoardDiv.append(title("Your board"));
  };

  const renderAttackBoard = (computer) => {
    resetDynamicContent(computerBoardDiv);

    const gameboard = computer.gameboard.getBoard();

    // Parse and display rows and columns
    for (const [y, row] of gameboard.entries()) {
      const rowDiv = document.createElement("div");
      rowDiv.classList.add("row");
      for (const [x, column] of row.entries()) {
        let squareDiv;
        if (column.ship || column == "") {
          // Don't show ships of the enemy's board
          squareDiv = createSquare(x, y, `?`, "water");
        } else if (column == "missed") {
          squareDiv = createSquare(x, y, `-`, "miss");
        } else if (column == "hit") {
          squareDiv = createSquare(x, y, `+`, "hit");
        }
        rowDiv.append(squareDiv);
      }
      computerBoardDiv.append(rowDiv);
    }
    computerBoardDiv.append(title("Opponent's board"));
  };

  const displayGameOver = (text) => {
    const boardsWrapper = document.querySelector("#boardsWrapper");

    boardsWrapper.classList.add("hidden");

    boardsWrapper.addEventListener("transitionend", () => {
      boardsWrapper.innerHTML = "";
      const message = title(text);
      boardsWrapper.append(message);
      boardsWrapper.classList.remove("hidden");
    });
  };

  const addClickAndMove = (player) => {
    const gameboard = player.gameboard;

    // User hasn't clicked a ship to move yet
    let clickedSquareObj = null;
    let clickedSquareShipLength = null;

    // FIXME: globals
    let fromX = null;
    let fromY = null;

    // Define function chain

    const addClickListener = () => {
      const shipElements = [...humanBoardDiv.querySelectorAll(".ship")];
      shipElements.forEach((shipElement) =>
        shipElement.addEventListener("click", handleClick)
      );
    };

    const handleClick = (event) => {
      const [x, y] = getCoordinates(event);
      fromX = x;
      fromY = y;
      clickedSquareObj = gameboard.getSquare(x, y);
      gameboard.deleteShip(clickedSquareObj.ship);
      addEnterListener();
    };

    const addEnterListener = () => {
      const squares = [...humanBoardDiv.querySelectorAll(".square")];
      squares.forEach((square) =>
        square.addEventListener("mouseenter", (e) => handleEnter(e))
      );
    };

    const handleEnter = (event) => {
      const [toX, toY] = getCoordinates(event);
      if (!gameboard.getSquare(toX, toY).ship) {
        clickedSquareShipLength = clickedSquareObj.ship.info.length;
        const clickedSquareShip = gameboard.placeShip(
          getLegalX(toX, clickedSquareShipLength),
          toY
        )(clickedSquareShipLength);
        events.publish("Render player board", {
          hover: {
            ship: clickedSquareShip,
            from: {
              x: +fromX,
              y: +fromY,
            },
            to: {
              x: +toX,
              y: +toY,
            },
          },
        });
      }
    };

    // Start the chain
    addClickListener();
  };

  const extendHover = (player, hover) => {
    const gameboard = player.gameboard;

    console.log(
      "from",
      hover.from.x,
      hover.from.y,
      "to",
      hover.to.x,
      hover.to.y
    );

    const fromY = hover.to.y;
    const fromX = hover.to.x;

    const addEnterListener = () => {
      const squares = [...humanBoardDiv.querySelectorAll(".square")];
      squares.forEach((square) => {
        square.addEventListener("mouseenter", handleEnter);
      });
    };

    const handleEnter = (event) => {
      const [toX, toY] = getCoordinates(event);
      // Don't rerender if user is on the same square
      if (hover.to.x == toX && hover.to.y == toY) {
      } else {
        gameboard.deleteShip(hover.ship);
        if (!gameboard.getSquare(toX, toY).ship) {
          const shipLength = hover.ship.info.length;
          const hoveringShip = gameboard.placeShip(
            getLegalX(toX, shipLength),
            toY
          )(shipLength);
          // Rerender if user over a different square
          events.publish("Render player board", {
            hover: {
              ship: hoveringShip,
              from: {
                x: +fromX,
                y: +fromY,
              },
              to: {
                x: +toX,
                y: +toY,
              },
            },
          });
        }
      }
    };

    // Start the chain
    addEnterListener();
  };

  const addFightFunctionality = () => {
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

  // Private methods

  const getLegalX = (x, shipLength) => {
    if (+x + shipLength > 10) {
      return getLegalX(x - 1, shipLength);
    } else {
      return x;
    }
  };

  const getCoordinates = (event) => [
    +event.target.getAttribute("data-x"),
    +event.target.getAttribute("data-y"),
  ];

  // HTML and CSS helper functions

  const resetDynamicContent = (boardDiv) => {
    boardDiv.innerHTML = "";
  };

  const createSquare = (x, y, text, cssClass) => {
    const square = document.createElement("div");
    square.classList.add("square");
    square.classList.add(cssClass);
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
    addFightFunctionality,
    renderPlayerBoard,
    addClickAndMove,
    extendHover,
    displayGameOver,
  };
})();

export default dom;
