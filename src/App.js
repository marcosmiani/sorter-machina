/* global Worker */
import React, { useState } from 'react'
import logo from './logo.svg'
import './App.css'

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

function increaseSizeBy (arr, n) {
  const biggerArr = new Uint32Array(arr.length + n)
  biggerArr.set(arr, 0)
  for (let i = (arr.length - 1); i < (arr.length + n); ++i) arr[i] = getRandomInt(arr.length + n)
  return biggerArr
}

function createWorker (callback = () => {}) {
  let worker = null
  if (window.Worker) {
    worker = new Worker('worker.js')

    worker.onmessage = function (event) {
      const { action, result } = event.data
      callback(result, action)
    }

    worker.onerror = function (error) {
      console.error('Worker error: ' + error.message + '\n')
      throw error
    }
  } else {
    console.error('Your browser doesnt support service workers')
  }

  return worker
}

function sortProcess (
  worker,
  { items },
  finishedCallback = () => {},
  iterationCallback = () => {}
) {
  if (worker) worker.terminate()
  const newWorker = createWorker((result, action) => {
    if (action === 'sort') {
      finishedCallback(result)
    } else if (action === 'sort-tick') {
      iterationCallback(result)
    }
  })
  newWorker.postMessage({ action: 'sort', items })
  return newWorker
}

function createAndSortArray (n, msInterval, callback = () => {}) {
  const t = startTimer('sort it all')
  let sortWorker = null
  const MAX_INTERVALS = 100
  let intervalCount = 0
  let insertionInterval = null

  let semiSortedItems = createArray(n) // not completely sorted items
  let t2 = null
  // Sorting mechanism
  const sort = (items) => {
    stopTimer(t2)
    t2 = startTimer('sort machine')
    sortWorker = sortProcess(
      sortWorker,
      { items },
      (sortedItems) => {
        if (sortWorker) sortWorker.terminate()
        clearInterval(insertionInterval)
        callback(sortedItems, stopTimer(t), stopTimer(t2))
      },
      (sortedItems) => {
        semiSortedItems = sortedItems
      }
    )
  }

  // Interval to add more items
  insertionInterval = setInterval(() => {
    // sortWorker.terminate()
    console.info('interval nr', intervalCount)
    intervalCount++

    if (intervalCount === MAX_INTERVALS) {
      clearInterval(insertionInterval)
    }
    semiSortedItems = increaseSizeBy(semiSortedItems, 1)
    console.info(semiSortedItems)
    sort(semiSortedItems)
  }, msInterval)
}

const MIN_ITEMS_TO_PROCESS = 2
const MAX_ITEMS_TO_PROCESS = 100000
const MS_MIN_INTERVAL = 50
const MS_MAX_INTERVAL = 100

function App () {
  const [items, setItems] = useState([])
  const [time, setTime] = useState(null)
  const [workerTime, setWorkerTime] = useState(null)
  const [itemSize, setItemSize] = useState(100000)
  const [intervalTime, setIntervalTime] = useState(MS_MIN_INTERVAL)

  return (
    <div className='App'>
      <header className='App-header'>
        <img src={logo} className='App-logo' alt='logo' />
        {time && (
          <div>
            <p className='App-logo_message'>
              Time used: <code>{time}ms</code> for {items.length} items
            </p>
            <p className='App-logo_message'>
              the worker took <code>{workerTime}ms</code> to sort it all
            </p>
          </div>
        )}

        <label for='interval'>
          size (2-1000000):
          <input
            type='number'
            name='interval'
            value={itemSize}
            min={MIN_ITEMS_TO_PROCESS}
            max={MAX_ITEMS_TO_PROCESS}
            onChange={(e) => {
              setItemSize(e.target.value)
            }}
          />
        </label>

        <label for='interval'>
          ms (50-100):
          <input
            type='number'
            name='interval'
            value={intervalTime}
            min={MS_MIN_INTERVAL}
            max={MS_MAX_INTERVAL}
            onChange={(e) => {
              setIntervalTime(e.target.value)
            }}
          />
        </label>

        <button
          onClick={() => createAndSortArray(itemSize, intervalTime, (items, msTime, msWorkerTime) => {
            setItems(items)
            setTime(msTime)
            setWorkerTime(msWorkerTime)
          })}
        >
          Go
        </button>
      </header>
    </div>
  )
}

export default App
