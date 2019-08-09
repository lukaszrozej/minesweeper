console.log('render')

const squareSize = 20
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
  stroke: '#666'
})

const createMine = () => {
  const lineH = createSVGElement('line', {
    x1: '0.05',
    y1: '0.5',
    x2: '0.95',
    y2: '0.5',
    stroke: 'black'
  })
  const lineV = createSVGElement('line', {
    y1: '0.05',
    x1: '0.5',
    y2: '0.95',
    x2: '0.5',
    stroke: 'black'
  })
  const bigCircle = createSVGElement('circle', {
    cx: '0.5',
    cy: '0.5',
    r: '0.4'
  })
  const smallCircle = createSVGElement('circle', {
    cx: '0.3',
    cy: '0.4',
    r: '0.1'
  })
  const group = createSVG('g', {})
  group.appendChild(lineH)
  group.appendChild(lineV)
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

const createCover = () => createSVGElement('rect', {
  x: '0',
  y: '0',
  width: '1',
  height: '1',
  fill: '#8f8',
  stroke: '#0f0'
})

const createFlag = () => {
  const triangle = createSVGElement('polygon', {
    points: '0.5,0.2 0.5,0.4 0.3,0.3',
    fill: 'red'
  })
  const line = createSVGElement('line', {
    x1: '0.5',
    y1: '0.2',
    x2: '0.5',
    y2: '0.8',
    'stroke-width': '0.1',
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
  const group = createGroup(rows, i)
  group.appendChild(background)
  if (content) group.appendChild(content)
  group.appendChild(cover)
  group.appendChild(flag)
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

  const uncover = i => {
    squares[i].cover.classList.add('hidden')
  }

  const renderFlag = i => {
    squares[i].cover.classList.remove('hidden')
  }

  const render = state => {
    state.squares.forEach((square, i) => {
      if (!square.covered) uncover(i)
      if (square.flagged) renderFlag(i)
    })
  }

  return render
}
