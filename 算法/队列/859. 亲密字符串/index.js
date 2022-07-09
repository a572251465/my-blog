/**
 * @param {string} a
 * @param {string} b
 * @return {boolean}
 */
var buddyStrings = function (a, b) {
  if (a.length < 2 || b.length < 2 || a.length !== b.length) return false

  if (a === b && a.length > new Set(a).size) return true

  const queue = []
  let i = 0
  for (; i < a.length; i += 1) {
    if (a[i] !== b[i]) {
      queue.push(a[i], b[i])
      if (queue.length > 4) return false
    }
  }

  // 0 1
  // 2 3
  return queue.length === 4 && queue[0] === queue[3] && queue[1] === queue[2]
}
