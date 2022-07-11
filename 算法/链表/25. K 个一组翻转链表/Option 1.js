/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} head
 * @param {number} k
 * @return {ListNode}
 */
var reverseKGroup = function (head, k) {
  if (!head || !head.next || k < 2) return head

  const dummyHead = new ListNode(-1, head)

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

  let p = dummyHead
  while (p) {
    p.next = reversal(p.next, k)
    let n = k
    while (n-- && p) p = p.next
  }

  return dummyHead.next
}
