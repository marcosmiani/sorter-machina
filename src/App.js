/* global Worker */
import React, { useState } from 'react'
import logo from './logo.svg'
import './App.css'

function startTimer (name = 'default') {
  const startTime = new Date()
  console.info('starting timer at: ', startTime.toISOString())
  return { name, startTime }
}

function stopTimer ({ name, startTime }) {
  const endTime = new Date()
  const timeUsed = endTime.getTime() - startTime.getTime()
  console.info(`stopping ${name} at ${endTime.toISOString()}!, duration: ${timeUsed} ms`)
  return timeUsed
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

function initProcess (worker, { size }, callback = () => {}) {
  if (worker) worker.terminate()
  const newWorker = createWorker(callback)
  newWorker.postMessage({ action: 'init', size })
  return newWorker
}

function addItemToProcess (worker, { items, size }, callback = () => {}) {
  if (worker) worker.terminate()
  const newWorker = createWorker(callback)
  newWorker.postMessage({ action: 'increase-size', items, size })
  return newWorker
}

function sortProcess (worker, { items }, callback = () => {}) {
  if (worker) worker.terminate()
  const newWorker = createWorker(callback)
  newWorker.postMessage({ action: 'sort', items })
  return newWorker
}

function createAndSortArray (n, callback = () => {}) {
  const t = startTimer()
  let returnCount = 0
  const worker = initProcess(null, { size: n }, (items, action) => {
    if (action === 'init') {
      console.info(items, action)
      const sortWorker = sortProcess(worker, { items }, (sortedItems, action) => {
        if (action === 'sort') {
          console.info(sortedItems, action)
          sortWorker.terminate()
          console.info('returnCount first round:', returnCount)
          callback(sortedItems, stopTimer(t))
        } else if (action === 'items-processed') {
          returnCount++
          // console.info(sortedItems.length, action)
        }
      })
    }
  })
}

function App () {
  const [items, setItems] = useState([])
  const [time, setTime] = useState(null)

  return (
    <div className='App'>
      <header className='App-header'>
        <img src={logo} className='App-logo' alt='logo' />
        {time && (
          <p>
            Time used: <code>{time} ms</code> for {items.length} items
          </p>
        )}
        <button
          onClick={() => createAndSortArray(100000, (items, msTime) => {
            setItems(items)
            setTime(msTime)
          })}
        >
          Create AND sort a huge array
        </button>
      </header>
    </div>
  )
}

export default App
