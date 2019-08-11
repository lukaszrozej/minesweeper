
const applyTo = x => f => f(x)

const add = p1 => p2 => ({
  x: p1.x + p2.x,
  y: p1.y + p2.y
})

const valid = state => p =>
  p.x >= 0 &&
  p.x < state.cols &&
  p.y >= 0 &&
  p.y < state.rows

const directions = [
  add({ x: -1, y: -1 }),
  add({ x: 0, y: -1 }),
  add({ x: 1, y: -1 }),
  add({ x: -1, y: 0 }),
  add({ x: 1, y: 0 }),
  add({ x: -1, y: 1 }),
  add({ x: 0, y: 1 }),
  add({ x: 1, y: 1 })
]

const getSquare = state => p => state.squares[p.y * state.cols + p.x]

const emptySquare = rows => i => ({
  hasMine: false,
  adjacentMines: 0,
  covered: true,
  flagged: false,
  x: i % rows,
  y: Math.floor(i / rows)
})

const neighbors = (state, square) =>
  directions
    .map(applyTo(square))
    .filter(valid(state))
    .map(getSquare(state))

const start = (rows, cols, mineProbability) => {
  // const squares =  Array.from({ length: rows * cols }, emptySquare)
  const squares = Array.from(Array(rows * cols).keys(), emptySquare(rows))

  const state = {
    squares,
    rows,
    cols,
    gameOver: false
  }

  squares.forEach(square => {
    if (Math.random() < mineProbability) {
      square.hasMine = true
      neighbors(state, square).forEach(neighbor => {
        neighbor.adjacentMines += 1
      })
    }
  })

  return state
}

const toggleFlag = i => state => {
  const squares = state.squares.slice()
  const flag = squares[i].flagged ? false : true
  squares[i] = { ...squares[i], ...{ flag } }
  return { ...state, ...{ squares } }
}

const uncover = i => state => {
  if (!state[i].covered || state[i].flagged) return state

  const squares = state.squares.map(square => { ...square })
  const newState = { ...state, ...{ squares } }

  const recursivelyUncover = square => {
    if (!square.covered) return
    square.covered = false
    if (square.hasMine) newState.gameOver = true
    if (square.hasMine || square.adjacentMines) return
    neighbors(square).forEach(neighbor =>
      recursivelyUncover(newState, neighbor)
    )
  }

  recursivelyUncover(newState.squares[i])

  return newState
}

const nextState = (state, action) => state

const Minesweeper = { start, nextState }

console.log('game-logic', Minesweeper)
