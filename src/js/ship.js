function hit(position) {
  const hitMap = this.info.hitMap;
  if (position >= 0 && position < hitMap.length) {
    hitMap[position] = true;
  }
  return this;
}

function isSunk() {
  return this.info.hitMap.every((square) => square == true);
}

export default function Ship(length) {
  // Initialize hitMap with no hits recorded
  const hitMap = [];
  for (let i = 0; i < length; i++) {
    hitMap.push(false);
  }

  return Object.assign(
    {},
    {
      info: {
        length,
        hitMap,
      },
      hit,
      isSunk,
    }
  );
}
