/* global Worker */
import React, { useState } from 'react'
import logo from './logo.svg'
import { startTimer, stopTimer, createArray, increaseArraySizeBy, correctValue } from './utils'
import styled, { keyframes } from 'styled-components'

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`

const AppWrapper = styled.div`
  text-align: center;
  background-color: #282c34;
  min-height: calc(100vh - 40px);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
  color: white;
  padding: 20px;
`

const Header = styled.header`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`

const Logo = styled.img`
  height: 40vmin;
  pointer-events: none;

  @media (prefers-reduced-motion: no-preference) {
    animation: ${rotate} infinite ${({ processing }) => processing ? '1s' : '20s'} linear;
  }
`

const FormBlock = styled.div`
  display: flex;
  flex-direction: row;
  align-items: flex-start;
`

const Label = styled.label`
  text-align: left;
  font-size: calc(5px + 2vmin);
  min-width: 250px;
  margin-bottom: 10px;
`

const Input = styled.input`
  width: 100px;
  height: 25px;
  align-self: flex-end;
  font-size: calc(2px + 2vmin);
  margin-bottom: 10px;
  background-color: transparent;
  border: 0;
  border-bottom: 2px dotted white;
  color: white;
`

const Checkbox = styled.input`
  width: 100px;
  height: 25px;
  align-self: flex-end;
  font-size: calc(2px + 2vmin);
  margin-bottom: 10px;
  background-color: transparent;
  border: 0;
  border-bottom: 2px dotted white;
  color: white;
`

const Button = styled.button`
  width: 50px;
  height: 50px;
  font-size: calc(2px + 2vmin);
  border-radius: 50%;
  color: white;
  background-color: darkgreen;
  border: 0;
  cursor: pointer;

  &:disabled {
    cursor: wait;
    background-color: gray;
  }
`

const Body = styled.div`
  max-width: 250px;
  height: 250px;
`

const Warning = styled.code`
  color: darkkhaki;
  margin: 20px 0;
  max-width: 350px;
  font-size: calc(2vmin);
`

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

function createAndSortArray (n, msInterval = null, callback = () => {}) {
  const MAX_INTERVALS = 100
  const generalTimer = startTimer('sort it all')
  let machineTimer = null
  let sortWorker = null
  let intervalCount = 0
  let insertionInterval = null

  let semiSortedItems = createArray(n) // not completely sorted items

  // Sorting mechanism
  const sort = (items) => {
    stopTimer(machineTimer)
    machineTimer = startTimer('sort machine')
    sortWorker = sortProcess(
      sortWorker,
      { items },
      (sortedItems) => {
        if (sortWorker) sortWorker.terminate()
        if (insertionInterval) clearInterval(insertionInterval)
        callback(sortedItems, stopTimer(generalTimer), stopTimer(machineTimer))
      },
      (sortedItems) => {
        semiSortedItems = sortedItems
      }
    )
  }

  // Interval to add more items
  if (msInterval) {
    insertionInterval = setInterval(() => {
      intervalCount++
      // Not going to let this go to the infinite eh?
      if (intervalCount === MAX_INTERVALS) {
        clearInterval(insertionInterval)
      }
      semiSortedItems = increaseArraySizeBy(semiSortedItems, 1)

      sort(semiSortedItems)
    }, msInterval)
  }

  sort(semiSortedItems)
}

const MIN_ITEMS_TO_PROCESS = 2
const REQUESTED_ITEMS_TO_PROCESS = 100000
const MAX_ITEMS_TO_PROCESS = 1000000
const MS_MIN_INTERVAL = 50
const MS_MAX_INTERVAL = 1000

function App () {
  const [processing, setProcessing] = useState(false)
  const [items, setItems] = useState([])
  const [time, setTime] = useState(null)
  const [workerTime, setWorkerTime] = useState(null)
  const [itemSize, setItemSize] = useState(REQUESTED_ITEMS_TO_PROCESS)
  const [intervalStatus, setIntervalStatus] = useState(true)
  const [intervalTime, setIntervalTime] = useState(MS_MIN_INTERVAL)

  const showWarning = itemSize > (MAX_ITEMS_TO_PROCESS * 0.7)

  return (
    <AppWrapper>
      <Header>
        <Logo processing={processing} src={logo} alt='logo' />
        <FormBlock>
          <Label htmlFor='interval'>
            Size (2-1000000):
          </Label>
          <Input
            type='number'
            name='size'
            value={itemSize}
            min={MIN_ITEMS_TO_PROCESS}
            max={MAX_ITEMS_TO_PROCESS}
            onChange={(e) => {
              setItemSize(correctValue(e.target.value, MIN_ITEMS_TO_PROCESS, MAX_ITEMS_TO_PROCESS))
            }}
          />
        </FormBlock>
        <FormBlock>
          <Label htmlFor='interval'>
            Enable intervals:
          </Label>
          <Checkbox
            type='checkbox'
            name='enabledInterval'
            value='true'
            checked={intervalStatus}
            onChange={(e) => {
              setIntervalStatus(e.target.checked)
            }}
          />
        </FormBlock>
        {intervalStatus && (
          <FormBlock>
            <Label htmlFor='interval'>
              Interval ms (50-100):
            </Label>
            <Input
              type='number'
              name='interval'
              value={intervalTime}
              min={MS_MIN_INTERVAL}
              max={MS_MAX_INTERVAL}
              onChange={(e) => {
                setIntervalTime(correctValue(e.target.value, MS_MIN_INTERVAL, MS_MAX_INTERVAL))
              }}
            />
          </FormBlock>
        )}
        {showWarning && (
          <Warning>
            This number of numbers could take a lot of time!
          </Warning>
        )}
        <Button
          disabled={processing}
          onClick={() => {
            setProcessing(true)
            createAndSortArray(itemSize, intervalStatus && intervalTime, (items, msTime, msWorkerTime) => {
              setProcessing(false)
              setItems(items)
              setTime(msTime)
              setWorkerTime(msWorkerTime)
            })
          }}
        >
          Go
        </Button>
      </Header>

      <Body>
        {!processing && time && (
          <>
            <p>
              Total time: <code>{time}ms</code> for {items.length} items
            </p>
            <p>
              Worker time <code>{workerTime}ms</code> to sort it all
            </p>
          </>
        )}
      </Body>
    </AppWrapper>
  )
}

export default App
