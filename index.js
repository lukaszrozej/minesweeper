/* global rxjs */

console.log('index', rxjs)

const initialState = start(20, 20, 0.2)

const render = createBoardAndRender(initialState)

render(initialState)

startGame()
