var MyQueue = function () {
  this.size = 0
  this.inputStack = []
  this.outputStack = []
}

/**
 * @param {number} x
 * @return {void}
 */
MyQueue.prototype.push = function (x) {
  this.inputStack.push(x)
  this.size += 1
}

/**
 * @return {number}
 */
MyQueue.prototype.pop = function () {
  if (this.outputStack.length > 0) {
    this.size -= 1
    return this.outputStack.pop()
  }

  while (this.inputStack.length) this.outputStack.push(this.inputStack.pop())
  this.size -= 1
  return this.outputStack.pop()
}

/**
 * @return {number}
 */
MyQueue.prototype.peek = function () {
  if (this.outputStack.length)
    return this.outputStack[this.outputStack.length - 1]

  return this.inputStack[0]
}

/**
 * @return {boolean}
 */
MyQueue.prototype.empty = function () {
  return this.size === 0
}

/**
 * Your MyQueue object will be instantiated and called as such:
 * var obj = new MyQueue()
 * obj.push(x)
 * var param_2 = obj.pop()
 * var param_3 = obj.peek()
 * var param_4 = obj.empty()
 */

// const a = [
//   'MyQueue',
//   'push',
//   'push',
//   'pop',
//   'push',
//   'peek',
//   'pop',
//   'push',
//   'pop'
// ]
// const b = [[], [1], [8], [], [3], [], [], [5], []]
// let c
//
// a.forEach((keyName, index) => {
//   if (keyName === 'MyQueue') {
//     c = new MyQueue()
//   } else {
//     console.log(c[keyName](b[index][0]))
//   }
// })
