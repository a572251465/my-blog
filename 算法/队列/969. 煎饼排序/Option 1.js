/**
 * @param {number[]} arr
 * @return {number[]}
 */

// 2 3 4
// 3 2 4
// 3 4 2
// 4 3 2

function reverse(arr, results) {
  if (arr.length === 1) return

  let arr1 = []
  for (let i = 0; i < arr.length; i += 1) {
    if (arr[i] === arr.length) {
      results.push(i + 1)
      arr1 = arr
        .slice(0, i)
        .reverse()
        .concat(arr.slice(i + 1))
      break
    }
  }

  results.push(arr.length)
  reverse(arr1.reverse(), results)
}

var pancakeSort = function (arr) {
  const result = []

  reverse(arr, result)
  return result
}
console.log(pancakeSort([3, 2, 4, 1]))
