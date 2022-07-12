/**
 * @param {string} s
 * @return {boolean}
 */
var isValid = function (s) {
  if (s.length === 0) return true
  if (s.length === 1) return false

  const stack = []
  const hashMap = new Map([
    ['(', ')'],
    ['{', '}'],
    ['[', ']']
  ])

  const arr = Array.from(s)
  let i = 0
  for (; i < arr.length; i += 1) {
    const item = arr[i]
    if (hashMap.has(item)) {
      stack.push(hashMap.get(item))
    } else {
      const last = stack.pop()
      if (last !== item) return false
    }
  }

  return stack.length === 0
}
