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
  const lines = []
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

const createNumber = number => {
  const text = createSVGElement('text', {
    x: '0.5',
    y: '0.87',
    'font-size': '1.0',
    fill: colors[number],
    'text-anchor': 'middle'
  })
  text.textContent = number
  return text
}

const createContent = square => {
  if (square.hasMine) return createMine()
  if (square.adjacentMines) return createNumber(square.adjacentMines)
  return undefined
}

const createCover = () => {
  const rect = createSVGElement('rect', {
    x: '0.05',
    y: '0.05',
    width: '0.95',
    height: '0.95',
    fill: '#8e8'
  })
  const upperTriangle = createSVGElement('polygon', {
    points: '0,0 1,0 0,1',
    fill: '#cfc'
  })
  const lowerTriangle = createSVGElement('polygon', {
    points: '1,0 1,1 0,1',
    fill: '#4a4'
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

const createSquare = rows => (square, i) => {
  const background = createBackground()
  const content = createContent(square)
  const cover = createCover()
  const flag = createFlag()

  const x = i % rows
  const y = Math.floor(i / rows)
  const group = createGroup(x, y)

  group.appendChild(background)
  if (content) group.appendChild(content)
  group.appendChild(cover)
  group.appendChild(flag)
  group.id = i
  group.classList.add('square')

  return {
    group,
    cover,
    flag
  }
}

const createBoardAndRender = state => {
  const svg = createSVG(state)
  const squares = state.squares.map(createSquare(state.rows))
  squares.forEach(square => svg.appendChild(square.group))

  document.querySelector('.board').appendChild(svg)

  const renderUncovered = i => {
    squares[i].cover.classList.add('hidden')
  }

  const renderFlag = i => {
    squares[i].cover.classList.remove('hidden')
  }

  const render = state => {
    state.squares.forEach((square, i) => {
      if (!square.covered) renderUncovered(i)
      if (square.flagged) renderFlag(i)
    })
  }

  return render
}
