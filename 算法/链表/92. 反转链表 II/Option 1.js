/**
 * Definition for singly-linked list.
 * function ListNode(val, next) {
 *     this.val = (val===undefined ? 0 : val)
 *     this.next = (next===undefined ? null : next)
 * }
 */
/**
 * @param {ListNode} head
 * @param {number} left
 * @param {number} right
 * @return {ListNode}
 */
var reverseBetween = function (head, left, right) {
  if (!head || !head.next) return head

  const dummyHead = new ListNode(-1, head)
  let front, tail
  left -= 1
  let p = dummyHead,
    i = 0

  while (i <= right) {
    if (i === left) front = p
    if (i === right) tail = p
    p = p.next
    i++
  }

  const tailAfter = tail.next
  tail.next = null
  const reversal = (head) => {
    if (!head || !head.next) return head

    const newHead = reversal(head.next)
    head.next.next = head
    head.next = null
    return newHead
  }

  front.next = reversal(front.next)

  let s = front
  while (s && s.next) s = s.next
  s.next = tailAfter

  return dummyHead.next
}
