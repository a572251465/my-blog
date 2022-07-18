/**
 * @param {string} s
 * @return {number}
 */
var firstUniqChar = function (s) {
  if (!s.length) return -1

  const hashMap = new Map()
  for (const [i, c] of Array.from(s).entries()) {
    if (!hashMap.has(c)) {
      hashMap.set(c, i)
    } else {
      hashMap.set(c, -1)
    }
  }

  for (const item of hashMap.entries()) {
    if (item[1] !== -1) return item[1]
  }

  return -1
}
