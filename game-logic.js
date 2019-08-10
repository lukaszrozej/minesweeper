
const emptySquare = () => ({
  hasMine: true,
  adjacentMines: 0,
  covered: false,
  flagged: false
})

const start = (rows, cols, mineProbability) => ({
  squares: Array.from({ length: rows * cols }, emptySquare),
  rows,
  cols
})

const nextState = (state, action) => state

const Minesweeper = { start, nextState }

console.log('game-logic', Minesweeper)
