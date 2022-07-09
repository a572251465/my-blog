/**
 * @param {number} x
 * @return {boolean}
 */
var isPalindrome = function (x) {
  const y = `${x}`
  const len = (y.length / 2) | 0

  let start = 0,
    end = y.length - 1,
    i = 0

  while (i < len) {
    const val = y.charAt(start++)
    const val1 = y.charAt(end--)
    i++
    if (val !== val1) return false
  }

  return true
}
