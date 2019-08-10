/* global rxjs, Minesweeper */

console.log('game-looep', rxjs, Minesweeper)

const { fromEvent, merge } = rxjs
const { map, filter } = rxjs.operators

const startGame = (rows, cols, mineProbability) => {
  const uncoverActions = fromEvent(document, 'click').pipe(
    map(e => e.target.closest('.square')),
    filter(s => s !== null ),
    map(s => 'uncover' + s.id)
  )

  const rightClicks = fromEvent(document, 'contextmenu')

  rightClicks.forEach(e => e.preventDefault())

  const flagActions = rightClicks.pipe(
    map(e => e.target.closest('.square')),
    filter(s => s !== null),
    map(s => 'flag' + s.id)
  )

  const actions = merge(uncoverActions, flagActions)
  
  actions.forEach(e => console.log(e))
}
