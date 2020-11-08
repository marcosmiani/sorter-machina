import logo from './logo.svg'
import './App.css'

function getTime (before = 0) {
  return new Date().getTime() - before
}

function getRandomInt (max) {
  return Math.floor(Math.random() * Math.floor(max))
}

function executeAndMesure (fn = () => {}, name = 'ms') {
  let t = getTime()
  const result = fn()
  t = getTime(t)
  console.info(`${name}: `, t)
  return result
}

function createArray (n, fillerFn) {
  const arr = new Float64Array(n)
  for (let i = 0; i < n; ++i) arr[i] = fillerFn(n)
  return arr
}

function increaseSizeBy (arr, n) {
  const biggerArr = new Float64Array(arr.length + n)
  biggerArr.set(arr, 0)
  biggerArr.set(createArray(n, getRandomInt), arr.length)
  return biggerArr
}

function createAndSortArray (n) {
  const bigArr = executeAndMesure(() => {
    return createArray(n, getRandomInt)
  }, 'create and fill')

  console.info('created', bigArr.length)

  const sortedBigArr = executeAndMesure(() => {
    return bigArr.sort()
  }, 'sort')

  console.info('sorted', sortedBigArr.length)

  const biggerArr = executeAndMesure(() => {
    return increaseSizeBy(bigArr, 1000000)
  }, 'increase size')

  console.info('bigger', biggerArr.length)

  const sortedBiggerArr = executeAndMesure(() => {
    return biggerArr.sort()
  }, 'sort')

  console.info('sorted-again', sortedBiggerArr.length)
}

function App () {
  return (
    <div className='App'>
      <header className='App-header'>
        <img src={logo} className='App-logo' alt='logo' />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className='App-link'
          href='https://reactjs.org'
          target='_blank'
          rel='noopener noreferrer'
        >
          Learn React
        </a>
        <button onClick={() => createAndSortArray(10000000)}>
          Create a huge array
        </button>
      </header>
    </div>
  )
}

export default App
