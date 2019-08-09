/* global rxjs */

console.log('index', rxjs)

const initialState = start(20, 20, 0)

const render = createBoardAndRender(initialState)

render(initialState)
