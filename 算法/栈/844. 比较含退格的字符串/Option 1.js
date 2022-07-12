/**
 * @param {string} s
 * @param {string} t
 * @return {boolean}
 */
var backspaceCompare = function (s, t) {
  if (s === t) return true

  const stack = [],
    stack1 = []
  Array.from(s).forEach((item) => {
    if (item === '#') {
      stack.pop()
    } else {
      stack.push(item)
    }
  })

  Array.from(t).forEach((item) => {
    if (item === '#') {
      stack1.pop()
    } else {
      stack1.push(item)
    }
  })

  return stack.join('') === stack1.join('')
}
