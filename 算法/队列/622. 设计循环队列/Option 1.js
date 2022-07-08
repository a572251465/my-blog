/**
 * @param {number} k
 */
var MyCircularQueue = function (k) {
  this.length = k
  this.size = 0
  this.head = 0
  this.tail = -1
  this.queue = []
}

/**
 * @param {number} value
 * @return {boolean}
 */
MyCircularQueue.prototype.enQueue = function (value) {
  if (this.isFull()) return false

  // 队列中最后一个节点
  if (this.tail === this.length - 1) {
    this.tail = 0
    this.queue[this.tail] = value
  } else {
    this.queue[++this.tail] = value
  }

  this.size++
  return true
}

/**
 * @return {boolean}
 */
MyCircularQueue.prototype.deQueue = function () {
  if (this.isEmpty()) return false

  if (this.head === this.length - 1) {
    this.head = 0
  } else {
    this.head++
  }

  this.size--
  return true
}

/**
 * @return {number}
 */
MyCircularQueue.prototype.Front = function () {
  if (this.isEmpty()) return -1
  return this.queue[this.head]
}

/**
 * @return {number}
 */
MyCircularQueue.prototype.Rear = function () {
  if (this.isEmpty()) return -1
  return this.queue[this.tail]
}

/**
 * @return {boolean}
 */
MyCircularQueue.prototype.isEmpty = function () {
  return this.size === 0
}

/**
 * @return {boolean}
 */
MyCircularQueue.prototype.isFull = function () {
  return this.size === this.length
}

/**
 * Your MyCircularQueue object will be instantiated and called as such:
 * var obj = new MyCircularQueue(k)
 * var param_1 = obj.enQueue(value)
 * var param_2 = obj.deQueue()
 * var param_3 = obj.Front()
 * var param_4 = obj.Rear()
 * var param_5 = obj.isEmpty()
 * var param_6 = obj.isFull()
 */
