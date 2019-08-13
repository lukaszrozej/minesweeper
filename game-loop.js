/* global rxjs */

import { start, newBoard, toggleFlag, uncover, nextState } from './game-logic.js'
import { render } from './render.js'
import { getSliderValues, generateBtn } from './modal.js'

const { fromEvent, merge } = rxjs
const { map, filter, scan, startWith } = rxjs.operators

const uncoverActions = fromEvent(document, 'click').pipe(
  map(e => e.target.closest('.square')),
  filter(s => s !== null),
  map(s => uncover(s.id))
)

const rightClicks = fromEvent(document, 'contextmenu')

rightClicks.forEach(e => e.preventDefault())

const flagActions = rightClicks.pipe(
  map(e => e.target.closest('.square')),
  filter(s => s !== null),
  map(s => toggleFlag(s.id))
)

const newBoardActions = fromEvent(generateBtn, 'click').pipe(
  map(e => newBoard(getSliderValues()))
)

const actions = merge(uncoverActions, flagActions, newBoardActions)

const initialState = start(10, 10, 0.2)

const gameStates = actions.pipe(
  scan(nextState, initialState),
  startWith(initialState)
)

gameStates.forEach(render)
