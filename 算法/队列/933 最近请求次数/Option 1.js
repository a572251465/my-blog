var RecentCounter = function () {
  this.queue = []
  this.head = this.tail = 0
}

/**
 * @param {number} t
 * @return {number}
 */
RecentCounter.prototype.ping = function (t) {
  this.queue[this.tail++] = t

  while (t - this.queue[this.head] - 3000 > 0) this.head++

  return this.tail - this.head
}

/**
 * Your RecentCounter object will be instantiated and called as such:
 * var obj = new RecentCounter()
 * var param_1 = obj.ping(t)
 */
