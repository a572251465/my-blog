/**
 * @param {number} k
 */
var MyCircularDeque = function (k) {
  this.size = 0
  this.length = k
  this.stack = []
}

/**
 * @param {number} value
 * @return {boolean}
 */
MyCircularDeque.prototype.insertFront = function (value) {
  if (this.isFull()) return false

  // 进行位移
  for (let i = this.size - 1; i >= 0; i -= 1) {
    this.stack[i + 1] = this.stack[i]
  }
  this.stack[0] = value
  this.size += 1
  return true
}

/**
 * @param {number} value
 * @return {boolean}
 */
MyCircularDeque.prototype.insertLast = function (value) {
  if (this.isFull()) return false

  this.stack[this.size] = value
  this.size += 1
  return true
}

/**
 * @return {boolean}
 */
MyCircularDeque.prototype.deleteFront = function () {
  if (this.isEmpty()) return false

  this.stack[0] = null
  for (let i = 0; i < this.size - 1; i++) {
    this.stack[i] = this.stack[i + 1]
  }
  this.size--
  return true
}

/**
 * @return {boolean}
 */
MyCircularDeque.prototype.deleteLast = function () {
  if (this.isEmpty()) return false

  this.stack[this.size - 1] = null
  this.size -= 1
  return true
}

/**
 * @return {number}
 */
MyCircularDeque.prototype.getFront = function () {
  return this.stack[0] === null ? -1 : this.stack[0]
}

/**
 * @return {number}
 */
MyCircularDeque.prototype.getRear = function () {
  const value = this.stack[this.size - 1]
  return value === null || value === undefined ? -1 : value
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

// const keyNames = [
//   'MyCircularDeque',
//   'insertFront',
//   'deleteLast',
//   'getRear',
//   'getFront',
//   'getFront',
//   'deleteFront',
//   'insertFront',
//   'insertLast',
//   'insertFront',
//   'getFront',
//   'insertFront'
// ]
// const vals = [[4], [9], [], [], [], [], [], [6], [5], [9], [], [6]]
//
// let instance
// for (let i = 0; i < keyNames.length; i++) {
//   const name = keyNames[i]
//   const val = vals[i]
//   if (name === 'MyCircularDeque') {
//     instance = new MyCircularDeque(val[0])
//     console.log(null)
//   } else {
//     console.log(instance[name](val[0]))
//   }
// }

