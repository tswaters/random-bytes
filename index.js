function getRandom(num) {
  const decoder = new TextDecoder('ascii')
  let str = ''

  do {
    // this is way easier if it's a single 0-256 value
    // convert into ascii, and only take printable characters.
    const byte = window.crypto.getRandomValues(new Uint8Array(1))
    const char = decoder.decode(byte)
    if (/[ -~]/.test(char)) str += char
  } while (str.length < num)

  return str
}

let rid
let canvas
let ctx
let cols
let rows
let state
let width
let height
let charHeight
let charWidth

function init() {
  canvas = document.createElement('canvas')
  ctx = canvas.getContext('2d')
  document.getElementById('main').appendChild(canvas)
  resize()
}

window.addEventListener('resize', () => {
  window.cancelAnimationFrame(rid)
  rid = null
  resize()
})

document.addEventListener('keydown', (e) => {
  if (e.code === 'Escape') {
    if (rid) {
      window.cancelAnimationFrame(rid)
      rid = null
    } else {
      resize()
    }
  }
})

function resize() {
  width = canvas.width = window.innerWidth
  height = canvas.height = window.innerHeight
  ctx.font = '16px monospace'
  ctx.textBaseline = 'top'
  // these aren't "correct" but are close enough.
  charWidth = ctx.measureText('M').width
  charHeight = ctx.measureText('M').width
  cols = Math.floor(width / charWidth)
  rows = Math.floor(height / charHeight)
  state = []
  rid = requestAnimationFrame(paint)
}

function paint() {
  ctx.clearRect(0, 0, width, height)

  state.unshift(getRandom(cols))
  if (state.length === rows) state.pop()

  for (let i = 0; i < state.length; i += 1) {
    for (let j = 0; j < state[i].length; j += 1) {
      if (/[Tyler]/.test(state[i][j])) {
        ctx.fillStyle = '#0000aa'
      } else if (/[A-Z]/.test(state[i][j])) {
        ctx.fillStyle = '#aa00aa'
      } else if (/[a-z]/.test(state[i][j])) {
        ctx.fillStyle = '#cc00cc'
      } else if (/[0-9]/.test(state[i][j])) {
        ctx.fillStyle = '#ff00ff'
      } else {
        ctx.fillStyle = '#00aa00'
      }
      ctx.fillText(state[i][j], (charWidth + 5) * j, (charHeight + 5) * i)
    }
  }

  rid = window.requestAnimationFrame(paint)
}

window.requestAnimationFrame(init)
