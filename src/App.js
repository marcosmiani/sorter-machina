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
  font-size: 20px;
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
  align-items: center;
  justify-content: center;
  width: 100%;
  margin-bottom: 16px;
`

const Label = styled.label`
  text-align: left;
  flex: 1 0 auto;
  min-width: 150px;
`

const MinMax = styled.div`
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 0 0 20px;

  &>span {
    display: flex;
    font-size: 16px;
    justify-content: flex-end;
  }
`

const Input = styled.input`
  width: 100px;
  height: 25px;
  align-self: flex-end;
  font-size: 20px;
  background-color: transparent;
  border: 0;
  border-bottom: 2px dashed white;
  color: white;
  text-align: right;
  font-family: source-code-pro, Menlo, Monaco, Consolas, 'Courier New',
    monospace;
  margin-bottom: 4px;
`

const Checkbox = styled.input`
  width: 25px;
  height: 25px;
  align-self: flex-end;
  color: white;
`

const Button = styled.button`
  width: 50px;
  height: 50px;
  font-size: 16px;
  border-radius: 50%;
  color: white;
  background-color: darkgreen;
  border: 0;
  cursor: pointer;
  font-weight: 900;

  &:disabled {
    cursor: wait;
    background-color: gray;
  }
`

const Body = styled.div`
  height: 250px;
  padding: 0 25px 25px;

  & code{
    font-weight: 600;
  }
`

const Warning = styled.code`
  color: darkkhaki;
  margin: 20px 0;
  max-width: 350px;
  font-size: 14px;
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

function createAndSortArray (
  size,
  msInterval = null,
  successCallback = () => {},
  messageCallback = () => {}
) {
  const MAX_INTERVALS = 100
  const generalTimer = startTimer('sort it all')
  let machineTimer = null
  let sortWorker = null
  let intervalCount = 0
  let insertionInterval = null
  let insertionTime = 0

  let semiSortedItems = createArray(size) // not completely sorted items

  // Sorting mechanism
  const sort = (items) => {
    sortWorker = sortProcess(
      sortWorker,
      { items },
      (sortedItems) => {
        if (sortWorker) sortWorker.terminate()
        if (insertionInterval) clearInterval(insertionInterval)
        successCallback(sortedItems, stopTimer(generalTimer), stopTimer(machineTimer))
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
      insertionTime += stopTimer(machineTimer)
      messageCallback(intervalCount, insertionTime)

      machineTimer = startTimer('sort machine')
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
  const [insertTime, setInsertTime] = useState(0)
  const [averageInsertTime, setAverageInsertTime] = useState(0)
  const [workerTime, setWorkerTime] = useState(null)
  const [itemSize, setItemSize] = useState(REQUESTED_ITEMS_TO_PROCESS)
  const [intervalStatus, setIntervalStatus] = useState(true)
  const [intervalTime, setIntervalTime] = useState(MS_MIN_INTERVAL)

  const showWarning = itemSize > (MAX_ITEMS_TO_PROCESS * 0.7)

  const successCallback = (items, msTime, msWorkerTime) => {
    setProcessing(false)
    setItems(items)
    setTime(msTime)
    setWorkerTime(msWorkerTime)
  }

  const messageCallback = (insertions, msTime) => {
    console.info('message', insertTime, msTime)
    setInsertTime(msTime)
    setAverageInsertTime(msTime / insertions)
  }

  return (
    <AppWrapper>
      <Header>
        <Logo processing={processing} src={logo} alt='logo' />
        <FormBlock>
          <Label htmlFor='size'>
            Size:
          </Label>
          <MinMax>
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
            <span>2 to 1000000</span>
          </MinMax>
        </FormBlock>
        <FormBlock>
          <Label htmlFor='enabledInterval'>
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
              Interval ms:
            </Label>
            <MinMax>
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
              <span>50 to 100</span>
            </MinMax>
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
            createAndSortArray(
              itemSize,
              intervalStatus && intervalTime,
              successCallback,
              messageCallback
            )
          }}
        >
          GO
        </Button>
      </Header>

      <Body>
        {!processing && time && (
          <>
            <p>
              Total time for {items.length} items: <br /><code>{time}ms</code>
            </p>
            <p>
              Worker time to sort last iteration: <br /> <code>{workerTime}ms</code>
            </p>
            <p>
              Time spent on inserting (stoped current sort + insert):
              <br /><code>{insertTime}ms</code>
              <br /> Average: <code>{averageInsertTime}ms</code>
            </p>
            <p>
              Time spent on normal JS execution (setting, rendering, etc):
              <br /><code>{time - insertTime}ms</code>
            </p>
          </>
        )}
      </Body>
    </AppWrapper>
  )
}

export default App
