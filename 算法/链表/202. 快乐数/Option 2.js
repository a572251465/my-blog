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

  const hashMap = []
  while (n !== 1 && !hashMap.includes(n)) {
    hashMap.push(n)
    n = getNext(n)
  }

  return n === 1
}
