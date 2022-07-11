function ListNode(val, next) {
  this.val = val === undefined ? 0 : val
  this.next = next === undefined ? null : next
}

function LinkedList() {
  this.head = null
  this.size = 0
}

LinkedList.prototype.add = function (val) {
  const node = new ListNode(val)
  if (this.head === null) {
    this.head = node
  } else {
    let cur = this.head
    while (cur && cur.next) cur = cur.next

    cur.next = node
  }

  this.size += 1
}

module.exports = {
  LinkedList
}
