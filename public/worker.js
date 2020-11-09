/* global onmessage, postMessage */

function getRandomInt (max) {
  return Math.floor(Math.random() * Math.floor(max))
}

function createArray (n, fillerFn) {
  const arr = new Uint32Array(n)
  for (let i = 0; i < n; ++i) arr[i] = fillerFn(n)
  return arr
}

function increaseSizeBy (arr, n) {
  const biggerArr = new Uint32Array(arr.length + n)
  arr.set(arr, 0)
  for (let i = (arr.length - 1); i < (arr.length + n); ++i) arr[i] = getRandomInt(arr.length + n)
  return biggerArr
}

/* definitly too slow, but much simpler to stop midway
*/
function bubbleSort (list) {
  // Getting the array length
  const length = list.length

  // The main loop to iterate over the whole list
  // let i = length - 1
  // const interval = setInterval(() => {
  for (let i = length - 1; i >= 0; i--) {
    // Child loop to make iterate all over and over and compare by pairs
    for (let j = 1; j <= i; j++) {
      // If the current item is smaller than the next, they will change positions
      if (list[j - 1] > list[j]) {
        const aux = list[j - 1]
        list[j - 1] = list[j]
        list[j] = aux
      }
    }
    // Return the list with every iteractions to keep tabs
    postMessage({
      action: 'item-processed',
      result: list
    })
  }
  return list
}

let swappedMade = 0
const MAX_SWAPPED = 1000

function swap (items, leftIndex, rightIndex) {
  const temp = items[leftIndex]
  items[leftIndex] = items[rightIndex]
  items[rightIndex] = temp

  swappedMade++

  // Restrict the number of messages by interchanges to reduce costs
  // The estimation in normal hardware is about 2k swaps per ms, to be tolerant to low end hardware I halved the number
  if (swappedMade === MAX_SWAPPED) {
    swappedMade = 0
    postMessage({
      action: 'items-processed',
      result: items
    })
  }
}

function partition (items, left, right) {
  const pivot = items[Math.floor((right + left) / 2)] // middle element
  let i = left // left pointer
  let j = right // right pointer
  while (i <= j) {
    while (items[i] < pivot) {
      i++
    }
    while (items[j] > pivot) {
      j--
    }
    if (i <= j) {
      swap(items, i, j) // swap two elements
      i++
      j--
    }
  }

  return i
}

function quickSort (items, left, right) {
  let index
  if (items.length > 1) {
    index = partition(items, left, right) // index returned from partition
    if (left < index - 1) { // more elements on the left side of the pivot
      quickSort(items, left, index - 1)
    }
    if (index < right) { // more elements on the right side of the pivot
      quickSort(items, index, right)
    }
  }
  return items
}

onmessage = async function (e) { // eslint-disable-line no-native-reassign,no-global-assign
  const { action, items, size } = e.data
  console.log('Message received from main script')

  console.info('Posting', action)
  switch (action) {
    case 'init': {
      postMessage({
        action,
        result: createArray(size, getRandomInt)
      })
      break
    }
    case 'increase-size': {
      postMessage({
        action,
        result: increaseSizeBy(items, size)
      })
      break
    }
    case 'sort': {
      const result = quickSort(items, 0, items.length - 1)

      postMessage({
        action,
        result
      })
      break
    }
    default: {
      console.info('Posting default')
      postMessage({
        action,
        result: null
      })
    }
  }
}
