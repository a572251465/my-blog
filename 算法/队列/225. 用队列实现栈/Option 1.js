var MyStack = function () {
  /**
   * @description 队列特性：先进先出。 栈特性：先进后出
   * @type {number}
   */
  this.size = 0
  this.inputQueue = []
  this.outputQueue = []
}

/**
 * @param {number} x
 * @return {void}
 */
MyStack.prototype.push = function (x) {
  this.inputQueue.push(x)
  this.size += 1
}

/**
 * @return {number}
 */
MyStack.prototype.pop = function () {
  if (this.outputQueue.length > 0) {
    const value = this.outputQueue.shift()
    this.size -= 1
    return value
  }

  while (this.inputQueue.length) {
    this.outputQueue.push(this.inputQueue.pop())
  }
  this.size -= 1
  return this.outputQueue.shift()
}

/**
 * @return {number}
 */
MyStack.prototype.top = function () {
  if (this.inputQueue.length > 0)
    return this.inputQueue[this.inputQueue.length - 1]

  return this.outputQueue[0]
}

/**
 * @return {boolean}
 */
MyStack.prototype.empty = function () {
  return this.size === 0
}

/**
 * Your MyStack object will be instantiated and called as such:
 * var obj = new MyStack()
 * obj.push(x)
 * var param_2 = obj.pop()
 * var param_3 = obj.top()
 * var param_4 = obj.empty()
 */

const a = ['MyStack', 'push', 'push', 'top', 'push', 'top']
const b = [[], [1], [2], [], [3], []]
let c = null
a.forEach((keyName, index) => {
  if (keyName === 'MyStack') {
    c = new MyStack()
  } else {
    console.log(c[keyName](b[index][0]))
  }
})
