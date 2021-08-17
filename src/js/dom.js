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
          squareDiv = assignHitMapPosDom(squareDiv, column.ship);
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

  const renderComputerBoard = (computer) => {
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

    const addClickListener = () => {
      const shipElements = [...humanBoardDiv.querySelectorAll(".ship")];
      shipElements.forEach((shipElement) =>
        shipElement.addEventListener("click", handleClick)
      );
    };

    const handleClick = (event) => {
      const clickedSquare = event.target;
      const [x, y] = getCoordinates(clickedSquare);

      const clickedSquareObj = gameboard.getSquare(x, y);
      gameboard.deleteShip(clickedSquareObj.ship);

      const clickDataToSend = {
        from: {
          x,
          y,
        },
        renderOffset: +clickedSquare.getAttribute("data-hitmappos"),
        square: clickedSquareObj,
      };

      addHoverListener(clickDataToSend);
    };

    const addHoverListener = (clickData) => {
      const squares = [...humanBoardDiv.querySelectorAll(".square")];
      squares.forEach((square) =>
        square.addEventListener("mouseenter", (event) =>
          handleHover(event, clickData)
        )
      );
    };

    const handleHover = (event, clickData) => {
      const hoveredToField = event.target;
      const [x, y] = getCoordinates(hoveredToField);

      const hoverData = {
        to: {
          x,
          y,
        },
      };

      if (!gameboard.getSquare(hoverData.to.x, hoverData.to.y).ship) {
        const hoveringShip = placeShipDOM(
          clickData.square.ship,
          hoverData.to.x,
          hoverData.to.y,
          clickData.renderOffset,
          gameboard
        );

        events.publish("Render player board", {
          hover: {
            ship: hoveringShip,
            from: {
              x: +clickData.from.x,
              y: +clickData.from.y,
            },
            to: {
              x: +hoverData.to.x,
              y: +hoverData.to.y,
            },
            renderOffset: clickData.renderOffset,
          },
        });
      }
    };

    // Start the chain
    addClickListener();
  };

  const extendHover = (player, hover) => {
    const gameboard = player.gameboard;

    // The square we hovered to becomes a place we hover from
    const fromY = hover.to.y;
    const fromX = hover.to.x;

    // console.log(
    //   "from",
    //   hover.from.x,
    //   hover.from.y,
    //   "to",
    //   hover.to.x,
    //   hover.to.y
    // );

    const addHoverListener = () => {
      const squares = [...humanBoardDiv.querySelectorAll(".square")];
      squares.forEach((square) => {
        square.addEventListener("mouseenter", handleHover);
      });
    };

    const handleHover = (hoverEvent) => {
      const currentSquare = hoverEvent.target;
      const [toX, toY] = getCoordinates(currentSquare);

      // Don't rerender if user is on the same square
      if (hover.to.x == toX && hover.to.y == toY) {
        // Ability to place a ship if the user decides so
        currentSquare.addEventListener("click", dropShip);
      } else {
        gameboard.deleteShip(hover.ship);
        if (!gameboard.getSquare(toX, toY).ship) {
          const hoveringShip = placeShipDOM(
            hover.ship,
            toX,
            toY,
            hover.renderOffset,
            gameboard
          );
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
              renderOffset: hover.renderOffset,
            },
          });
        }
      }
    };

    const dropShip = () => {
      events.publish("Render player board", {
        hover: false,
      });
    };

    // Start the chain
    addHoverListener();
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

  const assignHitMapPosDom = (div, ship) => {
    const hitMapToDom = ship.dom.addons.hitMapDOM;

    if (hitMapToDom.arr.length == ship.info.length) {
      hitMapToDom.clearForBoardRender();
    }

    if (hitMapToDom.arr.length < ship.info.hitMap.length) {
      hitMapToDom.arr.push(true);
      div.setAttribute("data-hitMapPos", hitMapToDom.arr.length - 1);
    }
    return div;
  };

  const placeShipDOM = function createShipForDomDisplay(
    ship,
    x,
    y,
    whereGrabbed,
    gameboard
  ) {
    const xRenderOffset = calculateXRenderOffset(
      whereGrabbed,
      ship.info.length
    );
    const xInBounds = getXInBounds(x - xRenderOffset, ship.info.length);

    return gameboard.placeShip(xInBounds, y)(ship.info.length);
  };

  const calculateXRenderOffset = (whereGrabbed, shipLength) => {
    if (whereGrabbed == 0) {
      // If grabbed by the first square
      return 0;
    } else if (whereGrabbed == shipLength - 1) {
      // If grabbed by the last square
      return shipLength - 1;
    } else {
      // If grabbed by any square inbetween
      return shipLength - 1 - whereGrabbed;
    }
  };

  const getXInBounds = (x, shipLength) => {
    if (+x + shipLength > 10) {
      return getXInBounds(x - 1, shipLength);
    } else {
      return x;
    }
  };

  const getCoordinates = (eventTarget) => [
    +eventTarget.getAttribute("data-x"),
    +eventTarget.getAttribute("data-y"),
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
    renderPlayerBoard,
    addClickAndMove,
    extendHover,
    renderComputerBoard,
    addFightFunctionality,
    displayGameOver,
  };
})();

export default dom;
