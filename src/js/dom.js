const renderBoard = (board, boardDiv, { type }) => {
  for (const [y, row] of board.entries()) {
    const rowPara = document.createElement("p");
    for (const [x, column] of row.entries()) {
      const square = document.createElement("span");
      square.setAttribute("data-x", x);
      square.setAttribute("data-y", y);
      if (type == "Player's") {
        if (column.ship !== undefined) {
          square.textContent += ` [ ${column.ship.info.length} ] `;
        } else if (column == "missed") {
          square.textContent += " [ x ] ";
        } else {
          square.textContent += " [ ? ] ";
        }
      } else if (type == "Computer's") {
        square.textContent += " [ ? ] ";
      }
      rowPara.append(square);
    }
    boardDiv.append(rowPara);
  }
  return boardDiv;
};

const renderPlayerBoard = (board, boardDiv) => {
  renderBoard(board, boardDiv, { type: "Player's" });
  boardDiv.append(title("Your board"));
};

const renderAttackBoard = (board, boardDiv) => {
  renderBoard(board, boardDiv, { type: "Computer's" });
  boardDiv.append(title("Opponent's board"));
};

const title = (title) => {
  const h2 = document.createElement("h2");
  h2.textContent = title;
  return h2;
};

export { renderPlayerBoard, renderAttackBoard };
