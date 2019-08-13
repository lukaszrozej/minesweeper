console.log('render')

const squareSize = 30
const ns = 'http://www.w3.org/2000/svg'

const createSVGElement = (elementName, attributes) => {
  const element = document.createElementNS(ns, elementName)
  Object.entries(attributes).forEach(([attribute, value]) => {
    element.setAttribute(attribute, value)
  })
  return element
}

const createSVG = state => createSVGElement('svg', {
  width: `${state.cols * squareSize}`,
  height: `${state.rows * squareSize}`
})

const createBackground = () => createSVGElement('rect', {
  x: '0',
  y: '0',
  width: '1',
  height: '1',
  fill: '#ddd',
  stroke: '#666',
  'stroke-width': '0.1'
})

const createMine = () => {
  const group = createSVGElement('g', {})
  const r = 0.4
  for (let i = 0; i < 8; i++) {
    const x2 = r * Math.cos(i * Math.PI / 4) + 0.5
    const y2 = r * Math.sin(i * Math.PI / 4) + 0.5
    const line = createSVGElement('line', {
      x1: '0.5',
      y1: '0.5',
      x2: `${x2}`,
      y2: `${y2}`,
      stroke: 'black',
      'stroke-width': '0.1'
    })
    group.appendChild(line)
  }
  const bigCircle = createSVGElement('circle', {
    cx: '0.5',
    cy: '0.5',
    r: '0.3',
    fill: 'black'
  })
  const smallCircle = createSVGElement('circle', {
    cx: '0.4',
    cy: '0.4',
    r: '0.06',
    fill: 'white'
  })
  group.appendChild(bigCircle)
  group.appendChild(smallCircle)
  return group
}

const colors = [
  'blue',
  'green',
  'red',
  'brown',
  'purple',
  'black',
  'black',
  'black',
  'black'
]

const createNumber = () => createSVGElement('text', {
  x: '0.5',
  y: '0.87',
  'font-size': '1.0',
  'text-anchor': 'middle'
})

const createCover = () => {
  const rect = createSVGElement('rect', {
    x: '0.05',
    y: '0.05',
    width: '0.95',
    height: '0.95',
    fill: '#bbb'
  })
  const upperTriangle = createSVGElement('polygon', {
    points: '0,0 1,0 0,1',
    fill: '#d8d8d8'
  })
  const lowerTriangle = createSVGElement('polygon', {
    points: '1,0 1,1 0,1',
    fill: '#888'
  })
  const g = createSVGElement('g', {})
  g.appendChild(upperTriangle)
  g.appendChild(lowerTriangle)
  g.appendChild(rect)
  return g
}

const createFlag = () => {
  const triangle = createSVGElement('polygon', {
    points: '0.5,0.2 0.5,0.5 0.2,0.35',
    fill: 'red'
  })
  const line = createSVGElement('line', {
    x1: '0.5',
    y1: '0.2',
    x2: '0.5',
    y2: '0.8',
    'stroke-width': '0.05',
    stroke: 'black'
  })
  const g = createSVGElement('g', {})
  g.appendChild(triangle)
  g.appendChild(line)
  g.classList.add('hidden')
  return g
}

const createGroup = (x, y) => createSVGElement('g', {
  transform: `scale (${squareSize} ${squareSize}) translate (${x} ${y})`
})

const createSquare = cols => square => {
  const background = createBackground()
  const number = createNumber()
  const mine = createMine()
  const cover = createCover()
  const flag = createFlag()

  const group = createGroup(square.x, square.y)

  group.appendChild(background)
  group.appendChild(number)
  group.appendChild(mine)
  group.appendChild(cover)
  group.appendChild(flag)
  group.id = square.x + cols * square.y
  group.classList.add('square')

  return {
    group,
    number,
    mine,
    cover,
    flag
  }
}

let board = {
  rows: undefined,
  cols: undefined,
  squares: undefined
}

const boardDiv = document.querySelector('.board')

const createBoard = state => {
  const { rows, cols } = state
  const svg = createSVG(state)
  const squares = state.squares.map(createSquare(cols))
  squares.forEach(square => svg.appendChild(square.group))
  boardDiv.innerHTML = ''
  boardDiv.appendChild(svg)
  board = { rows, cols, squares }
}

const getSquareElement = square => board.squares[square.x + square.y * board.cols]

const renderIf = (condition, element) =>
  condition
    ? element.classList.remove('hidden')
    : element.classList.add('hidden')

const setNumber = (numberElement, number) => {
  numberElement.textContent = number ? `${number}` : ''
  numberElement.setAttribute('fill', colors[number])
}

const renderMinesLeft = state => {
  const mines = state.squares.filter(s => s.hasMine).length
  const flags = state.squares.filter(s => s.flagged).length
  document.getElementById('mines-left').textContent = mines - flags
}

/* eslint-disable no-unused-vars */
const render = state => {
  if (state.rows !== board.rows && state.cols !== board.cols) createBoard(state)

  renderMinesLeft(state)
  state.squares.forEach(square => {
    const squareElement = getSquareElement(square)
    setNumber(squareElement.number, square.adjacentMines)
    renderIf(!square.hasMine, squareElement.number)
    renderIf(square.hasMine, squareElement.mine)
    renderIf(square.covered, squareElement.cover)
    renderIf(square.flagged, squareElement.flag)
  })
}
/* eslint-eneble no-unused-vars */
