/**
 * @param {string} s
 * @return {number}
 */
var firstUniqChar = function (s) {
  let i = 0
  for (; i < s.length; i += 1) {
    const item = s[i]
    if (s.indexOf(item) === s.lastIndexOf(item)) return i
  }

  return -1
}
