/**
 * @param {string} s
 * @return {number}
 */
var firstUniqChar = function (s) {
  const q = [],
    hashMap = new Map()

  for (const [i, c] of Array.from(s).entries()) {
    if (!hashMap.has(c)) {
      hashMap.set(c, i)
      q.push([c, i])
    } else {
      hashMap.set(c, -1)
      while (q.length && hashMap.get(q[0][0]) === -1) q.shift()
    }
  }

  return q.length ? q[0][1] : -1
}
