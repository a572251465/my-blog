const { LinkedList } = require('../-- hand written linked list/index')

const listNode = new LinkedList()
listNode.add(1)
listNode.add(2)
listNode.add(3)
listNode.add(4)
listNode.add(5)

const reversal = (head, k) => {
  let count = 0,
    p = head
  while (p) {
    count++
    p = p.next
  }
  if (count < k) return head

  let newHead = null,
    s = head,
    n = k
  // 1 2 3 4 5
  while (s && n--) {
    const temp = s
    s = s.next
    temp.next = newHead
    newHead = temp
  }
  head.next = s

  return newHead
}

const res = reversal(listNode.head, 2)
console.log(JSON.stringify(res))
