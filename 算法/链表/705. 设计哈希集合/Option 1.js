class Node {
  constructor(val, next = null) {
    this.val = val
    this.next = next
  }
}

var MyHashSet = function () {
  this.head = null
  this.size = 0
}

/**
 * @param {number} key
 * @return {void}
 */
MyHashSet.prototype.add = function (key) {
  const node = new Node(key, null)
  if (!this.head) {
    this.head = node
    this.size++
    return
  }

  const flag = this.contains(key)
  if (flag) return

  let curr = this.head
  while (curr.next) {
    curr = curr.next
  }
  curr.next = node
  this.size++
}

/**
 * @param {number} key
 * @return {void}
 */
MyHashSet.prototype.remove = function (key) {
  if (!this.contains(key)) return
  let curr = this.get(key)
  if (curr) {
    curr.next = curr.next.next
  } else {
    this.head = this.head.next
  }
  this.size--
}

/**
 * @param {number} key
 * @return {boolean}
 */
MyHashSet.prototype.contains = function (key) {
  let curr = this.head
  while (curr) {
    if (curr.val === key) return true
    curr = curr.next
  }

  return false
}

MyHashSet.prototype.get = function (key) {
  let curr = this.head
  while (curr.next) {
    if (curr.next.val === key) return curr
    curr = curr.next
  }

  return null
}

/**
 * Your MyHashSet object will be instantiated and called as such:
 * var obj = new MyHashSet()
 * obj.add(key)
 * obj.remove(key)
 * var param_3 = obj.contains(key)
 */
// const ll = new MyHashSet()
// ll.add(9)
// ll.remove(19)
// ll.add(14)
// ll.remove(19)
// ll.remove(9)
// ll.add(0)
// ll.add(3)
// ll.add(4)
// ll.add(0)
// ll.remove(9)


