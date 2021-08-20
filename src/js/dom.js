import events from "./events";

const dom = (() => {
  // Cache dom

  const humanBoardDiv = document.querySelector("#playerBoard");
  const computerBoardDiv = document.querySelector("#attackBoard");

  // Public methods

  const renderPlayerBoard = (player, options = "") => {
    resetDynamicContent(humanBoardDiv);

    if (options.showStartButton) createStartButton();

    // Parse and display rows and columns
    for (const [y, row] of player.gameboard.getBoard().entries()) {
      const rowDiv = document.createElement("div");
      rowDiv.classList.add("row");
      for (const [x, column] of row.entries()) {
        let squareDiv;
        if (column.ship !== undefined) {
          squareDiv = createSquare(x, y, `${column.ship.info.length}`, "ship");
          squareDiv = setShipData(squareDiv, column, player.gameboard);
        } else if (column == "missed") {
          squareDiv = createSquare(x, y, `-`, "miss");
        } else if (column == "hit") {
          squareDiv = createSquare(x, y, `+`, "hit");
        } else {
          squareDiv = createSquare(x, y, `?`, "water");
        }
        rowDiv.append(squareDiv);
      }
      humanBoardDiv.append(rowDiv);
    }

    if (options.showRestrictedArea) {
      const ships = [...humanBoardDiv.querySelectorAll(".ship")];
      ships.forEach((ship) => renderRestrictedArea(ship));
    }

    humanBoardDiv.append(title("Your board"));
  };

  const renderComputerBoard = (computer) => {
    resetDynamicContent(computerBoardDiv);
    computerBoardDiv.classList.remove("hidden");

    // Parse and display rows and columns
    for (const [y, row] of computer.gameboard.getBoard().entries()) {
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

    boardsWrapper.classList.add("hiddenBoard");

    boardsWrapper.addEventListener("transitionend", () => {
      boardsWrapper.innerHTML = "";
      const message = title(text);
      boardsWrapper.append(message);
      boardsWrapper.classList.remove("hiddenBoard");
    });
  };

  const addClickAndMove = (player) => {
    const addClickListener = () => {
      const shipElements = [...humanBoardDiv.querySelectorAll(".ship")];
      shipElements.forEach((shipElement) =>
        shipElement.addEventListener("click", handleClick)
      );
    };

    const handleClick = (event) => {
      const clickedSquare = event.target;
      const [x, y] = getCoordinates(clickedSquare);
      clickedSquare.classList.add("hovering");
      clickedSquare.addEventListener("click", dropShip);

      const clickedSquareObj = player.gameboard.getSquare(x, y);

      // Data to send to the hover event
      const data = {
        click: {
          from: {
            x,
            y,
          },
          whereClicked: +clickedSquare.getAttribute("data-hitmappos"),
          ship: clickedSquareObj.ship,
        },
        hover: {
          from: {
            x: +x,
            y: +y,
          },
        },
      };

      addHoverListener(data);
    };

    const addHoverListener = (data) => {
      const squares = [...humanBoardDiv.querySelectorAll(".square")];
      squares.forEach((square) =>
        square.addEventListener("mouseenter", (event) =>
          handleHover(event, data)
        )
      );
    };

    const handleHover = (event, receivedData) => {
      const hoveredToSquare = event.target;
      const [x, y] = getCoordinates(hoveredToSquare);

      const data = {
        click: {
          ...receivedData.click,
        },
        hover: {
          ...receivedData.hover.from,
          to: {
            x,
            y,
          },
        },
        render: {
          to: {
            x: processX(
              receivedData.click.whereClicked,
              receivedData.click.ship.info.length,
              x
            ),
          },
        },
      };

      if (canIPlaceShip(data, player.gameboard)) {
        player.gameboard.deleteShip(data.click.ship);

        data.click.ship = player.gameboard.placeShip(
          data.render.to.x,
          data.hover.to.y
        )(data.click.ship.info.length);

        events.publish("Render player board with click & drop ability", data);
      }
    };

    // Start the chain
    addClickListener();
  };

  const extendHover = (player, pastData) => {
    const currentData = {
      ...pastData,
      hover: {
        // The place we hovered to in the past, becomes the place we hover from.
        from: {
          x: pastData.hover.to.x,
          y: pastData.hover.to.y,
        },
        // We haven't hovered anywhere yet.
        to: {},
      },
    };

    const addHoverListener = () => {
      const squares = [...humanBoardDiv.querySelectorAll(".square")];
      squares.forEach((square) => {
        square.addEventListener("mouseenter", handleHover);
      });
    };

    const handleHover = (event) => {
      const hoveredToSquare = event.target;

      const [x, y] = getCoordinates(hoveredToSquare);

      currentData.hover.to = {
        x,
        y,
      };

      currentData.render.to.x = processX(
        currentData.click.whereClicked,
        currentData.click.ship.info.length,
        x
      );

      // Don't rerender if user is on the same square
      if (
        pastData.hover.to.x == currentData.hover.to.x &&
        pastData.hover.to.y == currentData.hover.to.y
      ) {
        // Ability to place a ship if the user decides so
        hoveredToSquare.addEventListener("click", dropShip);
        // Visual cue
        hoveredToSquare.classList.add("hovering");
      }
      // Don't rerender if user tries to place a ship on another ship
      else {
        if (canIPlaceShip(currentData, player.gameboard)) {
          currentData.click.ship = player.gameboard.moveShip(
            currentData.click.ship,
            currentData.render.to.x,
            currentData.hover.to.y
          );

          events.publish(
            "Render player board with click & drop ability",
            currentData
          );
        } else {
        }
      }
    };

    addHoverListener();
  };

  const addFightFunctionality = () => {
    const squares = [...computerBoardDiv.querySelectorAll(".square")];
    squares.forEach((square) => {
      if (square.classList.contains("water")) {
        square.addEventListener("click", (e) => {
          const x = e.target.getAttribute("data-x");
          const y = e.target.getAttribute("data-y");
          events.publish("Player attacks", { x, y });
          events.publish("Render computer's board");
          events.publish("Check if game over");
          events.publish("Play computer's turn");
        });
      }
    });
  };

  // Private methods

  const dropShip = () => {
    events.publish("Render player board with click & drop ability", {
      hover: false,
    });
  };

  const canIPlaceShip = (data, gameboard) => {
    for (let i = 0; i < data.click.ship.info.length; i++) {
      const squareToPlaceShipAt = gameboard.getSquare(
        data.render.to.x + i,
        data.hover.to.y
      );
      const squareToPlaceShipAtDiv = getSquareFromCoordinates(
        data.render.to.x + i,
        data.hover.to.y
      );
      const restrictedAreaId = squareToPlaceShipAtDiv.getAttribute(
        "data-restrictedareaid"
      );

      if (squareToPlaceShipAt.ship) {
        if (squareToPlaceShipAt.ship != data.click.ship) {
          return false;
        } else {
          continue;
        }
      } else if (restrictedAreaId != null) {
        if (restrictedAreaId != gameboard.getShipID(data.click.ship)) {
          return false;
        } else {
          continue;
        }
      }
    }
    return true;
  };

  const processX = function processXForRender(whereGrabbed, shipLength, x) {
    const xRenderOffset = calculateXRenderOffset(whereGrabbed, shipLength);
    return getXInBounds(x - xRenderOffset, shipLength);
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
    // Right board border
    if (+x + shipLength > 10) {
      return getXInBounds(x - 1, shipLength);
    }
    // Left board border
    else if (+x < 0) {
      return getXInBounds(x + 1, shipLength);
    } else {
      return x;
    }
  };

  const getCoordinates = (eventTarget) => [
    +eventTarget.getAttribute("data-x"),
    +eventTarget.getAttribute("data-y"),
  ];

  const getSquareFromCoordinates = (x, y) =>
    document.querySelector(`[data-x="${x}"][data-y="${y}"]`);

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

  const setShipData = (div, column, gameboard) => {
    div.setAttribute("data-hitMapPos", column.shipHitMapPos);
    div.setAttribute("data-shipID", gameboard.getShipID(column.ship));
    return div;
  };

  const title = (title) => {
    const h2 = document.createElement("h2");
    h2.textContent = title;
    return h2;
  };

  const createStartButton = () => {
    const startButton = document.createElement("button");
    startButton.setAttribute("id", "start");
    startButton.textContent = "Lock ships";
    humanBoardDiv.append(startButton);
    startButton.addEventListener("click", () => {
      events.publish("Start the game");
      events.publish("Render computer's board");
      startButton.classList.add("hidden");
    });
  };

  const renderRestrictedArea = (shipDiv) => {
    const x = +shipDiv.getAttribute("data-x");
    const y = +shipDiv.getAttribute("data-y");

    const box = {
      top: [
        [x - 1, y + 1],
        [x, y + 1],
        [x + 1, y + 1],
      ],
      right: [
        [x + 1, y + 1],
        [x + 1, y],
        [x + 1, y - 1],
      ],
      bottom: [
        [x - 1, y - 1],
        [x, y - 1],
        [x + 1, y - 1],
      ],
      left: [
        [x - 1, y + 1],
        [x - 1, y],
        [x - 1, y - 1],
      ],
    };

    for (const side in box) {
      for (const square of box[side]) {
        const boxSquare = getSquareFromCoordinates(square[0], square[1]);
        if (
          boxSquare &&
          !boxSquare.getAttribute("data-shipID") &&
          !boxSquare.getAttribute("data-restrictedareaid")
        ) {
          boxSquare.classList.add("restricted");
          boxSquare.setAttribute(
            "data-restrictedAreaID",
            shipDiv.getAttribute("data-shipID")
          );
          boxSquare.textContent = "";
        }
        if (
          boxSquare &&
          boxSquare.getAttribute("data-restrictedareaid") !=
            shipDiv.getAttribute("data-shipID")
        ) {
          boxSquare.setAttribute("data-restrictedareaid", "corner");
        }
      }
    }
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
