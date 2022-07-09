/**
 * @param {number} n
 * @return {boolean}
 */
var isHappy = function (n) {
  if (n === 1) return true

  const getNext = (n) => {
    let sum = 0
    while (n) {
      const item = n % 10
      sum += item * item
      n = (n / 10) | 0
    }
    return sum
  }

  let slow = n
  let fast = getNext(n)

  while (slow !== fast && fast !== 1) {
    slow = getNext(slow)
    fast = getNext(getNext(fast))
  }

  return fast === 1
}

// 116
// 38
// 73
// 58
// 89
// 145
// 42
// 20
// 4
// 16
// 37
// 58
