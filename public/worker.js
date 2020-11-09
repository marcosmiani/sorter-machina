/* global onmessage, postMessage */

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
      action: 'sort-tick',
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
  const { action, items } = e.data

  const result = quickSort(items, 0, items.length - 1)

  postMessage({
    action,
    result
  })
}
