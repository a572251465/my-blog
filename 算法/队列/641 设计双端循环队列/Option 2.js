/**
 * @param {number} k
 */
var MyCircularDeque = function (k) {
  this.size = 0
  this.length = k
  this.front = 0
  this.tail = 0
  this.queue = []
}

/**
 * @param {number} value
 * @return {boolean}
 */
MyCircularDeque.prototype.insertFront = function (value) {
  if (this.isFull()) return false

  this.front = this.front - 1 === -1 ? this.length - 1 : this.front - 1
  this.queue[this.front] = value
  this.size++
  return true
}

/**
 * @param {number} value
 * @return {boolean}
 */
MyCircularDeque.prototype.insertLast = function (value) {
  if (this.isFull()) return false

  this.queue[this.tail++] = value
  this.tail %= this.length
  this.size++
  return true
}

/**
 * @return {boolean}
 */
MyCircularDeque.prototype.deleteFront = function () {
  if (this.isEmpty()) return false

  this.front = this.front + 1 === this.length ? 0 : this.front + 1
  this.size--
  return true
}

/**
 * @return {boolean}
 */
MyCircularDeque.prototype.deleteLast = function () {
  if (this.isEmpty()) return false

  this.tail--
  this.tail = this.tail === -1 ? this.length - 1 : this.tail
  this.size--

  return true
}

/**
 * @return {number}
 */
MyCircularDeque.prototype.getFront = function () {
  if (this.isEmpty()) return -1

  return this.queue[this.front]
}

/**
 * @return {number}
 */
MyCircularDeque.prototype.getRear = function () {
  if (this.isEmpty()) return -1

  return this.queue[this.tail - 1 === -1 ? this.length - 1 : this.tail - 1]
}

/**
 * @return {boolean}
 */
MyCircularDeque.prototype.isEmpty = function () {
  return this.size === 0
}

/**
 * @return {boolean}
 */
MyCircularDeque.prototype.isFull = function () {
  return this.size === this.length
}

/**
 * Your MyCircularDeque object will be instantiated and called as such:
 * var obj = new MyCircularDeque(k)
 * var param_1 = obj.insertFront(value)
 * var param_2 = obj.insertLast(value)
 * var param_3 = obj.deleteFront()
 * var param_4 = obj.deleteLast()
 * var param_5 = obj.getFront()
 * var param_6 = obj.getRear()
 * var param_7 = obj.isEmpty()
 * var param_8 = obj.isFull()
 */

let a = [
  'MyCircularDeque',
  'insertFront',
  'deleteLast',
  'getFront',
  'insertLast',
  'insertFront',
  'getFront',
  'getRear',
  'getFront',
  'getFront',
  'getRear',
  'insertLast'
]
let b = [[2], [7], [], [], [5], [0], [], [], [], [], [], [0]]

let c
a.forEach((keyName, index) => {
  debugger
  const item = b[index][0]
  if (keyName === 'MyCircularDeque') {
    c = new MyCircularDeque(item)
  } else {
    console.log(c[keyName](item))
  }
})
