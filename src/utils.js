
function startTimer (name = 'default') {
  const startTime = new Date()
  console.info('starting timer at: ', startTime.toISOString())
  return { name, startTime }
}

function stopTimer (timer) {
  let timeUsed = 0
  if (timer) {
    const { name, startTime } = timer
    const endTime = new Date()
    timeUsed = endTime.getTime() - startTime.getTime()
    console.info(`stopping ${name} at ${endTime.toISOString()}!, duration: ${timeUsed} ms`)
  }
  return timeUsed
}

function getRandomInt (max) {
  return Math.floor(Math.random() * Math.floor(max))
}

function createArray (n) {
  const arr = new Uint32Array(n)
  for (let i = 0; i < n; ++i) arr[i] = getRandomInt(n)
  return arr
}

function increaseArraySizeBy (arr, n) {
  const biggerArr = new Uint32Array(arr.length + n)
  biggerArr.set(arr, 0)
  for (let i = (arr.length - 1); i < (arr.length + n); ++i) arr[i] = getRandomInt(arr.length + n)
  return biggerArr
}

function correctValue (value, min, max) {
  return value > max ? max : value < min ? min : value
}

export {
  startTimer,
  stopTimer,
  createArray,
  increaseArraySizeBy,
  correctValue
}
