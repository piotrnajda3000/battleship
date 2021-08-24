export default function Ship(length) {
  const hitMap = Array(length).fill(false);

  const methods = {
    hit(position) {
      if (position >= 0 && position < hitMap.length) {
        this.info.hitMap[position] = true;
      }
      return this;
    },
    isSunk() {
      return this.info.hitMap.every((square) => square == true);
    },
  };

  return Object.assign(
    {},
    {
      info: {
        length,
        hitMap,
      },
    },
    methods
  );
}
